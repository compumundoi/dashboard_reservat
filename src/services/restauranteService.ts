import {
  RestauranteData,
  CreateRestauranteData,
  UpdateRestauranteData,
  RestauranteStats,
  RestauranteChartData,
} from "../types/restaurante";

const API_BASE_URL = "http://localhost:8013/api/v1";

// Interfaces para las respuestas de la API
interface ApiResponseList {
  data: Array<{
    proveedor: any;
    restaurante: any;
  }>;
  total: number;
  page: number;
  size: number;
}

class RestauranteService {
  private getAuthHeaders() {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  async getRestaurantes(
    page: number = 0,
    size: number = 10,
  ): Promise<{
    restaurantes: RestauranteData[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/restaurantes/listar/?pagina=${page + 1}&limite=${size}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data: ApiResponseList = await response.json();

      // Unificar datos de proveedor y restaurante
      const restaurantes: RestauranteData[] = data.data.map((item: any) => ({
        // Datos del proveedor
        id_proveedor: item.proveedor.id_proveedor,
        tipo: item.proveedor.tipo,
        nombre: item.proveedor.nombre,
        descripcion: item.proveedor.descripcion,
        email: item.proveedor.email,
        telefono: item.proveedor.telefono,
        direccion: item.proveedor.direccion,
        ciudad: item.proveedor.ciudad,
        pais: item.proveedor.pais,
        sitio_web: item.proveedor.sitio_web,
        rating_promedio: item.proveedor.rating_promedio,
        verificado: item.proveedor.verificado,
        fecha_registro: item.proveedor.fecha_registro,
        ubicacion: item.proveedor.ubicacion,
        redes_sociales: item.proveedor.redes_sociales,
        relevancia: item.proveedor.relevancia,
        usuario_creador: item.proveedor.usuario_creador,
        tipo_documento: item.proveedor.tipo_documento,
        numero_documento: item.proveedor.numero_documento,
        activo: item.proveedor.activo,

        // Datos específicos del restaurante
        id_restaurante: item.restaurante.id_restaurante,
        tipo_cocina: item.restaurante.tipo_cocina,
        horario_apertura: item.restaurante.horario_apertura,
        horario_cierre: item.restaurante.horario_cierre,
        capacidad: item.restaurante.capacidad,
        menu_url: item.restaurante.menu_url,
        tiene_terraza: item.restaurante.tiene_terraza,
        apto_celiacos: item.restaurante.apto_celiacos,
        apto_vegetarianos: item.restaurante.apto_vegetarianos,
        reservas_requeridas: item.restaurante.reservas_requeridas,
        entrega_a_domicilio: item.restaurante.entrega_a_domicilio,
        wifi: item.restaurante.wifi,
        zonas_comunes: item.restaurante.zonas_comunes,
        auditorio: item.restaurante.auditorio,
        pet_friendly: item.restaurante.pet_friendly,
        eventos: item.restaurante.eventos,
        menu_vegana: item.restaurante.menu_vegana,
        bufete: item.restaurante.bufete,
        catering: item.restaurante.catering,
        menu_infantil: item.restaurante.menu_infantil,
        parqueadero: item.restaurante.parqueadero,
        terraza: item.restaurante.terraza,
        sillas_bebe: item.restaurante.sillas_bebe,
        decoraciones_fechas_especiales:
          item.restaurante.decoraciones_fechas_especiales,
        rampa_discapacitados: item.restaurante.rampa_discapacitados,
        aforo_maximo: item.restaurante.aforo_maximo,
        tipo_comida: item.restaurante.tipo_comida,
        precio_ascendente: item.restaurante.precio_ascendente,
      }));

      return {
        restaurantes,
        total: data.total,
        totalPages: Math.ceil(data.total / size),
        currentPage: page + 1,
      };
    } catch (error) {
      console.error("Error fetching restaurantes:", error);
      throw error;
    }
  }

  async getRestauranteById(id: string): Promise<RestauranteData> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/restaurantes/consultar/${id}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Unificar datos de proveedor y restaurante
      return {
        // Datos del proveedor
        id_proveedor: data.proveedor.id_proveedor,
        tipo: data.proveedor.tipo,
        nombre: data.proveedor.nombre,
        descripcion: data.proveedor.descripcion,
        email: data.proveedor.email,
        telefono: data.proveedor.telefono,
        direccion: data.proveedor.direccion,
        ciudad: data.proveedor.ciudad,
        pais: data.proveedor.pais,
        sitio_web: data.proveedor.sitio_web,
        rating_promedio: data.proveedor.rating_promedio,
        verificado: data.proveedor.verificado,
        fecha_registro: data.proveedor.fecha_registro,
        ubicacion: data.proveedor.ubicacion,
        redes_sociales: data.proveedor.redes_sociales,
        relevancia: data.proveedor.relevancia,
        usuario_creador: data.proveedor.usuario_creador,
        tipo_documento: data.proveedor.tipo_documento,
        numero_documento: data.proveedor.numero_documento,
        activo: data.proveedor.activo,

        // Datos específicos del restaurante
        id_restaurante: data.restaurante.id_restaurante,
        tipo_cocina: data.restaurante.tipo_cocina,
        horario_apertura: data.restaurante.horario_apertura,
        horario_cierre: data.restaurante.horario_cierre,
        capacidad: data.restaurante.capacidad,
        menu_url: data.restaurante.menu_url,
        tiene_terraza: data.restaurante.tiene_terraza,
        apto_celiacos: data.restaurante.apto_celiacos,
        apto_vegetarianos: data.restaurante.apto_vegetarianos,
        reservas_requeridas: data.restaurante.reservas_requeridas,
        entrega_a_domicilio: data.restaurante.entrega_a_domicilio,
        wifi: data.restaurante.wifi,
        zonas_comunes: data.restaurante.zonas_comunes,
        auditorio: data.restaurante.auditorio,
        pet_friendly: data.restaurante.pet_friendly,
        eventos: data.restaurante.eventos,
        menu_vegana: data.restaurante.menu_vegana,
        bufete: data.restaurante.bufete,
        catering: data.restaurante.catering,
        menu_infantil: data.restaurante.menu_infantil,
        parqueadero: data.restaurante.parqueadero,
        terraza: data.restaurante.terraza,
        sillas_bebe: data.restaurante.sillas_bebe,
        decoraciones_fechas_especiales:
          data.restaurante.decoraciones_fechas_especiales,
        rampa_discapacitados: data.restaurante.rampa_discapacitados,
        aforo_maximo: data.restaurante.aforo_maximo,
        tipo_comida: data.restaurante.tipo_comida,
        precio_ascendente: data.restaurante.precio_ascendente,
      };
    } catch (error) {
      console.error("Error fetching restaurante details:", error);
      throw error;
    }
  }

  async createRestaurante(
    restaurante: CreateRestauranteData,
  ): Promise<RestauranteData> {
    try {
      // Estructurar los datos según el formato esperado por la API
      const requestData = {
        proveedor: {
          tipo: restaurante.tipo,
          nombre: restaurante.nombre,
          descripcion: restaurante.descripcion,
          email: restaurante.email,
          telefono: restaurante.telefono,
          direccion: restaurante.direccion,
          ciudad: restaurante.ciudad,
          pais: restaurante.pais,
          sitio_web: restaurante.sitio_web,
          rating_promedio: restaurante.rating_promedio,
          verificado: restaurante.verificado,
          fecha_registro: restaurante.fecha_registro,
          ubicacion: restaurante.ubicacion,
          redes_sociales: restaurante.redes_sociales,
          relevancia: restaurante.relevancia,
          usuario_creador: restaurante.usuario_creador,
          tipo_documento: restaurante.tipo_documento,
          numero_documento: restaurante.numero_documento,
          activo: restaurante.activo,
        },
        restaurante: {
          tipo_cocina: restaurante.tipo_cocina,
          horario_apertura: restaurante.horario_apertura,
          horario_cierre: restaurante.horario_cierre,
          capacidad: restaurante.capacidad,
          menu_url: restaurante.menu_url,
          tiene_terraza: restaurante.tiene_terraza,
          apto_celiacos: restaurante.apto_celiacos,
          apto_vegetarianos: restaurante.apto_vegetarianos,
          reservas_requeridas: restaurante.reservas_requeridas,
          entrega_a_domicilio: restaurante.entrega_a_domicilio,
          wifi: restaurante.wifi,
          zonas_comunes: restaurante.zonas_comunes,
          auditorio: restaurante.auditorio,
          pet_friendly: restaurante.pet_friendly,
          eventos: restaurante.eventos,
          menu_vegana: restaurante.menu_vegana,
          bufete: restaurante.bufete,
          catering: restaurante.catering,
          menu_infantil: restaurante.menu_infantil,
          parqueadero: restaurante.parqueadero,
          terraza: restaurante.terraza,
          sillas_bebe: restaurante.sillas_bebe,
          decoraciones_fechas_especiales:
            restaurante.decoraciones_fechas_especiales,
          rampa_discapacitados: restaurante.rampa_discapacitados,
          aforo_maximo: restaurante.aforo_maximo,
          tipo_comida: restaurante.tipo_comida,
          precio_ascendente: restaurante.precio_ascendente,
        },
      };

      const response = await fetch(`${API_BASE_URL}/restaurantes/crear/`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error creating restaurante:", error);
      throw error;
    }
  }

  async updateRestaurante(
    id: string,
    restaurante: UpdateRestauranteData,
  ): Promise<RestauranteData> {
    try {
      // Estructurar los datos según el formato esperado por la API
      const requestData = {
        proveedor: {
          tipo: restaurante.tipo,
          nombre: restaurante.nombre,
          descripcion: restaurante.descripcion,
          email: restaurante.email,
          telefono: restaurante.telefono,
          direccion: restaurante.direccion,
          ciudad: restaurante.ciudad,
          pais: restaurante.pais,
          sitio_web: restaurante.sitio_web,
          rating_promedio: restaurante.rating_promedio,
          verificado: restaurante.verificado,
          fecha_registro: restaurante.fecha_registro,
          ubicacion: restaurante.ubicacion,
          redes_sociales: restaurante.redes_sociales,
          relevancia: restaurante.relevancia,
          usuario_creador: restaurante.usuario_creador,
          tipo_documento: restaurante.tipo_documento,
          numero_documento: restaurante.numero_documento,
          activo: restaurante.activo,
        },
        restaurante: {
          tipo_cocina: restaurante.tipo_cocina,
          horario_apertura: restaurante.horario_apertura,
          horario_cierre: restaurante.horario_cierre,
          capacidad: restaurante.capacidad,
          menu_url: restaurante.menu_url,
          tiene_terraza: restaurante.tiene_terraza,
          apto_celiacos: restaurante.apto_celiacos,
          apto_vegetarianos: restaurante.apto_vegetarianos,
          reservas_requeridas: restaurante.reservas_requeridas,
          entrega_a_domicilio: restaurante.entrega_a_domicilio,
          wifi: restaurante.wifi,
          zonas_comunes: restaurante.zonas_comunes,
          auditorio: restaurante.auditorio,
          pet_friendly: restaurante.pet_friendly,
          eventos: restaurante.eventos,
          menu_vegana: restaurante.menu_vegana,
          bufete: restaurante.bufete,
          catering: restaurante.catering,
          menu_infantil: restaurante.menu_infantil,
          parqueadero: restaurante.parqueadero,
          terraza: restaurante.terraza,
          sillas_bebe: restaurante.sillas_bebe,
          decoraciones_fechas_especiales:
            restaurante.decoraciones_fechas_especiales,
          rampa_discapacitados: restaurante.rampa_discapacitados,
          aforo_maximo: restaurante.aforo_maximo,
          tipo_comida: restaurante.tipo_comida,
          precio_ascendente: restaurante.precio_ascendente,
        },
      };

      const response = await fetch(
        `${API_BASE_URL}/restaurantes/editar/${id}`,
        {
          method: "PUT",
          headers: this.getAuthHeaders(),
          body: JSON.stringify(requestData),
        },
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating restaurante:", error);
      throw error;
    }
  }

  async deleteRestaurante(id: string): Promise<void> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/restaurantes/eliminar/${id}`,
        {
          method: "DELETE",
          headers: this.getAuthHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error deleting restaurante:", error);
      throw error;
    }
  }

  async getRestauranteStats(): Promise<RestauranteStats> {
    try {
      // Obtener todos los restaurantes para calcular estadísticas
      const { restaurantes } = await this.getRestaurantes(0, 1000);

      return {
        total: restaurantes.length,
        verificados: restaurantes.filter((r) => r.verificado).length,
        con_entrega: restaurantes.filter((r) => r.entrega_a_domicilio).length,
        pet_friendly: restaurantes.filter((r) => r.pet_friendly).length,
      };
    } catch (error) {
      console.error("Error fetching restaurante stats:", error);
      return { total: 0, verificados: 0, con_entrega: 0, pet_friendly: 0 };
    }
  }

  async getRestauranteChartData(): Promise<RestauranteChartData> {
    try {
      const { restaurantes } = await this.getRestaurantes(0, 1000);

      // Distribución por tipos de cocina
      const tiposCount = restaurantes.reduce((acc: any, restaurante) => {
        acc[restaurante.tipo_cocina] = (acc[restaurante.tipo_cocina] || 0) + 1;
        return acc;
      }, {});

      const tipos_cocina = Object.entries(tiposCount).map(([tipo, count]) => ({
        tipo,
        count: count as number,
      }));

      // Distribución por servicios principales
      const servicios = [
        { key: "wifi", label: "WiFi" },
        { key: "parqueadero", label: "Parqueadero" },
        { key: "pet_friendly", label: "Pet Friendly" },
        { key: "terraza", label: "Terraza" },
        { key: "entrega_a_domicilio", label: "Entrega a Domicilio" },
        { key: "rampa_discapacitados", label: "Rampa Discapacitados" },
        { key: "eventos", label: "Eventos" },
        { key: "catering", label: "Catering" },
      ];

      const serviciosData = servicios.map((servicio) => ({
        servicio: servicio.label,
        count: restaurantes.filter((r: any) => r[servicio.key]).length,
      }));

      return { tipos_cocina, servicios: serviciosData };
    } catch (error) {
      console.error("Error fetching restaurante chart data:", error);
      return { tipos_cocina: [], servicios: [] };
    }
  }
}

export const restauranteService = new RestauranteService();
