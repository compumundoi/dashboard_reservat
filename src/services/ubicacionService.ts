import { Pais, Departamento, Municipio } from "../types/ubicacion";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8021/api/v1";

interface RespuestaPaises {
  paises: Pais[];
  total: number;
}

interface RespuestaDepartamentos {
  departamentos: Departamento[];
  total: number;
}

interface RespuestaMunicipios {
  municipios: Municipio[];
  total: number;
}

/**
 * Cliente del catálogo de ubicaciones.
 *
 * El catálogo es estático: 249 países, 33 departamentos y 1122 municipios que
 * no cambian entre sesiones. Por eso las respuestas se cachean en memoria —
 * abrir seis modales seguidos no debería disparar seis veces la misma lista.
 */
class UbicacionService {
  private cachePaisPorDefecto: Promise<Pais> | null = null;
  private cacheDepartamentos = new Map<string, Promise<Departamento[]>>();
  private cacheMunicipios = new Map<number, Promise<Municipio[]>>();

  private async pedir<T>(ruta: string): Promise<T> {
    const respuesta = await fetch(`${API_BASE_URL}${ruta}`, {
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!respuesta.ok) {
      throw new Error(
        `No se pudo cargar el catálogo de ubicaciones (${respuesta.status})`,
      );
    }

    return respuesta.json() as Promise<T>;
  }

  /** País que los formularios dejan fijo y no editable (Colombia). */
  async getPaisPorDefecto(): Promise<Pais> {
    if (!this.cachePaisPorDefecto) {
      this.cachePaisPorDefecto = this.pedir<Pais>(
        "/ubicaciones/paises/por-defecto",
      ).catch((error) => {
        // Un fallo no debe dejar la caché envenenada: el próximo intento
        // tiene que volver a pedir.
        this.cachePaisPorDefecto = null;
        throw error;
      });
    }
    return this.cachePaisPorDefecto;
  }

  async getPaises(): Promise<Pais[]> {
    const datos = await this.pedir<RespuestaPaises>("/ubicaciones/paises");
    return datos.paises;
  }

  /** Departamentos de un país. Sin argumento devuelve los de Colombia. */
  async getDepartamentos(paisId?: number): Promise<Departamento[]> {
    const clave = paisId === undefined ? "default" : String(paisId);

    if (!this.cacheDepartamentos.has(clave)) {
      const ruta =
        paisId === undefined
          ? "/ubicaciones/departamentos"
          : `/ubicaciones/departamentos?pais_id=${paisId}`;

      const promesa = this.pedir<RespuestaDepartamentos>(ruta)
        .then((datos) => datos.departamentos)
        .catch((error) => {
          this.cacheDepartamentos.delete(clave);
          throw error;
        });

      this.cacheDepartamentos.set(clave, promesa);
    }

    return this.cacheDepartamentos.get(clave)!;
  }

  async getMunicipios(departamentoId: number): Promise<Municipio[]> {
    if (!this.cacheMunicipios.has(departamentoId)) {
      const promesa = this.pedir<RespuestaMunicipios>(
        `/ubicaciones/municipios?departamento_id=${departamentoId}`,
      )
        .then((datos) => datos.municipios)
        .catch((error) => {
          this.cacheMunicipios.delete(departamentoId);
          throw error;
        });

      this.cacheMunicipios.set(departamentoId, promesa);
    }

    return this.cacheMunicipios.get(departamentoId)!;
  }
}

export const ubicacionService = new UbicacionService();
