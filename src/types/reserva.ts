// Tipos del módulo de reservas.
//
// Una reserva la crea el mayorista desde la landing y nace en estado
// "pendiente". Desde este dashboard un administrador la aprueba o la
// rechaza; esa transición sólo es válida desde "pendiente".

export type EstadoReserva = "pendiente" | "aprobada" | "rechazada";

export const ESTADOS_RESERVA: EstadoReserva[] = [
  "pendiente",
  "aprobada",
  "rechazada",
];

export interface ReservaData {
  id: string;
  id_proveedor: string | null;
  id_servicio: string | null;
  id_mayorista: string | null;
  nombre_servicio: string;
  descripcion: string | null;
  tipo_servicio: string;
  precio: string;
  ciudad: string;
  activo: boolean;
  estado: EstadoReserva;
  observaciones: string | null;
  fecha_creacion: string | null;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  cantidad: number;
  motivo_rechazo: string | null;
  fecha_decision: string | null;
  id_admin_decision: string | null;
}

export interface ResponseListReservas {
  reservas: ReservaData[];
  total: number;
  page: number;
  size: number;
}

export interface RespuestaDecision {
  message: string;
  reserva: ReservaData;
}

export interface ReservaTableProps {
  reservas: ReservaData[];
  loading: boolean;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  estadoFiltro: EstadoReserva | "";
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onEstadoChange: (estado: EstadoReserva | "") => void;
  onView: (reserva: ReservaData) => void;
  onAprobar: (reserva: ReservaData) => void;
  onRechazar: (reserva: ReservaData) => void;
  decidiendoId: string | null;
}
