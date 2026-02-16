import React from 'react';
import { Car, Activity } from 'lucide-react';
import { TransporteChartData } from '../../types/transporte';
import { cn } from '../../lib/utils';

interface TransporteChartsProps {
  chartData: TransporteChartData;
  loading: boolean;
}

const TransporteCharts: React.FC<TransporteChartsProps> = ({ chartData, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, index) => (
          <div key={index} className="bg-white rounded-2xl border border-secondary-100 p-6 shadow-soft-xl">
            <div className="animate-pulse">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gray-100 rounded-xl mr-3"></div>
                <div className="h-6 bg-gray-100 rounded w-1/2"></div>
              </div>
              <div className="space-y-5">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between">
                      <div className="w-20 h-4 bg-gray-100 rounded"></div>
                      <div className="w-12 h-4 bg-gray-100 rounded"></div>
                    </div>
                    <div className="h-2 bg-gray-50 rounded-full w-full"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const renderChart = (data: { name: string; value: number; color: string }[], title: string, icon: React.ReactNode, iconBg: string) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);

    return (
      <div className="bg-white rounded-2xl border border-secondary-100 p-6 shadow-soft-xl transition-all duration-300 hover:shadow-soft-2xl">
        <div className="flex items-center mb-8">
          <div className={cn("p-2.5 rounded-xl mr-4 bg-opacity-10", iconBg)}>
            {icon}
          </div>
          <h3 className="text-lg font-bold text-secondary-900">{title}</h3>
        </div>

        <div className="space-y-6">
          {data.map((item, index) => {
            const percentage = total > 0 ? (item.value / total) * 100 : 0;

            return (
              <div key={index} className="group">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-secondary-600 group-hover:text-secondary-900 transition-colors">
                    {item.name}
                  </span>
                  <span className="text-sm font-bold text-secondary-900">
                    {item.value}
                  </span>
                </div>
                <div className="h-2.5 w-full bg-secondary-50 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full bg-gradient-to-r rounded-full transition-all duration-1000 ease-out",
                      item.color
                    )}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {total === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-secondary-400">
            <Activity className="h-10 w-10 mb-2 opacity-20" />
            <p className="text-sm font-medium">No hay datos disponibles</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {renderChart(
        chartData.tiposVehiculo,
        'Distribución por Tipo de Vehículo',
        <Car className="h-5 w-5 text-blue-600" />,
        "bg-blue-500 text-blue-600"
      )}

      {renderChart(
        chartData.estados,
        'Transportes por Estado',
        <Activity className="h-5 w-5 text-green-600" />,
        "bg-green-500 text-green-600"
      )}
    </div>
  );
};

export default TransporteCharts;
