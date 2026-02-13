import React, { useState, useEffect } from 'react';
import { Building2, User, Save, Info } from 'lucide-react';
import { hotelService } from '../../services/hotelService';
import { ProveedorHotel, HotelInfo } from '../../types/hotel';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  hotelId: string;
  onSuccess: () => void;
}

interface HotelData {
  proveedor: ProveedorHotel;
  hotel: HotelInfo;
}

export const EditHotelModal: React.FC<Props> = ({ isOpen, onClose, hotelId, onSuccess }) => {
  const [data, setData] = useState<HotelData | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && hotelId) {
      loadHotelData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, hotelId]);

  const loadHotelData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await hotelService.getHotelById(hotelId);
      setData(response);
    } catch (err) {
      setError('Error al cargar los datos del hotel');
      console.error('Error loading hotel:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!data) return;

    try {
      setSaving(true);
      setError(null);
      await hotelService.updateHotel(hotelId, data);
      onSuccess();
      onClose();
    } catch (err) {
      setError('Error al guardar los cambios');
      console.error('Error saving hotel:', err);
    } finally {
      setSaving(false);
    }
  };

  const updateProveedorField = (field: keyof ProveedorHotel, value: string | number | boolean) => {
    if (!data) return;
    setData({
      ...data,
      proveedor: {
        ...data.proveedor,
        [field]: value
      }
    });
  };

  const updateHotelField = (field: keyof HotelInfo, value: string | number | boolean) => {
    if (!data) return;
    setData({
      ...data,
      hotel: {
        ...data.hotel,
        [field]: value
      }
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Hotel"
      description="Modifica la información del proveedor y hotel"
      size="3xl"
    >
      <div className="space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="text-secondary-600 font-medium">Cargando datos...</span>
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
              <div className="flex items-center gap-2 pb-2 border-b border-secondary-100">
                <div className="p-1.5 bg-primary-100 text-primary-700 rounded-lg">
                  <User className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-secondary-900">Información del Proveedor</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Input
                  label="Nombre"
                  value={data.proveedor.nombre}
                  onChange={(e) => updateProveedorField('nombre', e.target.value)}
                />
                <Input
                  label="Email"
                  value={data.proveedor.email}
                  readOnly
                  disabled
                  className="bg-secondary-50 cursor-not-allowed"
                />
                <Input
                  label="Teléfono"
                  value={data.proveedor.telefono}
                  onChange={(e) => updateProveedorField('telefono', e.target.value)}
                />
                <Input
                  label="Ciudad"
                  value={data.proveedor.ciudad}
                  onChange={(e) => updateProveedorField('ciudad', e.target.value)}
                />
                <Input
                  label="País"
                  value={data.proveedor.pais}
                  onChange={(e) => updateProveedorField('pais', e.target.value)}
                />
                <Input
                  label="Sitio Web"
                  type="url"
                  value={data.proveedor.sitio_web}
                  onChange={(e) => updateProveedorField('sitio_web', e.target.value)}
                />
                <Input
                  label="Dirección"
                  value={data.proveedor.direccion}
                  onChange={(e) => updateProveedorField('direccion', e.target.value)}
                />
                <Input
                  label="Ubicación"
                  value={data.proveedor.ubicacion}
                  onChange={(e) => updateProveedorField('ubicacion', e.target.value)}
                />
                <Input
                  label="Rating Promedio"
                  type="number"
                  min={1}
                  max={5}
                  step={0.1}
                  value={data.proveedor.rating_promedio}
                  onChange={(e) => updateProveedorField('rating_promedio', parseFloat(e.target.value))}
                />
                <Input
                  label="Tipo Documento"
                  value={data.proveedor.tipo_documento}
                  readOnly
                  disabled
                  className="bg-secondary-50 cursor-not-allowed"
                />
                <Input
                  label="Número Documento"
                  value={data.proveedor.numero_documento}
                  readOnly
                  disabled
                  className="bg-secondary-50 cursor-not-allowed"
                />

                <div className="flex items-center h-full pt-6">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={data.proveedor.verificado}
                      onChange={(e) => updateProveedorField('verificado', e.target.checked)}
                      className="w-4 h-4 text-primary-600 rounded border-secondary-300 focus:ring-primary-500 transition duration-150 ease-in-out"
                    />
                    <span className="text-sm text-secondary-700 group-hover:text-secondary-900">Verificado</span>
                  </label>
                </div>
              </div>

              <Textarea
                label="Descripción"
                value={data.proveedor.descripcion}
                onChange={(e) => updateProveedorField('descripcion', e.target.value)}
                rows={3}
              />
            </div>

            {/* Información del Hotel */}
            <div className="space-y-4 pt-4 border-t border-secondary-100">
              <div className="flex items-center gap-2 pb-2 border-b border-secondary-100">
                <div className="p-1.5 bg-success-100 text-success-700 rounded-lg">
                  <Building2 className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-secondary-900">Detalles del Hotel</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Input
                  label="Estrellas"
                  type="number"
                  min={1}
                  max={5}
                  value={data.hotel.estrellas}
                  onChange={(e) => updateHotelField('estrellas', parseInt(e.target.value))}
                />
                <Input
                  label="Número de Habitaciones"
                  type="number"
                  min={1}
                  value={data.hotel.numero_habitaciones}
                  onChange={(e) => updateHotelField('numero_habitaciones', parseInt(e.target.value))}
                />
                <Input
                  label="Tipo de Habitación"
                  value={data.hotel.tipo_habitacion}
                  onChange={(e) => updateHotelField('tipo_habitacion', e.target.value)}
                />
                <Input
                  label="Check-in"
                  type="time"
                  value={data.hotel.check_in}
                  onChange={(e) => updateHotelField('check_in', e.target.value)}
                />
                <Input
                  label="Check-out"
                  type="time"
                  value={data.hotel.check_out}
                  onChange={(e) => updateHotelField('check_out', e.target.value)}
                />
                <Input
                  label="Precio Base"
                  type="number"
                  min={0}
                  step={0.01}
                  value={data.hotel.precio_ascendente}
                  onChange={(e) => updateHotelField('precio_ascendente', parseFloat(e.target.value))}
                />
              </div>

              <Textarea
                label="Servicios Incluidos"
                value={data.hotel.servicios_incluidos}
                onChange={(e) => updateHotelField('servicios_incluidos', e.target.value)}
                rows={3}
              />

              {/* Checkboxes para servicios */}
              <div className="space-y-3">
                <h5 className="text-sm font-medium text-secondary-700">Servicios y Facilidades</h5>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {[
                    { key: 'recepcion_24_horas', label: 'Recepción 24h' },
                    { key: 'piscina', label: 'Piscina' },
                    { key: 'admite_mascotas', label: 'Admite Mascotas' },
                    { key: 'pet_friendly', label: 'Pet Friendly' },
                    { key: 'tiene_estacionamiento', label: 'Estacionamiento' },
                    { key: 'servicio_restaurante', label: 'Restaurante' },
                    { key: 'bar', label: 'Bar' },
                    { key: 'room_service', label: 'Room Service' },
                    { key: 'asensor', label: 'Ascensor' },
                    { key: 'rampa_discapacitado', label: 'Rampa Discapacitados' },
                    { key: 'auditorio', label: 'Auditorio' },
                    { key: 'parqueadero', label: 'Parqueadero' },
                    { key: 'planta_energia', label: 'Planta Energía' },
                  ].map((service) => (
                    <label key={service.key} className="flex items-center gap-2 cursor-pointer group p-2 hover:bg-secondary-50 rounded-lg transition-colors border border-transparent hover:border-secondary-100">
                      <input
                        type="checkbox"
                        checked={data.hotel[service.key as keyof HotelInfo] as boolean}
                        onChange={(e) => updateHotelField(service.key as keyof HotelInfo, e.target.checked)}
                        className="w-4 h-4 text-primary-600 rounded border-secondary-300 focus:ring-primary-500 transition duration-150 ease-in-out"
                      />
                      <span className="text-sm text-secondary-700 group-hover:text-secondary-900">
                        {service.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="flex justify-end gap-3 pt-6 border-t border-secondary-100 mt-4">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            isLoading={saving}
            disabled={!data}
            leftIcon={!saving && <Save className="h-4 w-4" />}
          >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
