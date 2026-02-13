import React from 'react';
import { Package, CheckCircle, Tag, Building } from 'lucide-react';
import { ServicioStatsProps } from '../../types/servicio';

const ServicioStats: React.FC<ServicioStatsProps> = ({ stats, loading }) => {
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
            <p className="text-sm text-gray-500">Total Servicios</p>
            <p className="text-3xl font-bold text-blue-600">{stats.totalServicios.toLocaleString('es-ES')}</p>
          </div>
          <Package className="h-8 w-8 text-blue-500" />
        </div>
      </div>

      {/* Activos */}
      <div className="bg-green-50 rounded-xl p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Servicios Activos</p>
            <p className="text-3xl font-bold text-green-600">{stats.serviciosActivos.toLocaleString('es-ES')}</p>
          </div>
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
      </div>

      {/* Tipos */}
      <div className="bg-purple-50 rounded-xl p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Tipos de Servicio</p>
            <p className="text-3xl font-bold text-purple-600">{stats.serviciosPorTipo.toLocaleString('es-ES')}</p>
          </div>
          <Tag className="h-8 w-8 text-purple-500" />
        </div>
      </div>

      {/* Proveedores */}
      <div className="bg-orange-50 rounded-xl p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Proveedores con Servicios</p>
            <p className="text-3xl font-bold text-orange-600">{stats.proveedoresConServicios.toLocaleString('es-ES')}</p>
          </div>
          <Building className="h-8 w-8 text-orange-500" />
        </div>
      </div>
    </div>
  );
};

export default ServicioStats;
