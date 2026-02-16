/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Proveedor {
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

export interface ExperienciaData {
  id_experiencia: string;
  duracion: number;
  dificultad: string;
  idioma: string;
  incluye_transporte: boolean;
  grupo_maximo: number;
  guia_incluido: boolean;
  equipamiento_requerido: string;
  punto_de_encuentro: string;
  numero_rnt: string;
}

export interface ExperienciaCompleta {
  // Datos del proveedor
  id_proveedor: string;
  proveedor_nombre: string;
  proveedor_email: string;
  proveedor_telefono: string;
  proveedor_ciudad: string;
  proveedor_pais: string;
  proveedor_rating: number;
  proveedor_verificado: boolean;
  proveedor_activo: boolean;
  proveedor_direccion: string;
  proveedor_descripcion: string;
  proveedor_tipo_documento: string;
  proveedor_numero_documento: string;
  proveedor_sitio_web: string;
  fecha_registro: string;

  // Datos de la experiencia
  id_experiencia: string;
  duracion: number;
  dificultad: string;
  idioma: string;
  incluye_transporte: boolean;
  grupo_maximo: number;
  guia_incluido: boolean;
  equipamiento_requerido: string;
  punto_de_encuentro: string;
  numero_rnt: string;
}

export interface ExperienciaApiResponse {
  data: {
    proveedor: Proveedor;
    experiencia: ExperienciaData;
  }[];
  total: number;
  page: number;
  size: number;
}

export interface ExperienceTableProps {
  experiences: ExperienciaCompleta[];
  loading: boolean;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onClearSearch: () => void;
  currentPage: number;
  totalPages: number;
  totalExperiences: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onView: (experience: ExperienciaCompleta) => void;
  onEdit: (experience: ExperienciaCompleta) => void;
  onDelete: (id: string) => void;
  isSearching?: boolean;
  onDataChange?: () => void;
}

export interface ExperienceStatsProps {
  totalExperiences: number;
  verificadas: number;
  espanol: number;
  ingles: number;
  loading: boolean;
}

export interface ExperienceChartsProps {
  difficultyDistribution: { difficulty: string; count: number }[];
  languageDistribution: { language: string; count: number }[];
  chartsLoading: boolean;
}

export interface ExperienceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  experience: ExperienciaCompleta | null;
  loading?: boolean;
}

export interface EditExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  experience: ExperienciaCompleta | null;
  loading: boolean;
  isSaving: boolean;
}

export interface CreateExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  onSave: (data: any) => Promise<void>;
}
