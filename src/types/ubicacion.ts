// Catálogo de ubicaciones servido por ms_ubicaciones.
//
// Los formularios sólo envían `municipio_id`: el backend deriva ciudad,
// departamento y país desde el catálogo. Los campos de texto siguen viajando
// en las respuestas porque los listados, los detalles y el buscador del
// landing leen el nombre, no el id.

export interface Pais {
  id: number;
  nombre: string;
  codigo: string;
}

export interface Departamento {
  id: number;
  pais_id: number;
  nombre: string;
  codigo: string;
}

export interface Municipio {
  id: number;
  departamento_id: number;
  nombre: string;
  codigo: string;
}

// Estado de ubicación que manejan los formularios. `municipioId` es lo único
// que se persiste como referencia; el resto es texto libre o derivado.
export interface ValorUbicacion {
  paisId: number | null;
  departamentoId: number | null;
  municipioId: number | null;
  direccion: string;
}

// Los campos tal como los espera la API en el payload de creación/edición.
export interface UbicacionPayload {
  municipio_id: number | null;
}

export const UBICACION_VACIA: ValorUbicacion = {
  paisId: null,
  departamentoId: null,
  municipioId: null,
  direccion: "",
};
