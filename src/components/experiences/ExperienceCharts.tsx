import React from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';
import { Card } from '../ui/Card';

interface ExperienceChartsProps {
  difficultyDistribution: { difficulty: string; count: number }[];
  languageDistribution: { language: string; count: number }[];
  chartsLoading?: boolean;
}

export const ExperienceCharts: React.FC<ExperienceChartsProps> = ({
  difficultyDistribution,
  languageDistribution,
  chartsLoading = false
}) => {
  const maxDifficultyValue = difficultyDistribution.length > 0
    ? Math.max(...difficultyDistribution.map(item => item.count))
    : 0;
  const maxLanguageValue = languageDistribution.length > 0
    ? Math.max(...languageDistribution.map(item => item.count))
    : 0;

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      'fácil': 'from-emerald-500 to-emerald-600',
      'moderado': 'from-amber-500 to-amber-600',
      'difícil': 'from-red-500 to-red-600',
      'extremo': 'from-purple-500 to-purple-600'
    };
    return colors[difficulty.toLowerCase()] || 'from-gray-500 to-gray-600';
  };

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      'español': 'from-amber-500 to-amber-600',
      'inglés': 'from-indigo-500 to-indigo-600',
      'francés': 'from-purple-500 to-purple-600',
      'portugués': 'from-emerald-500 to-emerald-600'
    };
    return colors[language.toLowerCase()] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Distribución por Dificultad */}
      <Card className="flex flex-col h-full border-none shadow-soft-xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 leading-none mb-1.5">
              Distribución por Dificultad
            </h3>
            <p className="text-sm text-gray-500">Nivel de complejidad de las experiencias</p>
          </div>
        </div>

        <div className="flex-1">
          {chartsLoading ? (
            <div className="space-y-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="space-y-2 animate-pulse">
                  <div className="flex justify-between items-center">
                    <div className="w-20 h-4 bg-gray-100 rounded"></div>
                    <div className="w-8 h-4 bg-gray-100 rounded"></div>
                  </div>
                  <div className="bg-gray-100 rounded-full h-3"></div>
                </div>
              ))}
            </div>
          ) : difficultyDistribution.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center py-12 text-gray-400">
              <BarChart3 className="h-10 w-10 mb-3 opacity-20" />
              <p>No hay datos disponibles</p>
            </div>
          ) : (
            <div className="space-y-6">
              {difficultyDistribution.map((item, index) => (
                <div key={index} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700 capitalize group-hover:text-gray-900 transition-colors">
                      {item.difficulty}
                    </span>
                    <span className="text-sm font-bold text-gray-900 bg-gray-50 px-2 py-0.5 rounded-md">
                      {item.count}
                    </span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-3.5 overflow-hidden">
                    <div
                      className={`bg-gradient-to-r ${getDifficultyColor(item.difficulty)} h-full rounded-full transition-all duration-1000 ease-out shadow-sm`}
                      style={{
                        width: `${maxDifficultyValue > 0 ? (item.count / maxDifficultyValue) * 100 : 0}%`
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Distribución por Idioma */}
      <Card className="flex flex-col h-full border-none shadow-soft-xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 leading-none mb-1.5">
              Distribución por Idioma
            </h3>
            <p className="text-sm text-gray-500">Idiomas disponibles en el catálogo</p>
          </div>
        </div>

        <div className="flex-1">
          {chartsLoading ? (
            <div className="space-y-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="space-y-2 animate-pulse">
                  <div className="flex justify-between items-center">
                    <div className="w-20 h-4 bg-gray-100 rounded"></div>
                    <div className="w-8 h-4 bg-gray-100 rounded"></div>
                  </div>
                  <div className="bg-gray-100 rounded-full h-3"></div>
                </div>
              ))}
            </div>
          ) : languageDistribution.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center py-12 text-gray-400">
              <TrendingUp className="h-10 w-10 mb-3 opacity-20" />
              <p>No hay datos disponibles</p>
            </div>
          ) : (
            <div className="space-y-6">
              {languageDistribution.map((item, index) => (
                <div key={index} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700 capitalize group-hover:text-gray-900 transition-colors">
                      {item.language}
                    </span>
                    <span className="text-sm font-bold text-gray-900 bg-gray-50 px-2 py-0.5 rounded-md">
                      {item.count}
                    </span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-3.5 overflow-hidden">
                    <div
                      className={`bg-gradient-to-r ${getLanguageColor(item.language)} h-full rounded-full transition-all duration-1000 ease-out shadow-sm`}
                      style={{
                        width: `${maxLanguageValue > 0 ? (item.count / maxLanguageValue) * 100 : 0}%`
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};