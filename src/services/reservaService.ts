// Servicio para manejar las peticiones a la API de Reservas
import {
  EstadoReserva,
  ReservaData,
  RespuestaDecision,
  ResponseListReservas,
} from "../types/reserva";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8018/api/v1";

// El token se guarda en la cookie `auth_token` (ver App.tsx), con copia en
// localStorage para los navegadores que bloquean cookies en localhost.
const getAuthToken = (): string | null => {
  const cookie = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("auth_token="));

  if (cookie) return cookie.slice("auth_token=".length);

  try {
    return localStorage.getItem("auth_token");
  } catch {
    return null;
  }
};

const getAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// El backend responde los errores en `detail`; sin esto el administrador ve
// un "Error 409" que no explica que la reserva ya tenía una decisión.
const leerError = async (response: Response): Promise<string> => {
  try {
    const data = await response.json();
    return data?.detail || data?.message || `Error ${response.status}`;
  } catch {
    return `Error ${response.status}: ${response.statusText}`;
  }
};

class ReservaService {
  // Lista reservas paginadas, opcionalmente filtradas por estado.
  // La paginación de este servicio es 1-based.
  async getReservas(
    pagina: number = 1,
    limite: number = 10,
    estado: EstadoReserva | "" = "",
  ): Promise<ResponseListReservas> {
    const params = new URLSearchParams({
      pagina: String(pagina),
      limite: String(limite),
    });
    if (estado) params.set("estado", estado);

    const response = await fetch(
      `${API_BASE_URL}/reservas/listar/?${params.toString()}`,
      { method: "GET", headers: getAuthHeaders() },
    );

    if (!response.ok) throw new Error(await leerError(response));
    return response.json();
  }

  async getReservaById(id: string): Promise<ReservaData> {
    const response = await fetch(`${API_BASE_URL}/reservas/consultar/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error(await leerError(response));
    return response.json();
  }

  // Aprueba una reserva pendiente. El backend responde 409 si ya tenía
  // una decisión tomada.
  async aprobar(id: string, idAdmin?: string): Promise<RespuestaDecision> {
    const response = await fetch(`${API_BASE_URL}/reservas/${id}/aprobar`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(idAdmin ? { id_admin_decision: idAdmin } : {}),
    });

    if (!response.ok) throw new Error(await leerError(response));
    return response.json();
  }

  // Rechaza una reserva pendiente. El motivo es obligatorio: es el texto que
  // se le comunica al mayorista y al proveedor.
  async rechazar(
    id: string,
    motivo: string,
    idAdmin?: string,
  ): Promise<RespuestaDecision> {
    const response = await fetch(`${API_BASE_URL}/reservas/${id}/rechazar`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        motivo_rechazo: motivo,
        ...(idAdmin ? { id_admin_decision: idAdmin } : {}),
      }),
    });

    if (!response.ok) throw new Error(await leerError(response));
    return response.json();
  }
}

export const reservaService = new ReservaService();
export default reservaService;
