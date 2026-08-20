export interface MayoristaData {
  id: string;
  nombre: string;
  apellidos?: string | null;
  descripcion?: string | null;
  email: string;
  telefono: string;
  direccion: string;
  // Ubicación: el formulario sólo envía municipio_id; ciudad, departamento y
  // país los deriva el backend desde el catálogo de ubicaciones.
  municipio_id: number | null;
  ciudad: string;
  departamento?: string;
  pais: string;
  pais_id?: number | null;
  departamento_id?: number | null;
  recurente: boolean;
  usuario_creador?: string | null;
  verificado: boolean;
  intereses?: string | null;
  tipo_documento: string;
  numero_documento: string;
  contacto_principal?: string | null;
  telefono_contacto?: string | null;
  email_contacto?: string | null;
  comision_porcentaje?: number;
  limite_credito?: number;
  estado?: string;
  observaciones?: string | null;
  activo: boolean;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export interface CreateMayoristaData {
  nombre: string;
  apellidos?: string | null;
  descripcion?: string | null;
  email: string;
  telefono: string;
  direccion: string;
  // Ubicación: el formulario sólo envía municipio_id; ciudad, departamento y
  // país los deriva el backend desde el catálogo de ubicaciones.
  municipio_id: number | null;
  ciudad: string;
  departamento?: string;
  pais: string;
  pais_id?: number | null;
  departamento_id?: number | null;
  recurente: boolean;
  usuario_creador?: string | null;
  verificado: boolean;
  intereses?: string | null;
  tipo_documento: string;
  numero_documento: string;
  contacto_principal?: string | null;
  telefono_contacto?: string | null;
  email_contacto?: string | null;
  comision_porcentaje?: number;
  limite_credito?: number;
  estado?: string;
  observaciones?: string | null;
  activo: boolean;
}

export interface UpdateMayoristaData {
  nombre?: string;
  apellidos?: string | null;
  descripcion?: string | null;
  email?: string;
  telefono?: string;
  direccion?: string;
  municipio_id?: number | null;
  ciudad?: string;
  departamento?: string;
  pais?: string;
  pais_id?: number | null;
  departamento_id?: number | null;
  recurente?: boolean;
  usuario_creador?: string | null;
  verificado?: boolean;
  intereses?: string | null;
  tipo_documento?: string;
  numero_documento?: string;
  contacto_principal?: string | null;
  telefono_contacto?: string | null;
  email_contacto?: string | null;
  comision_porcentaje?: number;
  limite_credito?: number;
  estado?: string;
  observaciones?: string | null;
  activo?: boolean;
}

export interface MayoristaStats {
  total: number;
  verificados: number;
  recurrentes: number;
  activos: number;
}

export interface MayoristaChartData {
  estados: Array<{
    estado: string;
    count: number;
  }>;
  verificacion: Array<{
    tipo: string;
    count: number;
  }>;
}
