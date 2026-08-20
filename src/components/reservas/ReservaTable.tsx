import React from 'react';
import { Eye, Check, X, CalendarRange, Users } from 'lucide-react';
import { EstadoReserva, ESTADOS_RESERVA, ReservaData, ReservaTableProps } from '../../types/reserva';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Select } from '../ui/Select';
import { formatearFecha, formatearTotal, detalleDelTotal } from './formato';

const VARIANTE_ESTADO: Record<EstadoReserva, 'warning' | 'success' | 'error'> = {
  pendiente: 'warning',
  aprobada: 'success',
  rechazada: 'error',
};

const ReservaTable: React.FC<ReservaTableProps> = ({
  reservas,
  loading,
  currentPage,
  pageSize,
  totalPages,
  totalItems,
  estadoFiltro,
  onPageChange,
  onPageSizeChange,
  onEstadoChange,
  onView,
  onAprobar,
  onRechazar,
  decidiendoId,
}) => {
  const desde = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const hasta = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="w-56">
          <Select
            label="Estado"
            value={estadoFiltro}
            onChange={(e) => onEstadoChange(e.target.value as EstadoReserva | '')}
            options={[
              { value: '', label: 'Todos los estados' },
              ...ESTADOS_RESERVA.map((estado) => ({
                value: estado,
                label: estado.charAt(0).toUpperCase() + estado.slice(1),
              })),
            ]}
          />
        </div>
        <div className="w-40">
          <Select
            label="Por página"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            options={[5, 10, 25, 50].map((n) => ({ value: n, label: String(n) }))}
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Servicio</TableHead>
            <TableHead>Fechas</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading && (
            <TableRow>
              <TableCell colSpan={6} className="py-10 text-center text-secondary-400">
                Cargando reservas...
              </TableCell>
            </TableRow>
          )}

          {!loading && reservas.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="py-10 text-center text-secondary-400">
                {estadoFiltro
                  ? `No hay reservas en estado "${estadoFiltro}".`
                  : 'Todavía no hay reservas registradas.'}
              </TableCell>
            </TableRow>
          )}

          {!loading && reservas.map((reserva: ReservaData) => {
            const esPendiente = reserva.estado === 'pendiente';
            const decidiendo = decidiendoId === reserva.id;

            return (
              <TableRow key={reserva.id}>
                <TableCell>
                  <div className="font-medium text-secondary-900">{reserva.nombre_servicio}</div>
                  <div className="text-xs text-secondary-500">
                    {reserva.tipo_servicio} · {reserva.ciudad}
                  </div>
                  {(reserva.nombre_mayorista || reserva.nombre_proveedor) && (
                    <div className="text-xs text-secondary-400 mt-0.5">
                      {reserva.nombre_mayorista && (
                        <>Solicita: {reserva.nombre_mayorista}</>
                      )}
                      {reserva.nombre_mayorista && reserva.nombre_proveedor && ' · '}
                      {reserva.nombre_proveedor}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-sm">
                    <CalendarRange size={15} className="text-secondary-400" />
                    {formatearFecha(reserva.fecha_inicio)} → {formatearFecha(reserva.fecha_fin)}
                  </div>
                  {reserva.hora && (
                    <div className="text-xs text-secondary-500 mt-0.5">
                      Hora: {reserva.hora}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <Users size={15} className="text-secondary-400" />
                    {reserva.cantidad}
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  {formatearTotal(reserva)}
                  <div className="text-xs font-normal text-secondary-500">
                    {detalleDelTotal(reserva)}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={VARIANTE_ESTADO[reserva.estado]}>
                    {reserva.estado}
                  </Badge>
                  {reserva.estado === 'rechazada' && reserva.motivo_rechazo && (
                    <div
                      className="text-xs text-secondary-500 mt-1 max-w-[16rem] truncate"
                      title={reserva.motivo_rechazo}
                    >
                      {reserva.motivo_rechazo}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(reserva)}
                      title="Ver detalle"
                    >
                      <Eye size={16} />
                    </Button>

                    {/* Sólo una reserva pendiente admite decisión: para el
                        resto no se ofrece una acción que el backend rechaza. */}
                    {esPendiente && (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          isLoading={decidiendo}
                          disabled={decidiendo}
                          onClick={() => onAprobar(reserva)}
                          leftIcon={<Check size={15} />}
                        >
                          Aprobar
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          disabled={decidiendo}
                          onClick={() => onRechazar(reserva)}
                          leftIcon={<X size={15} />}
                        >
                          Rechazar
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Paginación */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-secondary-500">
          Mostrando {desde}–{hasta} de {totalItems}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            disabled={currentPage <= 1 || loading}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Anterior
          </Button>
          <span className="text-sm text-secondary-600">
            {currentPage} / {Math.max(totalPages, 1)}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={currentPage >= totalPages || loading}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReservaTable;
