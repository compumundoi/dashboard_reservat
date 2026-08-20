import React, { useState } from 'react';
import { Save, Building, Info } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import SelectProveedorDisponible from '../common/SelectProveedorDisponible';
import { Select } from '../ui/Select';
import { LocationFields } from '../ui/LocationFields';
import { ValorUbicacion } from '../../types/ubicacion';
import { Textarea } from '../ui/Textarea';

// ... (keep initialForm same as before or define it here if not exported)
// Formulario inicial con valores por defecto
const initialForm = {
  proveedor: {
    tipo: 'hotel',
    nombre: '',
    descripcion: '',
    email: '',
    telefono: '',
    direccion: '',
    municipio_id: null as number | null,
    ciudad: '',
    pais: '',
    sitio_web: '',
    rating_promedio: 4,
    verificado: false,
    fecha_registro: new Date().toISOString(),
    ubicacion: '',
    redes_sociales: '',
    relevancia: 'Alto',
    usuario_creador: 'admin',
    tipo_documento: 'NIT',
    numero_documento: '',
    rnt: '',
    activo: true,
  },
  hotel: {
    estrellas: 3,
    numero_habitaciones: 20,
    servicios_incluidos: '',
    check_in: '14:00',
    check_out: '12:00',
    admite_mascotas: false,
    tiene_estacionamiento: false,
    tipo_habitacion: 'Standard',
    precio_ascendente: 50.0,
    servicio_restaurante: false,
    recepcion_24_horas: false,
    bar: false,
    room_service: false,
    asensor: false,
    rampa_discapacitado: false,
    pet_friendly: false,
    auditorio: false,
    parqueadero: false,
    piscina: false,
    planta_energia: false,
  },
};

// La ubicación vive aparte del resto del formulario: son ids del catálogo,
// no texto. Al enviar se vuelca sobre el payload del proveedor.
const UBICACION_INICIAL: ValorUbicacion = {
  paisId: null,
  departamentoId: null,
  municipioId: null,
  direccion: '',
};

interface CreateHotelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: typeof initialForm) => void;
  loading: boolean;
}

