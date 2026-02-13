import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { UserData } from '../types/auth';
import { LogOut, Bell, Search, Menu } from 'lucide-react';
import { UsersSection } from './users/UsersSection';
import { ExperiencesSection } from './experiences/ExperiencesSection';
import { HotelsSection } from './hotels/HotelsSection';
import MayoristasSection from './mayoristas/MayoristasSection';
import RestaurantesSection from './restaurantes/RestaurantesSection';
import RutasSection from './rutas/RutasSection';
import TransportesSection from './transportes/TransportesSection';
import ViajesSection from './viajes/ViajesSection';
import RestriccionesSection from './restricciones/RestriccionesSection';
import FotosSection from './fotos/FotosSection';
import ServiciosSection from './servicios/ServiciosSection';
import { Button, Input } from './ui';

interface DashboardProps {
  user: UserData;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [activeSection, setActiveSection] = useState('usuarios');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4 animate-fade-in">
            <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 mb-2 ring-8 ring-primary-50/50">
              <span className="text-4xl">👋</span>
            </div>
            <h2 className="text-3xl font-display font-bold text-secondary-900">¡Hola, {user.nombre || 'Administrador'}!</h2>
            <p className="text-secondary-500 max-w-md mx-auto">
              Bienvenido a tu panel de control. Selecciona una opción en el menú lateral para comenzar a gestionar tu negocio.
            </p>
            <div className="flex gap-3 mt-4 justify-center">
              <Button onClick={() => setActiveSection('servicios')}>Gestionar Servicios</Button>
              <Button variant="outline" onClick={() => setActiveSection('usuarios')}>Ver Usuarios</Button>
            </div>
          </div>
        );
      case 'usuarios':
        return <UsersSection />;
      case 'servicios':
        return <ServiciosSection />;
      case 'experiencias':
        return <ExperiencesSection />;
      case 'hoteles':
        return <HotelsSection />;
      case 'mayoristas':
        return <MayoristasSection />;
      case 'restaurantes':
        return <RestaurantesSection />;
      case 'rutas':
        return <RutasSection />;
      case 'transportes':
        return <TransportesSection />;
      case 'viajes':
        return <ViajesSection />;
      case 'fechas-bloqueadas':
        return <RestriccionesSection />;
      case 'fotos':
        return <FotosSection />;
      default:
        return (
          <div className="flex items-center justify-center h-full text-secondary-400">
            Sección en construcción
          </div>
        );
    }
  };

  const getSectionTitle = () => {
    const titles: Record<string, string> = {
      'dashboard': 'Panel Principal',
      'usuarios': 'Gestión de Usuarios',
      'servicios': 'Catálogo de Servicios',
      'experiencias': 'Experiencias Turísticas',
      'hoteles': 'Alojamientos y Hoteles',
      'transportes': 'Flota de Transporte',
      'restaurantes': 'Gastronomía',
      'mayoristas': 'Aliados Mayoristas',
      'rutas': 'Rutas y Trayectos',
      'viajes': 'Paquetes de Viaje',
      'fechas-bloqueadas': 'Restricciones y Bloqueos',
      'fotos': 'Galería Multimedia',
    };
    return titles[activeSection] || 'Panel de Administración';
  };

  return (
    <div className="flex h-screen bg-secondary-50 overflow-hidden font-sans">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300">
        {/* Top Navigation Bar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-secondary-200 flex items-center justify-between px-6 z-10 shrink-0 sticky top-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="lg:hidden p-2 text-secondary-500 hover:bg-secondary-100 rounded-lg"
            >
              <Menu size={20} />
            </button>
            <h2 className="text-xl font-display font-bold text-secondary-900 animate-slide-in-right">
              {getSectionTitle()}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block w-64">
              <Input
                placeholder="Buscar..."
                leftIcon={<Search className="w-4 h-4" />}
                className="bg-secondary-50 border-transparent focus:bg-white transition-all shadow-none focus:shadow-sm"
              />
            </div>

            <button className="relative p-2.5 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200 group">
              <Bell className="w-5 h-5 group-hover:animate-bounce-gentle" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-error-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="h-8 w-px bg-secondary-200 mx-1 hidden sm:block"></div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-secondary-900 leading-tight">{(user.nombre || user.email || 'Admin').split('@')[0]}</p>
                <p className="text-xs text-secondary-500">Administrador</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-tr from-primary-100 to-primary-50 rounded-xl flex items-center justify-center text-primary-700 font-bold border border-primary-100 shadow-sm">
                {(user.nombre || user.email || 'A').charAt(0).toUpperCase()}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="text-error-600 hover:text-error-700 hover:bg-error-50 hidden sm:flex"
                title="Cerrar Sesión"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 relative scroll-smooth bg-secondary-50/50">
          <div className="max-w-7xl mx-auto h-full animate-fade-in pb-10">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};