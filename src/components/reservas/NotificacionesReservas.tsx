import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Bell, ClipboardList } from 'lucide-react';
import { ReservaData } from '../../types/reserva';
import { reservaService } from '../../services/reservaService';
import { formatearFecha, formatearTotal } from './formato';
import { cn } from '../../lib/utils';

interface NotificacionesReservasProps {
  /** Lleva al módulo de reservas cuando el administrador abre una. */
  onIrAReservas: () => void;
}

// Las reservas pendientes son trabajo esperando, no un evento en vivo: un
// refresco por minuto alcanza y no castiga al backend.
const INTERVALO_REFRESCO_MS = 60_000;
const MAXIMO_EN_LISTA = 5;

const NotificacionesReservas: React.FC<NotificacionesReservasProps> = ({
  onIrAReservas,
}) => {
  const [pendientes, setPendientes] = useState<ReservaData[]>([]);
  const [total, setTotal] = useState(0);
  const [abierto, setAbierto] = useState(false);
  const contenedor = useRef<HTMLDivElement>(null);

  const cargar = useCallback(async () => {
    try {
      const respuesta = await reservaService.getReservas(
        1,
        MAXIMO_EN_LISTA,
        'pendiente',
      );
      setPendientes(respuesta.reservas);
      setTotal(respuesta.total);
    } catch (error) {
      // Un fallo acá no puede romper el encabezado: se reintenta al
      // siguiente refresco y mientras tanto no se muestra nada.
      console.error('Error al cargar notificaciones de reservas:', error);
    }
  }, []);

  useEffect(() => {
    cargar();
    const intervalo = setInterval(cargar, INTERVALO_REFRESCO_MS);
    return () => clearInterval(intervalo);
  }, [cargar]);

  // Al abrir se pide el dato fresco: puede haber cambiado desde el último
  // refresco, o el propio administrador acaba de decidir una.
  useEffect(() => {
    if (abierto) cargar();
  }, [abierto, cargar]);

  // Un clic fuera cierra el panel, como cualquier menú del encabezado.
  useEffect(() => {
    if (!abierto) return;

    const alHacerClic = (evento: MouseEvent) => {
      if (!contenedor.current?.contains(evento.target as Node)) {
        setAbierto(false);
      }
    };

    document.addEventListener('mousedown', alHacerClic);
    return () => document.removeEventListener('mousedown', alHacerClic);
  }, [abierto]);

  const irAReservas = () => {
    setAbierto(false);
    onIrAReservas();
  };

  return (
    <div className="relative" ref={contenedor}>
      <button
        onClick={() => setAbierto(!abierto)}
        className={cn(
          'relative p-2.5 rounded-xl transition-all duration-200 group',
          abierto
            ? 'text-primary-600 bg-primary-50'
            : 'text-secondary-400 hover:text-primary-600 hover:bg-primary-50',
        )}
        title={
          total > 0
            ? `${total} reserva(s) pendiente(s)`
            : 'No hay reservas pendientes'
        }
      >
        <Bell className="w-5 h-5" />
        {/* El indicador aparece sólo si hay algo que atender. */}
        {total > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[1.15rem] h-[1.15rem] px-1 bg-error-500 text-white text-[0.65rem] font-bold rounded-full border-2 border-white flex items-center justify-center">
            {total > 9 ? '9+' : total}
          </span>
        )}
      </button>

      {abierto && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl border border-secondary-200 shadow-soft-lg z-50 overflow-hidden animate-fade-in">
          <div className="px-4 py-3 border-b border-secondary-100 bg-secondary-50/50">
            <p className="text-sm font-semibold text-secondary-900">
              Reservas pendientes
            </p>
            <p className="text-xs text-secondary-500">
              {total === 0
                ? 'No hay nada esperando aprobación'
                : `${total} esperando tu aprobación`}
            </p>
          </div>

          {pendientes.length > 0 && (
            <ul className="max-h-80 overflow-y-auto divide-y divide-secondary-100">
              {pendientes.map((reserva) => (
                <li key={reserva.id}>
                  <button
                    onClick={irAReservas}
                    className="w-full text-left px-4 py-3 hover:bg-secondary-50 transition-colors"
                  >
                    <p className="text-sm font-medium text-secondary-900 truncate">
                      {reserva.nombre_servicio}
                    </p>
                    <p className="text-xs text-secondary-500 truncate">
                      {reserva.nombre_mayorista || 'Mayorista'} ·{' '}
                      {formatearFecha(reserva.fecha_inicio)}
                    </p>
                    <p className="text-xs font-medium text-primary-600 mt-0.5">
                      {formatearTotal(reserva)}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <button
            onClick={irAReservas}
            className="w-full px-4 py-3 text-sm font-medium text-primary-600 hover:bg-primary-50 transition-colors flex items-center justify-center gap-2 border-t border-secondary-100"
          >
            <ClipboardList size={16} />
            Ver todas las reservas
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificacionesReservas;
