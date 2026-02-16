/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Download, MapPin } from 'lucide-react';
import { ViajeData, ViajeStatsData, ViajeChartData } from '../../types/viaje';
import { viajeService } from '../../services/viajeService';
import ViajeTable from './ViajeTable';
import ViajeStats from './ViajeStats';
import ViajeCharts from './ViajeCharts';
import ViajeDetailModal from './ViajeDetailModal';
import EditViajeModal from './EditViajeModal';
import CreateViajeModal from './CreateViajeModal';
import Swal from 'sweetalert2';

const ViajesSection: React.FC = () => {
  // Estados principales
  const [viajes, setViajes] = useState<ViajeData[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados de paginación y búsqueda
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  // Estados para filtrado local
  const [filteredViajes, setFilteredViajes] = useState<ViajeData[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Estados de estadísticas y gráficos
  const [stats, setStats] = useState<ViajeStatsData>({
    totalViajes: 0,
    viajesActivos: 0,
    viajesEnCurso: 0,
    capacidadPromedioDisponible: 0
  });
  const [chartData, setChartData] = useState<ViajeChartData>({
    estadoDistribution: [],
    viajePorMes: []
  });

  // Estados de modales
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedViaje, setSelectedViaje] = useState<ViajeData | null>(null);

  // Cargar viajes
  const loadViajes = useCallback(async (page: number = currentPage, size: number = pageSize) => {
    try {
      setLoading(true);

      const response = await viajeService.getViajes(page - 1, size);

      // Procesar datos para la UI
      const processedViajes = response.viajes.map(viaje =>
        viajeService.processViajeData(viaje)
      );

      setViajes(processedViajes);
      setTotalItems(response.total);
      setTotalPages(Math.ceil(response.total / size));

      // Calcular estadísticas y gráficos
      const calculatedStats = viajeService.calculateStats(processedViajes);
      const generatedChartData = viajeService.generateChartData(processedViajes);

      setStats(calculatedStats);
      setChartData(generatedChartData);

    } catch (error) {
      console.error('Error al cargar viajes:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los viajes. Por favor, intenta de nuevo.',
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  // Efecto para cargar datos iniciales
  useEffect(() => {
    loadViajes();
  }, [loadViajes]);

  // Efecto para búsqueda local
  useEffect(() => {
    if (searchTerm.trim()) {
      setIsSearching(true);
      const filtered = viajeService.searchViajes(viajes, searchTerm);
      setFilteredViajes(filtered);
    } else {
      setIsSearching(false);
      setFilteredViajes([]);
    }
  }, [searchTerm, viajes]);

  // Handlers
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (!isSearching) {
      loadViajes(page, pageSize);
    }
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
    if (!isSearching) {
      loadViajes(1, size);
    }
  };

  const handleViewDetails = (viaje: ViajeData) => {
    setSelectedViaje(viaje);
    setShowDetailModal(true);
  };

  const handleEdit = (viaje: ViajeData) => {
    setSelectedViaje(viaje);
    setShowEditModal(true);
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
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        await viajeService.deleteViaje(id);

        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El viaje ha sido eliminado correctamente',
          timer: 2000,
          showConfirmButton: false
        });

        await loadViajes();
      }
    } catch (error) {
      console.error('Error al eliminar viaje:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar el viaje. Por favor, intenta de nuevo.',
      });
    }
  };

  const handleSaveEdit = async (data: any) => {
    try {
      if (!selectedViaje?.id) return;

      await viajeService.updateViaje(selectedViaje.id, data);

      Swal.fire({
        icon: 'success',
        title: 'Actualizado',
        text: 'El viaje ha sido actualizado correctamente',
        timer: 2000,
        showConfirmButton: false
      });

      setShowEditModal(false);
      setSelectedViaje(null);
      await loadViajes();
    } catch (error) {
      console.error('Error al actualizar viaje:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el viaje. Por favor, intenta de nuevo.',
      });
    }
  };

  const handleSaveCreate = async (data: any) => {
    try {
      await viajeService.createViaje(data);

      Swal.fire({
        icon: 'success',
        title: 'Creado',
        text: 'El viaje ha sido creado correctamente',
        timer: 2000,
        showConfirmButton: false
      });

      setShowCreateModal(false);
      await loadViajes();
    } catch (error) {
      console.error('Error al crear viaje:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo crear el viaje. Por favor, intenta de nuevo.',
      });
    }
  };

  const handleExport = async () => {
    try {
      const allViajes = isSearching ? filteredViajes : viajes;
      await viajeService.exportToExcel(allViajes);

      Swal.fire({
        icon: 'success',
        title: 'Exportado',
        text: 'Los viajes han sido exportados correctamente',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error al exportar viajes:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo exportar los viajes. Por favor, intenta de nuevo.',
      });
    }
  };

  // Datos para mostrar (filtrados o todos)
  const displayViajes = isSearching ? filteredViajes : viajes;
  const displayTotalItems = isSearching ? filteredViajes.length : totalItems;
  const displayTotalPages = isSearching ? Math.ceil(filteredViajes.length / pageSize) : totalPages;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <MapPin className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Viajes</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {displayTotalItems} viajes encontrados
          </p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button
            onClick={handleExport}
            disabled={loading || displayViajes.length === 0}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar Viajes
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Crear Viaje
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <ViajeStats stats={stats} loading={loading} />

      {/* Tabla */}
      <ViajeTable
        viajes={displayViajes}
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
      <ViajeCharts chartData={chartData} loading={loading} />

      {/* Modales */}
      <ViajeDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        viaje={selectedViaje}
      />

      <EditViajeModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        viaje={selectedViaje}
        onSave={handleSaveEdit}
      />

      <CreateViajeModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleSaveCreate}
      />
    </div>
  );
};

export default ViajesSection;
