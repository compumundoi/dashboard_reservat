/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { User, Compass, MapPin, Save, Info, Mail, Phone, Shield, Clock, Users, Globe2, Briefcase } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { EditExperienceModalProps } from '../../types/experience';

export const EditExperienceModal: React.FC<EditExperienceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  experience,
  loading,
  isSaving
}) => {
  const [formData, setFormData] = useState<any>({
    proveedor: {
      nombre: '',
      email: '',
      numero_documento: '',
      telefono: '',
      ciudad: '',
      pais: '',
      direccion: '',
      descripcion: '',
      verificado: false,
      activo: true,
      tipo: 'tour',
      sitio_web: '',
    },
    experiencia: {
      duracion: 1,
      grupo_maximo: 1,
      dificultad: 'Fácil',
      idioma: 'Español',
      punto_de_encuentro: '',
      numero_rnt: '',
      equipamiento_requerido: '',
      incluye_transporte: false,
      guia_incluido: false,
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (experience) {
      setFormData({
        proveedor: {
          nombre: experience.proveedor_nombre || '',
          email: experience.proveedor_email || '',
          numero_documento: experience.proveedor_numero_documento || '',
          telefono: experience.proveedor_telefono || '',
          ciudad: experience.proveedor_ciudad || '',
          pais: experience.proveedor_pais || '',
          direccion: experience.proveedor_direccion || '',
          descripcion: experience.proveedor_descripcion || '',
          verificado: experience.proveedor_verificado || false,
          activo: experience.proveedor_activo || false,
          tipo: 'tour',
          sitio_web: experience.proveedor_sitio_web || '',
        },
        experiencia: {
          duracion: experience.duracion || 1,
          grupo_maximo: experience.grupo_maximo || 1,
          dificultad: experience.dificultad || 'Fácil',
          idioma: experience.idioma || 'Español',
          punto_de_encuentro: experience.punto_de_encuentro || '',
          numero_rnt: experience.numero_rnt || '',
          equipamiento_requerido: experience.equipamiento_requerido || '',
          incluye_transporte: experience.incluye_transporte || false,
          guia_incluido: experience.guia_incluido || false,
        }
      });
    }
  }, [experience]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.proveedor.nombre?.trim()) newErrors['proveedor.nombre'] = 'Nombre comercial requerido';
    if (!formData.proveedor.email?.trim()) newErrors['proveedor.email'] = 'Email de contacto requerido';
    if (!formData.experiencia.punto_de_encuentro?.trim()) newErrors['experiencia.punto_de_encuentro'] = 'Punto de encuentro requerido';
    if (!formData.experiencia.numero_rnt?.trim()) newErrors['experiencia.numero_rnt'] = 'RNT requerido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateFormValue = (path: string, value: any) => {
    setFormData((prev: any) => {
      const copy = JSON.parse(JSON.stringify(prev));
      const parts = path.split('.');
      let ref = copy;
      for (let i = 0; i < parts.length - 1; i++) {
        ref = ref[parts[i]];
      }
      ref[parts[parts.length - 1]] = value;
      return copy;
    });

    if (errors[path]) {
      setErrors(prev => {
        const newErrs = { ...prev };
        delete newErrs[path];
        return newErrs;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      await onSave(formData);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Experiencia"
      description={`Editando: ${experience?.proveedor_nombre || 'Experiencia'}`}
      size="2xl"
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium">Cargando datos...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Columna Izquierda: Información del Proveedor */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
                  <User className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Perfil del Proveedor</h3>
              </div>

              <div className="space-y-4">
                <Input
                  label="Nombre del Negocio *"
                  value={formData.proveedor.nombre}
                  onChange={(e) => updateFormValue('proveedor.nombre', e.target.value)}
                  placeholder="Ej: Amazonia Tours"
                  className={errors['proveedor.nombre'] ? "border-red-500" : ""}
                  error={errors['proveedor.nombre']}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="NIT / Documento *"
                    value={formData.proveedor.numero_documento}
                    onChange={(e) => updateFormValue('proveedor.numero_documento', e.target.value)}
                    placeholder="900.123..."
                    leftIcon={<Shield className="h-3 w-3 text-gray-400" />}
                  />
                  <Input
                    label="Teléfono"
                    value={formData.proveedor.telefono}
                    onChange={(e) => updateFormValue('proveedor.telefono', e.target.value)}
                    placeholder="+57..."
                    leftIcon={<Phone className="h-3 w-3 text-gray-400" />}
                  />
                </div>

                <Input
                  label="Email de Contacto *"
                  type="email"
                  value={formData.proveedor.email}
                  onChange={(e) => updateFormValue('proveedor.email', e.target.value)}
                  placeholder="contacto@ejemplo.com"
                  leftIcon={<Mail className="h-3 w-3 text-gray-400" />}
                  className={errors['proveedor.email'] ? "border-red-500" : ""}
                  error={errors['proveedor.email']}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Ciudad"
                    value={formData.proveedor.ciudad}
                    onChange={(e) => updateFormValue('proveedor.ciudad', e.target.value)}
                  />
                  <Input
                    label="País"
                    value={formData.proveedor.pais}
                    onChange={(e) => updateFormValue('proveedor.pais', e.target.value)}
                  />
                </div>

                <Input
                  label="Dirección Física"
                  value={formData.proveedor.direccion}
                  onChange={(e) => updateFormValue('proveedor.direccion', e.target.value)}
                  leftIcon={<MapPin className="h-3 w-3 text-gray-400" />}
                />

                <Textarea
                  label="Descripción del Proveedor"
                  value={formData.proveedor.descripcion}
                  onChange={(e) => updateFormValue('proveedor.descripcion', e.target.value)}
                  placeholder="Breve reseña sobre la empresa..."
                  rows={3}
                />

                <div className="flex items-center gap-2 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none p-2 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-100 w-full">
                    <input
                      type="checkbox"
                      checked={formData.proveedor.verificado}
                      onChange={(e) => updateFormValue('proveedor.verificado', e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Proveedor Verificado</span>
                    <Shield className="h-3 w-3 text-blue-500 ml-auto" />
                  </label>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Detalles de la Experiencia */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <div className="p-1.5 bg-green-100 text-green-700 rounded-lg">
                  <Compass className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Detalles de la Actividad</h3>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Duración (hs)"
                    type="number"
                    min={1}
                    value={formData.experiencia.duracion}
                    onChange={(e) => updateFormValue('experiencia.duracion', parseInt(e.target.value))}
                    leftIcon={<Clock className="h-3 w-3 text-gray-400" />}
                  />
                  <Input
                    label="Max. Personas"
                    type="number"
                    min={1}
                    value={formData.experiencia.grupo_maximo}
                    onChange={(e) => updateFormValue('experiencia.grupo_maximo', parseInt(e.target.value))}
                    leftIcon={<Users className="h-3 w-3 text-gray-400" />}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Dificultad"
                    value={formData.experiencia.dificultad}
                    onChange={(e) => updateFormValue('experiencia.dificultad', e.target.value)}
                    options={[
                      { value: 'Fácil', label: 'Fácil' },
                      { value: 'Moderado', label: 'Moderado' },
                      { value: 'Difícil', label: 'Difícil' },
                      { value: 'Extremo', label: 'Extremo' },
                    ]}
                  />
                  <Input
                    label="Idioma"
                    value={formData.experiencia.idioma}
                    onChange={(e) => updateFormValue('experiencia.idioma', e.target.value)}
                    leftIcon={<Globe2 className="h-3 w-3 text-gray-400" />}
                  />
                </div>

                <Input
                  label="Punto de Encuentro *"
                  value={formData.experiencia.punto_de_encuentro}
                  onChange={(e) => updateFormValue('experiencia.punto_de_encuentro', e.target.value)}
                  placeholder="Ej: Lobby del hotel..."
                  leftIcon={<MapPin className="h-3 w-3 text-gray-400" />}
                  className={errors['experiencia.punto_de_encuentro'] ? "border-red-500" : ""}
                  error={errors['experiencia.punto_de_encuentro']}
                />

                <Input
                  label="Registro RNT *"
                  value={formData.experiencia.numero_rnt}
                  onChange={(e) => updateFormValue('experiencia.numero_rnt', e.target.value)}
                  placeholder="12345"
                  leftIcon={<Briefcase className="h-3 w-3 text-gray-400" />}
                  className={errors['experiencia.numero_rnt'] ? "border-red-500" : ""}
                  error={errors['experiencia.numero_rnt']}
                />

                <Textarea
                  label="Equipamiento Recomendado"
                  value={formData.experiencia.equipamiento_requerido}
                  onChange={(e) => updateFormValue('experiencia.equipamiento_requerido', e.target.value)}
                  placeholder="Ej: Ropa cómoda, bloqueador..."
                  rows={3}
                />

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none p-2 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-100">
                    <input
                      type="checkbox"
                      checked={formData.experiencia.incluye_transporte}
                      onChange={(e) => updateFormValue('experiencia.incluye_transporte', e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">Transporte</span>
                      <span className="text-[10px] text-gray-500">Incluido</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none p-2 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-100">
                    <input
                      type="checkbox"
                      checked={formData.experiencia.guia_incluido}
                      onChange={(e) => updateFormValue('experiencia.guia_incluido', e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">Guía</span>
                      <span className="text-[10px] text-gray-500">Profesional</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center group cursor-pointer">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={formData.proveedor.activo}
                  onChange={(e) => updateFormValue('proveedor.activo', e.target.checked)}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-md transition-all cursor-pointer"
                  id="active-edit-check"
                />
              </div>
              <label htmlFor="active-edit-check" className="ml-3 text-sm font-medium text-gray-700 cursor-pointer">
                Proveedor Activo
              </label>
              <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Info className="h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSaving}
                className="flex-1 sm:flex-none"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSaving}
                className="flex-1 sm:flex-none gap-2"
              >
                {!isSaving && <Save className="h-4 w-4" />}
                Guardar Cambios
              </Button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
};