import {
  DatosServicio,
  RespuestaServicio,
  ActualizarServicio,
  ResponseListServicios,
  ServicioData,
  ServicioStatsData,
  ServicioChartData,
} from "../types/servicio";
import * as XLSX from "xlsx";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8016/api/v1";

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

// Función para formatear precio
const formatearPrecio = (precio: number, moneda: string): string => {
  return `${precio.toLocaleString("es-ES")} ${moneda}`;
};

// Función para obtener nombre del proveedor (últimos 8 caracteres del UUID)
const obtenerNombreProveedor = (proveedorId: string): string => {
  return `Proveedor-${proveedorId.slice(-8)}`;
};

// Función para procesar datos de servicio para la UI
const procesarServicioParaUI = (servicio: RespuestaServicio): ServicioData => ({
  id_servicio: servicio.id_servicio,
  proveedor_id: servicio.proveedor_id,
  proveedorNombre: obtenerNombreProveedor(servicio.proveedor_id),
  nombre: servicio.nombre,
  descripcion: servicio.descripcion,
  tipo_servicio: servicio.tipo_servicio,
  precio: servicio.precio,
  moneda: servicio.moneda,
  precioFormateado: formatearPrecio(servicio.precio, servicio.moneda),
  activo: servicio.activo,
  fecha_creacion: servicio.fecha_creacion,
  fecha_actualizacion: servicio.fecha_actualizacion,
  fechaCreacionFormateada: formatearFecha(servicio.fecha_creacion),
  fechaActualizacionFormateada: formatearFecha(servicio.fecha_actualizacion),
  relevancia: servicio.relevancia,
  ciudad: servicio.ciudad,
  departamento: servicio.departamento,
  ubicacionCompleta: `${servicio.ciudad}, ${servicio.departamento}`,
  ubicacion: servicio.ubicacion,
  detalles_del_servicio: servicio.detalles_del_servicio,
});

// Crear nuevo servicio
export const crearServicio = async (
  datosServicio: DatosServicio,
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/servicios/crear/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(datosServicio),
  });

  if (!response.ok) {
    throw new Error("Error al crear el servicio");
  }
};

// Listar servicios con paginación
export const listarServicios = async (
  pagina: number = 0,
  limite: number = 10,
): Promise<ResponseListServicios> => {
  const response = await fetch(
    `${API_BASE_URL}/servicios/listar/?pagina=${pagina}&limite=${limite}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error("Error al obtener los servicios");
  }

  return await response.json();
};

// Listar servicios por proveedor
export const listarServiciosPorProveedor = async (
  idProveedor: string,
  pagina: number = 0,
  limite: number = 100,
): Promise<ResponseListServicios> => {
  const response = await fetch(
    `${API_BASE_URL}/servicios/proveedor/${idProveedor}?pagina=${pagina}&limite=${limite}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error("Error al obtener los servicios del proveedor");
  }

  return await response.json();
};

// Consultar servicio específico
export const consultarServicio = async (
  idServicio: string,
): Promise<RespuestaServicio> => {
  const response = await fetch(
    `${API_BASE_URL}/servicios/consultar/${idServicio}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error("Error al consultar el servicio");
  }

  return await response.json();
};

// Actualizar servicio
export const actualizarServicio = async (
  idServicio: string,
  datos: ActualizarServicio,
): Promise<RespuestaServicio> => {
  const response = await fetch(
    `${API_BASE_URL}/servicios/editar/${idServicio}`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(datos),
    },
  );

  if (!response.ok) {
    throw new Error("Error al actualizar el servicio");
  }

  return await response.json();
};

// Eliminar servicio
export const eliminarServicio = async (idServicio: string): Promise<void> => {
  const response = await fetch(
    `${API_BASE_URL}/servicios/eliminar/${idServicio}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error("Error al eliminar el servicio");
  }
};

