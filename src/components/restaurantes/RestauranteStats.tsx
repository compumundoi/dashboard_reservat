import React, { useState, useEffect } from 'react';
import { Utensils, CheckCircle, Truck, Heart } from 'lucide-react';
import { RestauranteStats as RestauranteStatsType } from '../../types/restaurante';
import { restauranteService } from '../../services/restauranteService';

interface RestauranteStatsProps {
  loading: boolean;
}

const RestauranteStats: React.FC<RestauranteStatsProps> = ({ loading }) => {
  const [stats, setStats] = useState<RestauranteStatsType>({
    total: 0,
    verificados: 0,
    con_entrega: 0,
    pet_friendly: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const statsData = await restauranteService.getRestauranteStats();
        setStats(statsData);
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    };

    if (!loading) {
      loadStats();
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl p-6 border border-gray-100 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total */}
      <div className="bg-blue-50 rounded-xl p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Restaurantes</p>
            <p className="text-3xl font-bold text-blue-600">{stats.total.toLocaleString('es-ES')}</p>
          </div>
          <Utensils className="h-8 w-8 text-blue-500" />
        </div>
      </div>

      {/* Verificados */}
      <div className="bg-green-50 rounded-xl p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Restaurantes Verificados</p>
            <p className="text-3xl font-bold text-green-600">{stats.verificados.toLocaleString('es-ES')}</p>
          </div>
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
      </div>

      {/* Entrega */}
      <div className="bg-orange-50 rounded-xl p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Con Entrega a Domicilio</p>
            <p className="text-3xl font-bold text-orange-600">{stats.con_entrega.toLocaleString('es-ES')}</p>
          </div>
          <Truck className="h-8 w-8 text-orange-500" />
        </div>
      </div>

      {/* Pet Friendly */}
      <div className="bg-purple-50 rounded-xl p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Pet Friendly</p>
            <p className="text-3xl font-bold text-purple-600">{stats.pet_friendly.toLocaleString('es-ES')}</p>
          </div>
          <Heart className="h-8 w-8 text-purple-500" />
        </div>
      </div>
    </div>
  );
};

export default RestauranteStats;
