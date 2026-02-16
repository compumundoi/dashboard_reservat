import React from 'react';
import { Car, CheckCircle, Shield, Users } from 'lucide-react';
import { TransporteStats as TransporteStatsType } from '../../types/transporte';

interface TransporteStatsProps {
  stats: TransporteStatsType;
  loading: boolean;
}

const TransporteStats: React.FC<TransporteStatsProps> = ({ stats, loading }) => {
  const statsData = [
    {
      title: 'Total Transportes',
      value: stats.totalTransportes,
      icon: Car,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      iconColor: 'text-blue-500',
    },
    {
      title: 'Transportes Disponibles',
      value: stats.transportesDisponibles,
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      iconColor: 'text-green-500',
    },
    {
      title: 'Con Seguro Vigente',
      value: stats.transportesConSeguro,
      icon: Shield,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      iconColor: 'text-purple-500',
    },
    {
      title: 'Capacidad Promedio',
      value: stats.capacidadPromedio,
      icon: Users,
      unit: ' pers.',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      iconColor: 'text-orange-500',
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="space-y-3 flex-1">
                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                <div className="h-8 bg-gray-100 rounded w-3/4"></div>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-lg ml-4"></div>
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
          <div key={index} className={`${stat.bgColor} rounded-xl p-6 border border-gray-100`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <div className="flex items-baseline gap-1">
                  <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
                  {stat.unit && <span className={`text-sm font-medium ${stat.textColor}`}>{stat.unit}</span>}
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

export default TransporteStats;
