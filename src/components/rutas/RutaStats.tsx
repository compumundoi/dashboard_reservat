import React from 'react';
import { Route, CheckCircle, Star, Clock } from 'lucide-react';
import { RutaStats as RutaStatsType } from '../../types/ruta';

interface RutaStatsProps {
  stats: RutaStatsType;
  loading: boolean;
}

const RutaStats: React.FC<RutaStatsProps> = ({ stats, loading }) => {
  const statsData = [
    {
      title: 'Total Rutas',
      value: stats.totalRutas,
      icon: Route,
      className: 'bg-blue-50 border-blue-100',
      textColor: 'text-blue-600',
      iconColor: 'text-blue-500'
    },
    {
      title: 'Rutas Activas',
      value: stats.rutasActivas,
      icon: CheckCircle,
      className: 'bg-green-50 border-green-100',
      textColor: 'text-green-600',
      iconColor: 'text-green-500'
    },
    {
      title: 'Rutas Recomendadas',
      value: stats.rutasRecomendadas,
      icon: Star,
      className: 'bg-purple-50 border-purple-100',
      textColor: 'text-purple-600',
      iconColor: 'text-purple-500'
    },
    {
      title: 'Duración Promedio',
      value: `${stats.duracionPromedio} min`,
      icon: Clock,
      className: 'bg-orange-50 border-orange-100',
      textColor: 'text-orange-600',
      iconColor: 'text-orange-500'
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
                <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
              </div>
              <IconComponent className={`h-8 w-8 ${stat.iconColor}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RutaStats;
