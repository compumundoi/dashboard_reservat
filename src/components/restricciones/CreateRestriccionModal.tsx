import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { X, Shield, Plus } from 'lucide-react';
import { RestriccionModalProps } from '../../types/restriccion';
import { restriccionService } from '../../services/restriccionService';
import Swal from 'sweetalert2';
import ServicioAutocomplete from '../common/ServicioAutocomplete';

const CreateRestriccionModal: React.FC<RestriccionModalProps> = ({ isOpen, onClose, onSave }) => {
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

  const resetForm = () => {
    setFormData({
      servicio_id: '',
      fecha: '',
      motivo: '',
      bloqueado_por: '',
      bloqueo_activo: true
    });
    setSelectedServicioName('');
    setErrors({});
  };

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

    if (!validateForm()) return;

    try {
      setLoading(true);

      const createData = {
        servicio_id: formData.servicio_id.trim(),
        fecha: new Date(formData.fecha).toISOString(),
        motivo: formData.motivo.trim(),
        bloqueado_por: formData.bloqueado_por.trim(),
        bloqueo_activo: formData.bloqueo_activo
      };

      await restriccionService.createRestriccion(createData);

      Swal.fire({
        icon: 'success',
        title: 'Restricción creada',
        text: 'La restricción ha sido creada correctamente',
        timer: 2000,
        showConfirmButton: false
      });

      resetForm();
      onSave?.();
      onClose();
    } catch (error) {
      console.error('Error al crear restricción:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo crear la restricción. Por favor, intenta de nuevo.',
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

  const handleClose = () => {
    if (!loading) {
      resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-3 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Shield className="h-5 w-5 mr-2 text-blue-500" />
            Crear Nueva Restricción
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
            disabled={loading}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-6">
          {/* Servicio */}
          <div>
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

          {/* Fecha */}
          <div>
            <label htmlFor="fecha" className="block text-sm font-medium text-gray-700">
              Fecha y Hora *
            </label>
            <input
              type="datetime-local"
              id="fecha"
              name="fecha"
              value={formData.fecha}
              onChange={handleInputChange}
              min={new Date().toISOString().slice(0, 16)}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.fecha ? 'border-red-300' : 'border-gray-300'
                }`}
              disabled={loading}
            />
            {errors.fecha && (
              <p className="mt-1 text-sm text-red-600">{errors.fecha}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Selecciona la fecha y hora que deseas bloquear
            </p>
          </div>

          {/* Motivo */}
          <div>
            <label htmlFor="motivo" className="block text-sm font-medium text-gray-700">
              Motivo del Bloqueo *
            </label>
            <textarea
              id="motivo"
              name="motivo"
              rows={4}
              value={formData.motivo}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.motivo ? 'border-red-300' : 'border-gray-300'
                }`}
              placeholder="Describe el motivo del bloqueo de esta fecha..."
              disabled={loading}
            />
            {errors.motivo && (
              <p className="mt-1 text-sm text-red-600">{errors.motivo}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Mínimo 10 caracteres. Actual: {formData.motivo.length}
            </p>
          </div>

          {/* Bloqueado Por */}
          <div>
            <label htmlFor="bloqueado_por" className="block text-sm font-medium text-gray-700">
              Bloqueado Por *
            </label>
            <input
              type="text"
              id="bloqueado_por"
              name="bloqueado_por"
              value={formData.bloqueado_por}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.bloqueado_por ? 'border-red-300' : 'border-gray-300'
                }`}
              placeholder="Tu nombre o identificación"
              disabled={loading}
            />
            {errors.bloqueado_por && (
              <p className="mt-1 text-sm text-red-600">{errors.bloqueado_por}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Nombre del usuario que realiza el bloqueo
            </p>
          </div>

          {/* Estado del Bloqueo */}
          <div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="bloqueo_activo"
                name="bloqueo_activo"
                checked={formData.bloqueo_activo}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={loading}
              />
              <label htmlFor="bloqueo_activo" className="ml-2 block text-sm text-gray-700">
                Activar bloqueo inmediatamente
              </label>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Si está marcado, el bloqueo estará activo desde el momento de la creación
            </p>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              {loading ? 'Creando...' : 'Crear Restricción'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default CreateRestriccionModal;
