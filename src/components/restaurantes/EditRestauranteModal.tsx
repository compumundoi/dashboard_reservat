/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from 'react';
import { Save, Info, Utensils, Building, MapPin, Clock, Users, Star } from 'lucide-react';
import { UpdateRestauranteData } from '../../types/restaurante';
import { restauranteService } from '../../services/restauranteService';
import Swal from 'sweetalert2';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';

interface EditRestauranteModalProps {
  restauranteId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const EditRestauranteModal: React.FC<EditRestauranteModalProps> = ({
  restauranteId,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<UpdateRestauranteData>({});

  const loadRestauranteData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await restauranteService.getRestauranteById(restauranteId);
      setFormData({
        // Datos del proveedor
        tipo: data.tipo,
        nombre: data.nombre,
        descripcion: data.descripcion,
        email: data.email,
        telefono: data.telefono,
        direccion: data.direccion,
        ciudad: data.ciudad,
        pais: data.pais,
        sitio_web: data.sitio_web,
        rating_promedio: data.rating_promedio,
        verificado: data.verificado,
        fecha_registro: data.fecha_registro,
        ubicacion: data.ubicacion,
        redes_sociales: data.redes_sociales,
        relevancia: data.relevancia,
        usuario_creador: data.usuario_creador,
        tipo_documento: data.tipo_documento,
        numero_documento: data.numero_documento,
        activo: data.activo,

        // Datos específicos del restaurante
        tipo_cocina: data.tipo_cocina,
        horario_apertura: data.horario_apertura,
        horario_cierre: data.horario_cierre,
        capacidad: data.capacidad,
        menu_url: data.menu_url,
        tiene_terraza: data.tiene_terraza,
        apto_celiacos: data.apto_celiacos,
        apto_vegetarianos: data.apto_vegetarianos,
        reservas_requeridas: data.reservas_requeridas,
        entrega_a_domicilio: data.entrega_a_domicilio,
        wifi: data.wifi,
        zonas_comunes: data.zonas_comunes,
        auditorio: data.auditorio,
        pet_friendly: data.pet_friendly,
        eventos: data.eventos,
        menu_vegana: data.menu_vegana,
        bufete: data.bufete,
        catering: data.catering,
        menu_infantil: data.menu_infantil,
        parqueadero: data.parqueadero,
        terraza: data.terraza,
        sillas_bebe: data.sillas_bebe,
        decoraciones_fechas_especiales: data.decoraciones_fechas_especiales,
        rampa_discapacitados: data.rampa_discapacitados,
        aforo_maximo: data.aforo_maximo,
        tipo_comida: data.tipo_comida,
        precio_ascendente: data.precio_ascendente
      });
    } catch (error) {
      console.error('Error loading restaurante data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al cargar los datos del restaurante'
      });
    } finally {
      setLoading(false);
    }
  }, [restauranteId]);

  useEffect(() => {
    if (isOpen && restauranteId) {
      loadRestauranteData();
    }
  }, [isOpen, restauranteId, loadRestauranteData]);

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
    if (!formData.nombre?.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.email?.trim()) newErrors.email = 'El email es requerido';
    if (!formData.telefono?.trim()) newErrors.telefono = 'El teléfono es requerido';
    if (!formData.direccion?.trim()) newErrors.direccion = 'La dirección es requerida';
    if (!formData.ciudad?.trim()) newErrors.ciudad = 'La ciudad es requerida';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSaving(true);
      await restauranteService.updateRestaurante(restauranteId, formData);
      onSuccess();
    } catch (error) {
      console.error('Error updating restaurante:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al actualizar el restaurante',
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
      title="Editar Restaurante"
      description="Actualiza la información del establecimiento gastronómico"
      size="xl"
    >
      {loading ? (
        <div className="space-y-8 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="h-8 bg-gray-100 rounded-lg w-1/2"></div>
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-50 rounded-lg w-full"></div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-gray-100 rounded-lg w-1/2"></div>
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-50 rounded-lg w-full"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Columna 1: Información General */}
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
                  value={formData.nombre || ''}
                  onChange={handleInputChange}
                  error={errors.nombre}
                  leftIcon={<Utensils className="h-4 w-4" />}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Email *"
                    name="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    error={errors.email}
                  />
                  <Input
                    label="Teléfono *"
                    name="telefono"
                    value={formData.telefono || ''}
                    onChange={handleInputChange}
                    error={errors.telefono}
                  />
                </div>

                <Input
                  label="Dirección *"
                  name="direccion"
                  value={formData.direccion || ''}
                  onChange={handleInputChange}
                  error={errors.direccion}
                  leftIcon={<MapPin className="h-4 w-4" />}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Ciudad *"
                    name="ciudad"
                    value={formData.ciudad || ''}
                    onChange={handleInputChange}
                    error={errors.ciudad}
                  />
                  <Input
                    label="País *"
                    name="pais"
                    value={formData.pais || ''}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Tipo Documento *"
                    name="tipo_documento"
                    value={formData.tipo_documento || ''}
                    onChange={handleInputChange}
                    options={[
                      { value: '', label: 'Seleccionar' },
                      { value: 'NIT', label: 'NIT' },
                      { value: 'CC', label: 'Cédula' },
                      { value: 'CE', label: 'CE' },
                      { value: 'RUT', label: 'RUT' }
                    ]}
                  />
                  <Input
                    label="Número Documento *"
                    name="numero_documento"
                    value={formData.numero_documento || ''}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Rating *"
                    name="rating_promedio"
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={formData.rating_promedio || 5}
                    onChange={handleInputChange}
                    leftIcon={<Star className="h-4 w-4 text-yellow-400" />}
                  />
                  <Select
                    label="Relevancia"
                    name="relevancia"
                    value={formData.relevancia || 'media'}
                    onChange={handleInputChange}
                    options={[
                      { value: 'baja', label: 'Baja' },
                      { value: 'media', label: 'Media' },
                      { value: 'alta', label: 'Alta' }
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* Columna 2: Detalles y Servicios */}
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
                    label="Tipo de Cocina"
                    name="tipo_cocina"
                    value={formData.tipo_cocina || ''}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="Estilo"
                    name="tipo_comida"
                    value={formData.tipo_comida || ''}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Apertura"
                    name="horario_apertura"
                    type="time"
                    value={formData.horario_apertura || ''}
                    onChange={handleInputChange}
                    leftIcon={<Clock className="h-4 w-4" />}
                  />
                  <Input
                    label="Cierre"
                    name="horario_cierre"
                    type="time"
                    value={formData.horario_cierre || ''}
                    onChange={handleInputChange}
                    leftIcon={<Clock className="h-4 w-4" />}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Capacidad"
                    name="capacidad"
                    type="number"
                    value={formData.capacidad || 0}
                    onChange={handleInputChange}
                    leftIcon={<Users className="h-4 w-4" />}
                  />
                  <Input
                    label="Precio Promedio"
                    name="precio_ascendente"
                    type="number"
                    value={formData.precio_ascendente || 0}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-4 pt-2">
                  <label className="text-sm font-medium text-gray-700 block">Características</label>
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
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
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

          <Textarea
            label="Descripción *"
            name="descripcion"
            value={formData.descripcion || ''}
            onChange={handleInputChange}
            error={errors.descripcion}
            rows={4}
          />

          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center group">
              <input
                type="checkbox"
                name="activo"
                id="activo-edit"
                checked={formData.activo || false}
                onChange={handleInputChange}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
              />
              <label htmlFor="activo-edit" className="ml-3 text-sm font-medium text-gray-700 cursor-pointer">
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
                Guardar Cambios
              </Button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default EditRestauranteModal;
