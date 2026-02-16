import React, { useState, useEffect, useCallback } from 'react';
import {
  MapPin, Phone, Mail, Globe, Clock, Users, Star, Utensils,
  Wifi, Car, Heart, Truck, CheckCircle, Calendar, User, FileText,
  Hash, Info, Building, ShieldCheck, ExternalLink
} from 'lucide-react';
import { RestauranteData } from '../../types/restaurante';
import { restauranteService } from '../../services/restauranteService';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface RestauranteDetailModalProps {
  restauranteId: string;
  isOpen: boolean;
  onClose: () => void;
}

const RestauranteDetailModal: React.FC<RestauranteDetailModalProps> = ({
  restauranteId,
  isOpen,
  onClose
}) => {
  const [restaurante, setRestaurante] = useState<RestauranteData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadRestauranteDetails = useCallback(async () => {
    try {
      setLoading(true);
      const data = await restauranteService.getRestauranteById(restauranteId);
      setRestaurante(data);
    } catch (error) {
      console.error('Error loading restaurante details:', error);
    } finally {
      setLoading(false);
    }
  }, [restauranteId]);

  useEffect(() => {
    if (isOpen && restauranteId) {
      loadRestauranteDetails();
    }
  }, [isOpen, restauranteId, loadRestauranteDetails]);

  const renderServiceBadge = (label: string, value: boolean, icon: React.ReactNode) => (
    <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 ${value
      ? 'bg-success-50 border-success-100 text-success-700 shadow-sm'
      : 'bg-gray-50 border-gray-100 text-gray-400 opacity-60'
      }`}>
      <div className={`p-1.5 rounded-lg ${value ? 'bg-success-100' : 'bg-gray-100'}`}>
        {React.cloneElement(icon as React.ReactElement, { className: 'h-4 w-4' })}
      </div>
      <span className="text-sm font-medium">{label}</span>
      <div className="ml-auto">
        {value ? (
          <CheckCircle className="h-4 w-4 text-success-500 fill-success-50" />
        ) : (
          <div className="h-4 w-4 rounded-full border-2 border-gray-200" />
        )}
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ficha del Restaurante"
      description="Consulta la información detallada del establecimiento"
      size="xl"
    >
      {loading ? (
        <div className="space-y-8 animate-pulse">
          <div className="h-32 bg-gray-50 rounded-2xl w-full"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="h-6 bg-gray-50 rounded w-1/3"></div>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-50 rounded-xl"></div>
              ))}
            </div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-50 rounded w-1/3"></div>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-50 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      ) : restaurante ? (
        <div className="space-y-8">
          {/* Header Card */}
          <div className="bg-gradient-to-br from-secondary-50 to-white p-6 rounded-2xl border border-secondary-100 shadow-sm">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg shadow-primary-200 ring-4 ring-white">
                  {restaurante.nombre.charAt(0).toUpperCase()}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h2 className="text-3xl font-bold text-secondary-900 tracking-tight">{restaurante.nombre}</h2>
                    {restaurante.verificado && (
                      <div className="bg-blue-100 p-1 rounded-full" title="Establecimiento Verificado">
                        <ShieldCheck className="h-5 w-5 text-blue-600 fill-blue-50" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="bg-white/80 backdrop-blur-sm border-secondary-200 font-semibold px-3 py-1 text-sm uppercase tracking-wide">
                      {restaurante.tipo_cocina}
                    </Badge>
                    <div className="flex items-center gap-1 bg-warning-50 px-2 py-0.5 rounded-lg border border-warning-100">
                      <Star className="h-4 w-4 text-warning-400 fill-warning-400" />
                      <span className="text-sm font-bold text-warning-700">{restaurante.rating_promedio}</span>
                    </div>
                    <Badge variant={restaurante.activo ? 'success' : 'secondary'} className="rounded-full px-3">
                      {restaurante.activo ? 'Operativo' : 'Inactivo'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1 px-6 py-3 bg-white rounded-xl border border-secondary-100 shadow-sm">
                <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-[0.2em]">Precio Promedio</p>
                <p className="text-3xl font-black text-primary-600 tracking-tighter">
                  ${restaurante.precio_ascendente?.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left Column: Core Info */}
            <div className="space-y-8">
              <section className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-bold text-secondary-900 uppercase tracking-widest">
                  <div className="p-1 bg-primary-100 rounded text-primary-600">
                    <Info className="h-3.5 w-3.5" />
                  </div>
                  Información de Contacto
                </h3>

                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-4 p-4 rounded-xl border border-secondary-50 bg-white hover:border-primary-100 transition-colors group">
                    <div className="p-2 bg-secondary-50 rounded-lg group-hover:bg-primary-50 transition-colors">
                      <Mail className="h-5 w-5 text-secondary-400 group-hover:text-primary-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-secondary-400 uppercase">Email Corporativo</p>
                      <p className="text-sm font-semibold text-secondary-900">{restaurante.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-xl border border-secondary-50 bg-white hover:border-primary-100 transition-colors group">
                    <div className="p-2 bg-secondary-50 rounded-lg group-hover:bg-primary-50 transition-colors">
                      <Phone className="h-5 w-5 text-secondary-400 group-hover:text-primary-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-secondary-400 uppercase">Teléfono de Reservas</p>
                      <p className="text-sm font-semibold text-secondary-900">{restaurante.telefono}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-xl border border-secondary-50 bg-white hover:border-primary-100 transition-colors group">
                    <div className="p-2 bg-secondary-50 rounded-lg group-hover:bg-primary-50 transition-colors">
                      <MapPin className="h-5 w-5 text-secondary-400 group-hover:text-primary-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-secondary-400 uppercase">Ubicación</p>
                      <p className="text-sm font-semibold text-secondary-900">
                        {restaurante.direccion}, {restaurante.ciudad}
                      </p>
                      <p className="text-[11px] text-secondary-500 font-medium">{restaurante.pais}</p>
                    </div>
                  </div>

                  {restaurante.sitio_web && (
                    <a
                      href={restaurante.sitio_web}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-xl border border-secondary-50 bg-white hover:border-primary-100 hover:bg-primary-50/10 transition-all group lg:col-span-1"
                    >
                      <div className="p-2 bg-secondary-50 rounded-lg group-hover:bg-primary-50 transition-colors">
                        <Globe className="h-5 w-5 text-secondary-400 group-hover:text-primary-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] font-bold text-secondary-400 uppercase">Sitio Web Oficial</p>
                        <p className="text-sm font-semibold text-primary-600 flex items-center gap-1.5">
                          {restaurante.sitio_web.replace(/^https?:\/\//, '')}
                          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </p>
                      </div>
                    </a>
                  )}
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-bold text-secondary-900 uppercase tracking-widest">
                  <div className="p-1 bg-amber-100 rounded text-amber-600">
                    <Building className="h-3.5 w-3.5" />
                  </div>
                  Datos Legales y Registro
                </h3>
                <div className="p-5 rounded-2xl bg-secondary-50 border border-secondary-100 grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-[10px] font-bold text-secondary-400 uppercase mb-1">Identificación</p>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-secondary-400" />
                      <span className="text-sm font-bold text-secondary-900">
                        {restaurante.tipo_documento}: {restaurante.numero_documento}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-secondary-400 uppercase mb-1">Hash ID</p>
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-secondary-400" />
                      <span className="text-[11px] font-mono text-secondary-500 truncate" title={restauranteId}>
                        {restauranteId.substring(0, 12)}...
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-secondary-400 uppercase mb-1">Registrado por</p>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-secondary-400" />
                      <span className="text-sm font-semibold text-secondary-900">{restaurante.usuario_creador}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-secondary-400 uppercase mb-1">Fecha de Alta</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-secondary-400" />
                      <span className="text-sm font-semibold text-secondary-900">
                        {new Date(restaurante.fecha_registro).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column: Experience and Features */}
            <div className="space-y-8">
              <section className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-bold text-secondary-900 uppercase tracking-widest">
                  <div className="p-1 bg-secondary-100 rounded text-secondary-600">
                    <Utensils className="h-3.5 w-3.5" />
                  </div>
                  Experiencia Gastronómica
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-secondary-100 bg-white">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-primary-500" />
                      <p className="text-[10px] font-bold text-secondary-400 uppercase">Horario</p>
                    </div>
                    <p className="text-sm font-bold text-secondary-900">
                      {restaurante.horario_apertura} — {restaurante.horario_cierre}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-secondary-100 bg-white">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-primary-500" />
                      <p className="text-[10px] font-bold text-secondary-400 uppercase">Aforo Máx.</p>
                    </div>
                    <p className="text-sm font-bold text-secondary-900">{restaurante.aforo_maximo} Personas</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-secondary-100 space-y-4">
                  <div>
                    <p className="text-xs font-bold text-secondary-900 mb-3 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary-500" />
                      Opciones Alimentarias
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {restaurante.apto_celiacos && <Badge variant="success">Sin Gluten</Badge>}
                      {restaurante.apto_vegetarianos && <Badge variant="warning">Vegetariano</Badge>}
                      {restaurante.menu_vegana && <Badge variant="success">Vegano</Badge>}
                      {restaurante.menu_infantil && <Badge variant="info">Menú Infantil</Badge>}
                      {!restaurante.apto_celiacos && !restaurante.apto_vegetarianos && !restaurante.menu_vegana && (
                        <p className="text-xs text-secondary-400 italic">No se especificaron opciones especiales</p>
                      )}
                    </div>
                  </div>

                  {restaurante.menu_url && (
                    <Button variant="outline" className="w-full justify-between group" onClick={() => window.open(restaurante.menu_url, '_blank')}>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary-500" />
                        <span>Ver Carta Digital / Menú</span>
                      </div>
                      <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>
                  )}
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-bold text-secondary-900 uppercase tracking-widest">
                  <div className="p-1 bg-green-100 rounded text-green-600">
                    <CheckCircle className="h-3.5 w-3.5" />
                  </div>
                  Servicios Incluidos
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {renderServiceBadge('WiFi', restaurante.wifi, <Wifi />)}
                  {renderServiceBadge('Parqueo', restaurante.parqueadero, <Car />)}
                  {renderServiceBadge('Pet Friendly', restaurante.pet_friendly, <Heart />)}
                  {renderServiceBadge('Domicilios', restaurante.entrega_a_domicilio, <Truck />)}
                  {renderServiceBadge('Terraza', restaurante.terraza, <Utensils />)}
                  {renderServiceBadge('Eventos', restaurante.eventos, <Calendar />)}
                </div>
              </section>
            </div>
          </div>

          {/* Description */}
          {restaurante.descripcion && (
            <section className="space-y-4 pt-4">
              <h3 className="text-sm font-bold text-secondary-900 uppercase tracking-widest">Sobre el Establecimiento</h3>
              <div className="p-6 rounded-2xl bg-secondary-50 border border-secondary-100 relative">
                <FileText className="h-12 w-12 text-secondary-100 absolute bottom-4 right-4" />
                <p className="text-sm text-secondary-700 leading-relaxed font-medium">
                  {restaurante.descripcion}
                </p>
              </div>
            </section>
          )}

          {/* Footer Actions */}
          <div className="pt-6 border-t border-secondary-100 flex justify-end">
            <Button onClick={onClose} variant="secondary" className="px-10 h-11 rounded-xl font-bold">
              Cerrar Vista
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-secondary-50 rounded-3xl border-2 border-dashed border-secondary-200">
          <Utensils className="h-16 w-16 text-secondary-200 mx-auto mb-4" />
          <p className="text-lg font-bold text-secondary-400 tracking-tight">No se pudo recuperar la información</p>
          <Button variant="outline" className="mt-4" onClick={onClose}>Volver al listado</Button>
        </div>
      )}
    </Modal>
  );
};

export default RestauranteDetailModal;
