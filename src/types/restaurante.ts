// Interfaces para la gestión de restaurantes
export interface RestauranteData {
  // Datos del proveedor
  id_proveedor: string;
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
  
  // Datos específicos del restaurante
  id_restaurante: string;
  tipo_cocina: string;
  horario_apertura: string;
  horario_cierre: string;
  capacidad: number;
  menu_url: string;
  tiene_terraza: boolean;
  apto_celiacos: boolean;
  apto_vegetarianos: boolean;
  reservas_requeridas: boolean;
  entrega_a_domicilio: boolean;
  wifi: boolean;
  zonas_comunes: boolean;
  auditorio: boolean;
  pet_friendly: boolean;
  eventos: boolean;
  menu_vegana: boolean;
  bufete: boolean;
  catering: boolean;
  menu_infantil: boolean;
  parqueadero: boolean;
  terraza: boolean;
  sillas_bebe: boolean;
  decoraciones_fechas_especiales: boolean;
  rampa_discapacitados: boolean;
  aforo_maximo: number;
  tipo_comida: string;
  precio_ascendente: number;
}

export interface CreateRestauranteData {
  // Datos del proveedor
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
  
  // Datos específicos del restaurante
  tipo_cocina: string;
  horario_apertura: string;
  horario_cierre: string;
  capacidad: number;
  menu_url: string;
  tiene_terraza: boolean;
  apto_celiacos: boolean;
  apto_vegetarianos: boolean;
  reservas_requeridas: boolean;
  entrega_a_domicilio: boolean;
  wifi: boolean;
  zonas_comunes: boolean;
  auditorio: boolean;
  pet_friendly: boolean;
  eventos: boolean;
  menu_vegana: boolean;
  bufete: boolean;
  catering: boolean;
  menu_infantil: boolean;
  parqueadero: boolean;
  terraza: boolean;
  sillas_bebe: boolean;
  decoraciones_fechas_especiales: boolean;
  rampa_discapacitados: boolean;
  aforo_maximo: number;
  tipo_comida: string;
  precio_ascendente: number;
}

export interface UpdateRestauranteData extends Partial<CreateRestauranteData> {}

export interface RestauranteStats {
  total: number;
  verificados: number;
  con_entrega: number;
  pet_friendly: number;
}

export interface RestauranteChartData {
  tipos_cocina: Array<{
    tipo: string;
    count: number;
  }>;
  servicios: Array<{
    servicio: string;
    count: number;
  }>;
}
