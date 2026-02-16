import React from 'react';
import { Shield, ShieldCheck, Calendar, Server } from 'lucide-react';
import { RestriccionStatsProps } from '../../types/restriccion';

const RestriccionStats: React.FC<RestriccionStatsProps> = ({ stats, loading }) => {
  const statsData = [
    {
      title: 'Total Restricciones',
      value: stats.totalRestricciones,
      icon: Shield,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      iconColor: 'text-blue-500'
    },
    {
      title: 'Restricciones Activas',
      value: stats.restriccionesActivas,
      icon: ShieldCheck,
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      iconColor: 'text-green-500'
    },
    {
      title: 'Bloqueos Mes Actual',
      value: stats.restriccionesMesActual,
      icon: Calendar,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      iconColor: 'text-purple-500'
    },
    {
      title: 'Servicios con Restricciones',
      value: stats.serviciosConRestricciones,
      icon: Server,
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      iconColor: 'text-orange-500'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl p-6 border border-gray-100 animate-pulse">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
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
        const Icon = stat.icon;
        return (
          <div key={index} className={`${stat.bgColor} rounded-xl p-6 border border-gray-100`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className={`text-3xl font-bold ${stat.textColor} mt-1`}>{stat.value.toLocaleString('es-ES')}</p>
              </div>
              <Icon className={`h-8 w-8 ${stat.iconColor}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RestriccionStats;
