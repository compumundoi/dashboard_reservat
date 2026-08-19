// Tipos e interfaces para la sección de Restricciones (Fechas Bloqueadas)

// Datos para crear una fecha bloqueada
export interface DatosFechaBloqueada {
  servicio_id: string;
  fecha: string; // datetime format
  motivo: string;
  bloqueado_por: string;
  bloqueo_activo: boolean;
}

// Respuesta de la API para una fecha bloqueada
export interface RespuestaFechaBloqueada {
  id: string;
  servicio_id: string;
  servicio_nombre?: string | null;
  fecha: string;
  motivo: string;
  bloqueado_por: string;
  bloqueo_activo: boolean;
}

// Datos para actualizar una fecha bloqueada
export interface ActualizarFechaBloqueada {
  servicio_id?: string | null;
  fecha?: string | null;
  motivo?: string | null;
  bloqueado_por?: string | null;
  bloqueo_activo?: boolean | null;
}

// Respuesta de lista paginada
export interface ResponseListRestricciones {
  fechas_bloqueadas: RespuestaFechaBloqueada[];
  total: number;
  page: number;
  size: number;
}

// Mensaje de respuesta genérico
export interface ResponseMessage {
  message: string;
  status?: number;
}

// Datos procesados para la UI
export interface RestriccionData extends RespuestaFechaBloqueada {
  // Campos calculados para la UI
  fecha_formateada: string;
  servicio_nombre?: string; // Para mostrar nombre del servicio en lugar del ID
  dias_hasta_fecha?: number;
  estado_badge: 'activo' | 'inactivo';
}

// Estadísticas de restricciones
export interface RestriccionStatsData {
  totalRestricciones: number;
  restriccionesActivas: number;
  restriccionesMesActual: number;
  serviciosConRestricciones: number;
}

// Datos para gráficos
export interface RestriccionChartData {
  estados: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  bloqueosPorMes: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

// Props para componentes
export interface RestriccionTableProps {
  restricciones: RestriccionData[];
  loading: boolean;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  searchTerm: string;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSearch: (term: string) => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export interface RestriccionStatsProps {
  stats: RestriccionStatsData;
  loading: boolean;
}

export interface RestriccionChartsProps {
  data: RestriccionChartData;
  loading: boolean;
}

export interface RestriccionModalProps {
  isOpen: boolean;
  onClose: () => void;
  restriccion?: RestriccionData | null;
  onSave?: () => void;
}

// Constantes para estados
export const ESTADOS_RESTRICCION = {
  ACTIVO: 'activo',
  INACTIVO: 'inactivo'
} as const;

export type EstadoRestriccion = typeof ESTADOS_RESTRICCION[keyof typeof ESTADOS_RESTRICCION];
