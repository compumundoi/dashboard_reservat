import React from 'react';
import { Shield, Calendar, Activity, FileText } from 'lucide-react';
import { RestriccionModalProps } from '../../types/restriccion';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

const RestriccionDetailModal: React.FC<RestriccionModalProps> = ({ isOpen, onClose, restriccion }) => {
  if (!isOpen || !restriccion) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalle de la Restricción"
      size="lg"
    >
      <div className="space-y-6">

        {/* Status Banner */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${restriccion.bloqueo_activo ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Estado De la Restricción</p>
              <div className="mt-1">
                <Badge variant={restriccion.bloqueo_activo ? 'success' : 'secondary'}>
                  {restriccion.bloqueo_activo ? 'Activa' : 'Inactiva'}
                </Badge>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-500">ID Referencia</p>
            <p className="text-sm font-bold text-gray-900 font-mono mt-1">#{restriccion.id.slice(0, 8)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Service Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Servicio Asociado</h3>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Nombre del Servicio</p>
                  <p className="text-gray-900 font-medium mt-1">{restriccion.servicio_nombre || 'No disponible'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">ID Servicio</p>
                  <p className="text-gray-500 font-mono text-sm mt-1">{restriccion.servicio_id}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Date & Time Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <div className="p-1.5 bg-purple-100 text-purple-700 rounded-lg">
                <Calendar className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Fecha y Tiempo</h3>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Fecha Restringida</p>
                  <p className="text-gray-900 font-medium mt-1 capitalize">{restriccion.fecha_formateada}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Tiempo Restante</p>
                  {restriccion.dias_hasta_fecha !== undefined ? (
                    <div className="mt-1">
                      {restriccion.dias_hasta_fecha > 0 ? (
                        <Badge variant="warning">{restriccion.dias_hasta_fecha} días restantes</Badge>
                      ) : restriccion.dias_hasta_fecha === 0 ? (
                        <Badge variant="error" className="animate-pulse">Hoy</Badge>
                      ) : (
                        <Badge variant="secondary">Fecha pasada</Badge>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm mt-1">No calculado</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Blocking Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <div className="p-1.5 bg-orange-100 text-orange-700 rounded-lg">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Detalles del Bloqueo</h3>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 md:col-span-2">
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Motivo</p>
                <p className="text-gray-700 mt-1 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                  {restriccion.motivo}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Bloqueado Por</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600 font-bold">
                    {restriccion.bloqueado_por.charAt(0)}
                  </div>
                  <span className="text-gray-900 font-medium">{restriccion.bloqueado_por}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100 mt-2">
          <Button onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RestriccionDetailModal;
