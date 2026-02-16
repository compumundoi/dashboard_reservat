import React, { useState } from 'react';
import { Car, Plus, Truck, Shield, Wifi, Wind, Info } from 'lucide-react';
import { TransporteModalProps } from '../../types/transporte';
import { transporteService } from '../../services/transporteService';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import Swal from 'sweetalert2';

const CreateTransporteModal: React.FC<TransporteModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
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

    if (!formData.proveedor.nombre.trim()) newErrors['proveedor.nombre'] = 'El nombre es requerido';
    if (!formData.proveedor.email.trim()) newErrors['proveedor.email'] = 'El email es requerido';
    if (!formData.proveedor.telefono.trim()) newErrors['proveedor.telefono'] = 'El teléfono es requerido';
    if (!formData.proveedor.ciudad.trim()) newErrors['proveedor.ciudad'] = 'La ciudad es requerida';
    if (!formData.proveedor.numero_documento.trim()) newErrors['proveedor.numero_documento'] = 'El NIT es requerido';

    if (!formData.transporte.tipo_vehiculo.trim()) newErrors['transporte.tipo_vehiculo'] = 'El tipo es requerido';
    if (!formData.transporte.modelo.trim()) newErrors['transporte.modelo'] = 'El modelo es requerido';
    if (!formData.transporte.placa.trim()) newErrors['transporte.placa'] = 'La placa es requerida';
    if (formData.transporte.capacidad <= 0) newErrors['transporte.capacidad'] = 'La capacidad debe ser > 0';

    const currentYear = new Date().getFullYear();
    if (formData.transporte.anio < 1900 || formData.transporte.anio > currentYear + 1) {
      newErrors['transporte.anio'] = `El año debe estar entre 1900 y ${currentYear + 1}`;
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
        proveedor: { ...formData.proveedor, fecha_registro: new Date().toISOString() },
        transporte: { ...formData.transporte, fecha_mantenimiento: new Date().toISOString() }
      };

      await transporteService.createTransporte(createData);
      await Swal.fire({
        title: '¡Creado!',
        text: 'Transporte creado correctamente',
        icon: 'success',
        confirmButtonColor: '#3b82f6',
        timer: 3000,
        timerProgressBar: true
      });

      if (onSave) onSave();
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error creating transporte:', error);
      Swal.fire({ title: 'Error', text: 'Error al crear el transporte', icon: 'error', confirmButtonColor: '#ef4444' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section: 'proveedor' | 'transporte', field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
    const errorKey = `${section}.${field}`;
    if (errors[errorKey]) setErrors(prev => ({ ...prev, [errorKey]: '' }));
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Crear Nuevo Transporte"
      description="Completa la información del proveedor y vehículo"
      size="3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Información del Proveedor */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-secondary-100">
            <div className="p-1.5 bg-primary-100 text-primary-700 rounded-lg">
              <Info className="w-4 h-4" />
            </div>
            <h4 className="font-semibold text-secondary-900">Información del Proveedor</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="md:col-span-2 lg:col-span-2">
              <Input
                label="Nombre del Proveedor *"
                placeholder="Ej: Transportes del Norte S.A.S"
                value={formData.proveedor.nombre}
                onChange={(e) => handleInputChange('proveedor', 'nombre', e.target.value)}
                error={errors['proveedor.nombre']}
                required
              />
            </div>
            <Input
              label="Email *"
              type="email"
              placeholder="proveedor@ejemplo.com"
              value={formData.proveedor.email}
              onChange={(e) => handleInputChange('proveedor', 'email', e.target.value)}
              error={errors['proveedor.email']}
              required
            />
            <Input
              label="Teléfono *"
              placeholder="+57 321 000 0000"
              value={formData.proveedor.telefono}
              onChange={(e) => handleInputChange('proveedor', 'telefono', e.target.value)}
              error={errors['proveedor.telefono']}
              required
            />
            <Input
              label="Ciudad *"
              placeholder="Bogotá"
              value={formData.proveedor.ciudad}
              onChange={(e) => handleInputChange('proveedor', 'ciudad', e.target.value)}
              error={errors['proveedor.ciudad']}
              required
            />
            <Input
              label="Número de Documento (NIT) *"
              placeholder="900.000.000-1"
              value={formData.proveedor.numero_documento}
              onChange={(e) => handleInputChange('proveedor', 'numero_documento', e.target.value)}
              error={errors['proveedor.numero_documento']}
              required
            />
            <Input
              label="Dirección"
              placeholder="Calle 123 # 45 - 67"
              value={formData.proveedor.direccion}
              onChange={(e) => handleInputChange('proveedor', 'direccion', e.target.value)}
            />
            <Input
              label="Ubicación (Zona/Barrio)"
              placeholder="Sede principal"
              value={formData.proveedor.ubicacion}
              onChange={(e) => handleInputChange('proveedor', 'ubicacion', e.target.value)}
            />
            <Input
              label="Sitio Web"
              placeholder="https://..."
              value={formData.proveedor.sitio_web}
              onChange={(e) => handleInputChange('proveedor', 'sitio_web', e.target.value)}
            />
            <div className="flex items-center h-full pt-6">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.proveedor.verificado}
                  onChange={(e) => handleInputChange('proveedor', 'verificado', e.target.checked)}
                  className="w-4 h-4 text-primary-600 rounded border-secondary-300 focus:ring-primary-500 transition duration-150 ease-in-out"
                />
                <span className="text-sm text-secondary-700 group-hover:text-secondary-900">Empresa Verificada</span>
              </label>
            </div>
          </div>
          <Textarea
            label="Descripción"
            placeholder="Descripción de los servicios..."
            rows={3}
            value={formData.proveedor.descripcion}
            onChange={(e) => handleInputChange('proveedor', 'descripcion', e.target.value)}
          />
        </div>

        {/* Información del Vehículo */}
        <div className="space-y-4 pt-4 border-t border-secondary-100">
          <div className="flex items-center gap-2 pb-2 border-b border-secondary-100">
            <div className="p-1.5 bg-success-100 text-success-700 rounded-lg">
              <Truck className="w-4 h-4" />
            </div>
            <h4 className="font-semibold text-secondary-900">Detalles del Vehículo</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Select
              label="Tipo de Vehículo *"
              value={formData.transporte.tipo_vehiculo}
              onChange={(e) => handleInputChange('transporte', 'tipo_vehiculo', e.target.value)}
              error={errors['transporte.tipo_vehiculo']}
              options={[
                { value: '', label: 'Seleccionar tipo' },
                { value: 'Bus', label: 'Bus' },
                { value: 'Van', label: 'Van' },
                { value: 'Automóvil', label: 'Automóvil' },
                { value: 'Camioneta', label: 'Camioneta' },
                { value: 'Microbus', label: 'Microbus' },
              ]}
              required
            />
            <Input
              label="Modelo *"
              placeholder="Ej: Mercedes Benz Sprinter"
              value={formData.transporte.modelo}
              onChange={(e) => handleInputChange('transporte', 'modelo', e.target.value)}
              error={errors['transporte.modelo']}
              required
            />
            <Input
              label="Placa *"
              placeholder="ABC123"
              value={formData.transporte.placa}
              onChange={(e) => handleInputChange('transporte', 'placa', e.target.value.toUpperCase())}
              error={errors['transporte.placa']}
              required
            />
            <Input
              label="Año"
              type="number"
              value={formData.transporte.anio}
              onChange={(e) => handleInputChange('transporte', 'anio', Number(e.target.value))}
              error={errors['transporte.anio']}
            />
            <Input
              label="Capacidad (pasajeros) *"
              type="number"
              value={formData.transporte.capacidad}
              onChange={(e) => handleInputChange('transporte', 'capacidad', Number(e.target.value))}
              error={errors['transporte.capacidad']}
              required
            />
            <Select
              label="Combustible"
              value={formData.transporte.combustible}
              onChange={(e) => handleInputChange('transporte', 'combustible', e.target.value)}
              options={[
                { value: '', label: 'Seleccionar' },
                { value: 'Gasolina', label: 'Gasolina' },
                { value: 'Diesel', label: 'Diesel' },
                { value: 'Gas', label: 'Gas' },
                { value: 'Eléctrico', label: 'Eléctrico' },
                { value: 'Híbrido', label: 'Híbrido' },
              ]}
            />
          </div>

          <div className="space-y-3">
            <h5 className="text-sm font-medium text-secondary-700">Características y Comodidades</h5>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {[
                { key: 'aire_acondicionado', label: 'Aire Acondicionado', icon: Wind },
                { key: 'wifi', label: 'WiFi Gratis', icon: Wifi },
                { key: 'seguro_vigente', label: 'Seguro Activo', icon: Shield },
                { key: 'disponible', label: 'Disponible', icon: Car },
              ].map((feature) => (
                <label key={feature.key} className="flex items-center gap-2 cursor-pointer group p-2 hover:bg-secondary-50 rounded-lg transition-colors border border-transparent hover:border-secondary-100">
                  <input
                    type="checkbox"
                    checked={formData.transporte[feature.key as keyof typeof formData.transporte] as boolean}
                    onChange={(e) => handleInputChange('transporte', feature.key, e.target.checked)}
                    className="w-4 h-4 text-primary-600 rounded border-secondary-300 focus:ring-primary-500 transition duration-150 ease-in-out"
                  />
                  <span className="text-sm text-secondary-700 group-hover:text-secondary-900">{feature.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-6 border-t border-secondary-100">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            isLoading={loading}
            leftIcon={!loading && <Plus className="h-4 w-4" />}
          >
            {loading ? 'Creando...' : 'Crear Transporte'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateTransporteModal;
