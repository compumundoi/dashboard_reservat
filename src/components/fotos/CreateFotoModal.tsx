import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { X, Save, Camera, Link, FileText, Hash, Star, Calendar } from 'lucide-react';
import { CreateFotoModalProps, DatosFoto } from '../../types/foto';
import { validarURLImagen } from '../../services/fotoService';
import ServicioAutocomplete from '../common/ServicioAutocomplete';

const CreateFotoModal: React.FC<CreateFotoModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<DatosFoto>({
    servicio_id: '',
    url: '',
    descripcion: '',
    orden: 1,
    es_portada: false,
    fecha_subida: new Date().toISOString().slice(0, 16),
    eliminado: false
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedServicioName, setSelectedServicioName] = useState('');

  // Validar formulario
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.servicio_id) {
      newErrors.servicio_id = 'Debe seleccionar un servicio';
    }

    if (!formData.url) {
      newErrors.url = 'La URL de la imagen es requerida';
    } else if (!validarURLImagen(formData.url)) {
      newErrors.url = 'Debe ser una URL válida de imagen (jpg, jpeg, png, gif, bmp, webp)';
    }

    if (!formData.descripcion) {
      newErrors.descripcion = 'La descripción es requerida';
    } else if (formData.descripcion.length < 5) {
      newErrors.descripcion = 'La descripción debe tener al menos 5 caracteres';
    }

    if (formData.orden < 0) {
      newErrors.orden = 'El orden debe ser un número positivo';
    }

    if (!formData.fecha_subida) {
      newErrors.fecha_subida = 'La fecha de subida es requerida';
    } else {
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
        type === 'number' ? Number(value) :
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
      // Convertir fecha a ISO string
      const dataToSend = {
        ...formData,
        fecha_subida: new Date(formData.fecha_subida).toISOString()
      };

      await onSave(dataToSend);

      // Resetear formulario
      setFormData({
        servicio_id: '',
        url: '',
        descripcion: '',
        orden: 1,
        es_portada: false,
        fecha_subida: new Date().toISOString().slice(0, 16),
        eliminado: false
      });
      setSelectedServicioName('');
      setErrors({});
    } catch (error) {
      console.error('Error creating foto:', error);
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
        orden: 1,
        es_portada: false,
        fecha_subida: new Date().toISOString().slice(0, 16),
        eliminado: false
      });
      setSelectedServicioName('');
      setErrors({});
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Camera className="h-6 w-6 text-purple-600" />
            <h3 className="text-lg font-medium text-gray-900">Crear Nueva Foto</h3>
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

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Link className="h-4 w-4" />
                  <span>URL de la Imagen *</span>
                </label>
                <input
                  type="url"
                  name="url"
                  value={formData.url}
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
                  <span>Descripción *</span>
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
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
                  <span>Orden *</span>
                </label>
                <input
                  type="number"
                  name="orden"
                  value={formData.orden}
                  onChange={handleInputChange}
                  min="0"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.orden ? 'border-red-300' : 'border-gray-300'
                    }`}
                  placeholder="1"
                />
                {errors.orden && (
                  <p className="mt-1 text-sm text-red-600">{errors.orden}</p>
                )}
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>Fecha de Subida *</span>
                </label>
                <input
                  type="datetime-local"
                  name="fecha_subida"
                  value={formData.fecha_subida}
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
                    checked={formData.es_portada}
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
                    checked={formData.eliminado}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Crear como eliminada
                  </label>
                </div>
              </div>

              {/* Vista previa de la imagen */}
              {formData.url && validarURLImagen(formData.url) && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Vista Previa
                  </label>
                  <div className="border border-gray-200 rounded-lg p-2">
                    <img
                      src={formData.url}
                      alt="Vista previa"
                      className="w-full h-32 object-cover rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}
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
                  Creando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Crear Foto
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

export default CreateFotoModal;
