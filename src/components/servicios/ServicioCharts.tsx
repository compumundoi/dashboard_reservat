import React from 'react';
import { BarChart3, MapPin } from 'lucide-react';
import { ServicioChartsProps } from '../../types/servicio';
import { Card } from '../ui/Card';

const ServicioCharts: React.FC<ServicioChartsProps> = ({ chartData, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, index) => (
          <Card key={index} className="p-6">
            <div className="animate-pulse space-y-6">
              <div className="h-6 bg-secondary-100 rounded w-1/3"></div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-4 bg-secondary-100 rounded w-20"></div>
                    <div className="h-6 bg-secondary-50 rounded flex-1"></div>
                    <div className="h-4 bg-secondary-100 rounded w-10"></div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const maxTipoValue = Math.max(...chartData.tipoServicioData.map(item => item.value), 1);
  const maxCiudadValue = Math.max(...chartData.ciudadData.map(item => item.cantidad), 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Tipos de Servicio */}
      <Card className="p-6 border-none shadow-soft-xl bg-white">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <BarChart3 className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold text-secondary-900">Distribución por Tipo</h3>
        </div>

        {chartData.tipoServicioData.length === 0 ? (
          <div className="text-center py-12 text-secondary-400">
            No hay datos de tipos de servicio disponibles
          </div>
        ) : (
          <div className="space-y-6">
            {chartData.tipoServicioData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-secondary-700">{item.name}</span>
                  <span className="text-secondary-500 font-mono">
                    {item.value} ({((item.value / chartData.tipoServicioData.reduce((sum, d) => sum + d.value, 0)) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="h-2.5 w-full bg-secondary-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${(item.value / maxTipoValue) * 100}%`,
                      backgroundColor: item.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Gráfico de Servicios por Ciudad */}
      <Card className="p-6 border-none shadow-soft-xl bg-white">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <MapPin className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold text-secondary-900">Servicios por Ciudad</h3>
        </div>

        {chartData.ciudadData.length === 0 ? (
          <div className="text-center py-12 text-secondary-400">
            No hay datos de ubicación disponibles
          </div>
        ) : (
          <div className="space-y-6">
            {chartData.ciudadData.map((item, index) => {
              const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
              const color = colors[index % colors.length];

              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-secondary-700">{item.ciudad}</span>
                    <span className="text-secondary-500 font-mono">
                      {item.cantidad} ({((item.cantidad / chartData.ciudadData.reduce((sum, d) => sum + d.cantidad, 0)) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-secondary-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${(item.cantidad / maxCiudadValue) * 100}%`,
                        backgroundColor: color
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ServicioCharts;
