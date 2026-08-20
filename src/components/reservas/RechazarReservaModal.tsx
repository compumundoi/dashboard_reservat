import React, { useEffect, useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { ReservaData } from '../../types/reserva';

interface RechazarReservaModalProps {
  isOpen: boolean;
  reserva: ReservaData | null;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: (motivo: string) => void;
}

const MAX_MOTIVO = 1000;

const RechazarReservaModal: React.FC<RechazarReservaModalProps> = ({
  isOpen,
  reserva,
  isSubmitting,
  onClose,
  onConfirm,
}) => {
  const [motivo, setMotivo] = useState('');
  const [error, setError] = useState('');

  // Cada rechazo empieza en blanco: el motivo de una reserva no puede
  // filtrarse a la siguiente.
  useEffect(() => {
    if (isOpen) {
      setMotivo('');
      setError('');
    }
  }, [isOpen, reserva?.id]);

  const handleConfirm = () => {
    const limpio = motivo.trim();
    if (!limpio) {
      setError('El motivo es obligatorio: es el texto que recibe el mayorista.');
      return;
    }
    onConfirm(limpio);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Rechazar reserva"
      description={reserva ? `${reserva.nombre_servicio} · ${reserva.ciudad}` : undefined}
      size="lg"
      // Un Escape accidental no puede descartar el motivo ya escrito.
      dismissible={false}
    >
      <div className="space-y-4">
        <p className="text-sm text-secondary-600">
          El rechazo es definitivo: una vez tomada la decisión, la reserva ya no
          vuelve a estado pendiente.
        </p>

        <Textarea
          label="Motivo del rechazo"
          value={motivo}
          maxLength={MAX_MOTIVO}
          rows={4}
          error={error}
          disabled={isSubmitting}
          placeholder="Ej: no hay disponibilidad para las fechas solicitadas."
          onChange={(e) => {
            setMotivo(e.target.value);
            if (error) setError('');
          }}
        />

        <p className="text-xs text-secondary-400 text-right">
          {motivo.length}/{MAX_MOTIVO}
        </p>

        <div className="flex justify-end gap-2 pt-2 border-t border-secondary-100">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirm}
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            Rechazar reserva
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RechazarReservaModal;
