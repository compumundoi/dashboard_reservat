import React, { useState, useEffect } from "react";
import { Package, Download, Plus } from "lucide-react";
import Swal from "sweetalert2";
import ServicioTable from "./ServicioTable";
import ServicioStats from "./ServicioStats";
import ServicioCharts from "./ServicioCharts";
import ServicioDetailModal from "./ServicioDetailModal";
import EditServicioModal from "./EditServicioModal";
import CreateServicioModal from "./CreateServicioModal";
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
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await eliminarServicio(id);
        await Swal.fire({
          icon: "success",
          title: "Eliminado",
          text: "El servicio ha sido eliminado correctamente",
          timer: 2000,
          showConfirmButton: false,
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
        });
      }
    }
  };

  // Handler para crear servicio
  const handleCreateSave = async (data: DatosServicio) => {
    await crearServicio(data);
    await Swal.fire({
      icon: "success",
      title: "Creado",
      text: "El servicio ha sido creado correctamente",
      timer: 2000,
      showConfirmButton: false,
    });
    setShowCreateModal(false);
    // Recargar datos
    loadServicios(currentPage, pageSize);
    loadStatsAndCharts();
  };

  // Handler para editar servicio
  const handleEditSave = async (data: ActualizarServicio) => {
    await actualizarServicio(data.id_servicio, data);
    await Swal.fire({
      icon: "success",
      title: "Actualizado",
      text: "El servicio ha sido actualizado correctamente",
      timer: 2000,
      showConfirmButton: false,
    });
    setShowEditModal(false);
    setSelectedServicio(null);
    // Recargar datos
    loadServicios(currentPage, pageSize);
    loadStatsAndCharts();
  };

  // Handler para exportar
  const handleExport = async () => {
    try {
      await exportarServiciosExcel();
      Swal.fire({
        icon: "success",
        title: "Exportado",
        text: "Los servicios han sido exportados correctamente",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo exportar los servicios",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Package className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Servicios</h1>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Exportar Servicios</span>
          </button>
          <button
            onClick={handleCreate}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Crear Servicio</span>
          </button>
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
