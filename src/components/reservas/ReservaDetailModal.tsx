import React from 'react';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { EstadoReserva, ReservaData } from '../../types/reserva';

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

const formatearFecha = (fecha: string | null): string => {
  if (!fecha) return '—';
  const valor = new Date(fecha);
  return isNaN(valor.getTime()) ? fecha : valor.toLocaleDateString('es-CO');
};

const formatearFechaHora = (fecha: string | null): string => {
  if (!fecha) return '—';
  const valor = new Date(fecha);
  return isNaN(valor.getTime()) ? fecha : valor.toLocaleString('es-CO');
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

  const unitario = Number(reserva.precio);
  const total = isNaN(unitario)
    ? reserva.precio
    : (unitario * reserva.cantidad).toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0,
      });

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
          <span className="text-xs text-secondary-400">ID {reserva.id}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Campo etiqueta="Fecha de inicio">{formatearFecha(reserva.fecha_inicio)}</Campo>
          <Campo etiqueta="Fecha de fin">{formatearFecha(reserva.fecha_fin)}</Campo>
          <Campo etiqueta="Cantidad">{reserva.cantidad}</Campo>
          <Campo etiqueta="Total">{total}</Campo>
          <Campo etiqueta="Solicitada el">{formatearFecha(reserva.fecha_creacion)}</Campo>
          <Campo etiqueta="Mayorista">{reserva.id_mayorista || '—'}</Campo>
          <Campo etiqueta="Proveedor">{reserva.id_proveedor || '—'}</Campo>
          <Campo etiqueta="Servicio">{reserva.id_servicio || '—'}</Campo>
        </div>

        {reserva.descripcion && (
          <Campo etiqueta="Descripción">{reserva.descripcion}</Campo>
        )}

        {reserva.observaciones && (
          <Campo etiqueta="Observaciones">{reserva.observaciones}</Campo>
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
