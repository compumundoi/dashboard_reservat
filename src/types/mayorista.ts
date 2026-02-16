export interface MayoristaData {
  id: string;
  nombre: string;
  apellidos?: string | null;
  descripcion?: string | null;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  pais: string;
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
  ciudad: string;
  pais: string;
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
  ciudad?: string;
  pais?: string;
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
