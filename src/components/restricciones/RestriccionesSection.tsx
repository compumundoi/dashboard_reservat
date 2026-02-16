import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Download, ShieldAlert } from 'lucide-react';
import { RestriccionData, RestriccionStatsData, RestriccionChartData } from '../../types/restriccion';
import { restriccionService } from '../../services/restriccionService';
import RestriccionTable from './RestriccionTable';
import RestriccionStats from './RestriccionStats';
import RestriccionCharts from './RestriccionCharts';
import RestriccionDetailModal from './RestriccionDetailModal';
import EditRestriccionModal from './EditRestriccionModal';
import CreateRestriccionModal from './CreateRestriccionModal';
import { Button } from '../ui/Button';
import Swal from 'sweetalert2';

const RestriccionesSection: React.FC = () => {
  // Estados principales
  const [restricciones, setRestricciones] = useState<RestriccionData[]>([]);
  const [filteredRestricciones, setFilteredRestricciones] = useState<RestriccionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  // Estados para estadísticas y gráficos
  const [stats, setStats] = useState<RestriccionStatsData>({
    totalRestricciones: 0,
    restriccionesActivas: 0,
    restriccionesMesActual: 0,
    serviciosConRestricciones: 0
  });
  const [chartData, setChartData] = useState<RestriccionChartData>({
    estados: [],
    bloqueosPorMes: []
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [chartsLoading, setChartsLoading] = useState(true);

  // Estados para modales
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedRestriccionId, setSelectedRestriccionId] = useState<string | null>(null);

  // Cargar restricciones
  const loadRestricciones = useCallback(async (page: number = currentPage, size: number = pageSize) => {
    try {
      setLoading(true);
      const response = await restriccionService.getRestricciones(page - 1, size); // API usa paginación 0-based

      const processedData = restriccionService.processRestriccionesForUI(response.fechas_bloqueadas);
      setRestricciones(processedData);
      setTotalItems(response.total);
      setTotalPages(Math.ceil(response.total / size));

      // Si no hay búsqueda activa, usar los datos paginados de la API
      if (!searchTerm) {
        setFilteredRestricciones(processedData);
      }

    } catch (error) {
      console.error('Error loading restricciones:', error);
      Swal.fire({
        title: 'Error',
        text: 'Error al cargar las restricciones',
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchTerm]);

  // Cargar estadísticas
  const loadStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const statsData = await restriccionService.calculateStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Cargar datos para gráficos
  const loadChartData = useCallback(async () => {
    try {
      setChartsLoading(true);
      const chartData = await restriccionService.generateChartData();
      setChartData(chartData);
    } catch (error) {
      console.error('Error loading chart data:', error);
    } finally {
      setChartsLoading(false);
    }
  }, []);

  // Filtrado local para búsqueda
  useEffect(() => {
    if (searchTerm) {
      const filtered = restricciones.filter(restriccion =>
        restriccion.motivo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restriccion.bloqueado_por.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restriccion.servicio_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restriccion.fecha_formateada.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRestricciones(filtered);
      setTotalItems(filtered.length);
      setTotalPages(Math.ceil(filtered.length / pageSize));
    } else {
      setFilteredRestricciones(restricciones);
      // NO llamar loadRestricciones aquí para evitar bucle infinito
    }
  }, [searchTerm, restricciones, pageSize]);

  // Cargar datos iniciales
  useEffect(() => {
    loadRestricciones();
    loadStats();
    loadChartData();
  }, [loadRestricciones, loadStats, loadChartData]);

  // Cargar restricciones cuando cambie la página o el tamaño de página (solo si no hay búsqueda activa)
  useEffect(() => {
    if (!searchTerm) {
      loadRestricciones(currentPage, pageSize);
    }
  }, [currentPage, pageSize, searchTerm, loadRestricciones]);

  // Handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleView = (id: string) => {
    setSelectedRestriccionId(id);
    setDetailModalOpen(true);
  };

  const handleEdit = (id: string) => {
    setSelectedRestriccionId(id);
    setEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        customClass: {
          popup: 'rounded-xl shadow-2xl',
          title: 'text-xl font-bold text-gray-900',
          confirmButton: 'px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
          cancelButton: 'px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
        }
      });

      if (result.isConfirmed) {
        await restriccionService.deleteRestriccion(id);

        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'La restricción ha sido eliminada correctamente',
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            popup: 'rounded-xl shadow-2xl',
          }
        });

        await loadRestricciones();
        await loadStats();
        await loadChartData();
      }
    } catch (error) {
      console.error('Error al eliminar restricción:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar la restricción. Por favor, intenta de nuevo.',
        customClass: {
          popup: 'rounded-xl shadow-2xl',
        }
      });
    }
  };

  const handleExport = async () => {
    try {
      await restriccionService.exportToExcel();
      Swal.fire({
        icon: 'success',
        title: 'Exportación exitosa',
        text: 'El archivo Excel ha sido descargado correctamente',
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: 'rounded-xl shadow-2xl',
        }
      });
    } catch (error) {
      console.error('Error al exportar:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error en la exportación',
        text: 'No se pudo exportar el archivo. Por favor, intenta de nuevo.',
        customClass: {
          popup: 'rounded-xl shadow-2xl',
        }
      });
    }
  };

  const handleModalSave = async () => {
    await loadRestricciones();
    await loadStats();
    await loadChartData();
  };

  const selectedRestriccion = selectedRestriccionId
    ? restricciones.find(r => r.id === selectedRestriccionId)
    : null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <ShieldAlert className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Restricciones</h1>
          </div>
          <p className="text-gray-600 mt-2">Administra las fechas bloqueadas y restricciones del sistema</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            <span>Exportar</span>
          </Button>
          <Button
            variant="primary"
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Crear Restricción</span>
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <RestriccionStats stats={stats} loading={statsLoading} />

      {/* Tabla */}
      <RestriccionTable
        restricciones={filteredRestricciones}
        loading={loading}
        currentPage={currentPage}
        pageSize={pageSize}
        totalPages={totalPages}
        totalItems={totalItems}
        searchTerm={searchTerm}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onSearch={handleSearch}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Gráficos */}
      <RestriccionCharts data={chartData} loading={chartsLoading} />

      {/* Modales */}
      <RestriccionDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        restriccion={selectedRestriccion}
      />

      <EditRestriccionModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        restriccion={selectedRestriccion}
        onSave={handleModalSave}
      />

      <CreateRestriccionModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleModalSave}
      />
    </div>
  );
};

export default RestriccionesSection;
