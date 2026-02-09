import {
  DatosViaje,
  ActualizarViaje,
  RespuestaViaje,
  ViajeData,
  ResponseListViajes,
  ResponseMessage,
  ViajeStatsData,
  ViajeChartData,
  ESTADOS_VIAJE,
} from "../types/viaje";
import * as XLSX from "xlsx";

const API_BASE_URL = "http://localhost:8011/api/v1";

// Función para obtener el token de autenticación
const getAuthToken = (): string | null => {
  const cookies = document.cookie.split(";");
  const tokenCookie = cookies.find((cookie) =>
    cookie.trim().startsWith("access_token="),
  );
  return tokenCookie ? tokenCookie.split("=")[1] : null;
};

// Headers con autenticación
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const viajeService = {
  // Listar viajes con paginación
  async getViajes(
    pagina: number = 0,
    limite: number = 10,
  ): Promise<ResponseListViajes> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/viajes/listar/?pagina=${pagina}&limite=${limite}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al obtener viajes:", error);
      throw error;
    }
  },

  // Obtener viaje por ID
  async getViajeById(id: string): Promise<RespuestaViaje> {
    try {
      const response = await fetch(`${API_BASE_URL}viajes/consultar/${id}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al obtener viaje:", error);
      throw error;
    }
  },

  // Crear nuevo viaje
  async createViaje(viajeData: DatosViaje): Promise<ResponseMessage> {
    try {
      const response = await fetch(`${API_BASE_URL}/viajes/crear/`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(viajeData),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al crear viaje:", error);
      throw error;
    }
  },

  // Actualizar viaje
  async updateViaje(
    id: string,
    viajeData: ActualizarViaje,
  ): Promise<RespuestaViaje> {
    try {
      const response = await fetch(`${API_BASE_URL}/viajes/editar/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(viajeData),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al actualizar viaje:", error);
      throw error;
    }
  },

  // Eliminar viaje
  async deleteViaje(id: string): Promise<ResponseMessage> {
    try {
      const response = await fetch(`${API_BASE_URL}/viajes/eliminar/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al eliminar viaje:", error);
      throw error;
    }
  },

  // Búsqueda local de viajes
  searchViajes(viajes: ViajeData[], searchTerm: string): ViajeData[] {
    if (!searchTerm.trim()) return viajes;

    const term = searchTerm.toLowerCase();
    return viajes.filter(
      (viaje) =>
        viaje.guia_asignado?.toLowerCase().includes(term) ||
        viaje.estado?.toLowerCase().includes(term) ||
        viaje.ruta_nombre?.toLowerCase().includes(term) ||
        viaje.transportador_nombre?.toLowerCase().includes(term) ||
        viaje.precio?.toString().includes(term),
    );
  },

  // Calcular estadísticas
  calculateStats(viajes: ViajeData[]): ViajeStatsData {
    const totalViajes = viajes.length;
    const viajesActivos = viajes.filter((v) => v.activo).length;
    const viajesEnCurso = viajes.filter(
      (v) => v.estado === ESTADOS_VIAJE.EN_CURSO,
    ).length;

    const capacidadPromedioDisponible =
      viajes.length > 0
        ? Math.round(
            viajes.reduce((sum, v) => sum + (v.capacidad_disponible || 0), 0) /
              viajes.length,
          )
        : 0;

    return {
      totalViajes,
      viajesActivos,
      viajesEnCurso,
      capacidadPromedioDisponible,
    };
  },

  // Generar datos para gráficos
  generateChartData(viajes: ViajeData[]): ViajeChartData {
    // Distribución por estado
    const estadoCounts = viajes.reduce(
      (acc, viaje) => {
        const estado = viaje.estado || "Sin estado";
        acc[estado] = (acc[estado] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const estadoDistribution = Object.entries(estadoCounts).map(
      ([estado, count]) => ({
        estado,
        count,
        percentage: Math.round((count / viajes.length) * 100),
      }),
    );

    // Viajes por mes (basado en fecha_inicio)
    const mesCounts = viajes.reduce(
      (acc, viaje) => {
        if (viaje.fecha_inicio) {
          const fecha = new Date(viaje.fecha_inicio);
          const mes = fecha.toLocaleDateString("es-ES", {
            month: "long",
            year: "numeric",
          });
          acc[mes] = (acc[mes] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>,
    );

    const viajePorMes = Object.entries(mesCounts)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .slice(-6) // Últimos 6 meses
      .map(([mes, count]) => ({ mes, count }));

    return {
      estadoDistribution,
      viajePorMes,
    };
  },

  // Exportar a Excel
  async exportToExcel(viajes: ViajeData[]): Promise<void> {
    try {
      const exportData = viajes.map((viaje) => ({
        ID: viaje.id,
        "Ruta ID": viaje.ruta_id || "",
        Ruta: viaje.ruta_nombre || "No especificada",
        "Fecha Inicio": viaje.fecha_inicio
          ? new Date(viaje.fecha_inicio).toLocaleDateString("es-ES")
          : "",
        "Fecha Fin": viaje.fecha_fin
          ? new Date(viaje.fecha_fin).toLocaleDateString("es-ES")
          : "",
        "Duración (días)": viaje.duracion_dias || "",
        "Capacidad Total": viaje.capacidad_total || 0,
        "Capacidad Disponible": viaje.capacidad_disponible || 0,
        "Ocupación (%)": viaje.ocupacion_porcentaje || 0,
        Precio: viaje.precio || 0,
        "Guía Asignado": viaje.guia_asignado || "",
        Estado: viaje.estado || "",
        "Transportador ID": viaje.id_transportador || "",
        Transportador: viaje.transportador_nombre || "No especificado",
        Activo: viaje.activo ? "Sí" : "No",
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Viajes");

      // Configurar anchos de columna
      const colWidths = [
        { wch: 10 }, // ID
        { wch: 15 }, // Ruta ID
        { wch: 25 }, // Ruta
        { wch: 15 }, // Fecha Inicio
        { wch: 15 }, // Fecha Fin
        { wch: 15 }, // Duración
        { wch: 15 }, // Capacidad Total
        { wch: 18 }, // Capacidad Disponible
        { wch: 15 }, // Ocupación
        { wch: 12 }, // Precio
        { wch: 20 }, // Guía
        { wch: 15 }, // Estado
        { wch: 18 }, // Transportador ID
        { wch: 25 }, // Transportador
        { wch: 10 }, // Activo
      ];
      worksheet["!cols"] = colWidths;

      const fileName = `viajes_${new Date().toISOString().split("T")[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);
    } catch (error) {
      console.error("Error al exportar viajes:", error);
      throw error;
    }
  },

  // Procesar datos de viaje para la UI
  processViajeData(viaje: RespuestaViaje): ViajeData {
    const viajeData: ViajeData = { ...viaje };

    // Calcular duración en días
    if (viaje.fecha_inicio && viaje.fecha_fin) {
      const inicio = new Date(viaje.fecha_inicio);
      const fin = new Date(viaje.fecha_fin);
      viajeData.duracion_dias = Math.ceil(
        (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24),
      );
    }

    // Calcular porcentaje de ocupación
    if (viaje.capacidad_total && viaje.capacidad_disponible !== undefined) {
      const ocupados = viaje.capacidad_total - viaje.capacidad_disponible;
      viajeData.ocupacion_porcentaje = Math.round(
        (ocupados / viaje.capacidad_total) * 100,
      );
    }

    return viajeData;
  },
};
