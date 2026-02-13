import React, { useState, useEffect } from "react";
import { Package, Download, Plus } from "lucide-react";
import Swal from "sweetalert2";
import ServicioTable from "./ServicioTable";
import ServicioStats from "./ServicioStats";
import ServicioCharts from "./ServicioCharts";
import ServicioDetailModal from "./ServicioDetailModal";
import EditServicioModal from "./EditServicioModal";
import CreateServicioModal from "./CreateServicioModal";
import { Button } from "../ui/Button";
import {
  listarServicios,
  procesarDatosServicios,
  calcularEstadisticas,
  generarDatosGraficos,
  exportarServiciosExcel,
  eliminarServicio,
  crearServicio,
  actualizarServicio,
} from "../../services/servicioService";
import {
  ServicioData,
  ServicioStatsData,
  ServicioChartData,
  DatosServicio,
  ActualizarServicio,
} from "../../types/servicio";

const ServiciosSection: React.FC = () => {
  // Estados principales
  const [servicios, setServicios] = useState<ServicioData[]>([]);
  const [filteredServicios, setFilteredServicios] = useState<ServicioData[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Estados de estadísticas y gráficos
  const [stats, setStats] = useState<ServicioStatsData>({
    totalServicios: 0,
    serviciosActivos: 0,
    serviciosPorTipo: 0,
    proveedoresConServicios: 0,
  });
  const [chartData, setChartData] = useState<ServicioChartData>({
    tipoServicioData: [],
    ciudadData: [],
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Estados de modales
  const [selectedServicio, setSelectedServicio] = useState<ServicioData | null>(
    null,
  );
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Cargar servicios
  const loadServicios = async (page: number = 0, size: number = 5) => {
    try {
      setLoading(true);
      const response = await listarServicios(page, size);
      const processedData = procesarDatosServicios(response);

      setServicios(processedData.servicios);
      setFilteredServicios(processedData.servicios);
      setTotalItems(processedData.totalItems);
      setTotalPages(processedData.totalPages);
      setCurrentPage(processedData.currentPage);
    } catch (error) {
      console.error("Error al cargar servicios:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los servicios",
      });
    } finally {
      setLoading(false);
    }
  };

  // Cargar estadísticas y gráficos
  const loadStatsAndCharts = async () => {
    try {
      setStatsLoading(true);
      // Obtener una muestra más grande para estadísticas
      const response = await listarServicios(0, 300);
      const processedData = procesarDatosServicios(response);

      const calculatedStats = calcularEstadisticas(processedData.servicios);
      const generatedChartData = generarDatosGraficos(processedData.servicios);

      setStats(calculatedStats);
      setChartData(generatedChartData);
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  // Efecto para carga inicial
  useEffect(() => {
    loadServicios(currentPage, pageSize);
    loadStatsAndCharts();
  }, [currentPage, pageSize]);

  // Efecto para cambios de página/tamaño
  useEffect(() => {
    if (!searchTerm) {
      loadServicios(currentPage, pageSize);
    }
  }, [currentPage, pageSize, searchTerm]);

  // Efecto para filtrado local por búsqueda
  useEffect(() => {
    if (searchTerm) {
      const filtered = servicios.filter(
        (servicio) =>
          servicio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          servicio.descripcion
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          servicio.tipo_servicio
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          servicio.ciudad.toLowerCase().includes(searchTerm.toLowerCase()) ||
          servicio.departamento
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          servicio.proveedorNombre
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
      setFilteredServicios(filtered);
    } else {
      setFilteredServicios(servicios);
    }
  }, [searchTerm, servicios]);

  // Handlers de paginación
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(0);
  };

  // Handlers de modales
  const handleView = (servicio: ServicioData) => {
    setSelectedServicio(servicio);
    setShowDetailModal(true);
  };

  const handleEdit = (servicio: ServicioData) => {
    setSelectedServicio(servicio);
    setShowEditModal(true);
  };

  const handleCreate = () => {
    setShowCreateModal(true);
  };

  // Handler para eliminar
  const handleDelete = async (id: string) => {
    const servicio = servicios.find(s => s.id_servicio === id);
    const servicioName = servicio?.nombre || 'este servicio';

    const result = await Swal.fire({
      title: "¿Estás seguro?",
      html: `
        <div class="text-center">
          <div class="mb-4">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m-4 0h14" />
              </svg>
            </div>
          </div>
          <p class="text-gray-600 mb-2">Vas a eliminar el servicio:</p>
          <p class="font-semibold text-gray-900 text-lg">${servicioName}</p>
          <p class="text-sm text-gray-500 mt-2">Esta acción no se puede deshacer</p>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      customClass: {
        popup: 'rounded-xl shadow-2xl',
        title: 'text-xl font-bold text-gray-900',
        confirmButton: 'px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
        cancelButton: 'px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
      },
      buttonsStyling: false,
    });

    if (result.isConfirmed) {
      try {
        await eliminarServicio(id);
        await Swal.fire({
          icon: "success",
          title: "¡Eliminado!",
          text: "El servicio ha sido eliminado correctamente",
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            popup: 'rounded-xl shadow-2xl',
            title: 'text-xl font-bold text-gray-900',
          }
        });
        // Recargar datos
        loadServicios(currentPage, pageSize);
        loadStatsAndCharts();
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo eliminar el servicio",
          customClass: {
            popup: 'rounded-xl shadow-2xl',
            title: 'text-xl font-bold text-gray-900',
          }
        });
      }
    }
  };

  // Handler para crear servicio
  const handleCreateSave = async (data: DatosServicio) => {
    try {
      await crearServicio(data);
      await Swal.fire({
        icon: "success",
        title: "¡Creado!",
        text: "El servicio ha sido creado correctamente",
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: 'rounded-xl shadow-2xl',
          title: 'text-xl font-bold text-gray-900',
        }
      });
      setShowCreateModal(false);
      // Recargar datos
      loadServicios(currentPage, pageSize);
      loadStatsAndCharts();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al crear el servicio",
        customClass: {
          popup: 'rounded-xl shadow-2xl',
          title: 'text-xl font-bold text-gray-900',
        }
      });
    }
  };

  // Handler para editar servicio
  const handleEditSave = async (data: ActualizarServicio) => {
    try {
      await actualizarServicio(data.id_servicio, data);
      await Swal.fire({
        icon: "success",
        title: "¡Actualizado!",
        text: "El servicio ha sido actualizado correctamente",
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: 'rounded-xl shadow-2xl',
          title: 'text-xl font-bold text-gray-900',
        }
      });
      setShowEditModal(false);
      setSelectedServicio(null);
      // Recargar datos
      loadServicios(currentPage, pageSize);
      loadStatsAndCharts();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al actualizar el servicio",
        customClass: {
          popup: 'rounded-xl shadow-2xl',
          title: 'text-xl font-bold text-gray-900',
        }
      });
    }
  };

  // Handler para exportar
  const handleExport = async () => {
    try {
      await exportarServiciosExcel();
      Swal.fire({
        icon: "success",
        title: "¡Exportado!",
        text: "Los servicios han sido exportados correctamente",
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: 'rounded-xl shadow-2xl',
          title: 'text-xl font-bold text-gray-900',
        }
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo exportar los servicios",
        customClass: {
          popup: 'rounded-xl shadow-2xl',
          title: 'text-xl font-bold text-gray-900',
        }
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <Package className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Servicios</h1>
          </div>
          <p className="text-gray-600 mt-2">Administra los servicios, tours y experiencias del sistema</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleExport}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            <span>Exportar Servicios</span>
          </Button>
          <Button
            onClick={handleCreate}
            variant="primary"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Crear Servicio</span>
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <ServicioStats stats={stats} loading={statsLoading} />

      {/* Tabla */}
      <ServicioTable
        servicios={filteredServicios}
        loading={loading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Gráficos */}
      <ServicioCharts chartData={chartData} loading={statsLoading} />

      {/* Modales */}
      <ServicioDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        servicio={selectedServicio}
      />

      <EditServicioModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedServicio(null);
        }}
        servicio={selectedServicio}
        onSave={handleEditSave}
      />

      <CreateServicioModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateSave}
      />
    </div>
  );
};

export default ServiciosSection;
