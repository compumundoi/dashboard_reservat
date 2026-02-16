import React, { useState, useEffect } from 'react';
import { Shield, Save, Calendar, FileText, User } from 'lucide-react';
import { RestriccionModalProps } from '../../types/restriccion';
import { restriccionService } from '../../services/restriccionService';
import Swal from 'sweetalert2';
import ServicioAutocomplete from '../common/ServicioAutocomplete';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

const EditRestriccionModal: React.FC<RestriccionModalProps> = ({ isOpen, onClose, restriccion, onSave }) => {
  const [formData, setFormData] = useState({
    servicio_id: '',
    fecha: '',
    motivo: '',
    bloqueado_por: '',
    bloqueo_activo: true
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedServicioName, setSelectedServicioName] = useState('');

  useEffect(() => {
    if (restriccion) {
      // Convertir la fecha al formato datetime-local
      const fechaISO = new Date(restriccion.fecha).toISOString().slice(0, 16);

      setFormData({
        servicio_id: restriccion.servicio_id,
        fecha: fechaISO,
        motivo: restriccion.motivo,
        bloqueado_por: restriccion.bloqueado_por,
        bloqueo_activo: restriccion.bloqueo_activo
      });
      setSelectedServicioName(restriccion.servicio_nombre || '');
    }
  }, [restriccion]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.servicio_id.trim()) {
      newErrors.servicio_id = 'Debe seleccionar un servicio';
    }

    if (!formData.fecha) {
      newErrors.fecha = 'La fecha es requerida';
    } else {
      const fechaSeleccionada = new Date(formData.fecha);
      const ahora = new Date();
      if (fechaSeleccionada < ahora) {
        newErrors.fecha = 'La fecha no puede ser anterior a la fecha actual';
      }
    }

    if (!formData.motivo.trim()) {
      newErrors.motivo = 'El motivo es requerido';
    } else if (formData.motivo.trim().length < 10) {
      newErrors.motivo = 'El motivo debe tener al menos 10 caracteres';
    }

    if (!formData.bloqueado_por.trim()) {
      newErrors.bloqueado_por = 'El campo "Bloqueado por" es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !restriccion) return;

    try {
      setLoading(true);

      const updateData = {
        servicio_id: formData.servicio_id.trim(),
        fecha: new Date(formData.fecha).toISOString(),
        motivo: formData.motivo.trim(),
        bloqueado_por: formData.bloqueado_por.trim(),
        bloqueo_activo: formData.bloqueo_activo
      };

      await restriccionService.updateRestriccion(restriccion.id, updateData);

      Swal.fire({
        icon: 'success',
        title: 'Restricción actualizada',
        text: 'La restricción ha sido actualizada correctamente',
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: 'rounded-xl shadow-2xl',
        }
      });

      onSave?.();
      onClose();
    } catch (error) {
      console.error('Error al actualizar restricción:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar la restricción. Por favor, intenta de nuevo.',
        customClass: {
          popup: 'rounded-xl shadow-2xl',
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  if (!isOpen || !restriccion) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Restricción"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 gap-8">

          {/* Section: General Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
                <Calendar className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Información del Bloqueo</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 md:col-span-2">
                <ServicioAutocomplete
                  value={formData.servicio_id}
                  selectedName={selectedServicioName}
                  onChange={(id, nombre) => {
                    setFormData(prev => ({ ...prev, servicio_id: id }));
                    setSelectedServicioName(nombre);
                    if (errors.servicio_id) {
                      setErrors(prev => ({ ...prev, servicio_id: '' }));
                    }
                  }}
                  error={errors.servicio_id}
                />
              </div>

              <div>
                <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha y Hora *
                </label>
                <input
                  type="datetime-local"
                  id="fecha"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleInputChange}
                  min={new Date().toISOString().slice(0, 16)}
                  className={`flex h-10 w-full rounded-xl border border-secondary-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 ${errors.fecha ? 'border-red-500 focus-visible:ring-red-500' : ''
                    }`}
                  disabled={loading}
                />
                {errors.fecha && (
                  <p className="mt-1 text-xs text-red-600 font-medium flex items-center gap-1">
                    <Shield className="h-3 w-3" /> {errors.fecha}
                  </p>
                )}
              </div>

              <div>
                <Input
                  label="Bloqueado Por *"
                  name="bloqueado_por"
                  value={formData.bloqueado_por}
                  onChange={handleInputChange}
                  placeholder="Usuario responsable"
                  error={errors.bloqueado_por}
                  leftIcon={<User className="h-4 w-4" />}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Section: Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <div className="p-1.5 bg-purple-100 text-purple-700 rounded-lg">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Detalles y Estado</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="motivo" className="block text-sm font-medium text-gray-700 mb-1">
                  Motivo del Bloqueo *
                </label>
                <textarea
                  id="motivo"
                  name="motivo"
                  rows={3}
                  value={formData.motivo}
                  onChange={handleInputChange}
                  className={`flex w-full rounded-xl border border-secondary-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-secondary-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 ${errors.motivo ? 'border-red-500 focus-visible:ring-red-500' : ''
                    }`}
                  placeholder="Describe el motivo del bloqueo..."
                  disabled={loading}
                />
                {errors.motivo ? (
                  <p className="mt-1 text-xs text-red-600 font-medium">{errors.motivo}</p>
                ) : (
                  <p className="mt-1 text-xs text-gray-500 text-right">
                    {formData.motivo.length}/10 min car.
                  </p>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="bloqueo_activo"
                    name="bloqueo_activo"
                    checked={formData.bloqueo_activo}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                    disabled={loading}
                  />
                  <label htmlFor="bloqueo_activo" className="ml-3 block text-sm font-medium text-gray-900 cursor-pointer">
                    Bloqueo activo
                  </label>
                </div>
                <p className="mt-1 ml-8 text-xs text-gray-500">
                  Si está marcado, el bloqueo estará activo y la fecha no estará disponible
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            isLoading={loading}
            leftIcon={<Save className="h-4 w-4" />}
          >
            Guardar Cambios
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditRestriccionModal;
