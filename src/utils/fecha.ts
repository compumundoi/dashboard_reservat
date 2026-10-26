// Formatea una fecha para un <input type="datetime-local">, que trabaja en
// hora local. toISOString() da la hora UTC y el input la toma como local:
// en Colombia eso corre la fecha 5 horas hacia adelante.
export const aFechaLocalInput = (fecha: Date = new Date()): string => {
  const desfase = fecha.getTimezoneOffset() * 60_000;
  return new Date(fecha.getTime() - desfase).toISOString().slice(0, 16);
};