export const CreateHotelModal: React.FC<CreateHotelModalProps> = ({
  isOpen,
  onClose,
  onSave,
  loading,
}) => {
  const [form, setForm] = useState(initialForm);
  const [ubicacion, setUbicacion] = useState<ValorUbicacion>(UBICACION_INICIAL);

  const updateProveedorField = (field: string, value: string | number | boolean) => {
    setForm(prev => ({
      ...prev,
      proveedor: {
        ...prev.proveedor,
        [field]: value
      }
    }));
  };

  const updateHotelField = (field: string, value: string | number | boolean) => {
    setForm(prev => ({
      ...prev,
      hotel: {
        ...prev.hotel,
        [field]: value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones básicas
    if (!form.proveedor.nombre.trim()) {
      alert('El nombre del proveedor es requerido');
      return;
    }
    if (!form.proveedor.email.trim()) {
      alert('El email del proveedor es requerido');
      return;
    }
    if (!form.proveedor.telefono.trim()) {
      alert('El teléfono del proveedor es requerido');
      return;
    }
    if (ubicacion.departamentoId === null) {
      alert('El departamento es requerido');
      return;
    }
    if (ubicacion.municipioId === null) {
      alert('El municipio es requerido');
      return;
    }
    if (!ubicacion.direccion.trim()) {
      alert('La dirección es requerida');
      return;
    }

    // Formatear datos para envío
    const payload = {
      proveedor: {
        ...form.proveedor,
        // ciudad, departamento y país los resuelve el backend desde municipio_id.
        municipio_id: ubicacion.municipioId,
        direccion: ubicacion.direccion,
        fecha_registro: new Date().toISOString(),
      },
      hotel: {
        ...form.hotel,
        check_in: form.hotel.check_in + ':00',
        check_out: form.hotel.check_out + ':00',
      }
    };

    onSave(payload);
  };

  const handleClose = () => {
    setForm(initialForm);
    setUbicacion(UBICACION_INICIAL);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Crear Nuevo Hotel"
      description="Completa la información del proveedor y hotel"
      size="3xl"
      dismissible={false}
    >
      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Información del Proveedor */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-secondary-100">
            <div className="p-1.5 bg-primary-100 text-primary-700 rounded-lg">
              <Info className="w-4 h-4" />
            </div>
            <h4 className="font-semibold text-secondary-900">Información del Proveedor</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              label="Nombre del Hotel *"
              placeholder="Ej: Hotel Paradise"
              value={form.proveedor.nombre}
              onChange={(e) => updateProveedorField('nombre', e.target.value)}
              required
            />
            <SelectProveedorDisponible
              isOpen={isOpen}
              value={form.proveedor.email}
              onChange={(email) => updateProveedorField('email', email)}
            />
            <Input
              label="Teléfono *"
              type="tel"
              placeholder="1234567890"
              value={form.proveedor.telefono}
              onChange={(e) => updateProveedorField('telefono', e.target.value)}
              required
            />
            <Input
              label="Sitio Web"
              type="url"
              placeholder="https://hotel.com"
              value={form.proveedor.sitio_web}
              onChange={(e) => updateProveedorField('sitio_web', e.target.value)}
            />
            <div className="md:col-span-2 lg:col-span-3">
              <LocationFields
                value={ubicacion}
                onChange={setUbicacion}
                required
                direccionPlaceholder="Calle Principal 123"
              />
            </div>
            <Input
              label="Ubicación (Barrio/Zona)"
              placeholder="Centro"
              value={form.proveedor.ubicacion}
              onChange={(e) => updateProveedorField('ubicacion', e.target.value)}
            />
            <Input
              label="Rating Promedio"
              type="number"
              min={1}
              max={5}
              step={0.1}
              value={form.proveedor.rating_promedio}
              onChange={(e) => updateProveedorField('rating_promedio', parseFloat(e.target.value))}
            />
            <Select
              label="Tipo Documento"
              value={form.proveedor.tipo_documento}
              onChange={(e) => updateProveedorField('tipo_documento', e.target.value)}
              options={[
                { value: 'NIT', label: 'NIT' },
                { value: 'CC', label: 'Cédula' },
                { value: 'CE', label: 'Cédula Extranjería' },
              ]}
            />
            <Input
              label="Número Documento"
              placeholder="123456789"
              value={form.proveedor.numero_documento}
              onChange={(e) => updateProveedorField('numero_documento', e.target.value)}
            />
            <Input
              label="RNT"
              placeholder="12345678"
              inputMode="numeric"
              maxLength={8}
              value={form.proveedor.rnt}
              onChange={(e) =>
                updateProveedorField('rnt', e.target.value.replace(/\D/g, '').slice(0, 8))
              }
            />

            <div className="flex items-center h-full pt-6">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={form.proveedor.verificado}
                  onChange={(e) => updateProveedorField('verificado', e.target.checked)}
                  className="w-4 h-4 text-primary-600 rounded border-secondary-300 focus:ring-primary-500 transition duration-150 ease-in-out"
                />
                <span className="text-sm text-secondary-700 group-hover:text-secondary-900">Verificado</span>
              </label>
            </div>
          </div>
          <Textarea
            label="Descripción"
            placeholder="Descripción del hotel..."
            value={form.proveedor.descripcion}
            onChange={(e) => updateProveedorField('descripcion', e.target.value)}
            rows={3}
          />
        </div>

        {/* Información del Hotel */}
        <div className="space-y-4 pt-4 border-t border-secondary-100">
          <div className="flex items-center gap-2 pb-2 border-b border-secondary-100">
            <div className="p-1.5 bg-success-100 text-success-700 rounded-lg">
              <Building className="w-4 h-4" />
            </div>
            <h4 className="font-semibold text-secondary-900">Detalles del Hotel</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              label="Estrellas"
              type="number"
              min={1}
              max={5}
              value={form.hotel.estrellas}
              onChange={(e) => updateHotelField('estrellas', parseInt(e.target.value))}
            />
            <Input
              label="Número de Habitaciones"
              type="number"
              min={1}
              value={form.hotel.numero_habitaciones}
              onChange={(e) => updateHotelField('numero_habitaciones', parseInt(e.target.value))}
            />
            <Select
              label="Tipo de Habitación"
              value={form.hotel.tipo_habitacion}
              onChange={(e) => updateHotelField('tipo_habitacion', e.target.value)}
              options={[
                { value: 'Standard', label: 'Standard' },
                { value: 'Superior', label: 'Superior' },
                { value: 'Deluxe', label: 'Deluxe' },
                { value: 'Suite', label: 'Suite' },
                { value: 'Presidential', label: 'Presidential' },
              ]}
            />
            <Input
              label="Check-in"
              type="time"
              value={form.hotel.check_in}
              onChange={(e) => updateHotelField('check_in', e.target.value)}
            />
            <Input
              label="Check-out"
              type="time"
              value={form.hotel.check_out}
              onChange={(e) => updateHotelField('check_out', e.target.value)}
            />
            <Input
              label="Precio Base"
              type="number"
              min={0}
              step={0.01}
              value={form.hotel.precio_ascendente}
              onChange={(e) => updateHotelField('precio_ascendente', parseFloat(e.target.value))}
            />
          </div>

          <Textarea
            label="Servicios Incluidos"
            placeholder="Desayuno, WiFi, Parking, etc..."
            value={form.hotel.servicios_incluidos}
            onChange={(e) => updateHotelField('servicios_incluidos', e.target.value)}
            rows={3}
          />

          <div className="space-y-3">
            <h5 className="text-sm font-medium text-secondary-700">Servicios y Facilidades</h5>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {[
                { key: 'recepcion_24_horas', label: 'Recepción 24h' },
                { key: 'piscina', label: 'Piscina' },
                { key: 'admite_mascotas', label: 'Admite Mascotas' },
                { key: 'pet_friendly', label: 'Servicios especializados' },
                { key: 'tiene_estacionamiento', label: 'Estacionamiento' },
                { key: 'servicio_restaurante', label: 'Restaurante' },
                { key: 'bar', label: 'Bar' },
                { key: 'room_service', label: 'Servicio al cuarto' },
                { key: 'asensor', label: 'Ascensor' },
                { key: 'rampa_discapacitado', label: 'Rampa Discapacitados' },
                { key: 'auditorio', label: 'Auditorio' },
                { key: 'parqueadero', label: 'Parqueadero' },
                { key: 'planta_energia', label: 'Planta Energía' },
              ].map((service) => (
                <label key={service.key} className="flex items-center gap-2 cursor-pointer group p-2 hover:bg-secondary-50 rounded-lg transition-colors border border-transparent hover:border-secondary-100">
                  <input
                    type="checkbox"
                    checked={form.hotel[service.key as keyof typeof form.hotel] as boolean}
                    onChange={(e) => updateHotelField(service.key, e.target.checked)}
                    className="w-4 h-4 text-primary-600 rounded border-secondary-300 focus:ring-primary-500 transition duration-150 ease-in-out"
                  />
                  <span className="text-sm text-secondary-700 group-hover:text-secondary-900">{service.label}</span>
                </label>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-6 border-t border-secondary-100">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            isLoading={loading}
            leftIcon={!loading && <Save className="h-4 w-4" />}
          >
            {loading ? 'Creando...' : 'Crear Hotel'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
