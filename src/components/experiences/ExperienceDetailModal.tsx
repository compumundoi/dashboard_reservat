import React from 'react';
import {
  User, MapPin, Clock, Users, Star, Globe, Shield,
  Calendar, Phone, Mail, ExternalLink, CheckCircle, XCircle
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { cn } from '../../lib/utils';
import { ExperienceDetailModalProps } from '../../types/experience';

export const ExperienceDetailModal: React.FC<ExperienceDetailModalProps> = ({
  isOpen,
  onClose,
  experience,
  loading = false
}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    const variants: Record<string, "success" | "warning" | "error" | "secondary" | "default"> = {
      'fácil': 'success',
      'moderado': 'warning',
      'difícil': 'error',
      'extremo': 'secondary'
    };
    const variant = variants[difficulty.toLowerCase()] || 'default';
    return (
      <Badge variant={variant} className="capitalize px-3 py-1">
        {difficulty}
      </Badge>
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const DetailItem = ({ icon: Icon, label, value, href, iconColor = "text-blue-500" }: any) => (
    <div className="flex items-start space-x-3 group">
      <div className={cn("p-2 rounded-lg bg-gray-50 group-hover:bg-white border border-transparent group-hover:border-gray-100 transition-all", iconColor.replace('text-', 'bg-').replace('500', '50'))}>
        <Icon className={cn("h-4 w-4", iconColor)} />
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
        {href ? (
          <a href={href} className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1">
            {value}
            <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <p className="text-sm font-semibold text-gray-900">{value || 'N/A'}</p>
        )}
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalle de la Experiencia"
      description="Información completa del proveedor y la actividad programada"
      size="4xl"
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-100 rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium animate-pulse">Cargando detalles...</p>
        </div>
      ) : experience ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Main Info */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Provider Info */}
            <div className="lg:col-span-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-2xl font-bold text-gray-900">{experience.proveedor_nombre}</h3>
                      {experience.proveedor_verificado && (
                        <Badge variant="success" className="gap-1 px-2">
                          <CheckCircle className="h-3 w-3" />
                          Verificado
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <MapPin className="h-4 w-4 mr-1.5 text-gray-400" />
                      {experience.proveedor_ciudad}, {experience.proveedor_pais}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right hidden md:block">
                    <p className="text-xs text-gray-500 font-medium">Rating Promedio</p>
                    <div className="flex items-center justify-end gap-1 mt-0.5">
                      <Star className="h-4 w-4 text-amber-400 fill-current" />
                      <span className="text-sm font-bold text-gray-900">{experience.proveedor_rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <Badge variant={experience.proveedor_activo ? "success" : "error"} className="px-4 py-1.5 text-sm uppercase tracking-wide font-bold">
                    {experience.proveedor_activo ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-6">
                <DetailItem icon={Mail} label="Email" value={experience.proveedor_email} href={`mailto:${experience.proveedor_email}`} />
                <DetailItem icon={Phone} label="Teléfono" value={experience.proveedor_telefono} href={`tel:${experience.proveedor_telefono}`} iconColor="text-emerald-500" />
                <DetailItem icon={Calendar} label="Registro" value={formatDate(experience.fecha_registro)} iconColor="text-indigo-500" />
                <DetailItem icon={Shield} label="Documento" value={`${experience.proveedor_tipo_documento}: ${experience.proveedor_numero_documento}`} iconColor="text-rose-500" />

                <div className="md:col-span-2">
                  <DetailItem icon={MapPin} label="Dirección" value={experience.proveedor_direccion} iconColor="text-cyan-500" />
                </div>
                {experience.proveedor_sitio_web && (
                  <div className="md:col-span-2">
                    <DetailItem icon={Globe} label="Sitio Web" value={experience.proveedor_sitio_web} href={experience.proveedor_sitio_web} iconColor="text-sky-500" />
                  </div>
                )}
              </div>
            </div>

            {/* Middle: Description */}
            <div className="lg:col-span-12">
              <Card className="bg-gray-50 border-none shadow-none p-6">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                  Descripción del Servicio
                </h4>
                <p className="text-gray-700 leading-relaxed italic text-sm">
                  {experience.proveedor_descripcion || 'Sin descripción disponible para este proveedor.'}
                </p>
              </Card>
            </div>

            {/* Bottom: Experience Specs */}
            <div className="lg:col-span-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
                <h4 className="text-xl font-bold text-gray-900 tracking-tight">Especificaciones de la Experiencia</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-5 border-blue-100 bg-blue-50/30 flex flex-col gap-3 group hover:border-blue-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-blue-600 uppercase tracking-wider">Duración</p>
                      <p className="text-lg font-bold text-gray-900">{experience.duracion} Horas</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-5 border-indigo-100 bg-indigo-50/30 flex flex-col gap-3 group hover:border-indigo-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-indigo-600 uppercase tracking-wider">Grupo Máximo</p>
                      <p className="text-lg font-bold text-gray-900">{experience.grupo_maximo} Personas</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-5 border-emerald-100 bg-emerald-50/30 flex flex-col gap-3 group hover:border-emerald-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                      <Globe className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-emerald-600 uppercase tracking-wider">Idioma Principal</p>
                      <p className="text-lg font-bold text-gray-900 capitalize">{experience.idioma}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-5 border-rose-100 bg-rose-50/30 flex flex-col gap-3 group hover:border-rose-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-rose-600 uppercase tracking-wider">Registro RNT</p>
                      <p className="text-lg font-bold text-gray-900">{experience.numero_rnt || 'N/A'}</p>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                <div className="lg:col-span-1 space-y-6">
                  <div>
                    <h5 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                      Dificultad de la Actividad
                    </h5>
                    {getDifficultyBadge(experience.dificultad)}
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                      Servicios Incluidos
                    </h5>
                    <div className="grid grid-cols-1 gap-3">
                      <div className={cn("flex items-center justify-between p-3 rounded-xl border transition-all",
                        experience.incluye_transporte ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-gray-50 border-gray-200 text-gray-400 opacity-60")}>
                        <span className="text-sm font-semibold">Transporte</span>
                        {experience.incluye_transporte ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                      </div>
                      <div className={cn("flex items-center justify-between p-3 rounded-xl border transition-all",
                        experience.guia_incluido ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-gray-50 border-gray-200 text-gray-400 opacity-60")}>
                        <span className="text-sm font-semibold">Guía Certificado</span>
                        {experience.guia_incluido ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2 grid grid-cols-1 gap-6 text-sm">
                  <div className="p-6 rounded-2xl border border-gray-100 bg-white space-y-4 shadow-soft-sm">
                    <h5 className="font-bold text-gray-900 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      Punto de Encuentro
                    </h5>
                    <p className="text-gray-600 leading-relaxed">
                      {experience.punto_de_encuentro || 'No se ha especificado un punto de encuentro específico.'}
                    </p>
                  </div>
                  <div className="p-6 rounded-2xl border border-gray-100 bg-white space-y-4 shadow-soft-sm">
                    <h5 className="font-bold text-gray-900 flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      Equipamiento Requerido
                    </h5>
                    <p className="text-gray-600 leading-relaxed">
                      {experience.equipamiento_requerido || 'No se requiere equipamiento especial para esta actividad.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Globe className="h-16 w-16 mb-4 opacity-10" />
          <p className="text-lg font-medium">No se encontró información</p>
        </div>
      )}
    </Modal>
  );
};