import React, { useState } from 'react';
import { Route, Plus, DollarSign, Clock, MapPin, AlignLeft } from 'lucide-react';
import { RutaModalProps } from '../../types/ruta';
import { rutaService } from '../../services/rutaService';
import Swal from 'sweetalert2';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';

const CreateRutaModal: React.FC<RutaModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    duracion_estimada: 0,
    activo: true,
    puntos_interes: '',
    recomendada: false,
    origen: '',
    destino: '',
    precio: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      duracion_estimada: 0,
      activo: true,
      puntos_interes: '',
      recomendada: false,
      origen: '',
      destino: '',
      precio: ''
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    }
    if (!formData.origen.trim()) {
      newErrors.origen = 'El origen es requerido';
    }
    if (!formData.destino.trim()) {
      newErrors.destino = 'El destino es requerido';
    }
    if (!formData.puntos_interes.trim()) {
      newErrors.puntos_interes = 'Los puntos de interés son requeridos';
    }
    if (!formData.precio.trim()) {
      newErrors.precio = 'El precio es requerido';
    }
    if (formData.duracion_estimada <= 0) {
      newErrors.duracion_estimada = 'La duración debe ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      await rutaService.createRuta(formData);

      await Swal.fire({
        title: '¡Creada!',
        text: 'Ruta creada correctamente',
        icon: 'success',
        confirmButtonColor: '#059669',
        timer: 3000,
        timerProgressBar: true,
        customClass: {
          popup: 'rounded-xl shadow-2xl',
          title: 'text-xl font-bold text-gray-900',
          confirmButton: 'px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
        }
      });

      if (onSave) {
        onSave();
      }
      resetForm();
      onClose();

    } catch (error) {
      console.error('Error creating ruta:', error);
      Swal.fire({
        title: 'Error',
        text: 'Error al crear la ruta',
        icon: 'error',
        confirmButtonColor: '#dc2626'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));

    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Crear Nueva Ruta"
      description="Agrega una nueva ruta al sistema"
      size="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Básica */}
        <div>
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100 mb-4">
            <div className="p-1.5 bg-purple-100 text-purple-700 rounded-lg">
              <Route className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Información Básica</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Nombre de la ruta"
              error={errors.nombre}
              leftIcon={<Route className="h-4 w-4" />}
              autoFocus
            />

            <Input
              label="Duración Estimada (min)"
              type="number"
              name="duracion_estimada"
              value={formData.duracion_estimada}
              onChange={handleInputChange}
              placeholder="120"
              min="1"
              error={errors.duracion_estimada}
              leftIcon={<Clock className="h-4 w-4" />}
            />
          </div>

          <div className="mt-4">
            <Textarea
              label="Descripción"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              placeholder="Descripción detallada de la ruta"
              rows={3}
              error={errors.descripcion}
            />
          </div>
        </div>

        {/* Trayecto y Precios */}
        <div>
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100 mb-4">
            <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
              <MapPin className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Trayecto y Precio</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Origen"
              name="origen"
              value={formData.origen}
              onChange={handleInputChange}
              placeholder="Ciudad de origen"
              error={errors.origen}
              leftIcon={<MapPin className="h-4 w-4" />}
            />

            <Input
              label="Destino"
              name="destino"
              value={formData.destino}
              onChange={handleInputChange}
              placeholder="Ciudad de destino"
              error={errors.destino}
              leftIcon={<MapPin className="h-4 w-4" />}
            />
          </div>
          <div className="mt-4">
            <Input
              label="Precio"
              name="precio"
              value={formData.precio}
              onChange={handleInputChange}
              placeholder="50000"
              error={errors.precio}
              leftIcon={<DollarSign className="h-4 w-4" />}
            />
          </div>
        </div>

        {/* Detalles Adicionales */}
        <div>
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100 mb-4">
            <div className="p-1.5 bg-green-100 text-green-700 rounded-lg">
              <AlignLeft className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Detalles Adicionales</h3>
          </div>

          <Textarea
            label="Puntos de Interés"
            name="puntos_interes"
            value={formData.puntos_interes}
            onChange={handleInputChange}
            placeholder="Lugares de interés en la ruta (ej: Plaza, Museo, Parque)"
            rows={2}
            error={errors.puntos_interes}
          />

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <input
                id="activo"
                type="checkbox"
                name="activo"
                checked={formData.activo}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-secondary-300 rounded"
              />
              <label htmlFor="activo" className="ml-2 block text-sm text-secondary-700">
                Ruta activa
              </label>
            </div>

            <div className="flex items-center">
              <input
                id="recomendada"
                type="checkbox"
                name="recomendada"
                checked={formData.recomendada}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-secondary-300 rounded"
              />
              <label htmlFor="recomendada" className="ml-2 block text-sm text-secondary-700">
                Ruta recomendada
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            isLoading={loading}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Crear Ruta
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateRutaModal;
