import React, { useState } from 'react';
import { LoginCredentials } from '../types/auth';
import { Button, Input, Card } from './ui';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, loading, error }) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    contraseña: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit({
        email: credentials.email,
        contraseña: credentials.contraseña
      });
    } catch (err) {
      // Error handled by parent
      console.error(err)
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-8 text-center animate-fade-in">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-tr from-primary-600 to-primary-400 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30 transform rotate-3">
            <span className="text-white font-display font-bold text-3xl">R</span>
          </div>
        </div>
        <h1 className="text-3xl font-display font-bold text-secondary-900 mb-2">
          Bienvenido
        </h1>
        <p className="text-secondary-500">
          Ingresa a tu panel de administración
        </p>
      </div>

      <Card className="animate-slide-up bg-white/80 backdrop-blur-xl border-white/40 shadow-soft-xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            id="email"
            name="email"
            label="Correo electrónico"
            type="email"
            value={credentials.email}
            onChange={handleChange}
            placeholder="nombre@empresa.com"
            required
            leftIcon={<Mail className="w-4 h-4" />}
            className="bg-white/50 focus:bg-white"
          />

          <div className="space-y-1">
            <Input
              id="contraseña"
              name="contraseña"
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              value={credentials.contraseña}
              onChange={handleChange}
              placeholder="••••••••"
              required
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="focus:outline-none">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              className="bg-white/50 focus:bg-white"
            />
            <div className="flex justify-end">
              <a href="#" className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-error-50 text-error-700 text-sm flex items-center gap-2 border border-error-100 animate-fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-error-500 flex-shrink-0" />
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={loading}
            rightIcon={!loading && <ArrowRight className="w-4 h-4" />}
          >
            Iniciar Sesión
          </Button>
        </form>
      </Card>

      <p className="text-center mt-6 text-sm text-secondary-400">
        &copy; {new Date().getFullYear()} Reservat. Todos los derechos reservados.
      </p>
    </div>
  );
};