/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Save, Info, Utensils, Building, MapPin, Clock, Users, Star } from 'lucide-react';
import { CreateRestauranteData } from '../../types/restaurante';
import { restauranteService } from '../../services/restauranteService';
import Swal from 'sweetalert2';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';

interface CreateRestauranteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateRestauranteModal: React.FC<CreateRestauranteModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<CreateRestauranteData>({
    // Datos del proveedor
    tipo: 'restaurante',
    nombre: '',
    descripcion: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    pais: 'Colombia',
    sitio_web: '',
    rating_promedio: 5,
    verificado: false,
    fecha_registro: new Date().toISOString(),
    ubicacion: '',
    redes_sociales: '',
    relevancia: 'media',
    usuario_creador: 'admin',
    tipo_documento: '',
    numero_documento: '',
    activo: true,

    // Datos específicos del restaurante
    tipo_cocina: '',
    horario_apertura: '08:00',
    horario_cierre: '22:00',
    capacidad: 50,
    menu_url: '',
    tiene_terraza: false,
    apto_celiacos: false,
    apto_vegetarianos: false,
    reservas_requeridas: false,
    entrega_a_domicilio: false,
    wifi: false,
    zonas_comunes: false,
    auditorio: false,
    pet_friendly: false,
    eventos: false,
    menu_vegana: false,
    bufete: false,
    catering: false,
    menu_infantil: false,
    parqueadero: false,
    terraza: false,
    sillas_bebe: false,
    decoraciones_fechas_especiales: false,
    rampa_discapacitados: false,
    aforo_maximo: 100,
    tipo_comida: '',
    precio_ascendente: 0
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked :
        type === 'number' ? parseFloat(value) : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.email.trim()) newErrors.email = 'El email es requerido';
    if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es requerido';
    if (!formData.direccion.trim()) newErrors.direccion = 'La dirección es requerida';
    if (!formData.ciudad.trim()) newErrors.ciudad = 'La ciudad es requerida';
    if (!formData.tipo_cocina.trim()) newErrors.tipo_cocina = 'El tipo de cocina es requerido';
    if (!formData.tipo_comida.trim()) newErrors.tipo_comida = 'El tipo de comida es requerido';
    if (!formData.tipo_documento) newErrors.tipo_documento = 'Seleccione un tipo de documento';
    if (!formData.numero_documento.trim()) newErrors.numero_documento = 'El número de documento es requerido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSaving(true);
      await restauranteService.createRestaurante(formData);
      onSuccess();
    } catch (error) {
      console.error('Error creating restaurante:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al crear el restaurante',
        customClass: {
          popup: 'rounded-xl shadow-2xl',
          title: 'text-xl font-bold text-gray-900',
          confirmButton: 'px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
        }
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Crear Nuevo Restaurante"
      description="Completa la información para registrar un nuevo establecimiento gastronómico"
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Columna 1: Información del Proveedor / General */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
                <Building className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Información del Proveedor</h3>
            </div>

            <div className="space-y-4">
              <Input
                label="Nombre del Restaurante *"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                error={errors.nombre}
                placeholder="Ej: El Sabor del Chef"
                leftIcon={<Utensils className="h-4 w-4" />}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Email *"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                  placeholder="ejemplo@correo.com"
                />
                <Input
                  label="Teléfono *"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  error={errors.telefono}
                  placeholder="+57 300 123 4567"
                />
              </div>

              <Input
                label="Dirección *"
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
                error={errors.direccion}
                placeholder="Calle 123 #45-67"
                leftIcon={<MapPin className="h-4 w-4" />}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Ciudad *"
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleInputChange}
                  error={errors.ciudad}
                  placeholder="Bogotá"
                />
                <Input
                  label="País *"
                  name="pais"
                  value={formData.pais}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Tipo Documento *"
                  name="tipo_documento"
                  value={formData.tipo_documento}
                  onChange={handleInputChange}
                  error={errors.tipo_documento}
                  options={[
                    { value: '', label: 'Seleccionar' },
                    { value: 'NIT', label: 'NIT' },
                    { value: 'CC', label: 'Cédula de Ciudadanía' },
                    { value: 'CE', label: 'Cédula de Extranjería' },
                    { value: 'RUT', label: 'RUT' }
                  ]}
                />
                <Input
                  label="Número Documento *"
                  name="numero_documento"
                  value={formData.numero_documento}
                  onChange={handleInputChange}
                  error={errors.numero_documento}
                  placeholder="900123456-7"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Rating Promedio *"
                  name="rating_promedio"
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={formData.rating_promedio}
                  onChange={handleInputChange}
                  leftIcon={<Star className="h-4 w-4 text-yellow-400" />}
                />
                <Select
                  label="Relevancia"
                  name="relevancia"
                  value={formData.relevancia}
                  onChange={handleInputChange}
                  options={[
                    { value: 'baja', label: 'Baja' },
                    { value: 'media', label: 'Media' },
                    { value: 'alta', label: 'Alta' }
                  ]}
                />
              </div>

              <Input
                label="Sitio Web"
                name="sitio_web"
                type="url"
                value={formData.sitio_web}
                onChange={handleInputChange}
                placeholder="https://www.ejemplo.com"
              />
            </div>
          </div>

          {/* Columna 2: Detalles del Restaurante y Servicios */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <div className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
                <Utensils className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Detalles del Establecimiento</h3>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Tipo de Cocina *"
                  name="tipo_cocina"
                  value={formData.tipo_cocina}
                  onChange={handleInputChange}
                  error={errors.tipo_cocina}
                  placeholder="Italiana, Mexicana..."
                />
                <Input
                  label="Tipo de Comida *"
                  name="tipo_comida"
                  value={formData.tipo_comida}
                  onChange={handleInputChange}
                  error={errors.tipo_comida}
                  placeholder="Casual, Gourmet..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Horario Apertura *"
                  name="horario_apertura"
                  type="time"
                  value={formData.horario_apertura}
                  onChange={handleInputChange}
                  leftIcon={<Clock className="h-4 w-4" />}
                />
                <Input
                  label="Horario Cierre *"
                  name="horario_cierre"
                  type="time"
                  value={formData.horario_cierre}
                  onChange={handleInputChange}
                  leftIcon={<Clock className="h-4 w-4" />}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Capacidad *"
                  name="capacidad"
                  type="number"
                  min="1"
                  value={formData.capacidad}
                  onChange={handleInputChange}
                  leftIcon={<Users className="h-4 w-4" />}
                />
                <Input
                  label="Aforo Máximo *"
                  name="aforo_maximo"
                  type="number"
                  min="1"
                  value={formData.aforo_maximo}
                  onChange={handleInputChange}
                  leftIcon={<Users className="h-4 w-4" />}
                />
              </div>

              <Input
                label="Precio Promedio (desde) *"
                name="precio_ascendente"
                type="number"
                min="0"
                value={formData.precio_ascendente}
                onChange={handleInputChange}
                placeholder="0"
              />

              <div className="space-y-4 pt-2">
                <label className="text-sm font-medium text-gray-700 block">Servicios Adicionales</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'wifi', label: 'WiFi Gratis' },
                    { key: 'parqueadero', label: 'Parqueadero' },
                    { key: 'pet_friendly', label: 'Pet Friendly' },
                    { key: 'entrega_a_domicilio', label: 'Domicilios' },
                    { key: 'terraza', label: 'Terraza' },
                    { key: 'eventos', label: 'Eventos' },
                    { key: 'menu_vegana', label: 'Menú Vegano' },
                    { key: 'apto_celiacos', label: 'Apto Celíacos' }
                  ].map((service) => (
                    <label key={service.key} className="flex items-center group cursor-pointer">
                      <input
                        type="checkbox"
                        name={service.key}
                        checked={(formData as Record<string, any>)[service.key] || false}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all cursor-pointer"
                      />
                      <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                        {service.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Textarea
            label="Descripción *"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleInputChange}
            error={errors.descripcion}
            placeholder="Describe el ambiente, especialidades y lo que hace único a este restaurante..."
            rows={4}
          />
        </div>

        <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center group">
            <input
              type="checkbox"
              name="activo"
              id="activo-create"
              checked={formData.activo}
              onChange={handleInputChange}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
            />
            <label htmlFor="activo-create" className="ml-3 text-sm font-medium text-gray-700 cursor-pointer">
              Establecimiento Activo
            </label>
            <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Info className="h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={saving}
              className="flex-1 sm:flex-none"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={saving}
              isLoading={saving}
              className="flex-1 sm:flex-none gap-2"
            >
              {!saving && <Save className="h-4 w-4" />}
              Crear Restaurante
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default CreateRestauranteModal;
