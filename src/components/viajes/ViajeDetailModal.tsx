import React from 'react';
import { Calendar, MapPin, Users, DollarSign, User, Clock, CheckCircle, XCircle, Route, Truck, Info, Hash } from 'lucide-react';
import { ViajeDetailModalProps, ESTADOS_VIAJE } from '../../types/viaje';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

const ViajeDetailModal: React.FC<ViajeDetailModalProps> = ({ isOpen, onClose, viaje }) => {
  if (!viaje) return null;

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'No especificada';
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number | undefined) => {
    if (price === undefined) return '$0';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getEstadoBadge = (estado: string | undefined) => {
    if (!estado) return <Badge variant="secondary">Sin estado</Badge>;

    switch (estado) {
      case ESTADOS_VIAJE.PROGRAMADO:
        return <Badge variant="info">Programado</Badge>;
      case ESTADOS_VIAJE.EN_CURSO:
        return <Badge variant="warning">En Curso</Badge>;
      case ESTADOS_VIAJE.FINALIZADO:
        return <Badge variant="success">Finalizado</Badge>;
      case ESTADOS_VIAJE.CANCELADO:
        return <Badge variant="error">Cancelado</Badge>;
      default:
        return <Badge variant="secondary">{estado}</Badge>;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalles del Viaje"
      description={`Información detallada del viaje ${viaje.id.slice(0, 8)}...`}
      size="2xl"
    >
      <div className="space-y-6">
        {/* Información General */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
              <Calendar className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Programación</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Fecha de Inicio</p>
              <div className="flex items-center gap-2 text-gray-900">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>{formatDate(viaje.fecha_inicio)}</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Fecha de Fin</p>
              <div className="flex items-center gap-2 text-gray-900">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>{formatDate(viaje.fecha_fin)}</span>
              </div>
            </div>
            {viaje.duracion_dias !== undefined && (
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Duración</p>
                <div className="flex items-center gap-2 text-gray-900">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>{viaje.duracion_dias} días</span>
                </div>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Estado</p>
              <div className="flex items-center gap-2">
                {getEstadoBadge(viaje.estado)}
                {viaje.activo ? (
                  <Badge variant="success" className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> Activo
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <XCircle className="h-3 w-3" /> Inactivo
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Capacidad y Precio */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <div className="p-1.5 bg-green-100 text-green-700 rounded-lg">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Capacidad y Finanzas</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p className="text-xs font-medium text-gray-500 mb-1">Capacidad Total</p>
              <p className="text-xl font-bold text-gray-900">{viaje.capacidad_total || 0}</p>
              <p className="text-xs text-gray-500">Pasajeros</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p className="text-xs font-medium text-gray-500 mb-1">Disponible</p>
              <p className="text-xl font-bold text-green-600">{viaje.capacidad_disponible || 0}</p>
              <p className="text-xs text-gray-500">Lugares libres</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p className="text-xs font-medium text-gray-500 mb-1">Precio por Pasajero</p>
              <p className="text-xl font-bold text-blue-600">{formatPrice(viaje.precio)}</p>
              <p className="text-xs text-gray-500">COP</p>
            </div>
          </div>
        </div>

        {/* Asignaciones */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <div className="p-1.5 bg-purple-100 text-purple-700 rounded-lg">
              <User className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Recursos Asignados</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Guía</p>
              <div className="flex items-center gap-2 text-gray-900 bg-gray-50 p-2 rounded-md border border-gray-200">
                <User className="h-4 w-4 text-purple-500" />
                <span>{viaje.guia_asignado || 'No asignado'}</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Transportador</p>
              <div className="flex items-center gap-2 text-gray-900 bg-gray-50 p-2 rounded-md border border-gray-200">
                <Truck className="h-4 w-4 text-orange-500" />
                <span>{viaje.transportador_nombre || viaje.id_transportador || 'No especificado'}</span>
              </div>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-gray-500 mb-1">Ruta</p>
              <div className="flex items-center gap-2 text-gray-900 bg-gray-50 p-2 rounded-md border border-gray-200">
                <Route className="h-4 w-4 text-blue-500" />
                <span>{viaje.ruta_nombre || viaje.ruta_id || 'No especificada'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Técnica */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <div className="p-1.5 bg-gray-100 text-gray-700 rounded-lg">
              <Info className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Metadatos</h3>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <span className="text-sm text-gray-500 flex items-center gap-2">
                <Hash className="h-3 w-3" /> ID Viaje
              </span>
              <span className="text-xs font-mono text-gray-400">{viaje.id}</span>
            </div>
            {viaje.ruta_id && (
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-sm text-gray-500 flex items-center gap-2">
                  <Hash className="h-3 w-3" /> ID Ruta
                </span>
                <span className="text-xs font-mono text-gray-400">{viaje.ruta_id}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ViajeDetailModal;
