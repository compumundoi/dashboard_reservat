import React, { useEffect, useState } from 'react';
import { hotelService } from '../../services/hotelService';
import {
  Building2,
  User,
  MapPin,
  Mail,
  Phone,
  Star,
  CheckCircle,
  XCircle,
  Bed,
  Clock,
  DollarSign,
  Car,
  Coffee,
  Utensils,
  Heart,
  Waves,
  Home,
  ArrowUpDown,
  Accessibility,
  Mic,
  Zap,
  Globe,
  Share2,
  FileText,
  Calendar,
  Info
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface Props {
  hotelId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

import { HotelInfo, ProveedorHotel } from '../../types/hotel';

interface HotelDetailData {
  hotel: HotelInfo;
  proveedor: ProveedorHotel;
}

export const HotelDetailModal: React.FC<Props> = ({ hotelId, isOpen, onClose }) => {
  const [data, setData] = useState<HotelDetailData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hotelId || !isOpen) return;
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await hotelService.getHotelById(hotelId);
        setData(res);
      } catch (e: any) {
        setError(e.message || 'Error al cargar hotel');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [hotelId, isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalles del Hotel"
      description="Información completa del proveedor y hotel"
      size="3xl"
    >
      <div className="space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="text-secondary-600 font-medium">Cargando detalles...</span>
          </div>
        ) : error ? (
          <div className="bg-error-50 border border-error-200 rounded-lg p-4 flex items-center gap-3 text-error-800">
            <div className="p-1 bg-error-100 rounded-full">
              <Info className="w-4 h-4" />
            </div>
            <p className="font-medium">{error}</p>
          </div>
        ) : data ? (
          <div className="space-y-8">
            {/* Información del Proveedor */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-secondary-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-primary-100 text-primary-700 rounded-lg">
                    <User className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold text-secondary-900">Información del Proveedor</h4>
                </div>

                <div className="flex items-center space-x-2">
                  {data.proveedor?.verificado ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800 border border-success-200">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verificado
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-error-100 text-error-800 border border-error-200">
                      <XCircle className="h-3 w-3 mr-1" />
                      No Verificado
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-3 text-secondary-600">
                    <Building2 className="h-4 w-4 text-primary-500 shrink-0" />
                    <span className="font-medium text-secondary-900 shrink-0">Nombre:</span>
                    <span className="truncate">{data.proveedor?.nombre}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-secondary-600">
                    <MapPin className="h-4 w-4 text-error-500 shrink-0" />
                    <span className="font-medium text-secondary-900 shrink-0">Ubicación:</span>
                    <span className="truncate">{data.proveedor?.ciudad}, {data.proveedor?.pais}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-secondary-600">
                    <Mail className="h-4 w-4 text-blue-500 shrink-0" />
                    <span className="font-medium text-secondary-900 shrink-0">Email:</span>
                    <span className="truncate">{data.proveedor?.email}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-secondary-600">
                    <Phone className="h-4 w-4 text-success-600 shrink-0" />
                    <span className="font-medium text-secondary-900 shrink-0">Teléfono:</span>
                    <span className="truncate">{data.proveedor?.telefono}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-secondary-600">
                    <MapPin className="h-4 w-4 text-secondary-500 shrink-0" />
                    <span className="font-medium text-secondary-900 shrink-0">Dirección:</span>
                    <span className="truncate">{data.proveedor?.direccion}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-secondary-600">
                    <MapPin className="h-4 w-4 text-purple-500 shrink-0" />
                    <span className="font-medium text-secondary-900 shrink-0">Zona:</span>
                    <span className="truncate">{data.proveedor?.ubicacion}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-secondary-600">
                    <Star className="h-4 w-4 text-warning-500 shrink-0" />
                    <span className="font-medium text-secondary-900 shrink-0">Relevancia:</span>
                    <span className="truncate">{data.proveedor?.relevancia}</span>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-3 text-secondary-600">
                    <Star className="h-4 w-4 text-yellow-400 fill-current shrink-0" />
                    <span className="font-medium text-secondary-900 shrink-0">Rating:</span>
                    <span>{data.proveedor?.rating_promedio}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-secondary-600">
                    <Globe className="h-4 w-4 text-blue-600 shrink-0" />
                    <span className="font-medium text-secondary-900 shrink-0">Sitio Web:</span>
                    <a href={data.proveedor?.sitio_web} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-800 truncate block max-w-[200px]">
                      {data.proveedor?.sitio_web}
                    </a>
                  </div>
                  <div className="flex items-center space-x-3 text-secondary-600">
                    <Share2 className="h-4 w-4 text-indigo-500 shrink-0" />
                    <span className="font-medium text-secondary-900 shrink-0">Redes:</span>
                    <a href={data.proveedor?.redes_sociales} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-800 truncate block max-w-[200px]">
                      {data.proveedor?.redes_sociales}
                    </a>
                  </div>
                  <div className="flex items-center space-x-3 text-secondary-600">
                    <FileText className="h-4 w-4 text-slate-600 shrink-0" />
                    <span className="font-medium text-secondary-900 shrink-0">Documento:</span>
                    <span>{data.proveedor?.tipo_documento}: {data.proveedor?.numero_documento}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-secondary-600">
                    <User className="h-4 w-4 text-teal-500 shrink-0" />
                    <span className="font-medium text-secondary-900 shrink-0">Creador:</span>
                    <span>{data.proveedor?.usuario_creador}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-secondary-600">
                    <Calendar className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span className="font-medium text-secondary-900 shrink-0">Registro:</span>
                    <span>{new Date(data.proveedor?.fecha_registro).toLocaleDateString('es-ES')}</span>
                  </div>
                </div>
              </div>

              {data.proveedor?.descripcion && (
                <div className="mt-4 bg-secondary-50 p-4 rounded-lg border border-secondary-100">
                  <span className="block text-sm font-medium text-secondary-900 mb-2">Descripción</span>
                  <p className="text-sm text-secondary-600 leading-relaxed">
                    {data.proveedor.descripcion}
                  </p>
                </div>
              )}
            </div>

            {/* Información del Hotel */}
            <div className="space-y-4 pt-4 border-t border-secondary-100">
              <div className="flex items-center gap-2 pb-2 border-b border-secondary-100">
                <div className="p-1.5 bg-success-100 text-success-700 rounded-lg">
                  <Building2 className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-secondary-900">Detalles del Hotel</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div className="bg-white p-3 rounded-lg border border-secondary-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-2 mb-1.5">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium text-secondary-700">Estrellas</span>
                  </div>
                  <div className="text-lg font-semibold text-secondary-900 ml-6">{data.hotel?.estrellas}</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-secondary-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-2 mb-1.5">
                    <Bed className="h-4 w-4 text-blue-500" />
                    <span className="font-medium text-secondary-700">Habitaciones</span>
                  </div>
                  <div className="text-lg font-semibold text-secondary-900 ml-6">{data.hotel?.numero_habitaciones}</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-secondary-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-2 mb-1.5">
                    <Home className="h-4 w-4 text-purple-500" />
                    <span className="font-medium text-secondary-700">Tipo</span>
                  </div>
                  <div className="text-lg font-semibold text-secondary-900 ml-6">{data.hotel?.tipo_habitacion}</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-secondary-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-2 mb-1.5">
                    <Clock className="h-4 w-4 text-success-500" />
                    <span className="font-medium text-secondary-700">Check-in</span>
                  </div>
                  <div className="text-lg font-semibold text-secondary-900 ml-6">{data.hotel?.check_in}</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-secondary-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-2 mb-1.5">
                    <Clock className="h-4 w-4 text-error-500" />
                    <span className="font-medium text-secondary-700">Check-out</span>
                  </div>
                  <div className="text-lg font-semibold text-secondary-900 ml-6">{data.hotel?.check_out}</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-secondary-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-2 mb-1.5">
                    <DollarSign className="h-4 w-4 text-success-600" />
                    <span className="font-medium text-secondary-700">Precio Base</span>
                  </div>
                  <div className="text-lg font-semibold text-secondary-900 ml-6">${data.hotel?.precio_ascendente}</div>
                </div>

                {/* Servicios checkboxes readonly representation */}
                {[
                  { icon: <Clock className="h-4 w-4 text-indigo-500" />, label: 'Recepción 24h', value: data.hotel?.recepcion_24_horas },
                  { icon: <Waves className="h-4 w-4 text-blue-400" />, label: 'Piscina', value: data.hotel?.piscina },
                  { icon: <Heart className="h-4 w-4 text-pink-500" />, label: 'Pet Friendly', value: data.hotel?.pet_friendly },
                  { icon: <Heart className="h-4 w-4 text-orange-500" />, label: 'Mascotas', value: data.hotel?.admite_mascotas },
                  { icon: <Car className="h-4 w-4 text-secondary-600" />, label: 'Estacionamiento', value: data.hotel?.tiene_estacionamiento },
                  { icon: <Utensils className="h-4 w-4 text-amber-500" />, label: 'Restaurante', value: data.hotel?.servicio_restaurante },
                  { icon: <Coffee className="h-4 w-4 text-amber-700" />, label: 'Bar', value: data.hotel?.bar },
                  { icon: <Utensils className="h-4 w-4 text-teal-500" />, label: 'Room Service', value: data.hotel?.room_service },
                  { icon: <ArrowUpDown className="h-4 w-4 text-slate-500" />, label: 'Ascensor', value: data.hotel?.asensor },
                  { icon: <Accessibility className="h-4 w-4 text-blue-600" />, label: 'Rampa', value: data.hotel?.rampa_discapacitado },
                  { icon: <Mic className="h-4 w-4 text-violet-500" />, label: 'Auditorio', value: data.hotel?.auditorio },
                  { icon: <Car className="h-4 w-4 text-emerald-500" />, label: 'Parqueadero', value: data.hotel?.parqueadero },
                  { icon: <Zap className="h-4 w-4 text-yellow-600" />, label: 'Planta Energía', value: data.hotel?.planta_energia },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg border border-secondary-100">
                    <div className="flex items-center space-x-2">
                      {item.icon}
                      <span className="text-secondary-700">{item.label}</span>
                    </div>
                    {item.value ? (
                      <CheckCircle className="h-4 w-4 text-success-500" />
                    ) : (
                      <div className="h-1.5 w-1.5 rounded-full bg-secondary-300"></div>
                    )}
                  </div>
                ))}
              </div>

              {data.hotel?.servicios_incluidos && (
                <div className="mt-4 bg-white p-4 rounded-lg border border-secondary-200">
                  <span className="block text-sm font-medium text-secondary-900 mb-2">Servicios Incluidos</span>
                  <p className="text-sm text-secondary-600">{data.hotel.servicios_incluidos}</p>
                </div>
              )}
            </div>
          </div>
        ) : null}

        <div className="flex justify-end pt-6 border-t border-secondary-100 mt-4">
          <Button
            onClick={onClose}
            variant="outline"
          >
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
};
