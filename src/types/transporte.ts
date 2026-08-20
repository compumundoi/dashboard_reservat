// Tipos para la gestión de transportes

export interface DatosProveedor {
  tipo: string;
  nombre: string;
  descripcion: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  pais: string;
  // Ubicación: el formulario sólo envía municipio_id; ciudad, departamento y
  // país los deriva el backend desde el catálogo de ubicaciones.
  municipio_id?: number | null;
  departamento_id?: number | null;
  pais_id?: number | null;
  departamento?: string;
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

export interface DatosTransporte {
  tipo_vehiculo: string;
  modelo: string;
  anio: number;
  placa: string;
  capacidad: number;
  aire_acondicionado: boolean;
  wifi: boolean;
  disponible: boolean;
  combustible: string;
  seguro_vigente: boolean;
  fecha_mantenimiento: string;
}

export interface ListarDatosProveedor extends DatosProveedor {
  id_proveedor: string;
}

export interface ListarDatosTransporte extends DatosTransporte {
  id_transporte: string;
}

export interface TransporteData {
  proveedor: ListarDatosProveedor;
  transporte: ListarDatosTransporte;
}

export interface CrearTransporteRequest {
  proveedor: DatosProveedor;
  transporte: DatosTransporte;
}

export interface TransporteUpdateData {
  proveedor: DatosProveedor;
  transporte: DatosTransporte;
}

export interface TransporteResponse {
  data: TransporteData[];
  total: number;
  page: number;
  size: number;
}

export interface TransporteStats {
  totalTransportes: number;
  transportesDisponibles: number;
  transportesConSeguro: number;
  capacidadPromedio: number;
}

export interface TransporteChartData {
  tiposVehiculo: { name: string; value: number; color: string }[];
  estados: { name: string; value: number; color: string }[];
}

// Props para componentes
export interface TransporteTableProps {
  transportes: TransporteData[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  searchTerm: string;
  onSearch: (term: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onViewDetails: (transporte: TransporteData) => void;
  onEdit: (transporte: TransporteData) => void;
  onDelete: (id: string) => void;
}

export interface TransporteModalProps {
  isOpen: boolean;
  onClose: () => void;
  transporte?: TransporteData;
  onSave?: () => void;
}
