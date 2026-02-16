import React, { useState } from 'react';
import { Calendar, Users, DollarSign, User, Route, Truck, Info, CheckCircle } from 'lucide-react';
import { CreateViajeModalProps, DatosViaje, ESTADOS_VIAJE } from '../../types/viaje';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

const CreateViajeModal: React.FC<CreateViajeModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<DatosViaje>({
    ruta_id: '',
    fecha_inicio: '',
    fecha_fin: '',
    capacidad_total: 0,
    capacidad_disponible: 0,
    precio: 0,
    guia_asignado: '',
    estado: ESTADOS_VIAJE.PROGRAMADO,
    id_transportador: '',
    activo: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) :
        type === 'checkbox' ? (e.target as HTMLInputElement).checked :
          value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    if (name === 'capacidad_total') {
      const newTotal = Number(value);
      setFormData(prev => ({
        ...prev,
        capacidad_total: newTotal,
        capacidad_disponible: newTotal
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.ruta_id.trim()) newErrors.ruta_id = 'El ID de la ruta es requerido';
    if (!formData.fecha_inicio) newErrors.fecha_inicio = 'La fecha de inicio es requerida';
    if (!formData.fecha_fin) newErrors.fecha_fin = 'La fecha de fin es requerida';

    if (formData.fecha_inicio && formData.fecha_fin) {
      if (new Date(formData.fecha_fin) <= new Date(formData.fecha_inicio)) {
        newErrors.fecha_fin = 'La fecha de fin debe ser posterior a la de inicio';
      }
    }

    if (!formData.capacidad_total || formData.capacidad_total <= 0) newErrors.capacidad_total = 'Debe ser mayor a 0';
    if (formData.capacidad_disponible < 0) newErrors.capacidad_disponible = 'No puede ser negativa';
    if (formData.capacidad_disponible > formData.capacidad_total) newErrors.capacidad_disponible = 'Excede la capacidad total';

    if (!formData.precio || formData.precio <= 0) newErrors.precio = 'Debe ser mayor a 0';
    if (!formData.guia_asignado.trim()) newErrors.guia_asignado = 'El guía es requerido';
    if (!formData.estado) newErrors.estado = 'El estado es requerido';
    if (!formData.id_transportador.trim()) newErrors.id_transportador = 'El ID del transportador es requerido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSave(formData);
      handleClose();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      ruta_id: '',
      fecha_inicio: '',
      fecha_fin: '',
      capacidad_total: 0,
      capacidad_disponible: 0,
      precio: 0,
      guia_asignado: '',
      estado: ESTADOS_VIAJE.PROGRAMADO,
      id_transportador: '',
      activo: true
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Crear Nuevo Viaje"
      description="Complete la información para programar un nuevo viaje"
      size="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Fechas Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
              <Calendar className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Programación</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              type="datetime-local"
              name="fecha_inicio"
              label="Fecha de Inicio"
              value={formData.fecha_inicio}
              onChange={handleInputChange}
              error={errors.fecha_inicio}
              required
            />
            <Input
              type="datetime-local"
              name="fecha_fin"
              label="Fecha de Fin"
              value={formData.fecha_fin}
              onChange={handleInputChange}
              error={errors.fecha_fin}
              required
            />
          </div>
        </div>

        {/* Capacidad y Precio Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <div className="p-1.5 bg-green-100 text-green-700 rounded-lg">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Capacidad y Precios</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              type="number"
              name="capacidad_total"
              label="Capacidad Total"
              value={formData.capacidad_total}
              onChange={handleInputChange}
              min="1"
              error={errors.capacidad_total}
              required
            />
            <Input
              type="number"
              name="capacidad_disponible"
              label="Disponible"
              value={formData.capacidad_disponible}
              onChange={handleInputChange}
              min="0"
              max={formData.capacidad_total}
              error={errors.capacidad_disponible}
              required
            />
            <Input
              type="number"
              name="precio"
              label="Precio (COP)"
              value={formData.precio}
              onChange={handleInputChange}
              min="0"
              step="1000"
              leftIcon={<DollarSign className="h-4 w-4" />}
              error={errors.precio}
              required
            />
          </div>
        </div>

        {/* Asignaciones Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <div className="p-1.5 bg-purple-100 text-purple-700 rounded-lg">
              <User className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Asignaciones</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              name="guia_asignado"
              label="Guía Asignado"
              value={formData.guia_asignado}
              onChange={handleInputChange}
              placeholder="Nombre del guía"
              error={errors.guia_asignado}
              required
            />
            <Select
              name="estado"
              label="Estado del Viaje"
              value={formData.estado}
              onChange={handleInputChange}
              error={errors.estado}
            >
              <option value={ESTADOS_VIAJE.PROGRAMADO}>Programado</option>
              <option value={ESTADOS_VIAJE.EN_CURSO}>En Curso</option>
              <option value={ESTADOS_VIAJE.FINALIZADO}>Finalizado</option>
              <option value={ESTADOS_VIAJE.CANCELADO}>Cancelado</option>
            </Select>
          </div>
        </div>

        {/* Info Técnica Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <div className="p-1.5 bg-orange-100 text-orange-700 rounded-lg">
              <Info className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Información Técnica</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              name="ruta_id"
              label="ID de Ruta"
              value={formData.ruta_id}
              onChange={handleInputChange}
              placeholder="UUID de la ruta"
              leftIcon={<Route className="h-4 w-4" />}
              error={errors.ruta_id}
              required
            />
            <Input
              name="id_transportador"
              label="ID de Transportador"
              value={formData.id_transportador}
              onChange={handleInputChange}
              placeholder="UUID del transportador"
              leftIcon={<Truck className="h-4 w-4" />}
              error={errors.id_transportador}
              required
            />
          </div>

          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
            <input
              type="checkbox"
              id="activo"
              name="activo"
              checked={formData.activo}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="activo" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Marcar viaje como activo (visible para clientes)
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={loading}>
            Crear Viaje
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateViajeModal;
