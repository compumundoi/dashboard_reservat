import React, { useState, useEffect } from 'react';
import { User, Phone, MapPin, Calendar, FileText, Mail, DollarSign, Hash, AlertCircle } from 'lucide-react';
import { MayoristaData } from '../../types/mayorista';
import { mayoristaService } from '../../services/mayoristaService';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface MayoristaDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  mayoristaId: string | null;
}

const MayoristaDetailModal: React.FC<MayoristaDetailModalProps> = ({
  isOpen,
  onClose,
  mayoristaId,
}) => {
  const [mayorista, setMayorista] = useState<MayoristaData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMayoristaDetails = async () => {
      if (!mayoristaId) return;

      setLoading(true);
      setError(null);
      try {
        const data = await mayoristaService.getMayoristaById(mayoristaId);
        setMayorista(data);
      } catch (err) {
        setError('Error al cargar los detalles del mayorista');
        console.error('Error fetching mayorista details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && mayoristaId) {
      fetchMayoristaDetails();
    }
  }, [isOpen, mayoristaId]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No disponible';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalles del Mayorista"
      description="Información completa del mayorista registrado"
      size="lg"
    >
      {loading ? (
        <div className="space-y-8 animate-pulse">
          <div className="h-32 bg-gray-100 rounded-2xl w-full"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="h-40 bg-gray-100 rounded-xl"></div>
              <div className="h-40 bg-gray-100 rounded-xl"></div>
            </div>
            <div className="space-y-6">
              <div className="h-40 bg-gray-100 rounded-xl"></div>
              <div className="h-40 bg-gray-100 rounded-xl"></div>
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="bg-red-50 text-red-500 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar</h3>
          <p className="text-gray-500 mb-6">{error}</p>
          <Button onClick={() => isOpen && mayoristaId && mayoristaService.getMayoristaById(mayoristaId).then(setMayorista)} variant="primary">
            Reintentar
          </Button>
        </div>
      ) : mayorista ? (
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between bg-secondary-50 p-6 rounded-2xl border border-secondary-100">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg shadow-blue-200">
                {mayorista.nombre.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-secondary-900">{mayorista.nombre}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={mayorista.activo ? 'success' : 'error'} className="rounded-full">
                    {mayorista.activo ? 'Activo' : 'Inactivo'}
                  </Badge>
                  {mayorista.verificado && (
                    <Badge variant="info" className="rounded-full">
                      Verificado
                    </Badge>
                  )}
                  {mayorista.recurente && (
                    <Badge variant="secondary" className="rounded-full">
                      Recurrente
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-secondary-500 mb-1 font-medium uppercase tracking-wider">Límite de Crédito</p>
              <p className="text-2xl font-bold text-secondary-900 tracking-tight">
                ${mayorista.limite_credito?.toLocaleString('es-COP') || '0'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Información General */}
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-secondary-900 uppercase tracking-wider">
                  <User className="h-4 w-4 text-primary-500" />
                  Información General
                </h3>
                <div className="grid gap-3">
                  <div className="p-4 rounded-xl border border-secondary-100 bg-white shadow-sm space-y-1">
                    <p className="text-xs font-medium text-secondary-400 uppercase tracking-tighter">Documento</p>
                    <div className="flex items-center gap-2 text-secondary-900">
                      <Hash className="h-4 w-4 text-secondary-400" />
                      <span className="font-semibold">{mayorista.tipo_documento}: {mayorista.numero_documento}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-secondary-100 bg-white shadow-sm space-y-1">
                    <p className="text-xs font-medium text-secondary-400 uppercase tracking-tighter">Contacto Principal</p>
                    <div className="flex items-center gap-2 text-secondary-900">
                      <User className="h-4 w-4 text-secondary-400" />
                      <span className="font-semibold">{mayorista.contacto_principal || 'No registrado'}</span>
                    </div>
                    {mayorista.email && (
                      <div className="flex items-center gap-2 text-sm text-secondary-600 mt-1">
                        <Mail className="h-3 w-3" />
                        {mayorista.email}
                      </div>
                    )}
                    {mayorista.telefono && (
                      <div className="flex items-center gap-2 text-sm text-secondary-600">
                        <Phone className="h-3 w-3" />
                        {mayorista.telefono}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Ubicación */}
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-secondary-900 uppercase tracking-wider">
                  <MapPin className="h-4 w-4 text-primary-500" />
                  Ubicación
                </h3>
                <div className="p-4 rounded-xl border border-secondary-100 bg-white shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-secondary-50 rounded-lg text-secondary-400">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-secondary-900">{mayorista.ciudad}, {mayorista.pais}</p>
                      <p className="text-sm text-secondary-500 mt-1">{mayorista.direccion}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Información Comercial */}
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-secondary-900 uppercase tracking-wider">
                  <DollarSign className="h-4 w-4 text-primary-500" />
                  Información Comercial
                </h3>
                <div className="p-4 rounded-xl border border-secondary-100 bg-white shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-secondary-50 pb-3">
                    <span className="text-sm text-secondary-600">Comisión</span>
                    <span className="font-bold text-secondary-900">{mayorista.comision_porcentaje}%</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-secondary-50 pb-3">
                    <span className="text-sm text-secondary-600">Estado Crediticio</span>
                    <Badge variant={mayorista.estado === 'activo' ? 'success' : 'warning'}>
                      {mayorista.estado ? mayorista.estado.toUpperCase() : 'N/A'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Detalles Adicionales */}
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-secondary-900 uppercase tracking-wider">
                  <FileText className="h-4 w-4 text-primary-500" />
                  Detalles Adicionales
                </h3>
                <div className="p-4 rounded-xl border border-secondary-100 bg-white shadow-sm space-y-4">
                  {mayorista.observaciones && (
                    <div>
                      <p className="text-xs font-medium text-secondary-400 uppercase tracking-tighter mb-2">Observaciones</p>
                      <p className="text-sm text-secondary-700 leading-relaxed italic border-l-2 border-secondary-100 pl-3">
                        "{mayorista.observaciones}"
                      </p>
                    </div>
                  )}
                  {mayorista.descripcion && (
                    <div>
                      <p className="text-xs font-medium text-secondary-400 uppercase tracking-tighter mb-2">Descripción</p>
                      <p className="text-sm text-secondary-700 leading-relaxed">
                        {mayorista.descripcion}
                      </p>
                    </div>
                  )}
                  {!mayorista.observaciones && !mayorista.descripcion && (
                    <p className="text-sm text-secondary-400 italic">No hay información adicional registrada.</p>
                  )}
                </div>
              </div>

              {/* Historial */}
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-secondary-900 uppercase tracking-wider">
                  <Calendar className="h-4 w-4 text-primary-500" />
                  Historial
                </h3>
                <div className="p-4 rounded-xl border border-secondary-100 bg-white shadow-sm divide-y divide-secondary-50">
                  <div className="py-2 flex justify-between items-center text-sm">
                    <span className="text-secondary-500">Fecha de Creación</span>
                    <span className="font-medium text-secondary-900">{formatDate(mayorista.fecha_creacion as string)}</span>
                  </div>
                  <div className="py-2 flex justify-between items-center text-sm">
                    <span className="text-secondary-500">Última Actualización</span>
                    <span className="font-medium text-secondary-900">{formatDate(mayorista.fecha_actualizacion as string)}</span>
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
      ) : null}
    </Modal>
  );
};

export default MayoristaDetailModal;
