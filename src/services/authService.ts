import { LoginCredentials, LoginResponse } from "../types/auth";
import { getCookie } from "../utils/auth";

// Usar ruta relativa para aprovechar el proxy en desarrollo y funcionar en producción
// Usar ruta completa para conectar con el microservicio en Docker
const API_BASE_URL = "http://localhost:8000/api/v1";

export const loginUser = async (
  credentials: LoginCredentials,
): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/usuarios/admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        contraseña: credentials.contraseña,
      }),
      credentials: "include",
    });

    // Verificar si la respuesta tiene contenido JSON
    const contentType = response.headers.get("content-type");
    const contentLength = response.headers.get("content-length");

    let data: any = {};
    if (contentLength !== "0" && contentType?.includes("application/json")) {
      const responseText = await response.text();
      if (responseText.trim()) {
        data = JSON.parse(responseText);
      }
    }

    if (!response.ok) {
      let errorMessage =
        data?.detail ||
        data?.message ||
        `Error ${response.status}: ${response.statusText}`;

      switch (response.status) {
        case 400:
          errorMessage =
            "Datos de entrada inválidos. Verifica el formato del email y contraseña.";
          break;
        case 401:
          errorMessage =
            "Credenciales incorrectas. Verifica tu email y contraseña.";
          break;
        case 403:
          errorMessage = "Usuario sin permisos de administrador.";
          break;
        case 404:
          errorMessage =
            "Endpoint no encontrado. Verifica la configuración de la API.";
          break;
        case 422:
          errorMessage =
            "Datos de entrada no válidos. Verifica el formato de los campos.";
          break;
        case 500:
          errorMessage =
            "Error interno del servidor. El servidor está experimentando problemas.";
          break;
        case 502:
        case 503:
        case 504:
          errorMessage =
            "Servidor no disponible temporalmente. Inténtalo más tarde.";
          break;
        default:
          errorMessage = `Error del servidor (${response.status}): ${response.statusText}`;
      }

      throw new Error(errorMessage);
    }

    // Si no hay token en la respuesta, verificar cookies
    if (!data.access_token) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const cookieToken = getCookie("auth_token");
      if (cookieToken) {
        data.access_token = cookieToken;
      }
    }

    return data as LoginResponse;
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message.includes("fetch") ||
        error.message.includes("NetworkError") ||
        error.message.includes("CORS")
      ) {
        throw new Error(
          "No se pudo conectar con el servidor. Verifica tu conexión a internet.",
        );
      }
      throw error;
    }
    throw new Error("Error de conexión inesperado");
  }
};
