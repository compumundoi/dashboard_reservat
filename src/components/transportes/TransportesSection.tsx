import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Download, Car } from 'lucide-react';
import { TransporteData, TransporteStats as TransporteStatsType, TransporteChartData } from '../../types/transporte';
import { transporteService } from '../../services/transporteService';
import TransporteTable from './TransporteTable';
import TransporteStats from './TransporteStats';
import TransporteCharts from './TransporteCharts';
import TransporteDetailModal from './TransporteDetailModal';
import EditTransporteModal from './EditTransporteModal';
import CreateTransporteModal from './CreateTransporteModal';
import { Button } from '../ui/Button';
import Swal from 'sweetalert2';

const TransportesSection: React.FC = () => {
  // Estados principales
  const [transportes, setTransportes] = useState<TransporteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTransportes, setFilteredTransportes] = useState<TransporteData[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Estados para estadísticas y gráficos
  const [stats, setStats] = useState<TransporteStatsType>({
    totalTransportes: 0,
    transportesDisponibles: 0,
    transportesConSeguro: 0,
    capacidadPromedio: 0
  });

  const [chartData, setChartData] = useState<TransporteChartData>({
    tiposVehiculo: [],
    estados: []
  });

  // Estados para modales
  const [selectedTransporte, setSelectedTransporte] = useState<TransporteData | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Cargar transportes
  const loadTransportes = useCallback(async (page: number = currentPage, size: number = pageSize) => {
    try {
      setLoading(true);
      const response = await transporteService.getTransportes(page, size);

      setTransportes(response.data);
      setTotalItems(response.total);
      setTotalPages(Math.ceil(response.total / size));
      setCurrentPage(response.page);

      // Calcular estadísticas
      calculateStats(response.data);
      calculateChartData(response.data);

    } catch (error) {
      console.error('Error loading transportes:', error);
      Swal.fire({
        title: 'Error',
        text: 'Error al cargar los transportes',
        icon: 'error',
        confirmButtonColor: '#dc2626'
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  // Calcular estadísticas
  const calculateStats = (data: TransporteData[]) => {
    const totalTransportes = data.length;
    const transportesDisponibles = data.filter(t => t.transporte.disponible).length;
    const transportesConSeguro = data.filter(t => t.transporte.seguro_vigente).length;
    const capacidadPromedio = totalTransportes > 0
      ? Math.round(data.reduce((sum, t) => sum + t.transporte.capacidad, 0) / totalTransportes)
      : 0;

    setStats({
      totalTransportes,
      transportesDisponibles,
      transportesConSeguro,
      capacidadPromedio
    });
  };

  // Calcular datos para gráficos
  const calculateChartData = (data: TransporteData[]) => {
    // Distribución por tipo de vehículo
    const tiposCount = data.reduce((acc, t) => {
      const tipo = t.transporte.tipo_vehiculo;
      acc[tipo] = (acc[tipo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const tiposVehiculo = Object.entries(tiposCount).map(([name, value], index) => ({
      name,
      value,
      color: [
        'from-blue-400 to-blue-600',
        'from-green-400 to-green-600',
        'from-purple-400 to-purple-600',
        'from-orange-400 to-orange-600',
        'from-red-400 to-red-600'
      ][index % 5]
    }));

    // Estados (Disponible/No Disponible)
    const disponibles = data.filter(t => t.transporte.disponible).length;
    const noDisponibles = data.length - disponibles;

    const estados = [
      {
        name: 'Disponible',
        value: disponibles,
        color: 'from-green-400 to-green-600'
      },
      {
        name: 'No Disponible',
        value: noDisponibles,
        color: 'from-red-400 to-red-600'
      }
    ].filter(item => item.value > 0);

    setChartData({ tiposVehiculo, estados });
  };

  // Manejar búsqueda
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim()) {
      setIsSearching(true);
      const filtered = transporteService.searchTransportes(transportes, term);
      setFilteredTransportes(filtered);
    } else {
      setIsSearching(false);
      setFilteredTransportes([]);
    }
  };

  // Manejar cambio de página
  const handlePageChange = (page: number) => {
    if (!isSearching) {
      loadTransportes(page, pageSize);
    } else {
      setCurrentPage(page);
    }
  };

  // Manejar cambio de tamaño de página
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
    if (!isSearching) {
      loadTransportes(1, size);
    }
  };

  // Handlers para modales
  const handleViewDetails = (transporte: TransporteData) => {
    setSelectedTransporte(transporte);
    setShowDetailModal(true);
  };

  const handleEdit = (transporte: TransporteData) => {
    setSelectedTransporte(transporte);
    setShowEditModal(true);
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await transporteService.deleteTransporte(id);

        Swal.fire({
          title: '¡Eliminado!',
          text: 'Transporte eliminado correctamente',
          icon: 'success',
          confirmButtonColor: '#059669',
          timer: 3000,
          timerProgressBar: true
        });

        // Recargar datos
        loadTransportes();
      } catch (err) {
        console.error('Error deleting transporte:', err);
        Swal.fire({
          title: 'Error',
          text: 'Error al eliminar el transporte',
          icon: 'error',
          confirmButtonColor: '#dc2626'
        });
      }
    }
  };

  // Handler para exportar
  const handleExport = async () => {
    try {
      await transporteService.exportToExcel();
      Swal.fire({
        title: '¡Exportado!',
        text: 'Archivo Excel descargado correctamente',
        icon: 'success',
        confirmButtonColor: '#059669',
        timer: 3000,
        timerProgressBar: true
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Error',
        text: 'Error al exportar los datos',
        icon: 'error',
        confirmButtonColor: '#dc2626'
      });
    }
  };

  // Handlers para cerrar modales y recargar
  const handleModalClose = () => {
    setSelectedTransporte(null);
    setShowDetailModal(false);
    setShowEditModal(false);
    setShowCreateModal(false);
  };

  const handleModalSave = () => {
    loadTransportes();
    handleModalClose();
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    loadTransportes();
  }, [loadTransportes]);

  // Datos para mostrar (filtrados o normales)
  const displayTransportes = isSearching ? filteredTransportes : transportes;
  const displayTotalItems = isSearching ? filteredTransportes.length : totalItems;
  const displayTotalPages = isSearching
    ? Math.ceil(filteredTransportes.length / pageSize)
    : totalPages;

  return (
    <div className="space-y-8">
      {/* Header con botones */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <Car className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Transportes</h1>
          </div>
          <p className="text-gray-600 mt-2">Administra todos los transportes del sistema</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            <span>Exportar Transportes</span>
          </Button>
          <Button
            onClick={() => setShowCreateModal(true)}
            variant="primary"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Crear Transporte</span>
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <TransporteStats stats={stats} loading={loading} />

      {/* Tabla */}
      <TransporteTable
        transportes={displayTransportes}
        loading={loading}
        currentPage={currentPage}
        totalPages={displayTotalPages}
        pageSize={pageSize}
        totalItems={displayTotalItems}
        searchTerm={searchTerm}
        onSearch={handleSearch}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onViewDetails={handleViewDetails}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Gráficos */}
      <TransporteCharts chartData={chartData} loading={loading} />

      {/* Modales */}
      <TransporteDetailModal
        isOpen={showDetailModal}
        onClose={handleModalClose}
        transporte={selectedTransporte || undefined}
      />

      <EditTransporteModal
        isOpen={showEditModal}
        onClose={handleModalClose}
        transporte={selectedTransporte || undefined}
        onSave={handleModalSave}
      />

      <CreateTransporteModal
        isOpen={showCreateModal}
        onClose={handleModalClose}
        onSave={handleModalSave}
      />
    </div>
  );
};

export default TransportesSection;
