import React, { useState, useEffect, useRef } from 'react';
import { Plus, Download, Image } from 'lucide-react';
import Swal from 'sweetalert2';
import FotoTable from './FotoTable';
import FotoStats from './FotoStats';
import FotoCharts from './FotoCharts';
import FotoDetailModal from './FotoDetailModal';
import EditFotoModal from './EditFotoModal';
import CreateFotoModal from './CreateFotoModal';
import { 
  listarFotos, 
  crearFoto, 
  actualizarFoto, 
  eliminarFoto,
  procesarDatosFotos,
  calcularEstadisticas,
  generarDatosGraficos,
  exportarFotosExcel
} from '../../services/fotoService';
import { FotoData, DatosFoto, ActualizarFoto, FotoStatsData, FotoChartData } from '../../types/foto';

const FotosSection: React.FC = () => {
  // Estados principales
  const [filteredFotos, setFilteredFotos] = useState<FotoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  // Sólo la última petición pedida puede pintar la tabla.
  const ultimaPeticion = useRef(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Estados de búsqueda
  const [searchTerm, setSearchTerm] = useState('');

  // Estados de estadísticas y gráficos
  const [stats, setStats] = useState<FotoStatsData>({
    totalFotos: 0,
    fotosActivas: 0,
    fotosPortada: 0,
    serviciosConFotos: 0
  });
  const [chartData, setChartData] = useState<FotoChartData>({
    estadoData: [],
    subidasMesData: []
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Estados de modales
  const [selectedFoto, setSelectedFoto] = useState<FotoData | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Cargar fotos
  const loadFotos = async (page: number, size: number, busqueda: string = '') => {
    const peticion = ++ultimaPeticion.current;
    try {
      setLoading(true);
      setError(null);

      const response = await listarFotos(page, size, busqueda);
      if (peticion !== ultimaPeticion.current) return;
      const { fotos: fotosData, totalItems: total, totalPages: pages, currentPage: current } = procesarDatosFotos(response);
      
      setFilteredFotos(fotosData);
      setTotalItems(total);
      setTotalPages(pages);
      setCurrentPage(current);
      
    } catch (err) {
      setError('Error al cargar las fotos');
      console.error('Error loading fotos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar estadísticas y gráficos
  const loadStatsAndCharts = async () => {
    try {
      setStatsLoading(true);
      
      // Cargar todas las fotos para estadísticas (límite alto)
      const response = await listarFotos(0, 1000);
      const { fotos: todasLasFotos } = procesarDatosFotos(response);
      
      // Calcular estadísticas
      const estadisticas = calcularEstadisticas(todasLasFotos);
      setStats(estadisticas);
      
      // Generar datos para gráficos
      const datosGraficos = generarDatosGraficos(todasLasFotos);
      setChartData(datosGraficos);
      
    } catch (err) {
      console.error('Error loading stats and charts:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  // Las tarjetas resumen todo el catálogo, no dependen de la búsqueda.
  useEffect(() => {
    loadStatsAndCharts();
  }, []);

  // Se espera a que el usuario deje de tipear para no pedir por tecla.
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(searchTerm), 350);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  // Otro término, otro conjunto de resultados: la página vuelve a la primera.
  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedSearch]);

  // La búsqueda la resuelve el backend, así que alcanza todas las fotos y
  // no sólo la página cargada.
  useEffect(() => {
    loadFotos(currentPage, pageSize, debouncedSearch);
  }, [currentPage, pageSize, debouncedSearch]);

  // Manejar cambio de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Manejar cambio de tamaño de página
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(0);
  };

  // Manejar búsqueda
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(0);
  };

  // Ver detalle de foto
  const handleViewFoto = (foto: FotoData) => {
    setSelectedFoto(foto);
    setIsDetailModalOpen(true);
  };

  // Editar foto
  const handleEditFoto = (foto: FotoData) => {
    setSelectedFoto(foto);
    setIsEditModalOpen(true);
  };

  // Eliminar foto
  const handleDeleteFoto = async (id: string) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await eliminarFoto(id);
        
        await Swal.fire({
          title: '¡Eliminada!',
          text: 'La foto ha sido eliminada correctamente',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });

        // Recargar datos
        loadFotos(currentPage, pageSize);
        loadStatsAndCharts();
        
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo eliminar la foto',
          icon: 'error'
        });
      }
    }
  };

  // Crear nueva foto
  const handleCreateFoto = async (data: DatosFoto) => {
    try {
      await crearFoto(data);
      
      await Swal.fire({
        title: '¡Creada!',
        text: 'La foto ha sido creada correctamente',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });

      setIsCreateModalOpen(false);
      
      // Recargar datos
      loadFotos(currentPage, pageSize);
      loadStatsAndCharts();
      
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'No se pudo crear la foto',
        icon: 'error'
      });
      throw error;
    }
  };

  // Actualizar foto
  const handleUpdateFoto = async (data: ActualizarFoto) => {
    if (!selectedFoto) return;

    try {
      await actualizarFoto(selectedFoto.id, data);
      
      await Swal.fire({
        title: '¡Actualizada!',
        text: 'La foto ha sido actualizada correctamente',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });

      setIsEditModalOpen(false);
      setSelectedFoto(null);
      
      // Recargar datos
      loadFotos(currentPage, pageSize);
      loadStatsAndCharts();
      
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'No se pudo actualizar la foto',
        icon: 'error'
      });
      throw error;
    }
  };

  // Exportar a Excel
  const handleExportExcel = async () => {
    try {
      const result = await Swal.fire({
        title: 'Exportar Fotos',
        text: '¿Deseas exportar todas las fotos a Excel?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3B82F6',
        cancelButtonColor: '#6B7280',
        confirmButtonText: 'Sí, exportar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        await exportarFotosExcel();
        
        Swal.fire({
          title: '¡Exportado!',
          text: 'Las fotos han sido exportadas correctamente',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'No se pudo exportar las fotos',
        icon: 'error'
      });
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-3">
            <Image className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Fotos</h1>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar Fotos
          </button>
          
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Crear Foto
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <FotoStats stats={stats} loading={statsLoading} />

      {/* Tabla */}
      <FotoTable
        fotos={filteredFotos}
        loading={loading}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        currentPage={currentPage}
        totalPages={searchTerm ? Math.ceil(filteredFotos.length / pageSize) : totalPages}
        pageSize={pageSize}
        totalItems={searchTerm ? filteredFotos.length : totalItems}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onView={handleViewFoto}
        onEdit={handleEditFoto}
        onDelete={handleDeleteFoto}
      />

      {/* Gráficos */}
      <FotoCharts chartData={chartData} loading={statsLoading} />

      {/* Modales */}
      <FotoDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedFoto(null);
        }}
        foto={selectedFoto}
      />

      <EditFotoModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedFoto(null);
        }}
        foto={selectedFoto}
        onSave={handleUpdateFoto}
      />

      <CreateFotoModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateFoto}
      />
    </div>
  );
};

export default FotosSection;
