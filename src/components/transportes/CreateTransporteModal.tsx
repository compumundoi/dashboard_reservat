import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { X, Car, Plus } from 'lucide-react';
import { TransporteModalProps } from '../../types/transporte';
import { transporteService } from '../../services/transporteService';
import Swal from 'sweetalert2';

const CreateTransporteModal: React.FC<TransporteModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    // Datos del proveedor
    proveedor: {
      tipo: 'transporte',
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
      relevancia: 'Media',
      usuario_creador: 'admin',
      tipo_documento: 'NIT',
      numero_documento: '',
      activo: true
    },
    // Datos del transporte
    transporte: {
      tipo_vehiculo: '',
      modelo: '',
      anio: new Date().getFullYear(),
      placa: '',
      capacidad: 0,
      aire_acondicionado: false,
      wifi: false,
      disponible: true,
      combustible: '',
      seguro_vigente: false,
      fecha_mantenimiento: new Date().toISOString()
    }
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setFormData({
      proveedor: {
        tipo: 'transporte',
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
        relevancia: 'Media',
        usuario_creador: 'admin',
        tipo_documento: 'NIT',
        numero_documento: '',
        activo: true
      },
      transporte: {
        tipo_vehiculo: '',
        modelo: '',
        anio: new Date().getFullYear(),
        placa: '',
        capacidad: 0,
        aire_acondicionado: false,
        wifi: false,
        disponible: true,
        combustible: '',
        seguro_vigente: false,
        fecha_mantenimiento: new Date().toISOString()
      }
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validaciones del proveedor
    if (!formData.proveedor.nombre.trim()) newErrors['proveedor.nombre'] = 'El nombre es requerido';
    if (!formData.proveedor.descripcion.trim()) newErrors['proveedor.descripcion'] = 'La descripción es requerida';
    if (!formData.proveedor.email.trim()) newErrors['proveedor.email'] = 'El email es requerido';
    if (!formData.proveedor.telefono.trim()) newErrors['proveedor.telefono'] = 'El teléfono es requerido';
    if (!formData.proveedor.direccion.trim()) newErrors['proveedor.direccion'] = 'La dirección es requerida';
    if (!formData.proveedor.ciudad.trim()) newErrors['proveedor.ciudad'] = 'La ciudad es requerida';
    if (!formData.proveedor.ubicacion.trim()) newErrors['proveedor.ubicacion'] = 'La ubicación es requerida';
    if (!formData.proveedor.numero_documento.trim()) newErrors['proveedor.numero_documento'] = 'El número de documento es requerido';

    // Validaciones del transporte
    if (!formData.transporte.tipo_vehiculo.trim()) newErrors['transporte.tipo_vehiculo'] = 'El tipo de vehículo es requerido';
    if (!formData.transporte.modelo.trim()) newErrors['transporte.modelo'] = 'El modelo es requerido';
    if (!formData.transporte.placa.trim()) newErrors['transporte.placa'] = 'La placa es requerida';
    if (formData.transporte.capacidad <= 0) newErrors['transporte.capacidad'] = 'La capacidad debe ser mayor a 0';
    if (!formData.transporte.combustible.trim()) newErrors['transporte.combustible'] = 'El tipo de combustible es requerido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const createData = {
        proveedor: {
          ...formData.proveedor,
          fecha_registro: new Date().toISOString()
        },
        transporte: {
          ...formData.transporte,
          fecha_mantenimiento: new Date().toISOString()
        }
      };

      await transporteService.createTransporte(createData);

      await Swal.fire({
        title: '¡Creado!',
        text: 'Transporte creado correctamente',
        icon: 'success',
        confirmButtonColor: '#059669',
        timer: 3000,
        timerProgressBar: true
      });

      if (onSave) {
        onSave();
      }
      resetForm();
      onClose();

    } catch (error) {
      console.error('Error creating transporte:', error);
      Swal.fire({
        title: 'Error',
        text: 'Error al crear el transporte',
        icon: 'error',
        confirmButtonColor: '#dc2626'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section: 'proveedor' | 'transporte', field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));

    // Limpiar error del campo
    const errorKey = `${section}.${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <Car className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-gray-900">Crear Nuevo Transporte</h3>
              <p className="text-sm text-gray-500">Agrega un nuevo transporte al sistema</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="py-4 max-h-96 overflow-y-auto">
          <div className="space-y-6">
            {/* Información del Proveedor */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Información del Proveedor</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                  <input
                    type="text"
                    value={formData.proveedor.nombre}
                    onChange={(e) => handleInputChange('proveedor', 'nombre', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors['proveedor.nombre'] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Nombre del proveedor"
                  />
                  {errors['proveedor.nombre'] && <p className="text-red-500 text-xs mt-1">{errors['proveedor.nombre']}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={formData.proveedor.email}
                    onChange={(e) => handleInputChange('proveedor', 'email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors['proveedor.email'] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="email@ejemplo.com"
                  />
                  {errors['proveedor.email'] && <p className="text-red-500 text-xs mt-1">{errors['proveedor.email']}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                  <input
                    type="text"
                    value={formData.proveedor.telefono}
                    onChange={(e) => handleInputChange('proveedor', 'telefono', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors['proveedor.telefono'] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Número de teléfono"
                  />
                  {errors['proveedor.telefono'] && <p className="text-red-500 text-xs mt-1">{errors['proveedor.telefono']}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad *</label>
                  <input
                    type="text"
                    value={formData.proveedor.ciudad}
                    onChange={(e) => handleInputChange('proveedor', 'ciudad', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors['proveedor.ciudad'] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Ciudad"
                  />
                  {errors['proveedor.ciudad'] && <p className="text-red-500 text-xs mt-1">{errors['proveedor.ciudad']}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección *</label>
                  <input
                    type="text"
                    value={formData.proveedor.direccion}
                    onChange={(e) => handleInputChange('proveedor', 'direccion', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors['proveedor.direccion'] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Dirección completa"
                  />
                  {errors['proveedor.direccion'] && <p className="text-red-500 text-xs mt-1">{errors['proveedor.direccion']}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Número de Documento *</label>
                  <input
                    type="text"
                    value={formData.proveedor.numero_documento}
                    onChange={(e) => handleInputChange('proveedor', 'numero_documento', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors['proveedor.numero_documento'] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Número de NIT"
                  />
                  {errors['proveedor.numero_documento'] && <p className="text-red-500 text-xs mt-1">{errors['proveedor.numero_documento']}</p>}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
                <textarea
                  value={formData.proveedor.descripcion}
                  onChange={(e) => handleInputChange('proveedor', 'descripcion', e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors['proveedor.descripcion'] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Descripción del proveedor de transporte"
                />
                {errors['proveedor.descripcion'] && <p className="text-red-500 text-xs mt-1">{errors['proveedor.descripcion']}</p>}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación *</label>
                <input
                  type="text"
                  value={formData.proveedor.ubicacion}
                  onChange={(e) => handleInputChange('proveedor', 'ubicacion', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors['proveedor.ubicacion'] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Ubicación específica o coordenadas"
                />
                {errors['proveedor.ubicacion'] && <p className="text-red-500 text-xs mt-1">{errors['proveedor.ubicacion']}</p>}
              </div>
            </div>

            {/* Información del Transporte */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Información del Vehículo</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Vehículo *</label>
                  <select
                    value={formData.transporte.tipo_vehiculo}
                    onChange={(e) => handleInputChange('transporte', 'tipo_vehiculo', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors['transporte.tipo_vehiculo'] ? 'border-red-500' : 'border-gray-300'
                      }`}
                  >
                    <option value="">Seleccionar tipo</option>
                    <option value="Bus">Bus</option>
                    <option value="Van">Van</option>
                    <option value="Automóvil">Automóvil</option>
                    <option value="Camioneta">Camioneta</option>
                    <option value="Microbus">Microbus</option>
                  </select>
                  {errors['transporte.tipo_vehiculo'] && <p className="text-red-500 text-xs mt-1">{errors['transporte.tipo_vehiculo']}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Modelo *</label>
                  <input
                    type="text"
                    value={formData.transporte.modelo}
                    onChange={(e) => handleInputChange('transporte', 'modelo', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors['transporte.modelo'] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Modelo del vehículo"
                  />
                  {errors['transporte.modelo'] && <p className="text-red-500 text-xs mt-1">{errors['transporte.modelo']}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Año</label>
                  <input
                    type="number"
                    value={formData.transporte.anio}
                    onChange={(e) => handleInputChange('transporte', 'anio', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1990"
                    max={new Date().getFullYear() + 1}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Placa *</label>
                  <input
                    type="text"
                    value={formData.transporte.placa}
                    onChange={(e) => handleInputChange('transporte', 'placa', e.target.value.toUpperCase())}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors['transporte.placa'] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="ABC123"
                  />
                  {errors['transporte.placa'] && <p className="text-red-500 text-xs mt-1">{errors['transporte.placa']}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad *</label>
                  <input
                    type="number"
                    value={formData.transporte.capacidad}
                    onChange={(e) => handleInputChange('transporte', 'capacidad', Number(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors['transporte.capacidad'] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    min="1"
                    placeholder="Número de pasajeros"
                  />
                  {errors['transporte.capacidad'] && <p className="text-red-500 text-xs mt-1">{errors['transporte.capacidad']}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Combustible *</label>
                  <select
                    value={formData.transporte.combustible}
                    onChange={(e) => handleInputChange('transporte', 'combustible', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors['transporte.combustible'] ? 'border-red-500' : 'border-gray-300'
                      }`}
                  >
                    <option value="">Seleccionar combustible</option>
                    <option value="Gasolina">Gasolina</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Gas">Gas</option>
                    <option value="Eléctrico">Eléctrico</option>
                    <option value="Híbrido">Híbrido</option>
                  </select>
                  {errors['transporte.combustible'] && <p className="text-red-500 text-xs mt-1">{errors['transporte.combustible']}</p>}
                </div>
              </div>

              {/* Checkboxes */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.transporte.aire_acondicionado}
                    onChange={(e) => handleInputChange('transporte', 'aire_acondicionado', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">Aire Acondicionado</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.transporte.wifi}
                    onChange={(e) => handleInputChange('transporte', 'wifi', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">WiFi</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.transporte.disponible}
                    onChange={(e) => handleInputChange('transporte', 'disponible', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">Disponible</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.transporte.seguro_vigente}
                    onChange={(e) => handleInputChange('transporte', 'seguro_vigente', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">Seguro Vigente</label>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            {loading ? 'Creando...' : 'Crear Transporte'}
          </button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default CreateTransporteModal;
