import React from 'react';
import { Building, MapPin, Calendar, Star, FileText, Info } from 'lucide-react';
import { ServicioDetailModalProps } from '../../types/servicio';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

const ServicioDetailModal: React.FC<ServicioDetailModalProps> = ({ isOpen, onClose, servicio }) => {
  if (!servicio) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalles del Servicio"
      description="Información completa sobre el servicio registrado"
      size="lg"
    >
      <div className="space-y-8">
        {/* Header Information */}
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between bg-secondary-50 p-6 rounded-2xl border border-secondary-100">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-primary-200">
              {servicio.nombre.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-secondary-900">{servicio.nombre}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="rounded-md capitalize">
                  {servicio.tipo_servicio}
                </Badge>
                <Badge
                  variant={servicio.activo ? 'success' : 'secondary'}
                  className="rounded-full"
                >
                  {servicio.activo ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-secondary-500 mb-1 font-medium uppercase tracking-wider text-[10px]">Precio Actual</p>
            <p className="text-3xl font-bold text-primary-600 tracking-tight">{servicio.precioFormateado}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-secondary-900 uppercase tracking-wider">
                <Info className="h-4 w-4 text-primary-500" />
                Información General
              </h3>

              <div className="grid gap-4">
                <div className="p-4 rounded-xl border border-secondary-100 bg-white shadow-sm space-y-1">
                  <p className="text-xs font-medium text-secondary-400 uppercase tracking-tighter">Proveedor</p>
                  <div className="flex items-center gap-2 text-secondary-900">
                    <Building className="h-4 w-4 text-secondary-400" />
                    <span className="font-semibold">{servicio.proveedorNombre}</span>
                  </div>
                  <p className="text-[10px] text-secondary-400 font-mono pl-6">{servicio.proveedor_id}</p>
                </div>

                <div className="p-4 rounded-xl border border-secondary-100 bg-white shadow-sm space-y-1">
                  <p className="text-xs font-medium text-secondary-400 uppercase tracking-tighter">Relevancia</p>
                  <div className="flex items-center gap-2 pt-1">
                    <Star className="h-4 w-4 text-warning-400 fill-warning-400" />
                    <Badge
                      variant={
                        servicio.relevancia === 'Alta' ? 'error' :
                          servicio.relevancia === 'Media' ? 'warning' :
                            'success'
                      }
                    >
                      {servicio.relevancia}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-secondary-900 uppercase tracking-wider">
                <MapPin className="h-4 w-4 text-primary-500" />
                Ubicación
              </h3>
              <div className="p-4 rounded-xl border border-secondary-100 bg-white shadow-sm space-y-3">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-secondary-400 mt-1 shrink-0" />
                  <div>
                    <p className="font-medium text-secondary-900">{servicio.ciudad}, {servicio.departamento}</p>
                    <p className="text-sm text-secondary-500 mt-1">{servicio.ubicacion}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-secondary-900 uppercase tracking-wider">
                <FileText className="h-4 w-4 text-primary-500" />
                Descripción y Detalles
              </h3>
              <div className="p-4 rounded-xl border border-secondary-100 bg-white shadow-sm space-y-4">
                <div>
                  <p className="text-xs font-medium text-secondary-400 uppercase tracking-tighter mb-2">Resumen</p>
                  <p className="text-sm text-secondary-700 leading-relaxed italic border-l-2 border-secondary-100 pl-3">
                    "{servicio.descripcion}"
                  </p>
                </div>
                {servicio.detalles_del_servicio && (
                  <div>
                    <p className="text-xs font-medium text-secondary-400 uppercase tracking-tighter mb-2">Detalles Adicionales</p>
                    <p className="text-sm text-secondary-700 leading-relaxed">
                      {servicio.detalles_del_servicio}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-secondary-900 uppercase tracking-wider">
                <Calendar className="h-4 w-4 text-primary-500" />
                Historial
              </h3>
              <div className="p-4 rounded-xl border border-secondary-100 bg-white shadow-sm divide-y divide-secondary-50">
                <div className="py-2 flex justify-between items-center text-sm">
                  <span className="text-secondary-500">Fecha de Creación</span>
                  <span className="font-medium text-secondary-900">{servicio.fechaCreacionFormateada}</span>
                </div>
                <div className="py-2 flex justify-between items-center text-sm">
                  <span className="text-secondary-500">Última Actualización</span>
                  <span className="font-medium text-secondary-900">{servicio.fechaActualizacionFormateada}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-secondary-100 flex justify-end">
          <Button onClick={onClose} variant="secondary" className="px-8">
            Cerrar Detalle
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ServicioDetailModal;
