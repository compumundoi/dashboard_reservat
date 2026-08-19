import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Download, Plus, UtensilsCrossed } from 'lucide-react';
import { RestauranteData } from '../../types/restaurante';
import { restauranteService } from '../../services/restauranteService';
import RestauranteTable from './RestauranteTable';
import RestauranteStats from './RestauranteStats';
import RestauranteCharts from './RestauranteCharts';
import RestauranteDetailModal from './RestauranteDetailModal';
import EditRestauranteModal from './EditRestauranteModal';
import CreateRestauranteModal from './CreateRestauranteModal';
import { Button } from '../ui/Button';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

const RestaurantesSection: React.FC = () => {
  // Estados principales
  const [filteredRestaurantes, setFilteredRestaurantes] = useState<RestauranteData[]>([]);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [chartsLoading, setChartsLoading] = useState(true);

  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // Estados de búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  // Un término nuevo puede dejar en vuelo la petición anterior. Sólo la
  // última pedida tiene derecho a pintar la tabla.
  const ultimaPeticion = useRef(0);

  // Estados de modales
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedRestauranteId, setSelectedRestauranteId] = useState<string | null>(null);

  // Cargar restaurantes
  const loadRestaurantes = useCallback(async (page: number = currentPage, size: number = pageSize, busqueda: string = '') => {
    const peticion = ++ultimaPeticion.current;
    try {
      setLoading(true);
      const response = await restauranteService.getRestaurantes(page - 1, size, busqueda);
      if (peticion !== ultimaPeticion.current) return;

      setFilteredRestaurantes(response.restaurantes);
      setTotalPages(response.totalPages);
      setTotalItems(response.total);
      setCurrentPage(response.currentPage);
    } catch (error) {
      console.error('Error loading restaurantes:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al cargar los restaurantes'
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    setTimeout(() => setStatsLoading(false), 1000);
    setTimeout(() => setChartsLoading(false), 1200);
  }, []);

  // Se espera a que el usuario deje de tipear para no disparar un request
  // por tecla.
  useEffect(() => {
    setIsSearching(Boolean(searchTerm.trim()));
    const timeout = setTimeout(() => setDebouncedSearch(searchTerm), 350);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  // Un término nuevo devuelve otro conjunto de resultados, así que la
  // página actual deja de tener sentido.
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    loadRestaurantes(currentPage, pageSize, debouncedSearch).finally(() =>
      setIsSearching(false),
    );
  }, [currentPage, pageSize, debouncedSearch, loadRestaurantes]);

  // La búsqueda la resuelve el backend: alcanza todos los restaurantes y
  // no sólo la página cargada.
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  // Manejar cambio de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Manejar cambio de tamaño de página
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // Manejar ver detalles
  const handleViewDetails = (id: string) => {
    setSelectedRestauranteId(id);
    setDetailModalOpen(true);
  };

  // Manejar editar
  const handleEdit = (id: string) => {
    setSelectedRestauranteId(id);
    setEditModalOpen(true);
  };

  // Manejar eliminar
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Estás seguro de eliminar este restaurante?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await restauranteService.deleteRestaurante(id);
        await Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'Restaurante eliminado exitosamente',
          timer: 2000,
          showConfirmButton: false
        });
        loadRestaurantes();
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al eliminar el restaurante'
        });
      }
    }
  };

  // Manejar crear restaurante
  const handleCreateSuccess = () => {
    setCreateModalOpen(false);
    loadRestaurantes();
    Swal.fire({
      icon: 'success',
      title: 'Creado',
      text: 'Restaurante creado exitosamente',
      timer: 2000,
      showConfirmButton: false
    });
  };

  // Manejar editar restaurante
  const handleEditSuccess = () => {
    setEditModalOpen(false);
    setSelectedRestauranteId(null);
    loadRestaurantes();
    Swal.fire({
      icon: 'success',
      title: 'Actualizado',
      text: 'Restaurante actualizado exitosamente',
      timer: 2000,
      showConfirmButton: false
    });
  };

  // Exportar a Excel
  const handleExport = async () => {
    try {
      const { restaurantes: allRestaurantes } = await restauranteService.getRestaurantes(0, 1000);

      const exportData = allRestaurantes.map(restaurante => ({
        'Nombre': restaurante.nombre,
        'Email': restaurante.email,
        'Teléfono': restaurante.telefono,
        'Ciudad': restaurante.ciudad,
        'País': restaurante.pais,
        'Tipo de Cocina': restaurante.tipo_cocina,
        'Horario Apertura': restaurante.horario_apertura,
        'Horario Cierre': restaurante.horario_cierre,
        'Capacidad': restaurante.capacidad,
        'Aforo Máximo': restaurante.aforo_maximo,
        'Verificado': restaurante.verificado ? 'Sí' : 'No',
        'Pet Friendly': restaurante.pet_friendly ? 'Sí' : 'No',
        'WiFi': restaurante.wifi ? 'Sí' : 'No',
        'Parqueadero': restaurante.parqueadero ? 'Sí' : 'No',
        'Entrega a Domicilio': restaurante.entrega_a_domicilio ? 'Sí' : 'No',
        'Terraza': restaurante.terraza ? 'Sí' : 'No',
        'Apto Celíacos': restaurante.apto_celiacos ? 'Sí' : 'No',
        'Apto Vegetarianos': restaurante.apto_vegetarianos ? 'Sí' : 'No',
        'Menú Vegano': restaurante.menu_vegana ? 'Sí' : 'No',
        'Eventos': restaurante.eventos ? 'Sí' : 'No',
        'Catering': restaurante.catering ? 'Sí' : 'No',
        'Tipo Documento': restaurante.tipo_documento,
        'Número Documento': restaurante.numero_documento,
        'Dirección': restaurante.direccion,
        'Sitio Web': restaurante.sitio_web,
        'Rating': restaurante.rating_promedio,
        'Fecha Registro': new Date(restaurante.fecha_registro).toLocaleDateString()
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();

      // Configurar anchos de columna
      const colWidths = [
        { wch: 25 }, { wch: 30 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
        { wch: 20 }, { wch: 12 }, { wch: 12 }, { wch: 10 }, { wch: 12 },
        { wch: 12 }, { wch: 12 }, { wch: 8 }, { wch: 12 }, { wch: 18 },
        { wch: 10 }, { wch: 15 }, { wch: 18 }, { wch: 15 }, { wch: 10 },
        { wch: 10 }, { wch: 15 }, { wch: 20 }, { wch: 40 }, { wch: 30 },
        { wch: 10 }, { wch: 15 }
      ];
      worksheet['!cols'] = colWidths;

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Restaurantes');
      XLSX.writeFile(workbook, 'restaurantes.xlsx');

      Swal.fire({
        icon: 'success',
        title: 'Exportado',
        text: 'Datos exportados exitosamente',
        timer: 2000,
        showConfirmButton: false
      });
    } catch {
      console.error('Error exporting to Excel');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al exportar los datos'
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <UtensilsCrossed className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Restaurantes</h1>
          </div>
          <p className="text-gray-600 mt-2">Administra los restaurantes y su información detallada</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleExport}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            <span>Exportar Restaurantes</span>
          </Button>
          <Button
            onClick={() => setCreateModalOpen(true)}
            variant="primary"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Crear Restaurante</span>
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <RestauranteStats loading={statsLoading} />

      {/* Tabla de restaurantes */}
      <RestauranteTable
        restaurantes={filteredRestaurantes}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={totalItems}
        searchTerm={searchTerm}
        isSearching={isSearching}
        onSearch={handleSearch}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onViewDetails={handleViewDetails}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Gráficos */}
      <RestauranteCharts loading={chartsLoading} />

      {/* Modales */}
      {detailModalOpen && selectedRestauranteId && (
        <RestauranteDetailModal
          restauranteId={selectedRestauranteId}
          isOpen={detailModalOpen}
          onClose={() => {
            setDetailModalOpen(false);
            setSelectedRestauranteId(null);
          }}
        />
      )}

      {editModalOpen && selectedRestauranteId && (
        <EditRestauranteModal
          restauranteId={selectedRestauranteId}
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedRestauranteId(null);
          }}
          onSuccess={handleEditSuccess}
        />
      )}

      {createModalOpen && (
        <CreateRestauranteModal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
    </div>
  );
};

export default RestaurantesSection;
