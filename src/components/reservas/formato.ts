// Formateo compartido por la tabla y el detalle de reservas.

/**
 * Formatea una fecha del backend en formato local.
 *
 * El backend devuelve las fechas de la reserva como "YYYY-MM-DD" sin hora, y
 * el navegador las interpreta como medianoche UTC: al mostrarlas en una zona
 * al oeste de Greenwich (Colombia es UTC-5) la fecha se corre un día hacia
 * atrás. Por eso una fecha sin hora se construye con sus componentes, que
 * `Date` toma como hora local.
 */
export const formatearFecha = (fecha: string | null): string => {
  if (!fecha) return '—';

  const soloFecha = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fecha);
  const valor = soloFecha
    ? new Date(Number(soloFecha[1]), Number(soloFecha[2]) - 1, Number(soloFecha[3]))
    : new Date(fecha);

  return isNaN(valor.getTime()) ? fecha : valor.toLocaleDateString('es-CO');
};

/** Formatea un instante con hora. `fecha_decision` sí viene con zona horaria. */
export const formatearFechaHora = (fecha: string | null): string => {
  if (!fecha) return '—';
  const valor = new Date(fecha);
  return isNaN(valor.getTime()) ? fecha : valor.toLocaleString('es-CO');
};

// Tipos que se cobran por noche; el resto se cobra por persona.
const TIPOS_POR_RANGO = ['alojamiento', 'hoteles', 'hotel'];

export const esPorRango = (tipoServicio: string | null): boolean =>
  TIPOS_POR_RANGO.includes(String(tipoServicio || '').toLowerCase());

/** Noches entre dos fechas "YYYY-MM-DD", comparadas como fechas locales. */
export const calcularNoches = (
  inicio: string | null,
  fin: string | null,
): number => {
  if (!inicio || !fin) return 1;

  const aFecha = (valor: string) => {
    const partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(valor);
    return partes
      ? new Date(Number(partes[1]), Number(partes[2]) - 1, Number(partes[3]))
      : new Date(valor);
  };

  const desde = aFecha(inicio);
  const hasta = aFecha(fin);
  if (isNaN(desde.getTime()) || isNaN(hasta.getTime())) return 1;

  const noches = Math.round((hasta.getTime() - desde.getTime()) / 86400000);
  return noches > 0 ? noches : 1;
};

/**
 * Total de la reserva.
 *
 * El alojamiento se cobra por noche (las personas sólo validan capacidad) y
 * el resto por persona. Es la misma regla que aplica la landing al crear la
 * solicitud: si difieren, el administrador aprueba un monto distinto del que
 * vio el mayorista.
 */
export const formatearTotal = (reserva: {
  precio: string;
  cantidad: number;
  tipo_servicio: string | null;
  fecha_inicio: string | null;
  fecha_fin: string | null;
}): string => {
  const unitario = Number(reserva.precio);
  if (isNaN(unitario)) return reserva.precio || '—';

  const multiplicador = esPorRango(reserva.tipo_servicio)
    ? calcularNoches(reserva.fecha_inicio, reserva.fecha_fin)
    : reserva.cantidad;

  return (unitario * multiplicador).toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  });
};

/** Detalle legible de cómo se compone el total. */
export const detalleDelTotal = (reserva: {
  precio: string;
  cantidad: number;
  tipo_servicio: string | null;
  fecha_inicio: string | null;
  fecha_fin: string | null;
}): string => {
  const unitario = Number(reserva.precio);
  if (isNaN(unitario)) return '';

  const formateado = `$${unitario.toLocaleString('es-CO')}`;

  if (esPorRango(reserva.tipo_servicio)) {
    const noches = calcularNoches(reserva.fecha_inicio, reserva.fecha_fin);
    return `${formateado} × ${noches} ${noches === 1 ? 'noche' : 'noches'}`;
  }

  return `${formateado} × ${reserva.cantidad} ${
    reserva.cantidad === 1 ? 'persona' : 'personas'
  }`;
};
