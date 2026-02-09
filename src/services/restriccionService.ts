// Servicio para manejar las peticiones a la API de Restricciones (Fechas Bloqueadas)
import {
  DatosFechaBloqueada,
  RespuestaFechaBloqueada,
  ActualizarFechaBloqueada,
  ResponseListRestricciones,
  ResponseMessage,
  RestriccionData,
  RestriccionStatsData,
  RestriccionChartData,
} from "../types/restriccion";
import * as XLSX from "xlsx";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8007/api/v1";

// Función para obtener el token de autenticación
const getAuthToken = (): string | null => {
  const cookies = document.cookie.split(";");
  const tokenCookie = cookies.find((cookie) =>
    cookie.trim().startsWith("token="),
  );
  return tokenCookie ? tokenCookie.split("=")[1] : null;
};

// Headers con autenticación
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

class RestriccionService {
  // Obtener restricciones con paginación
  async getRestricciones(
    pagina: number = 0,
    limite: number = 10,
  ): Promise<ResponseListRestricciones> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/fechas/listar/?pagina=${pagina}&limite=${limite}`,
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
      console.error("Error al obtener restricciones:", error);
      throw error;
    }
  }

  // Obtener restricción por ID
  async getRestriccionById(id: string): Promise<RespuestaFechaBloqueada> {
    try {
      const response = await fetch(`${API_BASE_URL}/fechas/consultar/${id}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al obtener restricción:", error);
      throw error;
    }
  }

  // Crear nueva restricción
  async createRestriccion(
    restriccionData: DatosFechaBloqueada,
  ): Promise<ResponseMessage> {
    try {
      const response = await fetch(`${API_BASE_URL}/fechas/crear/`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(restriccionData),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al crear restricción:", error);
      throw error;
    }
  }

  // Actualizar restricción
  async updateRestriccion(
    id: string,
    restriccionData: ActualizarFechaBloqueada,
  ): Promise<RespuestaFechaBloqueada> {
    try {
      const response = await fetch(`${API_BASE_URL}/fechas/editar/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(restriccionData),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al actualizar restricción:", error);
      throw error;
    }
  }

  // Eliminar restricción
  async deleteRestriccion(id: string): Promise<ResponseMessage> {
    try {
      const response = await fetch(`${API_BASE_URL}/fechas/eliminar/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al eliminar restricción:", error);
      throw error;
    }
  }

  // Procesar datos para la UI
  processRestriccionesForUI(
    restricciones: RespuestaFechaBloqueada[],
  ): RestriccionData[] {
    return restricciones.map((restriccion) => {
      const fecha = new Date(restriccion.fecha);
      const ahora = new Date();
      const diasHastaFecha = Math.ceil(
        (fecha.getTime() - ahora.getTime()) / (1000 * 60 * 60 * 24),
      );

      return {
        ...restriccion,
        fecha_formateada: fecha.toLocaleDateString("es-ES", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        servicio_nombre: `Servicio ${restriccion.servicio_id.slice(-8)}`, // Mostrar últimos 8 caracteres del UUID
        dias_hasta_fecha: diasHastaFecha,
        estado_badge: restriccion.bloqueo_activo ? "activo" : "inactivo",
      };
    });
  }

  // Calcular estadísticas
  async calculateStats(): Promise<RestriccionStatsData> {
    try {
      // Obtener todas las restricciones para calcular estadísticas
      const response = await this.getRestricciones(0, 1000);
      const restricciones = response.fechas_bloqueadas;

      const totalRestricciones = restricciones.length;
      const restriccionesActivas = restricciones.filter(
        (r) => r.bloqueo_activo,
      ).length;

      // Restricciones del mes actual
      const fechaActual = new Date();
      const inicioMes = new Date(
        fechaActual.getFullYear(),
        fechaActual.getMonth(),
        1,
      );
      const finMes = new Date(
        fechaActual.getFullYear(),
        fechaActual.getMonth() + 1,
        0,
      );

      const restriccionesMesActual = restricciones.filter((r) => {
        const fechaRestriccion = new Date(r.fecha);
        return fechaRestriccion >= inicioMes && fechaRestriccion <= finMes;
      }).length;

      // Servicios únicos con restricciones
      const serviciosUnicos = new Set(restricciones.map((r) => r.servicio_id));
      const serviciosConRestricciones = serviciosUnicos.size;

      return {
        totalRestricciones,
        restriccionesActivas,
        restriccionesMesActual,
        serviciosConRestricciones,
      };
    } catch (error) {
      console.error("Error al calcular estadísticas:", error);
      return {
        totalRestricciones: 0,
        restriccionesActivas: 0,
        restriccionesMesActual: 0,
        serviciosConRestricciones: 0,
      };
    }
  }

  // Generar datos para gráficos
  async generateChartData(): Promise<RestriccionChartData> {
    try {
      const response = await this.getRestricciones(0, 1000);
      const restricciones = response.fechas_bloqueadas;

      // Distribución por estado
      const activas = restricciones.filter((r) => r.bloqueo_activo).length;
      const inactivas = restricciones.length - activas;

      // Bloqueos por mes (últimos 6 meses)
      const fechaActual = new Date();
      const bloqueosPorMes = [];

      for (let i = 5; i >= 0; i--) {
        const fecha = new Date(
          fechaActual.getFullYear(),
          fechaActual.getMonth() - i,
          1,
        );
        const nombreMes = fecha.toLocaleDateString("es-ES", { month: "short" });
        const inicioMes = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
        const finMes = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);

        const bloqueosMes = restricciones.filter((r) => {
          const fechaRestriccion = new Date(r.fecha);
          return fechaRestriccion >= inicioMes && fechaRestriccion <= finMes;
        }).length;

        bloqueosPorMes.push({
          name: nombreMes,
          value: bloqueosMes,
          color: "from-red-500 to-red-600",
        });
      }

      return {
        estados: [
          { name: "Activas", value: activas, color: "from-red-500 to-red-600" },
          {
            name: "Inactivas",
            value: inactivas,
            color: "from-gray-500 to-gray-600",
          },
        ],
        bloqueosPorMes,
      };
    } catch (error) {
      console.error("Error al generar datos de gráficos:", error);
      return {
        estados: [],
        bloqueosPorMes: [],
      };
    }
  }

  // Exportar a Excel
  async exportToExcel(): Promise<void> {
    try {
      const response = await this.getRestricciones(0, 1000);
      const restricciones = this.processRestriccionesForUI(
        response.fechas_bloqueadas,
      );

      const exportData = restricciones.map((restriccion) => ({
        ID: restriccion.id,
        "Servicio ID": restriccion.servicio_id,
        Servicio: restriccion.servicio_nombre || "No especificado",
        Fecha: restriccion.fecha_formateada,
        Motivo: restriccion.motivo,
        "Bloqueado Por": restriccion.bloqueado_por,
        Estado: restriccion.bloqueo_activo ? "Activo" : "Inactivo",
        "Días Hasta Fecha": restriccion.dias_hasta_fecha || "N/A",
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Restricciones");

      // Configurar anchos de columna
      const colWidths = [
        { wch: 10 }, // ID
        { wch: 15 }, // Servicio ID
        { wch: 20 }, // Servicio
        { wch: 25 }, // Fecha
        { wch: 30 }, // Motivo
        { wch: 20 }, // Bloqueado Por
        { wch: 12 }, // Estado
        { wch: 18 }, // Días Hasta Fecha
      ];
      worksheet["!cols"] = colWidths;

      const fileName = `restricciones_${new Date().toISOString().split("T")[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);
    } catch (error) {
      console.error("Error al exportar restricciones:", error);
      throw error;
    }
  }
}

export const restriccionService = new RestriccionService();
