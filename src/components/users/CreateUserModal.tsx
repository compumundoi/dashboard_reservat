import React, { useState } from 'react';
import { User as UserIcon, Save, Mail, Lock } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: {
    nombre: string;
    apellido: string;
    email: string;
    tipo_usuario: string;
    contraseña: string;
  }) => void;
  loading: boolean;
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  onSave,
  loading
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    tipo_usuario: 'proveedor',
    contraseña: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const userTypes = [
    { value: 'proveedor', label: 'Proveedor' },
    { value: 'mayorista', label: 'Mayorista' },
    { value: 'admin', label: 'Administrador' }
  ];

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no tiene un formato válido';
    }

    if (!formData.contraseña.trim()) {
      newErrors.contraseña = 'La contraseña es requerida';
    } else if (formData.contraseña.length < 6) {
      newErrors.contraseña = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleClose = () => {
    setFormData({
      nombre: '',
      apellido: '',
      email: '',
      tipo_usuario: 'proveedor',
      contraseña: ''
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Crear Nuevo Usuario"
      description="Completa la información para registrar un nuevo usuario en la plataforma"
      size="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Información Personal */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-secondary-100">
            <div className="p-1.5 bg-primary-100 text-primary-700 rounded-lg">
              <UserIcon className="h-5 w-5" />
            </div>
            <h4 className="font-semibold text-secondary-900">Información Personal</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre"
              required
              placeholder="Ej. Juan"
              value={formData.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              error={errors.nombre}
            />
            <Input
              label="Apellido"
              required
              placeholder="Ej. Pérez"
              value={formData.apellido}
              onChange={(e) => handleChange('apellido', e.target.value)}
              error={errors.apellido}
            />
          </div>
        </div>

        {/* Cuenta y Acceso */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-secondary-100">
            <div className="p-1.5 bg-primary-100 text-primary-700 rounded-lg">
              <Lock className="h-5 w-5" />
            </div>
            <h4 className="font-semibold text-secondary-900">Cuenta y Acceso</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              required
              placeholder="usuario@ejemplo.com"
              leftIcon={<Mail className="h-4 w-4" />}
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
            />
            <Select
              label="Tipo de Usuario"
              required
              options={userTypes}
              value={formData.tipo_usuario}
              onChange={(e) => handleChange('tipo_usuario', e.target.value)}
            />
            <div className="md:col-span-2">
              <Input
                label="Contraseña"
                type="password"
                required
                placeholder="Mínimo 6 caracteres"
                leftIcon={<Lock className="h-4 w-4" />}
                value={formData.contraseña}
                onChange={(e) => handleChange('contraseña', e.target.value)}
                error={errors.contraseña}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-6 border-t border-secondary-100">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={loading}
          >
            <div className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              <span>Crear Usuario</span>
            </div>
          </Button>
        </div>
      </form>
    </Modal>
  );
};