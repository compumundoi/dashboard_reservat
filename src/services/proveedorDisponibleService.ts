import { getCookie } from "../utils/auth";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

export interface ProveedorDisponible {
  id: string;
  nombre: string | null;
  apellido: string | null;
  email: string;
}

// Usuarios de tipo proveedor que todavía no tienen un hotel, restaurante,
// experiencia o transporte asociado. Cada uno puede tener sólo uno, así que
// la lista se vacía a medida que se les da de alta un registro.
export const listarProveedoresDisponibles = async (): Promise<ProveedorDisponible[]> => {
  const response = await fetch(
    `${API_BASE_URL}/usuarios/proveedores-disponibles/`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${getCookie("auth_token")}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Error al obtener los proveedores disponibles");
  }

  const data = await response.json();
  return data.proveedores || [];
};
