/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from 'react';
import { User, Phone, DollarSign } from 'lucide-react';
import { CreateMayoristaData, MayoristaData } from '../../types/mayorista';
import { mayoristaService } from '../../services/mayoristaService';
import Swal from 'sweetalert2';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';

interface EditMayoristaModalProps {
  isOpen: boolean;
  onClose: () => void;
  mayoristaId: string | null;
  onMayoristaUpdated: () => void;
}

const EditMayoristaModal: React.FC<EditMayoristaModalProps> = ({
  isOpen,
  onClose,
  mayoristaId,
  onMayoristaUpdated,
}) => {
  const [formData, setFormData] = useState<CreateMayoristaData>({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    pais: '',
    tipo_documento: 'NIT',
    numero_documento: '',
    contacto_principal: '',
    telefono_contacto: '',
    email_contacto: '',
    comision_porcentaje: 0,
    limite_credito: 0,
    estado: 'activo',
    verificado: false,
    observaciones: '',
    recurente: false,
    activo: true
  });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof CreateMayoristaData, string>>>({});

  const fetchMayoristaData = useCallback(async () => {
    if (!mayoristaId) return;

    setLoadingData(true);
    try {
      const mayorista: MayoristaData = await mayoristaService.getMayoristaById(mayoristaId);
      setFormData({
        nombre: mayorista.nombre,
        email: mayorista.email,
        telefono: mayorista.telefono,
        direccion: mayorista.direccion,
        ciudad: mayorista.ciudad,
        pais: mayorista.pais,
        tipo_documento: mayorista.tipo_documento,
        numero_documento: mayorista.numero_documento,
        contacto_principal: mayorista.contacto_principal || '',
        telefono_contacto: mayorista.telefono_contacto || '',
        email_contacto: mayorista.email_contacto || '',
        comision_porcentaje: mayorista.comision_porcentaje ?? 0,
        limite_credito: mayorista.limite_credito ?? 0,
        estado: mayorista.estado || 'activo',
        verificado: mayorista.verificado,
        observaciones: mayorista.observaciones || '',
        recurente: mayorista.recurente,
        activo: mayorista.activo
      });
    } catch (error) {
      console.error('Error fetching mayorista data:', error);
      await Swal.fire({
        title: 'Error',
        text: 'Error al cargar los datos del mayorista',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#EF4444'
      });
      onClose();
    } finally {
      setLoadingData(false);
    }
  }, [mayoristaId, onClose]);

  useEffect(() => {
    if (isOpen && mayoristaId) {
      fetchMayoristaData();
    }
  }, [isOpen, mayoristaId, fetchMayoristaData]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateMayoristaData, string>> = {};

    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.email.trim()) newErrors.email = 'El email es requerido';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';
    if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es requerido';
    if (!formData.direccion.trim()) newErrors.direccion = 'La dirección es requerida';
    if (!formData.ciudad.trim()) newErrors.ciudad = 'La ciudad es requerida';
    if (!formData.pais.trim()) newErrors.pais = 'El país es requerido';
    if (!formData.numero_documento.trim()) newErrors.numero_documento = 'El número de documento es requerido';
    if (!(formData.contacto_principal || '').trim()) newErrors.contacto_principal = 'El contacto principal es requerido';
    if (!(formData.telefono_contacto || '').trim()) newErrors.telefono_contacto = 'El teléfono de contacto es requerido';
    if (!(formData.email_contacto || '').trim()) newErrors.email_contacto = 'El email de contacto es requerido';
    else if (!/\S+@\S+\.\S+/.test(formData.email_contacto || '')) newErrors.email_contacto = 'Email de contacto inválido';
    if (formData.comision_porcentaje !== undefined && (formData.comision_porcentaje < 0 || formData.comision_porcentaje > 100)) newErrors.comision_porcentaje = 'La comisión debe estar entre 0 y 100';
    if (formData.limite_credito !== undefined && formData.limite_credito < 0) newErrors.limite_credito = 'El límite de crédito no puede ser negativo';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !mayoristaId) return;

    setLoading(true);
    try {
      await mayoristaService.updateMayorista(mayoristaId, formData);

      await Swal.fire({
        title: '¡Éxito!',
        text: 'Mayorista actualizado exitosamente',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#3B82F6'
      });

      onMayoristaUpdated();
      handleClose();
    } catch (error) {
      console.error('Error updating mayorista:', error);
      await Swal.fire({
        title: 'Error',
        text: 'Error al actualizar el mayorista. Por favor, inténtalo de nuevo.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#EF4444'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      nombre: '',
      email: '',
      telefono: '',
      direccion: '',
      ciudad: '',
      pais: '',
      tipo_documento: 'NIT',
      numero_documento: '',
      contacto_principal: '',
      telefono_contacto: '',
      email_contacto: '',
      comision_porcentaje: 0,
      limite_credito: 0,
      estado: 'activo',
      verificado: false,
      observaciones: '',
      recurente: false,
      activo: true
    });
    setErrors({});
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let processedValue: any = value;

    if (type === 'number') {
      processedValue = value === '' ? undefined : parseFloat(value);
    } else if (type === 'checkbox') {
      processedValue = (e.target as HTMLInputElement).checked;
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    if (errors[name as keyof CreateMayoristaData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Editar Mayorista"
      description="Modifica la información del mayorista seleccionado."
      size="2xl"
    >
      {loadingData ? (
        <div className="space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-100 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-20"></div>
                  <div className="h-10 bg-gray-50 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Información Básica */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center border-b pb-2">
              <User className="w-5 h-5 mr-2 text-primary-600" />
              Información Básica
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Nombre *"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                error={errors.nombre}
                placeholder="Nombre del mayorista"
              />
              <Input
                label="Email *"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                placeholder="email@ejemplo.com"
              />
              <Input
                label="Teléfono *"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                error={errors.telefono}
                placeholder="+57 300 123 4567"
              />
              <Select
                label="Tipo de Documento *"
                name="tipo_documento"
                value={formData.tipo_documento}
                onChange={handleInputChange}
                error={errors.tipo_documento}
                options={[
                  { value: 'NIT', label: 'NIT' },
                  { value: 'CC', label: 'Cédula de Ciudadanía' },
                  { value: 'CE', label: 'Cédula de Extranjería' },
                  { value: 'RUT', label: 'RUT' }
                ]}
              />
              <Input
                label="Número de Documento *"
                name="numero_documento"
                value={formData.numero_documento}
                onChange={handleInputChange}
                error={errors.numero_documento}
                placeholder="123456789"
              />
              <Input
                label="Ciudad *"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleInputChange}
                error={errors.ciudad}
                placeholder="Bogotá"
              />
              <Input
                label="País *"
                name="pais"
                value={formData.pais}
                onChange={handleInputChange}
                error={errors.pais}
                placeholder="Colombia"
              />
              <div className="md:col-span-2">
                <Input
                  label="Dirección *"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  error={errors.direccion}
                  placeholder="Calle 123 #45-67"
                />
              </div>
            </div>
          </section>

          {/* Información de Contacto */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center border-b pb-2">
              <Phone className="w-5 h-5 mr-2 text-emerald-600" />
              Contacto Principal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Nombre del Contacto *"
                name="contacto_principal"
                value={formData.contacto_principal || ''}
                onChange={handleInputChange}
                error={errors.contacto_principal}
                placeholder="Juan Pérez"
              />
              <Input
                label="Teléfono de Contacto *"
                name="telefono_contacto"
                value={formData.telefono_contacto || ''}
                onChange={handleInputChange}
                error={errors.telefono_contacto}
                placeholder="+57 300 123 4567"
              />
              <div className="md:col-span-2">
                <Input
                  label="Email de Contacto *"
                  type="email"
                  name="email_contacto"
                  value={formData.email_contacto || ''}
                  onChange={handleInputChange}
                  error={errors.email_contacto}
                  placeholder="contacto@ejemplo.com"
                />
              </div>
            </div>
          </section>

          {/* Información Comercial */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center border-b pb-2">
              <DollarSign className="w-5 h-5 mr-2 text-purple-600" />
              Información Comercial
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Comisión (%) *"
                type="number"
                name="comision_porcentaje"
                value={formData.comision_porcentaje ?? 0}
                onChange={handleInputChange}
                error={errors.comision_porcentaje}
                min={0}
                max={100}
                step={0.1}
                placeholder="10.5"
              />
              <Input
                label="Límite de Crédito (COP) *"
                type="number"
                name="limite_credito"
                value={formData.limite_credito ?? 0}
                onChange={handleInputChange}
                error={errors.limite_credito}
                min={0}
                step={1000}
                placeholder="1000000"
              />
              <Select
                label="Estado *"
                name="estado"
                value={formData.estado || 'activo'}
                onChange={handleInputChange}
                error={errors.estado}
                options={[
                  { value: 'activo', label: 'Activo' },
                  { value: 'inactivo', label: 'Inactivo' },
                  { value: 'suspendido', label: 'Suspendido' }
                ]}
              />

              {/* Checkboxes */}
              <div className="grid grid-cols-3 gap-4 pt-4 md:col-span-2">
                <label className="flex items-center space-x-2 cursor-pointer p-3 border rounded-xl hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    name="verificado"
                    checked={formData.verificado}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Verificado</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer p-3 border rounded-xl hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    name="recurente"
                    checked={formData.recurente}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Recurrente</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer p-3 border rounded-xl hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    name="activo"
                    checked={formData.activo}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Activo</span>
                </label>
              </div>

              <div className="md:col-span-2">
                <Textarea
                  label="Observaciones"
                  name="observaciones"
                  value={formData.observaciones || ''}
                  onChange={handleInputChange}
                  error={errors.observaciones}
                  rows={3}
                  placeholder="Observaciones adicionales..."
                />
              </div>
            </div>
          </section>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
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
              className="w-full md:w-auto"
            >
              {loading ? 'Actualizando...' : 'Actualizar Mayorista'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default EditMayoristaModal;
