import React from 'react';
import {
  Users,
  Settings,
  Star,
  Building,
  Car,
  UtensilsCrossed,
  Store,
  Route,
  MapPin,
  Calendar,
  Image,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'usuarios', label: 'Usuarios', icon: Users },
  { id: 'servicios', label: 'Servicios', icon: Settings },
  { id: 'experiencias', label: 'Experiencias', icon: Star },
  { id: 'hoteles', label: 'Hoteles', icon: Building },
  { id: 'transportes', label: 'Transportes', icon: Car },
  { id: 'restaurantes', label: 'Restaurantes', icon: UtensilsCrossed },
  { id: 'mayoristas', label: 'Mayoristas', icon: Store },
  { id: 'rutas', label: 'Rutas', icon: Route },
  { id: 'viajes', label: 'Viajes', icon: MapPin },
  { id: 'fechas-bloqueadas', label: 'Restricciones', icon: Calendar },
  { id: 'fotos', label: 'Fotos', icon: Image },
];

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggle,
  activeSection,
  onSectionChange
}) => {
  return (
    <div className={cn(
      "bg-white border-r border-secondary-200 transition-all duration-300 ease-in-out flex flex-col h-full shadow-soft-lg z-20 relative",
      isCollapsed ? 'w-20' : 'w-72'
    )}>
      {/* Header */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-secondary-100 bg-secondary-50/50 backdrop-blur-sm">
        {!isCollapsed && (
          <div className="flex items-center gap-3 animate-fade-in">
            <div className="w-8 h-8 bg-gradient-to-tr from-primary-600 to-primary-400 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/20">
              <span className="text-white font-display font-bold text-lg">R</span>
            </div>
            <span className="text-xl font-display font-bold text-secondary-900 tracking-tight">ReservaT</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className={cn(
            "p-2 rounded-xl text-secondary-400 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200",
            isCollapsed && "mx-auto"
          )}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                isCollapsed ? "justify-center px-2" : "gap-3",
                isActive
                  ? "bg-primary-50 text-primary-700 font-medium"
                  : "text-secondary-500 hover:bg-secondary-50 hover:text-secondary-900"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-500 rounded-r-full" />
              )}

              <Icon
                size={22}
                className={cn(
                  "transition-colors duration-200",
                  isActive ? "text-primary-600" : "text-secondary-400 group-hover:text-secondary-600",
                  isCollapsed && "mx-auto"
                )}
              />

              {!isCollapsed && (
                <span className="truncate">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-secondary-100 bg-secondary-50/30">
        {!isCollapsed ? (
          <div className="bg-gradient-to-br from-primary-900 to-primary-800 rounded-2xl p-4 text-white shadow-lg shadow-primary-900/20">
            <h4 className="font-semibold text-sm mb-1">¿Necesitas ayuda?</h4>
            <p className="text-primary-200 text-xs mb-3">Contacta a soporte técnico</p>
            <Button variant="secondary" size="sm" className="w-full text-xs h-8 bg-white/10 text-white border-white/20 hover:bg-white/20">
              Contáctanos
            </Button>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full bg-secondary-100 flex items-center justify-center">
              <span className="text-xs text-secondary-500 font-bold">?</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};