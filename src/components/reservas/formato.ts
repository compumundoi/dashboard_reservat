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

/** Total de la reserva: el precio unitario del servicio por la cantidad. */
export const formatearTotal = (precio: string, cantidad: number): string => {
  const unitario = Number(precio);
  if (isNaN(unitario)) return precio || '—';

  return (unitario * cantidad).toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  });
};
