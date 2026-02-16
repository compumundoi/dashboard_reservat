/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import {
  Car, Truck, Mail, Phone, MapPin, Globe, Star, Shield,
  Wifi, Users, Calendar, Fuel, Building, Activity, Info,
  CheckCircle2, AlertCircle, Wind
} from 'lucide-react';
import { TransporteModalProps } from '../../types/transporte';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils';

const TransporteDetailModal: React.FC<TransporteModalProps> = ({ isOpen, onClose, transporte }) => {
  if (!isOpen || !transporte) return null;

  const DetailItem = ({ icon: Icon, label, value, colorClass = "text-secondary-500" }: {
    icon: any;
    label: string;
    value: React.ReactNode;
    colorClass?: string;
  }) => (
    <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-secondary-50 transition-colors group">
      <div className={cn("p-2 rounded-lg bg-white border border-secondary-100 shadow-sm group-hover:scale-110 transition-transform", colorClass)}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-secondary-400 mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-secondary-900 leading-tight">{value || 'No especificado'}</p>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalles del Transporte"
      description={transporte.proveedor.nombre}
      size="xl"
    >
      <div className="space-y-8 pb-4">
        {/* Header Visual */}
        <div className="relative h-32 rounded-2xl bg-gradient-to-r from-primary-600 to-indigo-600 overflow-hidden shadow-lg">
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          <div className="absolute bottom-6 left-8 flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-xl">
              <Car className="h-8 w-8 text-white" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-white leading-tight">
                {transporte.transporte.modelo}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={transporte.transporte.disponible ? "success" : "error"} className="bg-white/20 text-white border-white/30">
                  {transporte.transporte.disponible ? 'Disponible' : 'No Disponible'}
                </Badge>
                <div className="flex items-center gap-1 text-white/80 text-xs font-medium">
                  <Star className="h-3 w-3 text-yellow-300 fill-yellow-300" />
                  {transporte.proveedor.rating_promedio}/5.0
                </div>
              </div>
            </div>
          </div>
          <div className="absolute top-6 right-8">
            <div className="px-3 py-1.5 bg-black/20 backdrop-blur-md rounded-lg border border-white/10 text-white text-xs font-bold tracking-widest uppercase">
              Placa: {transporte.transporte.placa}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info Columns */}
          <div className="lg:col-span-2 space-y-8">
            {/* Sección: Vehículo */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-6 bg-primary-500 rounded-full" />
                <h5 className="text-base font-bold text-secondary-900">Especificaciones del Vehículo</h5>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-secondary-50/50 rounded-2xl p-4 border border-secondary-100">
                <DetailItem
                  icon={Truck}
                  label="Tipo de Vehículo"
                  value={transporte.transporte.tipo_vehiculo}
                  colorClass="text-primary-600"
                />
                <DetailItem
                  icon={Calendar}
                  label="Año / Modelo"
                  value={transporte.transporte.anio}
                  colorClass="text-blue-600"
                />
                <DetailItem
                  icon={Users}
                  label="Capacidad Máxima"
                  value={`${transporte.transporte.capacidad} pasajeros`}
                  colorClass="text-indigo-600"
                />
                <DetailItem
                  icon={Fuel}
                  label="Combustible"
                  value={transporte.transporte.combustible}
                  colorClass="text-amber-600"
                />
                <DetailItem
                  icon={Activity}
                  label="Último Mantenimiento"
                  value={new Date(transporte.transporte.fecha_mantenimiento).toLocaleDateString('es-ES', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                  colorClass="text-emerald-600"
                />
                <DetailItem
                  icon={Shield}
                  label="Seguro de Vehículo"
                  value={transporte.transporte.seguro_vigente ? "Vigente y Activo" : "Requiere Renovación"}
                  colorClass={transporte.transporte.seguro_vigente ? "text-emerald-600" : "text-error-600"}
                />
              </div>
            </section>

            {/* Sección: Comodidades */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                <h5 className="text-base font-bold text-secondary-900">Comodidades y Equipamiento</h5>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className={cn(
                  "flex items-center gap-3 px-5 py-3 rounded-2xl border-2 transition-all",
                  transporte.transporte.aire_acondicionado
                    ? "bg-blue-50/50 border-blue-200 text-blue-700"
                    : "bg-secondary-50/30 border-secondary-100 text-secondary-400 opacity-60"
                )}>
                  <Wind className={cn("h-5 w-5", transporte.transporte.aire_acondicionado ? "text-blue-600" : "")} />
                  <span className="text-sm font-bold">Aire Acondicionado</span>
                  {transporte.transporte.aire_acondicionado ? (
                    <CheckCircle2 className="h-4 w-4 text-blue-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                </div>

                <div className={cn(
                  "flex items-center gap-3 px-5 py-3 rounded-2xl border-2 transition-all",
                  transporte.transporte.wifi
                    ? "bg-indigo-50/50 border-indigo-200 text-indigo-700"
                    : "bg-secondary-50/30 border-secondary-100 text-secondary-400 opacity-60"
                )}>
                  <Wifi className={cn("h-5 w-5", transporte.transporte.wifi ? "text-indigo-600" : "")} />
                  <span className="text-sm font-bold">WiFi Premium</span>
                  {transporte.transporte.wifi ? (
                    <CheckCircle2 className="h-4 w-4 text-indigo-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                </div>
              </div>
            </section>

            {/* Sección: Proveedor */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                <h5 className="text-base font-bold text-secondary-900">Información del Proveedor</h5>
              </div>
              <div className="bg-white border border-secondary-100 rounded-2xl p-6 shadow-soft-sm">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                      <Building className="h-7 w-7" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h6 className="text-lg font-bold text-secondary-900">{transporte.proveedor.nombre}</h6>
                        {transporte.proveedor.verificado && (
                          <div className="p-1 bg-blue-50 rounded-full" title="Proveedor Verificado">
                            <CheckCircle2 className="h-4 w-4 text-blue-600 fill-blue-600/10" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs font-medium text-secondary-500 flex items-center gap-1 mt-0.5">
                        <Badge variant="secondary" className="px-1.5 py-0">NIT: {transporte.proveedor.numero_documento}</Badge>
                        <span>•</span>
                        <span>Registrado desde {new Date(transporte.proveedor.fecha_registro).getFullYear()}</span>
                      </p>
                    </div>
                  </div>
                  <Badge variant={transporte.proveedor.activo ? "success" : "warning"}>
                    {transporte.proveedor.activo ? 'Empresa Activa' : 'Inactiva'}
                  </Badge>
                </div>

                <p className="text-sm text-secondary-600 leading-relaxed bg-secondary-50/50 p-4 rounded-xl border border-secondary-100/50 italic">
                  "{transporte.proveedor.descripcion || 'Sin descripción detallada disponible.'}"
                </p>
              </div>
            </section>
          </div>

          {/* Sidebar Info Column */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-secondary-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors" />
              <h5 className="text-sm font-bold uppercase tracking-widest text-primary-400 mb-6 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Contacto Directo
              </h5>
              <div className="space-y-5 relative z-10">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-wider">Email Corporativo</p>
                  <a href={`mailto:${transporte.proveedor.email}`} className="text-sm font-medium hover:text-primary-300 transition-colors line-clamp-1 flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 opacity-60" />
                    {transporte.proveedor.email}
                  </a>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-wider">Línea de Atención</p>
                  <a href={`tel:${transporte.proveedor.telefono}`} className="text-sm font-medium hover:text-primary-300 transition-colors flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 opacity-60" />
                    {transporte.proveedor.telefono}
                  </a>
                </div>
                {transporte.proveedor.sitio_web && (
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-wider">Portal Web</p>
                    <a href={transporte.proveedor.sitio_web} target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:text-primary-300 transition-colors line-clamp-1 flex items-center gap-2">
                      <Globe className="h-3.5 w-3.5 opacity-60" />
                      {transporte.proveedor.sitio_web.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Location Card */}
            <div className="bg-white border border-secondary-100 rounded-3xl p-6 shadow-soft-sm">
              <h5 className="text-sm font-bold uppercase tracking-widest text-red-500 mb-6 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Ubicación
              </h5>
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-50 rounded-lg text-red-600 border border-red-100 mt-1">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-secondary-900">{transporte.proveedor.ciudad}, {transporte.proveedor.pais}</p>
                    <p className="text-xs text-secondary-500 mt-0.5">{transporte.proveedor.direccion}</p>
                  </div>
                </div>

                <div className="p-4 bg-secondary-50 rounded-2xl border border-secondary-100">
                  <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Info className="h-3 w-3" />
                    Referencia de Ubicación
                  </p>
                  <p className="text-xs font-semibold text-secondary-900 leading-relaxed italic">
                    {transporte.proveedor.ubicacion || 'No se proporcionaron referencias adicionales.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-6 border-t border-secondary-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-secondary-400 uppercase tracking-widest">Estado de Relevancia:</span>
            <Badge
              variant={transporte.proveedor.relevancia === 'Alta' ? 'info' : 'secondary'}
              className={cn(
                "px-3 py-1",
                transporte.proveedor.relevancia === 'Alta' && "bg-primary-50 text-primary-700 border-primary-100"
              )}
            >
              Prioridad {transporte.proveedor.relevancia}
            </Badge>
          </div>
          <Button
            onClick={onClose}
            variant="secondary"
            className="px-8"
          >
            Cerrar Panel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default TransporteDetailModal;
