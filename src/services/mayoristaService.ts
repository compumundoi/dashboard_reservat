import {
  MayoristaData,
  CreateMayoristaData,
  UpdateMayoristaData,
  MayoristaStats,
  MayoristaChartData,
} from "../types/mayorista";

const API_BASE_URL = "http://localhost:8004/api/v1";

// Interfaces para las respuestas de la API oficial
interface ApiResponseList {
  mayoristas: MayoristaData[];
  total: number;
  page: number;
  size: number;
}

class MayoristaService {
  private getAuthHeaders() {
    const cookies = document.cookie.split(";");
    const tokenCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("token="),
    );
    const token = tokenCookie ? tokenCookie.split("=")[1] : null;

    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  }

  async getMayoristas(
    page: number = 0,
    size: number = 10,
  ): Promise<{
    mayoristas: MayoristaData[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/mayorista/listar?pagina=${page}&limite=${size}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data: ApiResponseList = await response.json();

      return {
        mayoristas: data.mayoristas,
        total: data.total,
        totalPages: Math.ceil(data.total / size),
        currentPage: page + 1,
      };
    } catch (error) {
      console.error("Error fetching mayoristas:", error);
      throw error;
    }
  }

  async getMayoristaById(id: string): Promise<MayoristaData> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/mayorista/consultar/${id}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data: MayoristaData = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching mayorista by ID:", error);
      throw error;
    }
  }

  async createMayorista(data: CreateMayoristaData): Promise<MayoristaData> {
    try {
      const response = await fetch(`${API_BASE_URL}/mayorista/crear`, {
        method: "POST",
        headers: {
          ...this.getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result: MayoristaData = await response.json();
      return result;
    } catch (error) {
      console.error("Error creating mayorista:", error);
      throw error;
    }
  }

  async updateMayorista(
    id: string,
    data: UpdateMayoristaData,
  ): Promise<MayoristaData> {
    try {
      const response = await fetch(`${API_BASE_URL}/mayorista/editar/${id}`, {
        method: "PUT",
        headers: {
          ...this.getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result: MayoristaData = await response.json();
      return result;
    } catch (error) {
      console.error("Error updating mayorista:", error);
      throw error;
    }
  }

  async deleteMayorista(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/mayorista/eliminar/${id}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error deleting mayorista:", error);
      throw error;
    }
  }

  async getMayoristaStats(): Promise<MayoristaStats> {
    try {
      // Obtener todos los mayoristas para calcular estadísticas
      const { mayoristas } = await this.getMayoristas(0, 1000);

      const total = mayoristas.length;
      const verificados = mayoristas.filter((m) => m.verificado).length;
      const recurrentes = mayoristas.filter((m) => m.recurente).length;
      const activos = mayoristas.filter((m) => m.activo).length;

      return {
        total,
        verificados,
        recurrentes,
        activos,
      };
    } catch (error) {
      console.error("Error fetching mayorista stats:", error);
      // Retornar estadísticas por defecto en caso de error
      return {
        total: 0,
        verificados: 0,
        recurrentes: 0,
        activos: 0,
      };
    }
  }

  async getMayoristaChartData(): Promise<MayoristaChartData> {
    try {
      // Obtener todos los mayoristas para generar gráficos
      const { mayoristas } = await this.getMayoristas(0, 1000);

      // Datos para gráfico de estados
      const activos = mayoristas.filter((m) => m.activo).length;
      const inactivos = mayoristas.filter((m) => !m.activo).length;

      const estados = [
        { estado: "Activos", count: activos },
        { estado: "Inactivos", count: inactivos },
      ];

      // Datos para gráfico de verificación
      const verificados = mayoristas.filter((m) => m.verificado).length;
      const noVerificados = mayoristas.filter((m) => !m.verificado).length;

      const verificacion = [
        { tipo: "Verificados", count: verificados },
        { tipo: "No Verificados", count: noVerificados },
      ];

      return {
        estados,
        verificacion,
      };
    } catch (error) {
      console.error("Error fetching mayorista chart data:", error);
      // Retornar datos por defecto en caso de error
      return {
        estados: [
          { estado: "Activos", count: 0 },
          { estado: "Inactivos", count: 0 },
        ],
        verificacion: [
          { tipo: "Verificados", count: 0 },
          { tipo: "No Verificados", count: 0 },
        ],
      };
    }
  }
}

export const mayoristaService = new MayoristaService();
