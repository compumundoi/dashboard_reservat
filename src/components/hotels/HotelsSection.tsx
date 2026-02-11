import React, { useEffect, useState } from 'react';
import { hotelService } from '../../services/hotelService';
import { HotelUnificado } from '../../types/hotel';
import { HotelTable } from './HotelTable';
import { HotelDetailModal } from './HotelDetailModal';
import { EditHotelModal } from './EditHotelModal';
import { CreateHotelModal } from './CreateHotelModal';
import { HotelStarsChart } from './HotelStarsChart';
import { HotelServicesChart } from './HotelServicesChart';
import { Download, Plus, Hotel, CheckCircle, LayoutList, Building } from 'lucide-react';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

export const HotelsSection: React.FC = () => {
  const [hotels, setHotels] = useState<HotelUnificado[]>([]);
  const [filtered, setFiltered] = useState<HotelUnificado[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [loading, setLoading] = useState(false);
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editHotelId, setEditHotelId] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const data = await hotelService.getHotels(1, 300);
        setHotels(data);
        setFiltered(data);
      } catch (error) {
        console.error('Error loading hotels:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  const handleViewHotel = (id: string) => {
    setSelectedHotelId(id);
    setDetailOpen(true);
  };

  const handleEditHotel = (id: string) => {
    setEditHotelId(id);
    setEditOpen(true);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setIsSearching(true);
    setCurrentPage(1);

    if (term.trim() === '') {
      setFiltered(hotels);
      setIsSearching(false);
    } else {
      const filtered = hotels.filter(hotel =>
        hotel.nombre_proveedor.toLowerCase().includes(term.toLowerCase()) ||
        hotel.ciudad.toLowerCase().includes(term.toLowerCase()) ||
        hotel.pais.toLowerCase().includes(term.toLowerCase()) ||
        (hotel.email && hotel.email.toLowerCase().includes(term.toLowerCase()))
      );
      setFiltered(filtered);
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setIsSearching(false);
    setFiltered(hotels);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleEditSuccess = () => {
    // Recargar la lista de hoteles después de editar
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const data = await hotelService.getHotels(1, 300);
        setHotels(data);
        setFiltered(data);
      } catch (e) {
        console.error('Error recargando hoteles', e);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  };

  const handleDeleteHotel = async (id: string) => {
    try {
      const hotel = hotels.find(h => h.id_hotel === id);
      const hotelName = hotel?.nombre_proveedor || 'este hotel';

      const result = await Swal.fire({
        title: '¿Estás seguro?',
        html: `
          <div class="text-center">
            <div class="mb-4">
              <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m-4 0h14" />
                </svg>
              </div>
            </div>
            <p class="text-gray-600 mb-2">Vas a eliminar el hotel:</p>
            <p class="font-semibold text-gray-900 text-lg">${hotelName}</p>
            <p class="text-sm text-gray-500 mt-2">Esta acción no se puede deshacer</p>
          </div>
        `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
        customClass: {
          popup: 'rounded-xl shadow-2xl',
          title: 'text-xl font-bold text-gray-900',
          confirmButton: 'px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
          cancelButton: 'px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
        },
        buttonsStyling: false,
        focusConfirm: false,
        focusCancel: true
      });

      if (!result.isConfirmed) {
        return;
      }

      // Proceder con la eliminación
      console.log('Eliminando hotel con ID:', id);
      await hotelService.deleteHotel(id);

      // Recargar la lista después de eliminar
      const data = await hotelService.getHotels(1, 300);
      setHotels(data);
      setFiltered(data);

      // Mostrar confirmación de éxito
      await Swal.fire({
        title: '¡Eliminado!',
        text: 'El hotel ha sido eliminado exitosamente.',
        icon: 'success',
        confirmButtonColor: '#10b981',
        confirmButtonText: 'Entendido',
        customClass: {
          popup: 'rounded-xl shadow-2xl',
          title: 'text-xl font-bold text-gray-900',
          confirmButton: 'px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
        },
        buttonsStyling: false,
        timer: 2000,
        timerProgressBar: true
      });

    } catch (error) {
      console.error('Error eliminando hotel:', error);

      await Swal.fire({
        title: 'Error',
        text: 'No se pudo eliminar el hotel. Por favor intenta nuevamente.',
        icon: 'error',
        confirmButtonColor: '#dc2626',
        confirmButtonText: 'Entendido',
        customClass: {
          popup: 'rounded-xl shadow-2xl',
          title: 'text-xl font-bold text-gray-900',
          confirmButton: 'px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
        },
        buttonsStyling: false
      });
    }
  };

  const handleCreateHotel = async (payload: any) => {
    try {
      setCreateLoading(true);
      console.log('Creando hotel con payload:', payload);

      await hotelService.createHotel(payload);

      // Recargar la lista después de crear
      const data = await hotelService.getHotels(1, 300);
      setHotels(data);
      setFiltered(data);

      setCreateOpen(false);

      // Mostrar confirmación de éxito
      await Swal.fire({
        title: '¡Hotel Creado!',
        text: 'El hotel ha sido creado exitosamente.',
        icon: 'success',
        confirmButtonColor: '#10b981',
        confirmButtonText: 'Entendido',
        customClass: {
          popup: 'rounded-xl shadow-2xl',
          title: 'text-xl font-bold text-gray-900',
          confirmButton: 'px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
        },
        buttonsStyling: false,
        timer: 2000,
        timerProgressBar: true
      });

    } catch (error) {
      console.error('Error creando hotel:', error);

      await Swal.fire({
        title: 'Error',
        text: 'No se pudo crear el hotel. Por favor verifica los datos e intenta nuevamente.',
        icon: 'error',
        confirmButtonColor: '#dc2626',
        confirmButtonText: 'Entendido',
        customClass: {
          popup: 'rounded-xl shadow-2xl',
          title: 'text-xl font-bold text-gray-900',
          confirmButton: 'px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
        },
        buttonsStyling: false
      });
    } finally {
      setCreateLoading(false);
    }
  };

  // Exportar hoteles a Excel
  const handleExportHotels = async () => {
    try {
      await Swal.fire({
        title: 'Generando archivo...',
        text: 'Por favor espera mientras se genera el archivo Excel',
        icon: 'info',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true
      });

      // Obtener todos los hoteles directamente de la API
      const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:8008/api/v1";
      const response = await fetch(`${API_BASE_URL}/hoteles/listar/?page=1&size=1000`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      const apiData = await response.json();
      const hotelesData = apiData.data || [];

      if (!hotelesData.length) {
        await Swal.fire({
          title: 'Sin datos',
          text: 'No hay hoteles para exportar',
          icon: 'warning',
          confirmButtonColor: '#f59e0b',
          confirmButtonText: 'Entendido',
          customClass: {
            popup: 'rounded-xl shadow-2xl',
            title: 'text-xl font-bold text-gray-900',
            confirmButton: 'px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
          },
          buttonsStyling: false
        });
        return;
      }

      // Convertir a formato plano para la hoja de Excel con TODOS los campos
      const rows = hotelesData.map((item: any) => ({
        // Información del Proveedor
        'ID Proveedor': item.proveedor.id_proveedor,
        'Tipo': item.proveedor.tipo,
        'Nombre Hotel': item.proveedor.nombre,
        'Descripción': item.proveedor.descripcion || '',
        'Email': item.proveedor.email,
        'Teléfono': item.proveedor.telefono,
        'Dirección': item.proveedor.direccion,
        'Ciudad': item.proveedor.ciudad,
        'País': item.proveedor.pais,
        'Sitio Web': item.proveedor.sitio_web || '',
        'Rating Promedio': item.proveedor.rating_promedio,
        'Verificado': item.proveedor.verificado ? 'Sí' : 'No',
        'Fecha Registro': item.proveedor.fecha_registro,
        'Ubicación': item.proveedor.ubicacion || '',
        'Redes Sociales': item.proveedor.redes_sociales || '',
        'Relevancia': item.proveedor.relevancia,
        'Usuario Creador': item.proveedor.usuario_creador,
        'Tipo Documento': item.proveedor.tipo_documento,
        'Número Documento': item.proveedor.numero_documento,
        'Activo': item.proveedor.activo ? 'Sí' : 'No',

        // Información del Hotel
        'ID Hotel': item.hotel.id_hotel,
        'Estrellas': item.hotel.estrellas,
        'Número Habitaciones': item.hotel.numero_habitaciones,
        'Servicios Incluidos': item.hotel.servicios_incluidos || '',
        'Check-in': item.hotel.check_in,
        'Check-out': item.hotel.check_out,
        'Admite Mascotas': item.hotel.admite_mascotas ? 'Sí' : 'No',
        'Tiene Estacionamiento': item.hotel.tiene_estacionamiento ? 'Sí' : 'No',
        'Tipo Habitación': item.hotel.tipo_habitacion,
        'Precio Base': item.hotel.precio_ascendente,
        'Servicio Restaurante': item.hotel.servicio_restaurante ? 'Sí' : 'No',
        'Recepción 24h': item.hotel.recepcion_24_horas ? 'Sí' : 'No',
        'Bar': item.hotel.bar ? 'Sí' : 'No',
        'Room Service': item.hotel.room_service ? 'Sí' : 'No',
        'Ascensor': item.hotel.asensor ? 'Sí' : 'No',
        'Rampa Discapacitados': item.hotel.rampa_discapacitado ? 'Sí' : 'No',
        'Pet Friendly': item.hotel.pet_friendly ? 'Sí' : 'No',
        'Auditorio': item.hotel.auditorio ? 'Sí' : 'No',
        'Parqueadero': item.hotel.parqueadero ? 'Sí' : 'No',
        'Piscina': item.hotel.piscina ? 'Sí' : 'No',
        'Planta Energía': item.hotel.planta_energia ? 'Sí' : 'No'
      }));

      // Crear hoja de Excel
      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Hoteles');

      // Generar fecha y nombre del archivo con extensión explícita
      const fecha = new Date().toISOString().split('T')[0];
      const timestamp = new Date().getTime();
      const fileName = `hoteles_${fecha}_${timestamp}.xlsx`;

      // Generar ArrayBuffer y descargar manualmente para asegurar extensión
      const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
      });

      // Método mejorado para asegurar la descarga con extensión
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      // Configurar el enlace de descarga
      link.href = url;
      link.download = fileName;
      link.style.display = 'none';
      link.target = '_blank';

      // Forzar atributos para asegurar descarga correcta
      link.setAttribute('download', fileName);
      link.setAttribute('href', url);

      // Agregar al DOM, hacer click y limpiar
      document.body.appendChild(link);

      // Usar setTimeout para asegurar que el DOM se actualice
      setTimeout(() => {
        link.click();

        // Limpiar después de la descarga
        setTimeout(() => {
          if (document.body.contains(link)) {
            document.body.removeChild(link);
          }
          URL.revokeObjectURL(url);
        }, 200);
      }, 50);

      // Mostrar confirmación de éxito
      await Swal.fire({
        title: '¡Archivo Exportado!',
        text: `Se han exportado ${hotelesData.length} hoteles exitosamente.`,
        icon: 'success',
        confirmButtonColor: '#10b981',
        confirmButtonText: 'Entendido',
        customClass: {
          popup: 'rounded-xl shadow-2xl',
          title: 'text-xl font-bold text-gray-900',
          confirmButton: 'px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
        },
        buttonsStyling: false,
        timer: 3000,
        timerProgressBar: true
      });

    } catch (error) {
      console.error('Error exportando hoteles:', error);

      await Swal.fire({
        title: 'Error',
        text: 'No se pudo exportar el archivo. Por favor intenta nuevamente.',
        icon: 'error',
        confirmButtonColor: '#dc2626',
        confirmButtonText: 'Entendido',
        customClass: {
          popup: 'rounded-xl shadow-2xl',
          title: 'text-xl font-bold text-gray-900',
          confirmButton: 'px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
        },
        buttonsStyling: false
      });
    }
  };

  // Inicializar filtered con todos los hoteles
  useEffect(() => {
    setFiltered(hotels);
  }, [hotels]);

  // Estadísticas (pueden ser estáticas o simples conteos)
  const total = hotels.length;
  const verificadas = hotels.filter(h => h.verificado).length;
  const recep24 = hotels.filter(h => h.recepcion_24_horas).length;
  const conPiscina = hotels.filter(h => h.piscina).length;

  return (
    <div className="space-y-8">
      {/* Encabezado y botones */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <Building className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Hoteles</h1>
          </div>
          <p className="text-gray-600 mt-2">Administra todos los hoteles del sistema</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportHotels}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Download className="h-5 w-5" />
            <span>Exportar Hoteles</span>
          </button>
          <button
            onClick={() => setCreateOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <Plus className="h-5 w-5" />
            <span>Crear Hotel</span>
          </button>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total */}
        <div className="bg-blue-50 rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Hoteles</p>
              <p className="text-3xl font-bold text-blue-600">{total}</p>
            </div>
            <Hotel className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        {/* Verificados */}
        <div className="bg-green-50 rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Hoteles Verificados</p>
              <p className="text-3xl font-bold text-green-600">{verificadas}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        {/* Recepción 24h */}
        <div className="bg-orange-50 rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Recepción 24 horas</p>
              <p className="text-3xl font-bold text-orange-600">{recep24}</p>
            </div>
            <LayoutList className="h-8 w-8 text-orange-500" />
          </div>
        </div>
        {/* Con piscina */}
        <div className="bg-purple-50 rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Hoteles con Piscina</p>
              <p className="text-3xl font-bold text-purple-600">{conPiscina}</p>
            </div>
            <LayoutList className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Tabla */}
      <HotelTable
        hotels={filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
        searchTerm={searchTerm}
        isSearching={isSearching}
        onSearchChange={handleSearchChange}
        onClearSearch={handleClearSearch}
        loading={loading}
        currentPage={currentPage}
        totalPages={Math.ceil(filtered.length / pageSize)}
        totalHotels={filtered.length}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onView={handleViewHotel}
        onEdit={handleEditHotel}
        onDelete={handleDeleteHotel}
      />

      {/* Modal detalle */}
      {selectedHotelId && (
        <HotelDetailModal
          isOpen={detailOpen}
          onClose={() => setDetailOpen(false)}
          hotelId={selectedHotelId}
        />
      )}

      {editHotelId && (
        <EditHotelModal
          isOpen={editOpen}
          onClose={() => setEditOpen(false)}
          hotelId={editHotelId}
          onSuccess={handleEditSuccess}
        />
      )}

      <CreateHotelModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSave={handleCreateHotel}
        loading={createLoading}
      />

      {/* Gráficas de hoteles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <HotelStarsChart hotels={hotels} />
        <HotelServicesChart hotels={hotels} />
      </div>
    </div>
  );
};
