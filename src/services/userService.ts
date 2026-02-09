import { User } from "../types/user";
import { getCookie } from "../utils/auth";

// Usar el proxy configurado en Vite para evitar problemas de CORS
const API_BASE_URL = "http://localhost:8000/api/v1";

class UserService {
  private getAuthHeaders() {
    const token = getCookie("auth_token");
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  async getUsers(page: number, size: number) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/usuarios/listar/?page=${page}&size=${size}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      // Return the full response object which includes pagination info
      return data;
    } catch (error) {
      console.error("Error obteniendo usuarios:", error);
      throw error;
    }
  }

  async createUser(userData: {
    nombre: string;
    apellido: string;
    email: string;
    tipo_usuario: string;
    contraseña: string;
  }): Promise<{ message: string; status: number }> {
    try {
      console.log("Enviando petición POST para crear usuario:", userData);
      console.log("URL:", `${API_BASE_URL}/usuarios/crear/`);
      console.log("Headers:", this.getAuthHeaders());

      const response = await fetch(`${API_BASE_URL}/usuarios/crear/`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify(userData),
      });

      console.log("Respuesta POST:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      if (!response.ok) {
        let errorMessage = `Error ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          console.error("Error en respuesta POST:", errorData);
          // Use the API's error message if available
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (parseError) {
          // If JSON parsing fails, try to get text
          try {
            const errorText = await response.text();
            console.error("Error en respuesta POST (texto):", errorText);
            errorMessage = errorText || errorMessage;
          } catch (textError) {
            console.error("No se pudo obtener el mensaje de error");
          }
        }
        throw new Error(errorMessage);
      }

      // Get success response from API
      const responseData = await response.json();
      console.log("Usuario creado exitosamente:", responseData);
      return responseData;
    } catch (error) {
      console.error("Error creando usuario:", error);
      throw error;
    }
  }

  async getUserStats(): Promise<{
    total: number;
    proveedores: number;
    mayoristas: number;
    administrativos: number;
  }> {
    try {
      console.log("📊 Obteniendo estadísticas completas de usuarios...");

      // Obtener todos los usuarios para calcular estadísticas
      const response = await fetch(
        `${API_BASE_URL}/usuarios/listar/?page=1&size=1000`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const allUsers = Array.isArray(data) ? data : data.usuarios || [];

      console.log(
        "📊 Total de usuarios obtenidos para estadísticas:",
        allUsers.length,
      );

      // Calcular estadísticas
      const stats = {
        total: allUsers.length,
        proveedores: allUsers.filter(
          (u: User) => u.tipo_usuario === "proveedor",
        ).length,
        mayoristas: allUsers.filter((u: User) => u.tipo_usuario === "mayorista")
          .length,
        administrativos: allUsers.filter(
          (u: User) => u.tipo_usuario === "administrador",
        ).length,
      };

      console.log("📊 Estadísticas calculadas:", stats);
      return stats;
    } catch (error) {
      console.error("Error obteniendo estadísticas de usuarios:", error);
      throw error;
    }
  }

  async getUserById(id: string): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
        method: "GET",
        headers: this.getAuthHeaders(),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error obteniendo usuario:", error);
      throw error;
    }
  }

  async updateUser(
    id: string,
    userData: { nombre: string; apellido: string },
  ): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error actualizando usuario:", error);
      throw error;
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      console.log("Enviando petición DELETE para usuario:", id);
      console.log("URL:", `${API_BASE_URL}/usuarios/eliminar/${id}/`);
      console.log("Headers:", this.getAuthHeaders());

      const response = await fetch(`${API_BASE_URL}/usuarios/eliminar/${id}/`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
        credentials: "include",
      });

      console.log("Respuesta DELETE:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      if (!response.ok) {
        let errorMessage = `Error ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          console.error("Error en respuesta DELETE:", errorData);
          // Use the API's error message if available
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (parseError) {
          // If JSON parsing fails, try to get text
          try {
            const errorText = await response.text();
            console.error("Error en respuesta DELETE (texto):", errorText);
            errorMessage = errorText || errorMessage;
          } catch (textError) {
            console.error("No se pudo obtener el mensaje de error");
          }
        }
        throw new Error(errorMessage);
      }

      // Try to get success message from API response
      try {
        const responseData = await response.json();
        console.log("Respuesta exitosa del servidor:", responseData);
        return responseData;
      } catch (parseError) {
        // If no JSON response, that's fine for DELETE operations
        console.log("Usuario eliminado exitosamente del servidor");
      }
    } catch (error) {
      console.error("Error eliminando usuario:", error);
      throw error;
    }
  }
}

export const userService = new UserService();
