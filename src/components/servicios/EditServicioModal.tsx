import React, { useState, useEffect } from 'react';
import { Package, Building, MapPin, Save, Info } from 'lucide-react';
import Swal from 'sweetalert2';
import { EditServicioModalProps, ActualizarServicio } from '../../types/servicio';
import { validarPrecio } from '../../services/servicioService';
import ProveedorAutocomplete from '../common/ProveedorAutocomplete';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';

const EditServicioModal: React.FC<EditServicioModalProps> = ({ isOpen, onClose, servicio, onSave }) => {
  const [formData, setFormData] = useState<ActualizarServicio>({
    id_servicio: '',
    proveedor_id: '',
    nombre: '',
    descripcion: '',
    tipo_servicio: '',
    precio: 0,
    moneda: 'COP',
    activo: true,
    fecha_creacion: '',
    fecha_actualizacion: '',
    relevancia: 'Media',
    ciudad: '',
    departamento: '',
    ubicacion: '',
    detalles_del_servicio: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedProveedorName, setSelectedProveedorName] = useState('');

  useEffect(() => {
    if (servicio) {
      setFormData({
        id_servicio: servicio.id_servicio,
        proveedor_id: servicio.proveedor_id,
        nombre: servicio.nombre,
        descripcion: servicio.descripcion,
        tipo_servicio: servicio.tipo_servicio,
        precio: servicio.precio,
        moneda: servicio.moneda,
        activo: servicio.activo,
        fecha_creacion: servicio.fecha_creacion,
        fecha_actualizacion: new Date().toISOString(),
        relevancia: servicio.relevancia,
        ciudad: servicio.ciudad,
        departamento: servicio.departamento,
        ubicacion: servicio.ubicacion,
        detalles_del_servicio: servicio.detalles_del_servicio
      });
      setSelectedProveedorName(servicio.proveedorNombre || '');
      setErrors({});
    }
  }, [servicio]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
        type === 'number' ? Number(value) : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    } else if (formData.descripcion.length < 10) {
      newErrors.descripcion = 'La descripción debe tener al menos 10 caracteres';
    }

    if (!formData.tipo_servicio.trim()) {
      newErrors.tipo_servicio = 'El tipo de servicio es requerido';
    }

    if (!formData.proveedor_id.trim()) {
      newErrors.proveedor_id = 'Debe seleccionar un proveedor';
    }

    if (!validarPrecio(formData.precio)) {
      newErrors.precio = 'El precio debe ser mayor o igual a 0';
    }

    if (!formData.ciudad.trim()) {
      newErrors.ciudad = 'La ciudad es requerida';
    }

    if (!formData.departamento.trim()) {
      newErrors.departamento = 'El departamento es requerido';
    }

    if (!formData.ubicacion.trim()) {
      newErrors.ubicacion = 'La ubicación es requerida';
    }

    if (!formData.detalles_del_servicio.trim()) {
      newErrors.detalles_del_servicio = 'Los detalles del servicio son requeridos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el servicio',
        customClass: {
          popup: 'rounded-xl shadow-2xl',
          title: 'text-xl font-bold text-gray-900',
          confirmButton: 'px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Servicio"
      description="Modifica la información del servicio seleccionado"
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Información Principal */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-secondary-100">
              <div className="p-1.5 bg-primary-100 text-primary-700 rounded-lg">
                <Package className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900">Información General</h3>
            </div>

            <div className="space-y-4">
              <Input
                label="Nombre del Servicio *"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                error={errors.nombre}
                placeholder="Ej: Tour Guatavita Premium"
              />

              <Input
                label="Tipo de Servicio *"
                name="tipo_servicio"
                value={formData.tipo_servicio}
                onChange={handleInputChange}
                error={errors.tipo_servicio}
                placeholder="Ej: Hospedaje, Transporte, Alimentación"
              />

              <Textarea
                label="Descripción Corta *"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                error={errors.descripcion}
                placeholder="Una breve descripción para mostrar en listados"
                rows={3}
              />

              <Textarea
                label="Detalles del Servicio *"
                name="detalles_del_servicio"
                value={formData.detalles_del_servicio}
                onChange={handleInputChange}
                error={errors.detalles_del_servicio}
                placeholder="Información técnica, inclusiones, restricciones, cada detalle cuenta"
                rows={4}
              />
            </div>
          </div>

          {/* Información Comercial y Ubicación */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-secondary-100">
              <div className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
                <Building className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900">Información Comercial</h3>
            </div>

            <div className="space-y-4">
              <ProveedorAutocomplete
                value={formData.proveedor_id}
                selectedName={selectedProveedorName}
                onChange={(id, nombre) => {
                  setFormData(prev => ({ ...prev, proveedor_id: id }));
                  setSelectedProveedorName(nombre);
                  if (errors.proveedor_id) {
                    setErrors(prev => ({ ...prev, proveedor_id: '' }));
                  }
                }}
                error={errors.proveedor_id}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Precio Unitario *"
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleInputChange}
                  error={errors.precio}
                  min="0"
                  placeholder="0"
                />
                <Select
                  label="Moneda *"
                  name="moneda"
                  value={formData.moneda}
                  onChange={handleInputChange}
                  options={[
                    { value: 'COP', label: 'COP - Peso Colombiano' },
                    { value: 'USD', label: 'USD - Dólar Americano' },
                    { value: 'EUR', label: 'EUR - Euro' }
                  ]}
                />
              </div>

              <Select
                label="Nivel de Relevancia"
                name="relevancia"
                value={formData.relevancia}
                onChange={handleInputChange}
                options={[
                  { value: 'Baja', label: 'Baja' },
                  { value: 'Media', label: 'Media' },
                  { value: 'Alta', label: 'Alta' }
                ]}
              />
            </div>

            <div className="flex items-center gap-2 pb-2 border-b border-secondary-100 pt-4">
              <div className="p-1.5 bg-rose-100 text-rose-700 rounded-lg">
                <MapPin className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900">Ubicación</h3>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Ciudad *"
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleInputChange}
                  error={errors.ciudad}
                  placeholder="Ciudad"
                />
                <Input
                  label="Departamento *"
                  name="departamento"
                  value={formData.departamento}
                  onChange={handleInputChange}
                  error={errors.departamento}
                  placeholder="Departamento"
                />
              </div>
              <Input
                label="Dirección / Punto de Encuentro *"
                name="ubicacion"
                value={formData.ubicacion}
                onChange={handleInputChange}
                error={errors.ubicacion}
                placeholder="Ubicación exacta o descripción del punto de encuentro"
              />
            </div>
          </div>
        </div>

        {/* Footer and Settings */}
        <div className="pt-6 border-t border-secondary-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center group cursor-pointer">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                name="activo"
                id="activo-edit"
                checked={formData.activo}
                onChange={handleInputChange}
                className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded-md transition-all cursor-pointer"
              />
            </div>
            <label htmlFor="activo-edit" className="ml-3 text-sm font-medium text-secondary-700 cursor-pointer">
              Servicio activo
            </label>
            <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Info className="h-4 w-4 text-secondary-400" />
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 sm:flex-none"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              isLoading={loading}
              className="flex-1 sm:flex-none gap-2"
            >
              {!loading && <Save className="h-4 w-4" />}
              Guardar Cambios
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default EditServicioModal;
