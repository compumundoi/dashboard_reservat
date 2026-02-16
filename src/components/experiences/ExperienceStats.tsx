import React from 'react';
import { Compass, CheckCircle, Globe, Award } from 'lucide-react';

interface ExperienceStatsProps {
  totalExperiences: number;
  verificadas: number;
  espanol: number;
  ingles: number;
  loading: boolean;
}

export const ExperienceStats: React.FC<ExperienceStatsProps> = ({
  totalExperiences,
  verificadas,
  espanol,
  ingles,
  loading
}) => {
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
            <p className="text-sm text-gray-500">Total Experiencias</p>
            <p className="text-3xl font-bold text-blue-600">{totalExperiences.toLocaleString('es-ES')}</p>
          </div>
          <Compass className="h-8 w-8 text-blue-500" />
        </div>
      </div>

      {/* Verificadas */}
      <div className="bg-green-50 rounded-xl p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Exp. Verificadas</p>
            <p className="text-3xl font-bold text-green-600">{verificadas.toLocaleString('es-ES')}</p>
          </div>
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
      </div>

      {/* Español */}
      <div className="bg-purple-50 rounded-xl p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">En Español</p>
            <p className="text-3xl font-bold text-purple-600">{espanol.toLocaleString('es-ES')}</p>
          </div>
          <Award className="h-8 w-8 text-purple-500" />
        </div>
      </div>

      {/* Inglés */}
      <div className="bg-orange-50 rounded-xl p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">En Inglés</p>
            <p className="text-3xl font-bold text-orange-600">{ingles.toLocaleString('es-ES')}</p>
          </div>
          <Globe className="h-8 w-8 text-orange-500" />
        </div>
      </div>
    </div>
  );
};