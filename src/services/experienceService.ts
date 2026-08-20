/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ExperienciaCompleta,
  ExperienciaApiResponse,
} from "../types/experience";
import { getCookie } from "../utils/auth";

// Usar el proxy configurado en Vite para evitar problemas de CORS
// Usar ruta completa para conectar con el microservicio en Docker
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8014/api/v1";

// Devuelve el fragmento `&busqueda=...` ya codificado, o vacío si no hay
// término. La búsqueda la resuelve el backend para que alcance todos los
// registros y no sólo la página cargada.
const paramBusqueda = (busqueda: string): string =>
  busqueda.trim() ? `&busqueda=${encodeURIComponent(busqueda.trim())}` : "";


class ExperienceService {
  async createExperience(payload: any) {
    try {
      console.log("🚀 Creando experiencia...", payload);
      const response = await fetch(`${API_BASE_URL}/experiencias/crear/`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      console.log(
        "🚀 Respuesta createExperience:",
        response.status,
        response.statusText,
      );
      if (!response.ok) {
        let message = `Error ${response.status}: ${response.statusText}`;
        try {
          const err = await response.json();
          message = err.detail || err.message || message;
        } catch {
          /* ignore */
        }
        throw new Error(message);
      }
      const data = await response.json();
      console.log("🚀 Experiencia creada con éxito:", data);
      return data;
    } catch (error) {
      console.error("❌ Error creando experiencia:", error);
      throw error;
    }
  }

  private getAuthHeaders() {
    const token = getCookie("auth_token");
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  // Función para unificar los datos de proveedor y experiencia
  private unifyExperienceData(
    apiData: ExperienciaApiResponse["data"],
  ): ExperienciaCompleta[] {
    return apiData.map((item) => ({
      // Datos del proveedor
      id_proveedor: item.proveedor.id_proveedor,
      proveedor_nombre: item.proveedor.nombre,
      proveedor_email: item.proveedor.email,
      proveedor_telefono: item.proveedor.telefono,
      proveedor_ciudad: item.proveedor.ciudad,
      // Ids del catálogo de ubicaciones: sin ellos el modal de edición no
      // puede preseleccionar departamento y municipio.
      proveedor_municipio_id: item.proveedor.municipio_id ?? null,
      proveedor_departamento_id: item.proveedor.departamento_id ?? null,
      proveedor_pais_id: item.proveedor.pais_id ?? null,
      proveedor_departamento: item.proveedor.departamento ?? '',
      proveedor_pais: item.proveedor.pais,
      proveedor_rating: item.proveedor.rating_promedio,
      proveedor_verificado: item.proveedor.verificado,
      proveedor_activo: item.proveedor.activo,
      proveedor_direccion: item.proveedor.direccion,
      proveedor_descripcion: item.proveedor.descripcion,
      proveedor_tipo_documento: item.proveedor.tipo_documento,
      proveedor_numero_documento: item.proveedor.numero_documento,
      proveedor_sitio_web: item.proveedor.sitio_web,
      fecha_registro: item.proveedor.fecha_registro,

      // Datos de la experiencia
      id_experiencia: item.experiencia.id_experiencia,
      duracion: item.experiencia.duracion,
      dificultad: item.experiencia.dificultad,
      idioma: item.experiencia.idioma,
      incluye_transporte: item.experiencia.incluye_transporte,
      grupo_maximo: item.experiencia.grupo_maximo,
      guia_incluido: item.experiencia.guia_incluido,
      equipamiento_requerido: item.experiencia.equipamiento_requerido,
      punto_de_encuentro: item.experiencia.punto_de_encuentro,
      numero_rnt: item.experiencia.numero_rnt,
    }));
  }

  async getExperiences(page: number, size: number, busqueda: string = "") {
    try {
      console.log("📊 === SERVICIO: Obteniendo experiencias ===");
      console.log("📊 Parámetros:", { page, size });
      console.log(
        "📊 URL:",
        `${API_BASE_URL}/experiencias/listar/?page=${page}&size=${size}`,
      );

      const response = await fetch(
        `${API_BASE_URL}/experiencias/listar/?pagina=${page}&limite=${size}${paramBusqueda(busqueda)}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        },
      );

      console.log("📊 Respuesta HTTP:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data: ExperienciaApiResponse = await response.json();
      console.log("📊 Datos crudos del servidor:", {
        dataLength: data.data?.length || 0,
        total: data.total,
        page: data.page,
        size: data.size,
        datosCompletos: JSON.stringify(data, null, 2),
      });

      // CRÍTICO: Verificar si el servidor está devolviendo paginación correcta
      if (data.data && data.data.length > size) {
        console.warn(
          "⚠️ PROBLEMA: El servidor devolvió más datos de los solicitados",
        );
        console.warn(`Solicitado: ${size}, Recibido: ${data.data.length}`);
        console.warn("Aplicando paginación manual...");

        // Aplicar paginación manual si el servidor no la respeta
        const startIndex = (page - 1) * size;
        const endIndex = startIndex + size;
        data.data = data.data.slice(startIndex, endIndex);

        console.log("📊 Datos después de paginación manual:", {
          dataLength: data.data.length,
          startIndex,
          endIndex,
        });
      }

      // Unificar los datos
      const unifiedData = this.unifyExperienceData(data.data);

      console.log("📊 Datos procesados:", {
        experienciasUnificadas: unifiedData.length,
        primeraExperiencia: unifiedData[0]
          ? {
              id: unifiedData[0].id_experiencia,
              proveedor: unifiedData[0].proveedor_nombre,
            }
          : "No hay datos",
      });

      // Return the full response object which includes pagination info (siguiendo patrón de usuarios)
      const result = {
        experiencias: unifiedData,
        total: data.total,
        page: data.page,
        size: data.size,
      };

      console.log("📊 Resultado final del servicio:", {
        experienciasCount: result.experiencias.length,
        total: result.total,
        page: result.page,
        size: result.size,
      });

      return result;
    } catch (error) {
      console.error("❌ Error en servicio de experiencias:", error);
      throw error;
    }
  }

  async getExperienceStats(): Promise<{
    total: number;
    verificadas: number;
    espanol: number;
    ingles: number;
  }> {
    try {
      console.log("📊 Obteniendo estadísticas de experiencias...");

      // Obtener todas las experiencias para calcular estadísticas
      const response = await fetch(
        `${API_BASE_URL}/experiencias/listar/?pagina=1&limite=1000`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data: ExperienciaApiResponse = await response.json();
      const allExperiences = this.unifyExperienceData(data.data);

      console.log(
        "📊 Total de experiencias obtenidas para estadísticas:",
        allExperiences.length,
      );

      // Calcular estadísticas
      const stats = {
        total: allExperiences.length,
        verificadas: allExperiences.filter((exp) => exp.proveedor_verificado)
          .length,
        espanol: allExperiences.filter(
          (exp) =>
            exp.idioma.toLowerCase().includes("español") ||
            exp.idioma.toLowerCase().includes("spanish") ||
            exp.idioma.toLowerCase() === "es",
        ).length,
        ingles: allExperiences.filter(
          (exp) =>
            exp.idioma.toLowerCase().includes("inglés") ||
            exp.idioma.toLowerCase().includes("english") ||
            exp.idioma.toLowerCase() === "en",
        ).length,
      };

      console.log("📊 Estadísticas calculadas:", stats);
      return stats;
    } catch (error) {
      console.error("Error obteniendo estadísticas de experiencias:", error);
      throw error;
    }
  }

  async getExperienceById(id: string) {
    try {
      console.log("📊 Obteniendo experiencia por ID:", id);

      const response = await fetch(
        `${API_BASE_URL}/experiencias/consultar/${id}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("📊 Detalles de experiencia obtenidos:", data);

      return data;
    } catch (error) {
      console.error("Error obteniendo detalles de experiencia:", error);
      throw error;
    }
  }

  async updateExperience(
    id: string,
    experienceData: {
      proveedor: {
        tipo: string;
        nombre: string;
        descripcion: string;
        email: string;
        telefono: string;
        direccion: string;
        ciudad: string;
        pais: string;
        sitio_web: string;
        rating_promedio: number;
        verificado: boolean;
        fecha_registro: string;
        ubicacion: string;
        redes_sociales: string;
        relevancia: string;
        usuario_creador: string;
        tipo_documento: string;
        numero_documento: string;
        activo: boolean;
      };
      experiencia: {
        duracion: number;
        dificultad: string;
        idioma: string;
        incluye_transporte: boolean;
        grupo_maximo: number;
        guia_incluido: boolean;
        equipamiento_requerido: string;
        punto_de_encuentro: string;
        numero_rnt: string;
      };
    },
  ) {
    try {
      console.log("📝 Actualizando experiencia:", id);
      console.log("📝 Datos a enviar:", experienceData);

      const response = await fetch(
        `${API_BASE_URL}/experiencias/editar/${id}`,
        {
          method: "PUT",
          headers: this.getAuthHeaders(),
          body: JSON.stringify(experienceData),
        },
      );

      console.log("📝 Respuesta de actualización:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      if (!response.ok) {
        let errorMessage = `Error ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          console.error("Error en respuesta de actualización:", errorData);
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (parseError) {
          console.error(parseError);
          try {
            const errorText = await response.text();
            console.error(
              "Error en respuesta de actualización (texto):",
              errorText,
            );
            errorMessage = errorText || errorMessage;
          } catch (textError) {
            console.error(textError);
            console.error("No se pudo obtener el mensaje de error");
          }
        }
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      console.log("✅ Experiencia actualizada exitosamente:", responseData);
      return responseData;
    } catch (error) {
      console.error("Error actualizando experiencia:", error);
      throw error;
    }
  }

  async deleteExperience(id: string): Promise<void> {
    try {
      console.log("🗑️ Eliminando experiencia:", id);
      console.log("🗑️ URL:", `${API_BASE_URL}/experiencias/eliminar/${id}`);
      console.log("🗑️ Headers:", this.getAuthHeaders());

      const response = await fetch(
        `${API_BASE_URL}/experiencias/eliminar/${id}`,
        {
          method: "DELETE",
          headers: this.getAuthHeaders(),
        },
      );

      console.log("🗑️ Respuesta DELETE:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      if (!response.ok) {
        let errorMessage = `Error ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          console.error("Error en respuesta DELETE:", errorData);
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (parseError) {
          console.log(parseError);
          try {
            const errorText = await response.text();
            console.error("Error en respuesta DELETE (texto):", errorText);
            errorMessage = errorText || errorMessage;
          } catch (textError) {
            console.log(textError);
            console.error("No se pudo obtener el mensaje de error");
          }
        }
        throw new Error(errorMessage);
      }

      // Try to get success message from API response
      try {
        const responseData = await response.json();
        console.log("✅ Respuesta exitosa del servidor:", responseData);
        return responseData;
      } catch (parseError) {
        console.log(parseError);
        // If no JSON response, that's fine for DELETE operations
        console.log("✅ Experiencia eliminada exitosamente del servidor");
      }
    } catch (error) {
      console.error("❌ Error eliminando experiencia:", error);
      throw error;
    }
  }
}

export const experienceService = new ExperienceService();
