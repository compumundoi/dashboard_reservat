export interface ProveedorHotel {
  id_proveedor: string;
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
}

export interface HotelInfo {
  id_hotel: string;
  estrellas: number;
  numero_habitaciones: number;
  servicios_incluidos: string;
  check_in: string;
  check_out: string;
  admite_mascotas: boolean;
  tiene_estacionamiento: boolean;
  tipo_habitacion: string;
  precio_ascendente: number;
  servicio_restaurante: boolean;
  recepcion_24_horas: boolean;
  bar: boolean;
  room_service: boolean;
  asensor: boolean;
  rampa_discapacitado: boolean;
  pet_friendly: boolean;
  auditorio: boolean;
  parqueadero: boolean;
  piscina: boolean;
  planta_energia: boolean;
}

export interface HotelUnificado {
  // Campos del proveedor
  id_proveedor: string;
  nombre_proveedor: string;
  ciudad: string;
  pais: string;
  email: string;
  telefono?: string;
  direccion?: string;
  sitio_web?: string;
  ubicacion?: string;
  rating_promedio?: number;
  descripcion?: string;
  verificado: boolean;
  tipo_documento: string;
  numero_documento: string;
  // Campos del hotel
  id_hotel: string;
  estrellas: number;
  numero_habitaciones: number;
  servicios_incluidos: string;
  check_in?: string;
  check_out?: string;
  recepcion_24_horas: boolean;
  piscina: boolean;
  servicio_restaurante: boolean;
  parqueadero: boolean;
  pet_friendly: boolean;
  rampa_discapacitado: boolean;
  bar: boolean;
  room_service: boolean;
  asensor: boolean;
  auditorio: boolean;
  planta_energia: boolean;
  precio_ascendente?: number;
  tipo_habitacion?: string;
  admite_mascotas?: boolean;
  tiene_estacionamiento?: boolean;
}
