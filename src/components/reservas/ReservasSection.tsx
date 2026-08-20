import React, { useCallback, useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import { EstadoReserva, ReservaData } from '../../types/reserva';
import { reservaService } from '../../services/reservaService';
import ReservaTable from './ReservaTable';
import ReservaDetailModal from './ReservaDetailModal';
import RechazarReservaModal from './RechazarReservaModal';

interface ReservasSectionProps {
  /** Id del administrador que toma la decisión, para dejar trazabilidad. */
  adminId?: string;
}

const ReservasSection: React.FC<ReservasSectionProps> = ({ adminId }) => {
  const [reservas, setReservas] = useState<ReservaData[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  // Se arranca en pendientes: es la bandeja de trabajo del administrador.
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoReserva | ''>('pendiente');

  const [detalle, setDetalle] = useState<ReservaData | null>(null);
  const [reservaARechazar, setReservaARechazar] = useState<ReservaData | null>(null);
  const [decidiendoId, setDecidiendoId] = useState<string | null>(null);

  // Sólo la última petición pedida puede pintar la tabla.
  const ultimaPeticion = useRef(0);

  const loadReservas = useCallback(async () => {
    const peticion = ++ultimaPeticion.current;
    try {
      setLoading(true);
      const response = await reservaService.getReservas(
        currentPage,
        pageSize,
        estadoFiltro,
      );
      if (peticion !== ultimaPeticion.current) return;

      setReservas(response.reservas);
      setTotalItems(response.total);
      setTotalPages(Math.ceil(response.total / pageSize));
    } catch (error) {
      if (peticion !== ultimaPeticion.current) return;
      console.error('Error al cargar reservas:', error);
      Swal.fire({
        title: 'Error',
        text: error instanceof Error ? error.message : 'Error al cargar las reservas',
        icon: 'error',
        confirmButtonText: 'Entendido',
      });
    } finally {
      if (peticion === ultimaPeticion.current) setLoading(false);
    }
  }, [currentPage, pageSize, estadoFiltro]);

  useEffect(() => {
    loadReservas();
  }, [loadReservas]);

  // Otro filtro o tamaño, otro conjunto de resultados: vuelve a la primera página.
  const handleEstadoChange = (estado: EstadoReserva | '') => {
    setEstadoFiltro(estado);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleAprobar = async (reserva: ReservaData) => {
    const confirmacion = await Swal.fire({
      title: '¿Aprobar la reserva?',
      html:
        `<b>${reserva.nombre_servicio}</b><br/>` +
        'La decisión es definitiva: la reserva no vuelve a estado pendiente.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, aprobar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#6b7280',
    });

    if (!confirmacion.isConfirmed) return;

    try {
      setDecidiendoId(reserva.id);
      await reservaService.aprobar(reserva.id, adminId);
      await loadReservas();
      Swal.fire({
        title: 'Reserva aprobada',
        text: 'La reserva quedó aprobada.',
        icon: 'success',
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (error) {
      // Un 409 significa que otro administrador ya decidió: se recarga para
      // que la tabla deje de mostrar un estado que ya no es real.
      await loadReservas();
      Swal.fire({
        title: 'No se pudo aprobar',
        text: error instanceof Error ? error.message : 'Intenta nuevamente.',
        icon: 'error',
        confirmButtonText: 'Entendido',
      });
    } finally {
      setDecidiendoId(null);
    }
  };

  const handleRechazar = async (motivo: string) => {
    if (!reservaARechazar) return;

    try {
      setDecidiendoId(reservaARechazar.id);
      await reservaService.rechazar(reservaARechazar.id, motivo, adminId);
      setReservaARechazar(null);
      await loadReservas();
      Swal.fire({
        title: 'Reserva rechazada',
        text: 'Se registró el motivo del rechazo.',
        icon: 'success',
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (error) {
      await loadReservas();
      Swal.fire({
        title: 'No se pudo rechazar',
        text: error instanceof Error ? error.message : 'Intenta nuevamente.',
        icon: 'error',
        confirmButtonText: 'Entendido',
      });
    } finally {
      setDecidiendoId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="text-lg font-display font-bold text-secondary-900">
          Solicitudes de reserva
        </h3>
        <p className="text-sm text-secondary-500">
          Las reservas llegan pendientes desde la landing. Al aprobarlas o
          rechazarlas se notifica al mayorista y al proveedor.
        </p>
      </div>

      <ReservaTable
        reservas={reservas}
        loading={loading}
        currentPage={currentPage}
        pageSize={pageSize}
        totalPages={totalPages}
        totalItems={totalItems}
        estadoFiltro={estadoFiltro}
        onPageChange={setCurrentPage}
        onPageSizeChange={handlePageSizeChange}
        onEstadoChange={handleEstadoChange}
        onView={setDetalle}
        onAprobar={handleAprobar}
        onRechazar={setReservaARechazar}
        decidiendoId={decidiendoId}
      />

      <ReservaDetailModal
        isOpen={detalle !== null}
        reserva={detalle}
        onClose={() => setDetalle(null)}
      />

      <RechazarReservaModal
        isOpen={reservaARechazar !== null}
        reserva={reservaARechazar}
        isSubmitting={decidiendoId === reservaARechazar?.id}
        onClose={() => setReservaARechazar(null)}
        onConfirm={handleRechazar}
      />
    </div>
  );
};

export default ReservasSection;
