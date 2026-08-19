// Tipos e interfaces para la sección de Fotos
export interface DatosFoto {
  servicio_id: string;
  url: string;
  descripcion: string;
  orden: number;
  es_portada: boolean;
  fecha_subida: string;
  eliminado: boolean;
}

export interface RespuestaFoto {
  id: string;
  servicio_id: string;
  servicio_nombre?: string | null;
  url: string;
  descripcion: string;
  orden: number;
  es_portada: boolean;
  fecha_subida: string;
  eliminado: boolean;
}

export interface ActualizarFoto {
  servicio_id?: string | null;
  url?: string | null;
  descripcion?: string | null;
  orden?: number | null;
  es_portada?: boolean | null;
  fecha_subida?: string | null;
  eliminado?: boolean | null;
}

export interface ResponseListFotos {
  fotos: RespuestaFoto[];
  total: number;
  page: number;
  size: number;
}

// Tipos para la UI
export interface FotoData {
  id: string;
  servicio_id: string;
  servicioNombre: string;
  url: string;
  descripcion: string;
  orden: number;
  es_portada: boolean;
  fecha_subida: string;
  eliminado: boolean;
  fechaFormateada: string;
}

// Tipos para estadísticas
export interface FotoStatsData {
  totalFotos: number;
  fotosActivas: number;
  fotosPortada: number;
  serviciosConFotos: number;
}

// Tipos para gráficos
export interface FotoChartData {
  estadoData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  subidasMesData: Array<{
    mes: string;
    cantidad: number;
  }>;
}

// Props para componentes
export interface FotoTableProps {
  fotos: FotoData[];
  loading: boolean;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onView: (foto: FotoData) => void;
  onEdit: (foto: FotoData) => void;
  onDelete: (id: string) => void;
}

export interface FotoStatsProps {
  stats: FotoStatsData;
  loading: boolean;
}

export interface FotoChartsProps {
  chartData: FotoChartData;
  loading: boolean;
}

export interface FotoDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  foto: FotoData | null;
}

export interface EditFotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  foto: FotoData | null;
  onSave: (data: ActualizarFoto) => Promise<void>;
}

export interface CreateFotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: DatosFoto) => Promise<void>;
}
