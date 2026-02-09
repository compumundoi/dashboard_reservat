import {
  DatosFoto,
  RespuestaFoto,
  ActualizarFoto,
  ResponseListFotos,
  FotoData,
  FotoStatsData,
  FotoChartData,
} from "../types/foto";
import * as XLSX from "xlsx";

const API_BASE_URL = "http://localhost:8008";

// Función para obtener el token de autenticación
const getAuthToken = (): string => {
  const cookies = document.cookie.split(";");
  const tokenCookie = cookies.find((cookie) =>
    cookie.trim().startsWith("access_token="),
  );
  return tokenCookie ? tokenCookie.split("=")[1] : "";
};

// Función para obtener headers con autenticación
const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getAuthToken()}`,
});

// Función para formatear fecha en español
const formatearFecha = (fechaISO: string): string => {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Función para obtener nombre del servicio (últimos 8 caracteres del UUID)
const obtenerNombreServicio = (servicioId: string): string => {
  return `Servicio-${servicioId.slice(-8)}`;
};

// Función para procesar datos de foto para la UI
const procesarFotoParaUI = (foto: RespuestaFoto): FotoData => ({
  id: foto.id,
  servicio_id: foto.servicio_id,
  servicioNombre: obtenerNombreServicio(foto.servicio_id),
  url: foto.url,
  descripcion: foto.descripcion,
  orden: foto.orden,
  es_portada: foto.es_portada,
  fecha_subida: foto.fecha_subida,
  eliminado: foto.eliminado,
  fechaFormateada: formatearFecha(foto.fecha_subida),
});

// Crear nueva foto
export const crearFoto = async (datosFoto: DatosFoto): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/fotos/crear/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(datosFoto),
  });

  if (!response.ok) {
    throw new Error("Error al crear la foto");
  }
};

// Listar fotos con paginación
export const listarFotos = async (
  pagina: number = 0,
  limite: number = 10,
): Promise<ResponseListFotos> => {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/fotos/listar/?pagina=${pagina}&limite=${limite}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error("Error al obtener las fotos");
  }

  return await response.json();
};

// Listar fotos por servicio
export const listarFotosPorServicio = async (
  idServicio: string,
  pagina: number = 0,
  limite: number = 100,
): Promise<ResponseListFotos> => {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/fotos/servicios/${idServicio}?pagina=${pagina}&limite=${limite}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error("Error al obtener las fotos del servicio");
  }

  return await response.json();
};

// Consultar foto específica
export const consultarFoto = async (idFoto: string): Promise<RespuestaFoto> => {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/fotos/consultar/${idFoto}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error("Error al consultar la foto");
  }

  return await response.json();
};

// Actualizar foto
export const actualizarFoto = async (
  idFoto: string,
  datos: ActualizarFoto,
): Promise<RespuestaFoto> => {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/fotos/editar/${idFoto}`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(datos),
    },
  );

  if (!response.ok) {
    throw new Error("Error al actualizar la foto");
  }

  return await response.json();
};

// Eliminar foto
export const eliminarFoto = async (idFoto: string): Promise<void> => {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/fotos/eliminar/${idFoto}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error("Error al eliminar la foto");
  }
};

// Procesar datos para la UI
export const procesarDatosFotos = (
  response: ResponseListFotos,
): {
  fotos: FotoData[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
} => {
  const fotos = response.fotos.map(procesarFotoParaUI);

  return {
    fotos,
    totalItems: response.total,
    totalPages: Math.ceil(response.total / response.size),
    currentPage: response.page,
  };
};

// Calcular estadísticas
export const calcularEstadisticas = (fotos: FotoData[]): FotoStatsData => {
  const totalFotos = fotos.length;
  const fotosActivas = fotos.filter((foto) => !foto.eliminado).length;
  const fotosPortada = fotos.filter(
    (foto) => foto.es_portada && !foto.eliminado,
  ).length;

  // Contar servicios únicos con fotos activas
  const serviciosUnicos = new Set(
    fotos.filter((foto) => !foto.eliminado).map((foto) => foto.servicio_id),
  );
  const serviciosConFotos = serviciosUnicos.size;

  return {
    totalFotos,
    fotosActivas,
    fotosPortada,
    serviciosConFotos,
  };
};

// Generar datos para gráficos
export const generarDatosGraficos = (fotos: FotoData[]): FotoChartData => {
  // Datos para gráfico de estado
  const fotosActivas = fotos.filter((foto) => !foto.eliminado).length;
  const fotosEliminadas = fotos.filter((foto) => foto.eliminado).length;

  const estadoData = [
    {
      name: "Activas",
      value: fotosActivas,
      color: "#10B981",
    },
    {
      name: "Eliminadas",
      value: fotosEliminadas,
      color: "#EF4444",
    },
  ];

  // Datos para gráfico de subidas por mes (últimos 6 meses)
  const ahora = new Date();
  const subidasMesData = [];

  for (let i = 5; i >= 0; i--) {
    const fecha = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
    const mesNombre = fecha.toLocaleDateString("es-ES", {
      month: "short",
      year: "2-digit",
    });

    const fotosDelMes = fotos.filter((foto) => {
      const fechaFoto = new Date(foto.fecha_subida);
      return (
        fechaFoto.getMonth() === fecha.getMonth() &&
        fechaFoto.getFullYear() === fecha.getFullYear() &&
        !foto.eliminado
      );
    }).length;

    subidasMesData.push({
      mes: mesNombre,
      cantidad: fotosDelMes,
    });
  }

  return {
    estadoData,
    subidasMesData,
  };
};

// Exportar fotos a Excel
export const exportarFotosExcel = async (): Promise<void> => {
  try {
    // Obtener todas las fotos (límite alto para exportación completa)
    const response = await listarFotos(0, 1000);

    if (response.fotos.length === 0) {
      throw new Error("No hay fotos para exportar");
    }

    // Procesar datos para Excel
    const datosExcel = response.fotos.map((foto) => ({
      ID: foto.id,
      "Servicio ID": foto.servicio_id,
      Servicio: obtenerNombreServicio(foto.servicio_id),
      URL: foto.url,
      Descripción: foto.descripcion,
      Orden: foto.orden,
      "Es Portada": foto.es_portada ? "Sí" : "No",
      "Fecha Subida": formatearFecha(foto.fecha_subida),
      Estado: foto.eliminado ? "Eliminada" : "Activa",
    }));

    // Crear libro de trabajo
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(datosExcel);

    // Configurar anchos de columna
    const columnWidths = [
      { wch: 10 }, // ID
      { wch: 15 }, // Servicio ID
      { wch: 15 }, // Servicio
      { wch: 30 }, // URL
      { wch: 25 }, // Descripción
      { wch: 8 }, // Orden
      { wch: 12 }, // Es Portada
      { wch: 20 }, // Fecha Subida
      { wch: 10 }, // Estado
    ];
    worksheet["!cols"] = columnWidths;

    // Agregar hoja al libro
    XLSX.utils.book_append_sheet(workbook, worksheet, "Fotos");

    // Descargar archivo
    const fechaActual = new Date().toISOString().split("T")[0];
    XLSX.writeFile(workbook, `fotos_${fechaActual}.xlsx`);
  } catch (error) {
    throw new Error("Error al exportar fotos a Excel");
  }
};

// Validar URL de imagen
export const validarURLImagen = (url: string): boolean => {
  const patronURL = /^https?:\/\/.+\.(jpg|jpeg|png|gif|bmp|webp)$/i;
  return patronURL.test(url);
};

// Validar UUID
export const validarUUID = (uuid: string): boolean => {
  const patronUUID =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return patronUUID.test(uuid);
};
