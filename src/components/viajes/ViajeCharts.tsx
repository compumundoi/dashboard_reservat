import React from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';
import { ViajeChartsProps } from '../../types/viaje';

const ViajeCharts: React.FC<ViajeChartsProps> = ({ chartData, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="animate-pulse">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-gray-200 rounded-lg mr-3"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </div>
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-20 h-4 bg-gray-200 rounded mr-3"></div>
                    <div className="flex-1 h-6 bg-gray-200 rounded mr-3"></div>
                    <div className="w-8 h-4 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const getEstadoColor = (estado: string) => {
    const colors = {
      'programado': 'from-blue-400 to-blue-600',
      'en_curso': 'from-yellow-400 to-yellow-600',
      'finalizado': 'from-green-400 to-green-600',
      'cancelado': 'from-red-400 to-red-600'
    };
    return colors[estado as keyof typeof colors] || 'from-gray-400 to-gray-600';
  };

  const getMesColor = (index: number) => {
    const colors = [
      'from-purple-400 to-purple-600',
      'from-indigo-400 to-indigo-600',
      'from-blue-400 to-blue-600',
      'from-cyan-400 to-cyan-600',
      'from-teal-400 to-teal-600',
      'from-emerald-400 to-emerald-600'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Distribución por Estado */}
      <div className="bg-white rounded-2xl p-6 border-none shadow-soft-xl">
        <div className="flex items-center mb-8">
          <div className="bg-blue-50 p-2 rounded-lg mr-3">
            <BarChart3 className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Distribución por Estado</h3>
        </div>
        <div className="space-y-5">
          {chartData.estadoDistribution.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-gray-50 p-3 rounded-full mb-3">
                <BarChart3 className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No hay datos disponibles</p>
            </div>
          ) : (
            chartData.estadoDistribution.map((item, index) => (
              <div key={index} className="flex items-center group">
                <div className="w-28 text-sm text-gray-600 font-medium capitalize group-hover:text-gray-900 transition-colors">
                  {item.estado.replace('_', ' ')}
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${getEstadoColor(item.estado)} transition-all duration-1000 ease-out rounded-full`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
                <div className="w-12 text-right text-sm font-bold text-gray-900 tabular-nums">
                  {item.count}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Viajes por Mes */}
      <div className="bg-white rounded-2xl p-6 border-none shadow-soft-xl">
        <div className="flex items-center mb-8">
          <div className="bg-green-50 p-2 rounded-lg mr-3">
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Viajes por Mes</h3>
        </div>
        <div className="space-y-5">
          {chartData.viajePorMes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-gray-50 p-3 rounded-full mb-3">
                <TrendingUp className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No hay datos disponibles</p>
            </div>
          ) : (
            chartData.viajePorMes.map((item, index) => {
              const maxCount = Math.max(...chartData.viajePorMes.map(v => v.count));
              const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0;

              return (
                <div key={index} className="flex items-center group">
                  <div className="w-28 text-sm text-gray-600 font-medium group-hover:text-gray-900 transition-colors">
                    {item.mes}
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${getMesColor(index)} transition-all duration-1000 ease-out rounded-full`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-12 text-right text-sm font-bold text-gray-900 tabular-nums">
                    {item.count}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ViajeCharts;
