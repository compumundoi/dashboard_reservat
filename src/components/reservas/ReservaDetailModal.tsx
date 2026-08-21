import React from 'react';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { EstadoReserva, ReservaData } from '../../types/reserva';
import { formatearFecha, formatearFechaHora, formatearTotal, detalleDelTotal } from './formato';

interface ReservaDetailModalProps {
  isOpen: boolean;
  reserva: ReservaData | null;
  onClose: () => void;
}

const VARIANTE_ESTADO: Record<EstadoReserva, 'warning' | 'success' | 'error'> = {
  pendiente: 'warning',
  aprobada: 'success',
  rechazada: 'error',
};

const Campo: React.FC<{ etiqueta: string; children: React.ReactNode }> = ({
  etiqueta,
  children,
}) => (
  <div>
    <p className="text-xs uppercase tracking-wider text-secondary-400 font-semibold">
      {etiqueta}
    </p>
    <div className="text-sm text-secondary-800 mt-0.5 break-words">{children}</div>
  </div>
);

const ReservaDetailModal: React.FC<ReservaDetailModalProps> = ({
  isOpen,
  reserva,
  onClose,
}) => {
  if (!reserva) return null;

  const total = formatearTotal(reserva);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={reserva.nombre_servicio}
      description={`${reserva.tipo_servicio} · ${reserva.ciudad}`}
      size="xl"
    >
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Badge variant={VARIANTE_ESTADO[reserva.estado]}>{reserva.estado}</Badge>
          <span className="text-xs text-secondary-400">
            Reserva {reserva.id.slice(0, 8)}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Campo etiqueta="Fecha de inicio">{formatearFecha(reserva.fecha_inicio)}</Campo>
          <Campo etiqueta="Fecha de fin">{formatearFecha(reserva.fecha_fin)}</Campo>
          <Campo etiqueta="Cantidad">{reserva.cantidad}</Campo>
          {reserva.hora && <Campo etiqueta="Hora">{reserva.hora}</Campo>}
          <Campo etiqueta="Total">
            {total}
            <div className="text-xs text-secondary-500">
              {detalleDelTotal(reserva)}
            </div>
          </Campo>
          <Campo etiqueta="Solicitada el">{formatearFecha(reserva.fecha_creacion)}</Campo>
          {/* El identificador sólo aparece si el nombre no se pudo resolver:
              a un administrador un UUID no le dice nada. */}
          <Campo etiqueta="Mayorista">
            {reserva.nombre_mayorista || reserva.id_mayorista || '—'}
          </Campo>
          <Campo etiqueta="Proveedor">
            {reserva.nombre_proveedor || reserva.id_proveedor || '—'}
          </Campo>
        </div>

        {reserva.descripcion && (
          <Campo etiqueta="Descripción">{reserva.descripcion}</Campo>
        )}

        {reserva.observaciones && (
          <Campo etiqueta="Observaciones">{reserva.observaciones}</Campo>
        )}

        {/* El cobro sólo existe si la reserva llegó a aprobarse. */}
        {reserva.estado_pago !== 'no_aplica' && (
          <div className="border-t border-secondary-100 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Campo etiqueta="Estado del pago">
              <Badge
                variant={reserva.estado_pago === 'aprobado' ? 'success' : 'info'}
              >
                {reserva.estado_pago}
              </Badge>
            </Campo>
            {reserva.fecha_pago && (
              <Campo etiqueta="Pagada el">
                {formatearFechaHora(reserva.fecha_pago)}
              </Campo>
            )}
            {reserva.pago_metodo && (
              <Campo etiqueta="Medio de pago">{reserva.pago_metodo}</Campo>
            )}
          </div>
        )}

        {/* La decisión sólo existe una vez que un administrador la tomó. */}
        {reserva.estado !== 'pendiente' && (
          <div className="border-t border-secondary-100 pt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Campo etiqueta="Decidida el">
                {formatearFechaHora(reserva.fecha_decision)}
              </Campo>
              <Campo etiqueta="Decidida por">
                {reserva.id_admin_decision || 'No registrado'}
              </Campo>
            </div>

            {reserva.estado === 'rechazada' && (
              <Campo etiqueta="Motivo del rechazo">
                {reserva.motivo_rechazo || '—'}
              </Campo>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ReservaDetailModal;
