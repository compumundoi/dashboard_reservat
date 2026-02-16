import React from 'react';
import { Activity, Star } from 'lucide-react';
import { RutaChartData } from '../../types/ruta';

interface RutaChartsProps {
  chartData: RutaChartData;
  loading: boolean;
}

const RutaCharts: React.FC<RutaChartsProps> = ({ chartData, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="animate-pulse">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gray-100 rounded-lg mr-4"></div>
                <div className="h-6 bg-gray-100 rounded w-1/3"></div>
              </div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-24 h-4 bg-gray-100 rounded mr-3"></div>
                    <div className="flex-1 h-6 bg-gray-100 rounded-full"></div>
                    <div className="w-12 h-4 bg-gray-100 rounded ml-3"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const renderChart = (data: { name: string; value: number; color: string }[], title: string, icon: React.ReactNode) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);

    return (
      <div className="bg-white rounded-xl shadow-soft-sm border border-secondary-100 p-6 flex flex-col h-full hover:shadow-soft-md transition-all duration-300">
        <div className="flex items-center mb-6 pb-4 border-b border-gray-50">
          <div className="p-2 bg-primary-50 rounded-lg text-primary-600 mr-3">
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">Total: {total}</p>
          </div>
        </div>

        <div className="space-y-5 flex-1">
          {data.map((item, index) => {
            const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;

            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">{item.name}</span>
                  <span className="font-semibold text-gray-900">{item.value} ({percentage}%)</span>
                </div>
                <div className="bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${item.color} transition-all duration-1000 ease-out`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {total === 0 && (
          <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-lg mt-4 border border-dashed border-gray-200">
            <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No hay datos disponibles</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {renderChart(
        chartData.estados,
        'Distribución por Estado',
        <Activity className="h-6 w-6" />
      )}

      {renderChart(
        chartData.recomendadas,
        'Rutas Recomendadas',
        <Star className="h-6 w-6" />
      )}
    </div>
  );
};

export default RutaCharts;
