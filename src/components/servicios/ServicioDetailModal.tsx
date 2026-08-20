import React from 'react';
import { Building, MapPin, Calendar, Star, FileText, Info } from 'lucide-react';
import { ServicioDetailModalProps } from '../../types/servicio';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

// Los detalles llegan como un JSON cuya forma cambia según el tipo de
// servicio (un tour trae duración y dificultad, un alojamiento trae
// capacidad). Por eso se renderiza de forma genérica en vez de mapear
// campos conocidos: un tipo nuevo se muestra igual de bien sin tocar nada.
// Las claves del JSON vienen sin tildes y a veces abreviadas. Se traducen
// las conocidas; cualquier clave nueva cae en el formato genérico, así que
// un tipo de servicio no visto sigue mostrándose de forma legible.
const ETIQUETAS: Record<string, string> = {
  tipo_tour: 'Tipo de tour',
  tipo_alojamiento: 'Tipo de alojamiento',
  tipo_establecimiento: 'Tipo de establecimiento',
  grupo_objetivo: 'Grupo objetivo',
  duracion: 'Duración',
  dificultad: 'Dificultad',
  habitacion: 'Habitación',
  capacidad: 'Capacidad',
  incluye: 'Incluye',
  transporte: 'Transporte',
  guia: 'Guía',
  alimentacion: 'Alimentación',
  entradas_sitios: 'Entradas a sitios',
};

const etiquetaDeClave = (clave: string): string => {
  if (ETIQUETAS[clave]) return ETIQUETAS[clave];
  const texto = clave.replace(/_/g, ' ');
  return texto.charAt(0).toUpperCase() + texto.slice(1);
};

const textoDeValor = (valor: unknown): string => {
  if (typeof valor === 'boolean') return valor ? 'Sí' : 'No';
  if (Array.isArray(valor)) return valor.map((v) => textoDeValor(v)).join(', ');
  if (valor === null || valor === undefined || valor === '') return '—';
  return String(valor);
};

const ParDeDatos: React.FC<{ etiqueta: string; valor: unknown }> = ({ etiqueta, valor }) => (
  <div className="flex items-baseline justify-between gap-3 py-1.5 border-b border-secondary-50 last:border-b-0">
    <span className="text-xs text-secondary-500 shrink-0">{etiqueta}</span>
    <span className="text-sm text-secondary-900 font-medium text-right break-words">
      {textoDeValor(valor)}
    </span>
  </div>
);

const DetallesDelServicio: React.FC<{ valor: string }> = ({ valor }) => {
  let datos: Record<string, unknown>;
  try {
    const parseado = JSON.parse(valor);
    if (!parseado || typeof parseado !== 'object' || Array.isArray(parseado)) {
      throw new Error('no es un objeto');
    }
    datos = parseado as Record<string, unknown>;
  } catch {
    // Si algún registro guarda texto plano en vez de JSON, se muestra tal
    // cual en lugar de esconder el dato detrás de un error.
    return <p className="text-sm text-secondary-700 leading-relaxed">{valor}</p>;
  }

  const simples = Object.entries(datos).filter(
    ([, v]) => v === null || typeof v !== 'object' || Array.isArray(v),
  );
  const anidados = Object.entries(datos).filter(
    ([, v]) => v !== null && typeof v === 'object' && !Array.isArray(v),
  );

  return (
    <div className="rounded-xl border border-secondary-100 bg-white p-4 space-y-4">
      {simples.length > 0 && (
        <div>
          {simples.map(([clave, v]) => (
            <ParDeDatos key={clave} etiqueta={etiquetaDeClave(clave)} valor={v} />
          ))}
        </div>
      )}

      {anidados.map(([clave, v]) => (
        <div key={clave}>
          <p className="text-xs font-medium text-secondary-400 uppercase tracking-tighter mb-1">
            {etiquetaDeClave(clave)}
          </p>
          <div className="pl-3 border-l-2 border-secondary-100">
            {Object.entries(v as Record<string, unknown>).map(([subclave, subvalor]) => (
              <ParDeDatos
                key={subclave}
                etiqueta={etiquetaDeClave(subclave)}
                valor={subvalor}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const ServicioDetailModal: React.FC<ServicioDetailModalProps> = ({ isOpen, onClose, servicio }) => {
  if (!servicio) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalles del Servicio"
      description="Información completa sobre el servicio registrado"
      size="3xl"
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
                  <p className="text-sm text-secondary-500 pl-6 break-all">
                    {servicio.proveedorEmail || 'Sin email registrado'}
                  </p>
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
                    <DetallesDelServicio valor={servicio.detalles_del_servicio} />
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
