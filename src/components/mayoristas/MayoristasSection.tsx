import React, { useState, useEffect } from 'react';
import { Download, Plus, Store } from 'lucide-react';
import { Button } from "../ui/Button";
import { MayoristaData, MayoristaStats as MayoristaStatsType, MayoristaChartData } from '../../types/mayorista';
import { mayoristaService } from '../../services/mayoristaService';
import MayoristaTable from './MayoristaTable';
import MayoristaStats from './MayoristaStats';
import MayoristaCharts from './MayoristaCharts';
import MayoristaDetailModal from './MayoristaDetailModal';
import EditMayoristaModal from './EditMayoristaModal';
import CreateMayoristaModal from './CreateMayoristaModal';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

const MayoristasSection: React.FC = () => {
  // Estados principales
  const [mayoristas, setMayoristas] = useState<MayoristaData[]>([]);
  const [filteredMayoristas, setFilteredMayoristas] = useState<MayoristaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [chartsLoading, setChartsLoading] = useState(true);

  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // Estados de búsqueda
  const [searchTerm, setSearchTerm] = useState('');

  // Estados de modales
  const [detailOpen, setDetailOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedMayoristaId, setSelectedMayoristaId] = useState<string | null>(null);

  // Estados de datos
  const [stats, setStats] = useState<MayoristaStatsType>({
    total: 0,
    activos: 0,
    verificados: 0,
    recurrentes: 0
  });
  const [chartData, setChartData] = useState<MayoristaChartData>({
    estados: [],
    verificacion: []
  });

  const loadMayoristas = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await mayoristaService.getMayoristas(currentPage - 1, pageSize);
      setMayoristas(response.mayoristas);
      setFilteredMayoristas(response.mayoristas);
      setTotalItems(response.total);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error loading mayoristas:', error);
      await Swal.fire({
        title: 'Error',
        text: 'Error al cargar los mayoristas',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#EF4444'
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  const loadStats = React.useCallback(async () => {
    try {
      setStatsLoading(true);
      const statsData = await mayoristaService.getMayoristaStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const loadChartData = React.useCallback(async () => {
    try {
      setChartsLoading(true);
      const data = await mayoristaService.getMayoristaChartData();
      setChartData(data);
    } catch (error) {
      console.error('Error loading chart data:', error);
    } finally {
      setChartsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMayoristas();
    loadStats();
    loadChartData();
  }, [loadMayoristas, loadStats, loadChartData]);

  useEffect(() => {
    if (searchTerm.trim()) {

      const filtered = mayoristas.filter(mayorista =>
        mayorista.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (mayorista.apellidos && mayorista.apellidos.toLowerCase().includes(searchTerm.toLowerCase())) ||
        mayorista.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mayorista.ciudad.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mayorista.pais.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mayorista.numero_documento.includes(searchTerm) ||
        mayorista.telefono.includes(searchTerm) ||
        (mayorista.descripcion && mayorista.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (mayorista.intereses && mayorista.intereses.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredMayoristas(filtered);
      setTotalItems(filtered.length);
      setTotalPages(Math.ceil(filtered.length / pageSize));
      setCurrentPage(1);

    } else {
      setFilteredMayoristas(mayoristas);
      // No sobrescribir totalItems y totalPages cuando no hay búsqueda
      // Estos valores ya vienen correctos de la API
    }
  }, [searchTerm, mayoristas, pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const handleViewMayorista = (id: string) => {
    setSelectedMayoristaId(id);
    setDetailOpen(true);
  };

  const handleEditMayorista = (id: string) => {
    setSelectedMayoristaId(id);
    setEditOpen(true);
  };

  const handleDeleteMayorista = async (id: string) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Estás seguro de que deseas eliminar este mayorista? Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await mayoristaService.deleteMayorista(id);
        await Swal.fire({
          title: '¡Eliminado!',
          text: 'El mayorista ha sido eliminado exitosamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#3B82F6'
        });
        loadMayoristas();
        loadStats();
        loadChartData();
      } catch (error) {
        console.error('Error deleting mayorista:', error);
        await Swal.fire({
          title: 'Error',
          text: 'Error al eliminar el mayorista. Por favor, inténtalo de nuevo.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#EF4444'
        });
      }
    }
  };

  const handleMayoristaCreated = () => {
    loadMayoristas();
    loadStats();
    loadChartData();
  };

  const handleMayoristaUpdated = () => {
    loadMayoristas();
    loadStats();
    loadChartData();
  };

  const handleExportMayoristas = async () => {
    try {
      const { mayoristas: allMayoristas } = await mayoristaService.getMayoristas(1, 1000);

      const exportData = allMayoristas.map(mayorista => ({
        'ID': mayorista.id,
        'Nombre': mayorista.nombre,
        'Apellidos': mayorista.apellidos || '',
        'Email': mayorista.email,
        'Teléfono': mayorista.telefono,
        'Dirección': mayorista.direccion,
        'Ciudad': mayorista.ciudad,
        'País': mayorista.pais,
        'Tipo Documento': mayorista.tipo_documento,
        'Número Documento': mayorista.numero_documento,
        'Activo': mayorista.activo ? 'Sí' : 'No',
        'Verificado': mayorista.verificado ? 'Sí' : 'No',
        'Recurrente': mayorista.recurente ? 'Sí' : 'No',
        'Intereses': mayorista.intereses || '',
        'Descripción': mayorista.descripcion || '',
        'Usuario Creador': mayorista.usuario_creador,
        'Fecha Creación': mayorista.fecha_creacion || '',
        'Fecha Actualización': mayorista.fecha_actualizacion || ''
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Mayoristas');

      // Ajustar ancho de columnas
      const colWidths = [
        { wch: 10 }, // ID
        { wch: 20 }, // Nombre
        { wch: 20 }, // Apellidos
        { wch: 30 }, // Email
        { wch: 15 }, // Teléfono
        { wch: 30 }, // Dirección
        { wch: 20 }, // Ciudad
        { wch: 15 }, // País
        { wch: 15 }, // Tipo Documento
        { wch: 20 }, // Número Documento
        { wch: 12 }, // Activo
        { wch: 12 }, // Verificado
        { wch: 12 }, // Recurrente
        { wch: 25 }, // Intereses
        { wch: 30 }, // Descripción
        { wch: 20 }, // Usuario Creador
        { wch: 20 }, // Fecha Creación
        { wch: 20 }  // Fecha Actualización
      ];
      worksheet['!cols'] = colWidths;

      const fileName = `mayoristas_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      await Swal.fire({
        title: '¡Éxito!',
        text: 'Archivo exportado exitosamente',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#3B82F6'
      });
    } catch (error) {
      console.error('Error exporting mayoristas:', error);
      await Swal.fire({
        title: 'Error',
        text: 'Error al exportar los mayoristas. Por favor, inténtalo de nuevo.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#EF4444'
      });
    }
  };

  const getCurrentPageMayoristas = () => {
    // Si hay término de búsqueda, usar paginación local
    if (searchTerm.trim()) {
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      return filteredMayoristas.slice(startIndex, endIndex);
    }
    // Si no hay búsqueda, los datos ya vienen paginados de la API
    return mayoristas;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <Store className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Mayoristas</h1>
          </div>
          <p className="text-gray-600 mt-2">Administra los mayoristas y sus relaciones comerciales</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleExportMayoristas}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            <span>Exportar Mayoristas</span>
          </Button>
          <Button
            onClick={() => setCreateOpen(true)}
            variant="primary"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Crear Mayorista</span>
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <MayoristaStats stats={stats} loading={statsLoading} />

      {/* Tabla */}
      <MayoristaTable
        mayoristas={getCurrentPageMayoristas()}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={totalItems}
        searchTerm={searchTerm}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onSearchChange={handleSearchChange}
        onViewMayorista={handleViewMayorista}
        onEditMayorista={handleEditMayorista}
        onDeleteMayorista={handleDeleteMayorista}
      />

      {/* Gráficos */}
      <MayoristaCharts data={chartData} loading={chartsLoading} />

      {/* Modales */}
      <MayoristaDetailModal
        isOpen={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setSelectedMayoristaId(null);
        }}
        mayoristaId={selectedMayoristaId}
      />

      <EditMayoristaModal
        isOpen={editOpen}
        onClose={() => {
          setEditOpen(false);
          setSelectedMayoristaId(null);
        }}
        mayoristaId={selectedMayoristaId}
        onMayoristaUpdated={handleMayoristaUpdated}
      />

      <CreateMayoristaModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onMayoristaCreated={handleMayoristaCreated}
      />
    </div>
  );
};

export default MayoristasSection;
