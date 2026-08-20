// Tipos de servicio admitidos. El valor guardado respeta el que ya usan los
// registros existentes ("experiencias" en plural), para que las estadísticas
// y los filtros no partan en dos una misma categoría.
export const TIPOS_DE_SERVICIO = [
  { value: 'transporte', label: 'Transporte' },
  { value: 'alojamiento', label: 'Alojamiento' },
  { value: 'experiencias', label: 'Experiencia' },
  { value: 'restaurante', label: 'Restaurante' },
];

// Devuelve la etiqueta legible de un valor guardado. Si el registro trae un
// tipo fuera del catálogo —los había, cargados a mano cuando esto era texto
// libre— se muestra tal cual en vez de dejar el campo en blanco.
export const etiquetaDeTipo = (valor: string): string =>
  TIPOS_DE_SERVICIO.find((t) => t.value === valor)?.label || valor;

// Tipos e interfaces para la sección de Servicios
export interface DatosServicio {
  proveedor_id: string;
  nombre: string;
  descripcion: string;
  tipo_servicio: string;
  precio: number;
  moneda: string;
  activo: boolean;
  fecha_creacion: string;
  fecha_actualizacion: string;
  relevancia: string;
  // Ubicación: el formulario sólo envía municipio_id; ciudad, departamento y
  // país los deriva el backend desde el catálogo de ubicaciones.
  municipio_id: number | null;
  ciudad: string;
  departamento: string;
  pais?: string;
  pais_id?: number | null;
  departamento_id?: number | null;
  ubicacion: string;
  detalles_del_servicio: string;
}

export interface RespuestaServicio {
  id_servicio: string;
  proveedor_id: string;
  proveedor_nombre?: string | null;
  proveedor_email?: string | null;
  nombre: string;
  descripcion: string;
  tipo_servicio: string;
  precio: number;
  moneda: string;
  activo: boolean;
  fecha_creacion: string;
  fecha_actualizacion: string;
  relevancia: string;
  // Ubicación: el formulario sólo envía municipio_id; ciudad, departamento y
  // país los deriva el backend desde el catálogo de ubicaciones.
  municipio_id: number | null;
  ciudad: string;
  departamento: string;
  pais?: string;
  pais_id?: number | null;
  departamento_id?: number | null;
  ubicacion: string;
  detalles_del_servicio: string;
}

export interface ActualizarServicio {
  id_servicio: string;
  proveedor_id: string;
  nombre: string;
  descripcion: string;
  tipo_servicio: string;
  precio: number;
  moneda: string;
  activo: boolean;
  fecha_creacion: string;
  fecha_actualizacion: string;
  relevancia: string;
  // Ubicación: el formulario sólo envía municipio_id; ciudad, departamento y
  // país los deriva el backend desde el catálogo de ubicaciones.
  municipio_id: number | null;
  ciudad: string;
  departamento: string;
  pais?: string;
  pais_id?: number | null;
  departamento_id?: number | null;
  ubicacion: string;
  detalles_del_servicio: string;
}

export interface ResponseListServicios {
  servicios: RespuestaServicio[];
  total: number;
  page: number;
  size: number;
}

// Tipos para la UI
export interface ServicioData {
  id_servicio: string;
  proveedor_id: string;
  proveedorNombre: string;
  proveedorEmail: string;
  nombre: string;
  descripcion: string;
  tipo_servicio: string;
  precio: number;
  moneda: string;
  precioFormateado: string;
  activo: boolean;
  fecha_creacion: string;
  fecha_actualizacion: string;
  fechaCreacionFormateada: string;
  fechaActualizacionFormateada: string;
  relevancia: string;
  municipio_id: number | null;
  departamento_id: number | null;
  pais_id: number | null;
  pais: string;
  ciudad: string;
  departamento: string;
  ubicacionCompleta: string;
  ubicacion: string;
  detalles_del_servicio: string;
}

// Tipos para estadísticas
export interface ServicioStatsData {
  totalServicios: number;
  serviciosActivos: number;
  serviciosPorTipo: number;
  proveedoresConServicios: number;
}

// Tipos para gráficos
export interface ServicioChartData {
  tipoServicioData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  ciudadData: Array<{
    ciudad: string;
    cantidad: number;
  }>;
}

// Props para componentes
export interface ServicioTableProps {
  servicios: ServicioData[];
  loading: boolean;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onView: (servicio: ServicioData) => void;
  onEdit: (servicio: ServicioData) => void;
  onDelete: (id: string) => void;
}

export interface ServicioStatsProps {
  stats: ServicioStatsData;
  loading: boolean;
}

export interface ServicioChartsProps {
  chartData: ServicioChartData;
  loading: boolean;
}

export interface ServicioDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  servicio: ServicioData | null;
}

export interface EditServicioModalProps {
  isOpen: boolean;
  onClose: () => void;
  servicio: ServicioData | null;
  onSave: (data: ActualizarServicio) => Promise<void>;
}

export interface CreateServicioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: DatosServicio) => Promise<void>;
}
