import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { X, Package, Building, MapPin } from 'lucide-react';
import Swal from 'sweetalert2';
import { CreateServicioModalProps, DatosServicio } from '../../types/servicio';
import { validarPrecio } from '../../services/servicioService';
import ProveedorAutocomplete from '../common/ProveedorAutocomplete';

const CreateServicioModal: React.FC<CreateServicioModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<DatosServicio>({
    proveedor_id: '',
    nombre: '',
    descripcion: '',
    tipo_servicio: '',
    precio: 0,
    moneda: 'COP',
    activo: true,
    fecha_creacion: new Date().toISOString(),
    fecha_actualizacion: new Date().toISOString(),
    relevancia: 'Media',
    ciudad: '',
    departamento: '',
    ubicacion: '',
    detalles_del_servicio: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedProveedorName, setSelectedProveedorName] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
        type === 'number' ? Number(value) : value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
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
      // Resetear formulario
      setFormData({
        proveedor_id: '',
        nombre: '',
        descripcion: '',
        tipo_servicio: '',
        precio: 0,
        moneda: 'COP',
        activo: true,
        fecha_creacion: new Date().toISOString(),
        fecha_actualizacion: new Date().toISOString(),
        relevancia: 'Media',
        ciudad: '',
        departamento: '',
        ubicacion: '',
        detalles_del_servicio: ''
      });
      setSelectedProveedorName('');
      setErrors({});
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo crear el servicio'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      proveedor_id: '',
      nombre: '',
      descripcion: '',
      tipo_servicio: '',
      precio: 0,
      moneda: 'COP',
      activo: true,
      fecha_creacion: new Date().toISOString(),
      fecha_actualizacion: new Date().toISOString(),
      relevancia: 'Media',
      ciudad: '',
      departamento: '',
      ubicacion: '',
      detalles_del_servicio: ''
    });
    setSelectedProveedorName('');
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Crear Nuevo Servicio</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información Principal */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Package className="h-5 w-5 text-blue-600 mr-2" />
                Información Principal
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Servicio *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.nombre ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Ingrese el nombre del servicio"
                />
                {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Servicio *
                </label>
                <input
                  type="text"
                  name="tipo_servicio"
                  value={formData.tipo_servicio}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.tipo_servicio ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Ej: Hospedaje, Transporte, Alimentación"
                />
                {errors.tipo_servicio && <p className="text-red-500 text-sm mt-1">{errors.tipo_servicio}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción *
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.descripcion ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Descripción detallada del servicio"
                />
                {errors.descripcion && <p className="text-red-500 text-sm mt-1">{errors.descripcion}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Detalles del Servicio *
                </label>
                <textarea
                  name="detalles_del_servicio"
                  value={formData.detalles_del_servicio}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.detalles_del_servicio ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Detalles adicionales del servicio"
                />
                {errors.detalles_del_servicio && <p className="text-red-500 text-sm mt-1">{errors.detalles_del_servicio}</p>}
              </div>
            </div>

            {/* Información Comercial y Ubicación */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Building className="h-5 w-5 text-orange-600 mr-2" />
                Información Comercial
              </h3>

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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio *
                  </label>
                  <input
                    type="number"
                    name="precio"
                    value={formData.precio}
                    onChange={handleInputChange}
                    min="0"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.precio ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="0"
                  />
                  {errors.precio && <p className="text-red-500 text-sm mt-1">{errors.precio}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Moneda *
                  </label>
                  <select
                    name="moneda"
                    value={formData.moneda}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="COP">COP</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Relevancia *
                </label>
                <select
                  name="relevancia"
                  value={formData.relevancia}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Baja">Baja</option>
                  <option value="Media">Media</option>
                  <option value="Alta">Alta</option>
                </select>
              </div>

              <h3 className="text-lg font-medium text-gray-900 flex items-center pt-4">
                <MapPin className="h-5 w-5 text-red-600 mr-2" />
                Ubicación
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.ciudad ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Ciudad"
                  />
                  {errors.ciudad && <p className="text-red-500 text-sm mt-1">{errors.ciudad}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Departamento *
                  </label>
                  <input
                    type="text"
                    name="departamento"
                    value={formData.departamento}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.departamento ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Departamento"
                  />
                  {errors.departamento && <p className="text-red-500 text-sm mt-1">{errors.departamento}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ubicación Específica *
                </label>
                <input
                  type="text"
                  name="ubicacion"
                  value={formData.ubicacion}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.ubicacion ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Dirección o ubicación específica"
                />
                {errors.ubicacion && <p className="text-red-500 text-sm mt-1">{errors.ubicacion}</p>}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="activo"
                  checked={formData.activo}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Servicio activo
                </label>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creando...' : 'Crear Servicio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default CreateServicioModal;
