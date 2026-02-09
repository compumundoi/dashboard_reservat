import { HotelUnificado, ProveedorHotel, HotelInfo } from "../types/hotel";
import { getCookie } from "../utils/auth";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8012/api/v1";

class HotelService {
  private getAuthHeaders() {
    const token = getCookie("auth_token");
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  async getHotels(page = 1, size = 100) {
    const response = await fetch(
      `${API_BASE_URL}/hoteles/listar/?page=${page}&size=${size}`,
      {
        headers: this.getAuthHeaders(),
      },
    );
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }
    const data = await response.json();
    // unificar proveedor + hotel
    const unified: HotelUnificado[] = (data.data || []).map(
      (item: { proveedor: ProveedorHotel; hotel: HotelInfo }) => ({
        id_proveedor: item.proveedor.id_proveedor,
        nombre_proveedor: item.proveedor.nombre,
        ciudad: item.proveedor.ciudad,
        pais: item.proveedor.pais,
        email: item.proveedor.email,
        verificado: item.proveedor.verificado,
        tipo_documento: item.proveedor.tipo_documento,
        numero_documento: item.proveedor.numero_documento,
        id_hotel: item.hotel.id_hotel,
        estrellas: item.hotel.estrellas,
        numero_habitaciones: item.hotel.numero_habitaciones,
        servicios_incluidos: item.hotel.servicios_incluidos,
        recepcion_24_horas: item.hotel.recepcion_24_horas,
        piscina: item.hotel.piscina,
      }),
    );

    return unified;
  }

  async getHotelById(id: string) {
    const response = await fetch(`${API_BASE_URL}/hoteles/consultar/${id}`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }
    return response.json();
  }

  async updateHotel(
    id: string,
    data: { proveedor: ProveedorHotel; hotel: HotelInfo },
  ) {
    const response = await fetch(`${API_BASE_URL}/hoteles/editar/${id}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }
    return response.json();
  }

  async deleteHotel(id: string) {
    const response = await fetch(`${API_BASE_URL}/hoteles/eliminar/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }
    return response.json();
  }

  async createHotel(data: { proveedor: ProveedorHotel; hotel: HotelInfo }) {
    const response = await fetch(`${API_BASE_URL}/hoteles/crear/`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }
    return response.json();
  }
}

export const hotelService = new HotelService();
