import React from 'react';
import { Route, MapPin, Clock, DollarSign, Users, CheckCircle, Star, ArrowRight } from 'lucide-react';
import { RutaModalProps } from '../../types/ruta';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

const RutaDetailModal: React.FC<RutaModalProps> = ({ isOpen, onClose, ruta }) => {
  if (!ruta) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalles de la Ruta"
      description={`Información detallada sobre ${ruta.nombre}`}
      size="xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Columna Izquierda */}
        <div className="space-y-6">
          {/* Información Básica */}
          <div>
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100 mb-4">
              <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
                <Route className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Información General</h3>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Nombre</label>
                <p className="text-gray-900 font-medium">{ruta.nombre}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Descripción</label>
                <p className="text-gray-900 text-sm leading-relaxed">{ruta.descripcion}</p>
              </div>
            </div>
          </div>

          {/* Estado y Características */}
          <div>
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100 mb-4">
              <div className="p-1.5 bg-purple-100 text-purple-700 rounded-lg">
                <CheckCircle className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Estado y Etiquetas</h3>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex flex-wrap gap-3">
                <Badge variant={ruta.activo ? 'success' : 'error'} className="px-3 py-1">
                  {ruta.activo ? 'Activa' : 'Inactiva'}
                </Badge>

                {ruta.recomendada && (
                  <Badge variant="info" className="px-3 py-1 gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    Recomendada
                  </Badge>
                )}

                <Badge variant="secondary" className="px-3 py-1 gap-1">
                  <DollarSign className="h-3 w-3" />
                  {ruta.precio}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha */}
        <div className="space-y-6">
          {/* Ruta y Trayecto */}
          <div>
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100 mb-4">
              <div className="p-1.5 bg-rose-100 text-rose-700 rounded-lg">
                <MapPin className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Trayecto</h3>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <div className="relative flex items-center justify-between">
                {/* Linea conectora */}
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -z-10 transform -translate-y-1/2 mx-8"></div>

                <div className="flex flex-col items-center bg-gray-50 px-2 z-10">
                  <div className="w-8 h-8 rounded-full bg-green-100 border-2 border-green-500 flex items-center justify-center mb-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-600"></div>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{ruta.origen}</span>
                  <span className="text-xs text-gray-500">Origen</span>
                </div>

                <div className="bg-gray-50 px-2 z-10">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <div className="flex flex-col items-center bg-gray-50 px-2 z-10">
                  <div className="w-8 h-8 rounded-full bg-red-100 border-2 border-red-500 flex items-center justify-center mb-2">
                    <MapPin className="h-4 w-4 text-red-600" />
                  </div>
                  <span className="text-sm font-bold text-gray-900">{ruta.destino}</span>
                  <span className="text-xs text-gray-500">Destino</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 flex justify-center">
                <div className="flex items-center gap-2 text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">Duración est: {ruta.duracion_estimada} min</span>
                </div>
              </div>
            </div>
          </div>

          {/* Puntos de Interés */}
          <div>
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100 mb-4">
              <div className="p-1.5 bg-green-100 text-green-700 rounded-lg">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Puntos de Interés</h3>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                {ruta.puntos_interes}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end pt-6 border-t border-gray-100">
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
      </div>
    </Modal>
  );
};

export default RutaDetailModal;
