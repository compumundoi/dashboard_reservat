import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, PieChart } from 'lucide-react';
import { RestauranteChartData } from '../../types/restaurante';
import { restauranteService } from '../../services/restauranteService';
import { cn } from '../../lib/utils';

interface RestauranteChartsProps {
  loading: boolean;
}

const RestauranteCharts: React.FC<RestauranteChartsProps> = ({ loading }) => {
  const [chartData, setChartData] = useState<RestauranteChartData>({
    tipos_cocina: [],
    servicios: []
  });

  useEffect(() => {
    const loadChartData = async () => {
      try {
        const data = await restauranteService.getRestauranteChartData();
        setChartData(data);
      } catch (error) {
        console.error('Error loading chart data:', error);
      }
    };

    if (!loading) {
      loadChartData();
    }
  }, [loading]);

  // Colores modernos y vibrantes para los gráficos
  const chartColors = [
    { bg: 'bg-primary-500', from: 'from-primary-500', to: 'to-primary-600', shadow: 'shadow-primary-100' },
    { bg: 'bg-secondary-500', from: 'from-secondary-500', to: 'to-secondary-600', shadow: 'shadow-secondary-100' },
    { bg: 'bg-amber-500', from: 'from-amber-500', to: 'to-amber-600', shadow: 'shadow-amber-100' },
    { bg: 'bg-emerald-500', from: 'from-emerald-500', to: 'to-emerald-600', shadow: 'shadow-emerald-100' },
    { bg: 'bg-indigo-500', from: 'from-indigo-500', to: 'to-indigo-600', shadow: 'shadow-indigo-100' },
    { bg: 'bg-rose-500', from: 'from-rose-500', to: 'to-rose-600', shadow: 'shadow-rose-100' },
    { bg: 'bg-sky-500', from: 'from-sky-500', to: 'to-sky-600', shadow: 'shadow-sky-100' },
    { bg: 'bg-violet-500', from: 'from-violet-500', to: 'to-violet-600', shadow: 'shadow-violet-100' },
  ];

  const renderChart = (
    title: string,
    subtitle: string,
    icon: React.ReactNode,
    data: Array<{ [key: string]: string | number }>,
    valueKey: string,
    labelKey: string,
    iconColor: string
  ) => {
    if (loading) {
      return (
        <div className="bg-white p-8 rounded-3xl border border-secondary-100 shadow-sm transition-all">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-secondary-50 rounded-2xl animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-6 bg-secondary-50 rounded animate-pulse w-48"></div>
              <div className="h-4 bg-secondary-50 rounded animate-pulse w-32"></div>
            </div>
          </div>
          <div className="space-y-5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <div className="w-20 h-4 bg-secondary-50 rounded animate-pulse"></div>
                  <div className="w-12 h-4 bg-secondary-50 rounded animate-pulse"></div>
                </div>
                <div className="h-4 bg-secondary-50 rounded-full animate-pulse w-full"></div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (data.length === 0) {
      return (
        <div className="bg-white p-8 rounded-3xl border border-secondary-100 shadow-sm flex flex-col items-center justify-center text-center">
          <div className={cn("p-4 rounded-2xl mb-4 bg-secondary-50", iconColor)}>
            {icon}
          </div>
          <h3 className="text-xl font-bold text-secondary-900 mb-2">{title}</h3>
          <p className="text-secondary-500 text-sm max-w-[200px]">
            No hay suficientes datos registrados actualmente.
          </p>
        </div>
      );
    }

    const maxValue = Math.max(...data.map(item => Number(item[valueKey])));
    const total = data.reduce((sum, item) => sum + Number(item[valueKey]), 0);

    return (
      <div className="bg-white p-8 rounded-3xl border border-secondary-100 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className={cn("p-3 rounded-2xl shadow-lg ring-4 ring-white", iconColor)}>
              {icon}
            </div>
            <div>
              <h3 className="text-lg font-bold text-secondary-900 leading-tight">{title}</h3>
              <p className="text-xs font-medium text-secondary-400 uppercase tracking-widest mt-0.5">{subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-secondary-50 px-3 py-1.5 rounded-full border border-secondary-100">
            <TrendingUp className="h-3.5 w-3.5 text-secondary-400" />
            <span className="text-xs font-bold text-secondary-600">Actualizado</span>
          </div>
        </div>

        <div className="space-y-6">
          {data.slice(0, 7).map((item, index) => {
            const value = Number(item[valueKey]);
            const percentage = total > 0 ? (value / total) * 100 : 0;
            const widthPercentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
            const color = chartColors[index % chartColors.length];

            return (
              <div key={index} className="group">
                <div className="flex items-end justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={cn("w-1.5 h-1.5 rounded-full", color.bg)}></span>
                    <span className="text-sm font-bold text-secondary-700 truncate max-w-[150px]">
                      {String(item[labelKey])}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[10px] font-black text-secondary-400 uppercase">{value} UND</span>
                    <span className="text-sm font-black text-secondary-900">{percentage.toFixed(0)}%</span>
                  </div>
                </div>
                <div className="h-3 w-full bg-secondary-50 rounded-full overflow-hidden p-0.5 border border-secondary-100/50">
                  <div
                    className={cn(
                      "h-full rounded-full bg-gradient-to-r transition-all duration-1000 ease-out relative",
                      color.from, color.to
                    )}
                    style={{ width: loading ? '0%' : `${widthPercentage}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 pt-6 border-t border-secondary-50 flex items-center justify-between text-[10px] font-bold text-secondary-400 uppercase tracking-widest">
          <span>Total Registros: {total}</span>
          <span className="text-primary-500">Ver reporte completo</span>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {renderChart(
        'Tipos de Cocina',
        'Distribución por Especialidad',
        <BarChart3 className="h-6 w-6 text-white" />,
        chartData.tipos_cocina,
        'count',
        'tipo',
        'bg-purple-500 text-white'
      )}

      {renderChart(
        'Servicios Populares',
        'Frecuencia de Amenidades',
        <PieChart className="h-6 w-6 text-white" />,
        chartData.servicios,
        'count',
        'servicio',
        'bg-primary-500 text-white'
      )}
    </div>
  );
};

export default RestauranteCharts;
