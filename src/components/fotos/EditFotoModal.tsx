import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, Save, Camera, Link, FileText, Hash, Star, Calendar } from 'lucide-react';
import { EditFotoModalProps, ActualizarFoto } from '../../types/foto';
import { validarURLImagen } from '../../services/fotoService';
import ServicioAutocomplete from '../common/ServicioAutocomplete';

const EditFotoModal: React.FC<EditFotoModalProps> = ({ isOpen, onClose, foto, onSave }) => {
  const [formData, setFormData] = useState<ActualizarFoto>({
    servicio_id: '',
    url: '',
    descripcion: '',
    orden: 0,
    es_portada: false,
    fecha_subida: '',
    eliminado: false
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedServicioName, setSelectedServicioName] = useState('');

  // Cargar datos cuando se abre el modal
  useEffect(() => {
    if (isOpen && foto) {
      // Convertir fecha para input datetime-local
      const fechaLocal = new Date(foto.fecha_subida).toISOString().slice(0, 16);

      setFormData({
        servicio_id: foto.servicio_id,
        url: foto.url,
        descripcion: foto.descripcion,
        orden: foto.orden,
        es_portada: foto.es_portada,
        fecha_subida: fechaLocal,
        eliminado: foto.eliminado
      });
      setSelectedServicioName(foto.servicioNombre || '');
      setErrors({});
    }
  }, [isOpen, foto]);

  // Validar formulario
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // servicio_id validation handled by the autocomplete component

    if (formData.url && !validarURLImagen(formData.url)) {
      newErrors.url = 'Debe ser una URL válida de imagen (jpg, jpeg, png, gif, bmp, webp)';
    }

    if (formData.descripcion && formData.descripcion.length < 5) {
      newErrors.descripcion = 'La descripción debe tener al menos 5 caracteres';
    }

    if (formData.orden !== null && formData.orden !== undefined && formData.orden < 0) {
      newErrors.orden = 'El orden debe ser un número positivo';
    }

    if (formData.fecha_subida) {
      const fechaSeleccionada = new Date(formData.fecha_subida);
      const ahora = new Date();
      if (fechaSeleccionada > ahora) {
        newErrors.fecha_subida = 'La fecha de subida no puede ser futura';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
        type === 'number' ? (value === '' ? null : Number(value)) :
          value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Convertir fecha de vuelta a ISO string si existe
      const dataToSend = {
        ...formData,
        fecha_subida: formData.fecha_subida ? new Date(formData.fecha_subida).toISOString() : null
      };

      await onSave(dataToSend);
    } catch (error) {
      console.error('Error updating foto:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cerrar modal
  const handleClose = () => {
    if (!loading) {
      onClose();
      setFormData({
        servicio_id: '',
        url: '',
        descripcion: '',
        orden: 0,
        es_portada: false,
        fecha_subida: '',
        eliminado: false
      });
      setSelectedServicioName('');
      setErrors({});
    }
  };

  if (!isOpen || !foto) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Camera className="h-6 w-6 text-purple-600" />
            <h3 className="text-lg font-medium text-gray-900">Editar Foto</h3>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 disabled:opacity-50"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna izquierda */}
            <div className="space-y-4">
              <ServicioAutocomplete
                value={formData.servicio_id || ''}
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

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Link className="h-4 w-4" />
                  <span>URL de la Imagen</span>
                </label>
                <input
                  type="url"
                  name="url"
                  value={formData.url || ''}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.url ? 'border-red-300' : 'border-gray-300'
                    }`}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
                {errors.url && (
                  <p className="mt-1 text-sm text-red-600">{errors.url}</p>
                )}
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <FileText className="h-4 w-4" />
                  <span>Descripción</span>
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion || ''}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.descripcion ? 'border-red-300' : 'border-gray-300'
                    }`}
                  placeholder="Descripción de la imagen"
                />
                {errors.descripcion && (
                  <p className="mt-1 text-sm text-red-600">{errors.descripcion}</p>
                )}
              </div>
            </div>

            {/* Columna derecha */}
            <div className="space-y-4">
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Hash className="h-4 w-4" />
                  <span>Orden</span>
                </label>
                <input
                  type="number"
                  name="orden"
                  value={formData.orden || ''}
                  onChange={handleInputChange}
                  min="0"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.orden ? 'border-red-300' : 'border-gray-300'
                    }`}
                  placeholder="0"
                />
                {errors.orden && (
                  <p className="mt-1 text-sm text-red-600">{errors.orden}</p>
                )}
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>Fecha de Subida</span>
                </label>
                <input
                  type="datetime-local"
                  name="fecha_subida"
                  value={formData.fecha_subida || ''}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.fecha_subida ? 'border-red-300' : 'border-gray-300'
                    }`}
                />
                {errors.fecha_subida && (
                  <p className="mt-1 text-sm text-red-600">{errors.fecha_subida}</p>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="es_portada"
                    checked={formData.es_portada || false}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 flex items-center space-x-1 text-sm text-gray-700">
                    <Star className="h-4 w-4" />
                    <span>Es foto de portada</span>
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="eliminado"
                    checked={formData.eliminado || false}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Marcar como eliminada
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default EditFotoModal;
