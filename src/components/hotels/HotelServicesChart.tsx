import React from 'react';
import { TrendingUp } from 'lucide-react';
import { HotelUnificado } from '../../types/hotel';

interface HotelServicesChartProps {
  hotels: HotelUnificado[];
  loading?: boolean;
}

export const HotelServicesChart: React.FC<HotelServicesChartProps> = ({ hotels, loading = false }) => {
  // Definir los servicios principales a mostrar
  const services = [
    { key: 'piscina', label: 'Piscina', color: 'from-blue-500 to-blue-600' },
    { key: 'recepcion_24_horas', label: 'Recepción 24h', color: 'from-green-500 to-green-600' },
    { key: 'servicio_restaurante', label: 'Restaurante', color: 'from-orange-500 to-orange-600' },
    { key: 'parqueadero', label: 'Parqueadero', color: 'from-purple-500 to-purple-600' },
    { key: 'pet_friendly', label: 'Servicios especializados', color: 'from-pink-500 to-pink-600' },
    { key: 'rampa_discapacitado', label: 'Accesibilidad', color: 'from-emerald-500 to-emerald-600' },
  ];

  // Contar hoteles que tienen cada servicio
  const servicesData = services.map(service => ({
    ...service,
    count: hotels.filter(hotel => hotel[service.key as keyof HotelUnificado] === true).length
  }));

  const maxValue = Math.max(...servicesData.map(item => item.count));
  const totalHotels = hotels.length;
  
  const getPercentage = (count: number) => {
    return totalHotels > 0 ? ((count / totalHotels) * 100).toFixed(1) : '0.0';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
            Servicios Principales
          </h3>
          <p className="text-sm text-gray-600">Servicios más comunes en los hoteles</p>
        </div>
      </div>
      
      {loading ? (
        <div className="space-y-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="flex items-center animate-pulse">
              <div className="w-24 h-4 bg-gray-200 rounded"></div>
              <div className="flex-1 mx-4">
                <div className="bg-gray-200 rounded-full h-3"></div>
              </div>
              <div className="w-16 h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {servicesData.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="w-24 text-sm text-gray-600 font-medium">
                {item.label}
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-gray-200 rounded-full h-3">
                  <div
                    className={`bg-gradient-to-r ${item.color} h-3 rounded-full transition-all duration-500`}
                    style={{
                      width: `${maxValue > 0 ? (item.count / maxValue) * 100 : 0}%`
                    }}
                  ></div>
                </div>
              </div>
              <div className="w-16 text-sm font-semibold text-gray-900 text-right">
                {item.count} ({getPercentage(item.count)}%)
              </div>
            </div>
          ))}
        </div>
      )}
      
      {!loading && servicesData.every(item => item.count === 0) && (
        <div className="text-center py-8 text-gray-500">
          No hay datos de servicios disponibles
        </div>
      )}
    </div>
  );
};
