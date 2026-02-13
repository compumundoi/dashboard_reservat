import React from 'react';
import { Users, Shield, Store, UserCheck, LucideIcon } from 'lucide-react';

interface UserStatsProps {
  totalUsers: number;
  proveedores: number;
  mayoristas: number;
  administrativos: number;
  loading?: boolean;
}

interface StatItem {
  title: string;
  value: number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'orange' | 'purple' | 'indigo';
}

export const UserStats: React.FC<UserStatsProps> = ({
  totalUsers,
  proveedores,
  mayoristas,
  administrativos,
  loading = false
}) => {
  const stats: StatItem[] = [
    {
      title: 'Total Usuarios',
      value: totalUsers,
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Proveedores',
      value: proveedores,
      icon: UserCheck,
      color: 'green'
    },
    {
      title: 'Mayoristas',
      value: mayoristas,
      icon: Store,
      color: 'purple'
    },
    {
      title: 'Administrativos',
      value: administrativos,
      icon: Shield,
      color: 'orange'
    }
  ];

  const getColorClasses = (color: StatItem['color']) => {
    const classes = {
      blue: 'bg-blue-50 text-blue-600 icon-text-blue-500',
      green: 'bg-green-50 text-green-600 icon-text-green-500',
      purple: 'bg-purple-50 text-purple-600 icon-text-purple-500',
      orange: 'bg-orange-50 text-orange-600 icon-text-orange-500',
      indigo: 'bg-indigo-50 text-indigo-600 icon-text-indigo-500',
    };
    return classes[color];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const colorClass = getColorClasses(stat.color);
        const [bgColor, textColor, iconColor] = colorClass.split(' ');

        return (
          <div key={index} className={`${bgColor} rounded-xl p-6 border border-gray-100`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                {loading ? (
                  <div className="animate-pulse mt-1">
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                  </div>
                ) : (
                  <p className={`text-3xl font-bold ${textColor}`}>{stat.value.toLocaleString()}</p>
                )}
              </div>
              <Icon className={`h-8 w-8 ${iconColor.replace('icon-text-', 'text-')}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
};