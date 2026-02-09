import {
  TransporteData,
  TransporteResponse,
  CrearTransporteRequest,
  TransporteUpdateData,
} from "../types/transporte";
import * as XLSX from "xlsx";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8015/api/v1";

// Función para obtener el token de autenticación
const getAuthToken = (): string | null => {
  const cookies = document.cookie.split(";");
  const tokenCookie = cookies.find((cookie) =>
    cookie.trim().startsWith("access_token="),
  );
  return tokenCookie ? tokenCookie.split("=")[1] : null;
};

// Función para hacer peticiones autenticadas
const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
};

export const transporteService = {
  // Listar transportes con paginación
  async getTransportes(
    page: number = 1,
    limit: number = 10,
  ): Promise<TransporteResponse> {
    try {
      const response = await authenticatedFetch(
        `${API_BASE_URL}/api/v1/transportes/listar/?pagina=${page}&limite=${limit}`,
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching transportes:", error);
      throw error;
    }
  },

  // Obtener transporte por ID
  async getTransporteById(id: string): Promise<TransporteData> {
    try {
      const response = await authenticatedFetch(
        `${API_BASE_URL}/api/v1/transportes/consultar/${id}`,
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching transporte by ID:", error);
      throw error;
    }
  },

  // Crear nuevo transporte
  async createTransporte(
    transporteData: CrearTransporteRequest,
  ): Promise<void> {
    try {
      await authenticatedFetch(`${API_BASE_URL}/api/v1/transportes/crear/`, {
        method: "POST",
        body: JSON.stringify(transporteData),
      });
    } catch (error) {
      console.error("Error creating transporte:", error);
      throw error;
    }
  },

  // Actualizar transporte
  async updateTransporte(
    id: string,
    transporteData: TransporteUpdateData,
  ): Promise<void> {
    try {
      await authenticatedFetch(
        `${API_BASE_URL}/api/v1/transportes/editar/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(transporteData),
        },
      );
    } catch (error) {
      console.error("Error updating transporte:", error);
      throw error;
    }
  },

  // Eliminar transporte
  async deleteTransporte(id: string): Promise<void> {
    try {
      await authenticatedFetch(
        `${API_BASE_URL}/api/v1/transportes/eliminar/${id}`,
        {
          method: "DELETE",
        },
      );
    } catch (error) {
      console.error("Error deleting transporte:", error);
      throw error;
    }
  },

  // Buscar transportes (filtrado local)
  searchTransportes(
    transportes: TransporteData[],
    searchTerm: string,
  ): TransporteData[] {
    if (!searchTerm.trim()) return transportes;

    const term = searchTerm.toLowerCase();
    return transportes.filter(
      (item) =>
        item.proveedor.nombre.toLowerCase().includes(term) ||
        item.proveedor.email.toLowerCase().includes(term) ||
        item.proveedor.ciudad.toLowerCase().includes(term) ||
        item.transporte.tipo_vehiculo.toLowerCase().includes(term) ||
        item.transporte.modelo.toLowerCase().includes(term) ||
        item.transporte.placa.toLowerCase().includes(term),
    );
  },

  // Exportar transportes a Excel
  async exportToExcel(): Promise<void> {
    try {
      // Obtener todos los transportes (límite alto para exportar todo)
      const response = await this.getTransportes(1, 1000);
      const transportes = response.data;

      // Preparar datos para Excel
      const excelData = transportes.map((item) => ({
        // Datos del Proveedor
        Proveedor: item.proveedor.nombre,
        Email: item.proveedor.email,
        Teléfono: item.proveedor.telefono,
        Ciudad: item.proveedor.ciudad,
        País: item.proveedor.pais,
        Dirección: item.proveedor.direccion,
        "Sitio Web": item.proveedor.sitio_web,
        Rating: item.proveedor.rating_promedio,
        Verificado: item.proveedor.verificado ? "Sí" : "No",
        "Tipo Documento": item.proveedor.tipo_documento,
        "Número Documento": item.proveedor.numero_documento,
        Activo: item.proveedor.activo ? "Sí" : "No",

        // Datos del Transporte
        "Tipo Vehículo": item.transporte.tipo_vehiculo,
        Modelo: item.transporte.modelo,
        Año: item.transporte.anio,
        Placa: item.transporte.placa,
        Capacidad: item.transporte.capacidad,
        "Aire Acondicionado": item.transporte.aire_acondicionado ? "Sí" : "No",
        WiFi: item.transporte.wifi ? "Sí" : "No",
        Disponible: item.transporte.disponible ? "Sí" : "No",
        Combustible: item.transporte.combustible,
        "Seguro Vigente": item.transporte.seguro_vigente ? "Sí" : "No",
        "Fecha Mantenimiento": new Date(
          item.transporte.fecha_mantenimiento,
        ).toLocaleDateString("es-ES"),

        // Información adicional
        Descripción: item.proveedor.descripcion,
        Ubicación: item.proveedor.ubicacion,
        "Redes Sociales": item.proveedor.redes_sociales,
        "Fecha Registro": new Date(
          item.proveedor.fecha_registro,
        ).toLocaleDateString("es-ES"),
      }));

      // Crear libro de Excel
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Transportes");

      // Descargar archivo
      XLSX.writeFile(
        workbook,
        `transportes_${new Date().toISOString().split("T")[0]}.xlsx`,
      );
    } catch (error) {
      console.error("Error exporting transportes to Excel:", error);
      throw error;
    }
  },
};
