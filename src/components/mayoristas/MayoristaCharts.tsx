import React from 'react';
import { BarChart3, PieChart } from 'lucide-react';
import { MayoristaChartData } from '../../types/mayorista';
import { Card } from '../ui/Card';

interface MayoristaChartsProps {
  data: MayoristaChartData;
  loading: boolean;
}

const MayoristaCharts: React.FC<MayoristaChartsProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, index) => (
          <Card key={index} className="p-6">
            <div className="animate-pulse space-y-6">
              <div className="h-6 bg-gray-100 rounded w-1/3"></div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-4 bg-gray-100 rounded w-20"></div>
                    <div className="h-6 bg-gray-50 rounded flex-1"></div>
                    <div className="h-4 bg-gray-100 rounded w-10"></div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const maxEstadoValue = Math.max(...data.estados.map(item => item.count), 1);
  const maxVerificacionValue = Math.max(...data.verificacion.map(item => item.count), 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Distribución por Estados */}
      <Card className="p-6 border-none shadow-soft-xl bg-white">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <BarChart3 className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Distribución por Estados</h3>
        </div>

        {data.estados.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No hay datos de estados disponibles
          </div>
        ) : (
          <div className="space-y-6">
            {data.estados.map((item, index) => {
              const total = data.estados.reduce((sum, i) => sum + i.count, 0);
              const percentage = total > 0 ? (item.count / total) * 100 : 0;
              const colors = ['#10B981', '#EF4444']; // Green for Active, Red for Inactive (assuming order)
              // If order is not guaranteed, we might want to check item.estado string
              let color = colors[index % colors.length];
              if (item.estado === 'Activo') color = '#10B981';
              if (item.estado === 'Inactivo') color = '#EF4444';

              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">{item.estado}</span>
                    <span className="text-gray-500 font-mono">
                      {item.count} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${(item.count / maxEstadoValue) * 100}%`,
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

      {/* Gráfico de Verificación */}
      <Card className="p-6 border-none shadow-soft-xl bg-white">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <PieChart className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Estado de Verificación</h3>
        </div>

        {data.verificacion.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No hay datos de verificación disponibles
          </div>
        ) : (
          <div className="space-y-6">
            {data.verificacion.map((item, index) => {
              const total = data.verificacion.reduce((sum, i) => sum + i.count, 0);
              const percentage = total > 0 ? (item.count / total) * 100 : 0;
              const colors = ['#3B82F6', '#F59E0B']; // Blue for Verified, Orange for Not Verified
              let color = colors[index % colors.length];
              if (item.tipo === 'Verificado') color = '#3B82F6';
              if (item.tipo === 'No Verificado') color = '#F59E0B';

              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">{item.tipo}</span>
                    <span className="text-gray-500 font-mono">
                      {item.count} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${(item.count / maxVerificacionValue) * 100}%`,
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

export default MayoristaCharts;
