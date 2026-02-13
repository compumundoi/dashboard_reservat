const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

// Función para obtener el token de autenticación
const getAuthToken = (): string => {
  const cookies = document.cookie.split(";");
  const tokenCookie = cookies.find((cookie) =>
    cookie.trim().startsWith("access_token="),
  );
  return tokenCookie ? tokenCookie.split("=")[1] : "";
};

// Headers con autenticación
const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getAuthToken()}`,
});

export interface ServicioOption {
  id_servicio: string;
  nombre: string;
}

interface ResponseBusquedaServicios {
  servicios: ServicioOption[];
  total: number;
  page: number;
  size: number;
}

// Buscar servicios por nombre
export const buscarServicios = async (
  search: string,
  pagina: number = 0,
  limite: number = 10,
): Promise<ResponseBusquedaServicios> => {
  const params = new URLSearchParams({
    search,
    pagina: pagina.toString(),
    limite: limite.toString(),
  });

  const response = await fetch(`${API_BASE_URL}/servicios/buscar/?${params}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Error al buscar servicios");
  }

  return await response.json();
};
