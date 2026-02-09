import {
  DatosRuta,
  RutaData,
  ActualizarRuta,
  RutasResponse,
  DatosOrigenDestino,
} from "../types/ruta";

const API_BASE_URL = "http://localhost:8010/api/v1";

class RutaService {
  private getAuthHeaders() {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_token="))
      ?.split("=")[1];

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  async getRutas(page: number = 0, size: number = 10): Promise<RutasResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/rutas/listar/?pagina=${page}&limite=${size}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        rutas: data.rutas || [],
        total: data.total || 0,
        page: data.page || 0,
        size: data.size || size,
      };
    } catch (error) {
      console.error("Error fetching rutas:", error);
      throw error;
    }
  }

  async getRutaById(id: string): Promise<RutaData> {
    try {
      const response = await fetch(`${API_BASE_URL}/rutas/consultar/${id}`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching ruta by ID:", error);
      throw error;
    }
  }

  async createRuta(rutaData: DatosRuta): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/rutas/crear/`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(rutaData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Error ${response.status}: ${response.statusText}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating ruta:", error);
      throw error;
    }
  }

  async updateRuta(id: string, rutaData: ActualizarRuta): Promise<RutaData> {
    try {
      const response = await fetch(`${API_BASE_URL}/rutas/editar/${id}`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(rutaData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Error ${response.status}: ${response.statusText}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating ruta:", error);
      throw error;
    }
  }

  async deleteRuta(id: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/rutas/eliminar/${id}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Error ${response.status}: ${response.statusText}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error deleting ruta:", error);
      throw error;
    }
  }

  async getRutasByOrigenDestino(
    origen: string,
    destino: string,
    page: number = 0,
    size: number = 10,
  ): Promise<RutasResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/rutas/origen-destino/?pagina=${page}&limite=${size}`,
        {
          method: "POST",
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ origen, destino }),
        },
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        rutas: data.rutas || [],
        total: data.total || 0,
        page: data.page || 0,
        size: data.size || size,
      };
    } catch (error) {
      console.error("Error fetching rutas by origen-destino:", error);
      throw error;
    }
  }

  // Método para exportar rutas a Excel
  async exportRutasToExcel(): Promise<void> {
    try {
      // Obtener todas las rutas (sin paginación)
      const response = await this.getRutas(0, 1000);

      if (!response.rutas || response.rutas.length === 0) {
        throw new Error("No hay rutas para exportar");
      }

      // Importar la librería xlsx dinámicamente
      const XLSX = await import("xlsx");

      // Mapear los datos para el Excel
      const excelData = response.rutas.map((ruta) => ({
        ID: ruta.id,
        Nombre: ruta.nombre,
        Descripción: ruta.descripcion,
        Origen: ruta.origen,
        Destino: ruta.destino,
        "Duración Estimada (min)": ruta.duracion_estimada,
        Precio: ruta.precio,
        "Puntos de Interés": ruta.puntos_interes,
        Activo: ruta.activo ? "Sí" : "No",
        Recomendada: ruta.recomendada ? "Sí" : "No",
      }));

      // Crear el workbook y worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // Configurar anchos de columna
      const columnWidths = [
        { wch: 10 }, // ID
        { wch: 25 }, // Nombre
        { wch: 40 }, // Descripción
        { wch: 20 }, // Origen
        { wch: 20 }, // Destino
        { wch: 20 }, // Duración
        { wch: 15 }, // Precio
        { wch: 40 }, // Puntos de Interés
        { wch: 10 }, // Activo
        { wch: 15 }, // Recomendada
      ];
      worksheet["!cols"] = columnWidths;

      // Agregar worksheet al workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Rutas");

      // Generar y descargar el archivo
      XLSX.writeFile(
        workbook,
        `rutas_${new Date().toISOString().split("T")[0]}.xlsx`,
      );
    } catch (error) {
      console.error("Error exporting rutas to Excel:", error);
      throw error;
    }
  }
}

export const rutaService = new RutaService();