// Procesar datos para la UI
export const procesarDatosServicios = (
  response: ResponseListServicios,
): {
  servicios: ServicioData[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
} => {
  const servicios = response.servicios.map(procesarServicioParaUI);

  return {
    servicios,
    totalItems: response.total,
    totalPages: Math.ceil(response.total / response.size),
    currentPage: response.page,
  };
};

// Calcular estadísticas
export const calcularEstadisticas = (
  servicios: ServicioData[],
): ServicioStatsData => {
  const totalServicios = servicios.length;
  const serviciosActivos = servicios.filter(
    (servicio) => servicio.activo,
  ).length;

  // Contar tipos únicos de servicio
  const tiposUnicos = new Set(
    servicios.map((servicio) => servicio.tipo_servicio),
  );
  const serviciosPorTipo = tiposUnicos.size;

  // Contar proveedores únicos con servicios
  const proveedoresUnicos = new Set(
    servicios.map((servicio) => servicio.proveedor_id),
  );
  const proveedoresConServicios = proveedoresUnicos.size;

  return {
    totalServicios,
    serviciosActivos,
    serviciosPorTipo,
    proveedoresConServicios,
  };
};

// Generar datos para gráficos
export const generarDatosGraficos = (
  servicios: ServicioData[],
): ServicioChartData => {
  // Datos para gráfico de tipos de servicio
  const tiposCounts = servicios.reduce(
    (acc, servicio) => {
      if (servicio.activo) {
        acc[servicio.tipo_servicio] = (acc[servicio.tipo_servicio] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  const coloresTipos = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4",
  ];

  const tipoServicioData = Object.entries(tiposCounts)
    .map(([tipo, cantidad], index) => ({
      name: tipo,
      value: cantidad,
      color: coloresTipos[index % coloresTipos.length],
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6); // Top 6 tipos

  // Datos para gráfico de ciudades (top 6)
  const ciudadesCounts = servicios.reduce(
    (acc, servicio) => {
      if (servicio.activo) {
        acc[servicio.ciudad] = (acc[servicio.ciudad] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  const ciudadData = Object.entries(ciudadesCounts)
    .map(([ciudad, cantidad]) => ({
      ciudad,
      cantidad,
    }))
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 6); // Top 6 ciudades

  return {
    tipoServicioData,
    ciudadData,
  };
};

// Exportar servicios a Excel
export const exportarServiciosExcel = async (): Promise<void> => {
  try {
    // Obtener todos los servicios (límite alto para exportación completa)
    const response = await listarServicios(0, 1000);

    if (response.servicios.length === 0) {
      throw new Error("No hay servicios para exportar");
    }

    // Procesar datos para Excel
    const datosExcel = response.servicios.map((servicio) => ({
      "ID Servicio": servicio.id_servicio,
      "Proveedor ID": servicio.proveedor_id,
      Proveedor: obtenerNombreProveedor(servicio.proveedor_id),
      Nombre: servicio.nombre,
      Descripción: servicio.descripcion,
      "Tipo de Servicio": servicio.tipo_servicio,
      Precio: servicio.precio,
      Moneda: servicio.moneda,
      "Precio Formateado": formatearPrecio(servicio.precio, servicio.moneda),
      Estado: servicio.activo ? "Activo" : "Inactivo",
      Relevancia: servicio.relevancia,
      Ciudad: servicio.ciudad,
      Departamento: servicio.departamento,
      Ubicación: servicio.ubicacion,
      Detalles: servicio.detalles_del_servicio,
      "Fecha Creación": formatearFecha(servicio.fecha_creacion),
      "Fecha Actualización": formatearFecha(servicio.fecha_actualizacion),
    }));

    // Crear libro de trabajo
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(datosExcel);

    // Configurar anchos de columna
    const columnWidths = [
      { wch: 12 }, // ID Servicio
      { wch: 12 }, // Proveedor ID
      { wch: 15 }, // Proveedor
      { wch: 25 }, // Nombre
      { wch: 30 }, // Descripción
      { wch: 15 }, // Tipo de Servicio
      { wch: 10 }, // Precio
      { wch: 8 }, // Moneda
      { wch: 15 }, // Precio Formateado
      { wch: 10 }, // Estado
      { wch: 12 }, // Relevancia
      { wch: 15 }, // Ciudad
      { wch: 15 }, // Departamento
      { wch: 20 }, // Ubicación
      { wch: 30 }, // Detalles
      { wch: 20 }, // Fecha Creación
      { wch: 20 }, // Fecha Actualización
    ];
    worksheet["!cols"] = columnWidths;

    // Agregar hoja al libro
    XLSX.utils.book_append_sheet(workbook, worksheet, "Servicios");

    // Descargar archivo
    const fechaActual = new Date().toISOString().split("T")[0];
    XLSX.writeFile(workbook, `servicios_${fechaActual}.xlsx`);
  } catch (error) {
    throw new Error("Error al exportar servicios a Excel");
  }
};

// Validar UUID
export const validarUUID = (uuid: string): boolean => {
  const patronUUID =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return patronUUID.test(uuid);
};

// Validar precio
export const validarPrecio = (precio: number): boolean => {
  return precio >= 0;
};
