import { OpcionEntidad } from "../components/common/BuscadorEntidad";
import { rutaService } from "./rutaService";
import { transporteService } from "./transporteService";

// Se apoyan en el listado, que ya resuelve la búsqueda en el servidor, en
// lugar de traer todo y filtrar acá. El límite bajo mantiene corta la lista
// del desplegable.
const LIMITE_SUGERENCIAS = 8;

export const buscarRutasComoOpciones = async (
  termino: string,
): Promise<OpcionEntidad[]> => {
  // getRutas recibe la página 0-based y getTransportes 1-based: la
  // convención cambia según el microservicio, no la unifiques de memoria.
  const { rutas } = await rutaService.getRutas(0, LIMITE_SUGERENCIAS, termino);
  return rutas.map((ruta) => ({
    id: ruta.id,
    titulo: ruta.nombre,
    detalle: [ruta.origen, ruta.destino].filter(Boolean).join(" → "),
  }));
};

export const buscarTransportesComoOpciones = async (
  termino: string,
): Promise<OpcionEntidad[]> => {
  const { data } = await transporteService.getTransportes(1, LIMITE_SUGERENCIAS, termino);
  return data.map(({ proveedor, transporte }) => ({
    id: transporte.id_transporte,
    titulo: proveedor.nombre,
    detalle: [transporte.tipo_vehiculo, transporte.placa]
      .filter(Boolean)
      .join(" · "),
  }));
};

// Al editar, el viaje sólo guarda los ids. Se resuelven a un nombre legible
// para que el buscador no aparezca vacío sobre un registro que sí tiene ruta
// y transportador asignados.
export const nombreDeRuta = async (id: string): Promise<string> => {
  if (!id) return "";
  try {
    const ruta = await rutaService.getRutaById(id);
    return ruta?.nombre || "";
  } catch {
    return "";
  }
};

export const nombreDeTransportador = async (id: string): Promise<string> => {
  if (!id) return "";
  try {
    const { proveedor } = await transporteService.getTransporteById(id);
    return proveedor?.nombre || "";
  } catch {
    return "";
  }
};
