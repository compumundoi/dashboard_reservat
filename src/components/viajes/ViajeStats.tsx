import React from 'react';
import { Plane, CheckCircle, Clock, Users } from 'lucide-react';
import { ViajeStatsProps } from '../../types/viaje';

const ViajeStats: React.FC<ViajeStatsProps> = ({ stats, loading }) => {
  const statsData = [
    {
      title: 'Total Viajes',
      value: stats.totalViajes,
      icon: Plane,
      className: 'bg-blue-50 border-blue-100',
      textColor: 'text-blue-600',
      iconColor: 'text-blue-500'
    },
    {
      title: 'Viajes Activos',
      value: stats.viajesActivos,
      icon: CheckCircle,
      className: 'bg-green-50 border-green-100',
      textColor: 'text-green-600',
      iconColor: 'text-green-500'
    },
    {
      title: 'Viajes en Curso',
      value: stats.viajesEnCurso,
      icon: Clock,
      className: 'bg-purple-50 border-purple-100',
      textColor: 'text-purple-600',
      iconColor: 'text-purple-500'
    },
    {
      title: 'Capacidad Promedio',
      value: stats.capacidadPromedioDisponible,
      icon: Users,
      className: 'bg-orange-50 border-orange-100',
      textColor: 'text-orange-600',
      iconColor: 'text-orange-500',
      suffix: ' plazas'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="animate-pulse flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div
            key={index}
            className={`${stat.className} rounded-xl p-6 border transition-all duration-200 hover:shadow-md`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <div className="flex items-baseline gap-1">
                  <p className={`text-3xl font-bold ${stat.textColor}`}>
                    {stat.value.toLocaleString('es-ES')}
                  </p>
                  {stat.suffix && (
                    <span className="text-sm text-gray-500 font-medium">{stat.suffix}</span>
                  )}
                </div>
              </div>
              <IconComponent className={`h-8 w-8 ${stat.iconColor}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ViajeStats;
