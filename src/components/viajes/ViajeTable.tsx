import React from 'react';
import { Search, X, Eye, Edit, Trash2, Calendar, Users, MapPin, Clock, DollarSign } from 'lucide-react';
import { ViajeTableProps, ESTADOS_VIAJE } from '../../types/viaje';

const ViajeTable: React.FC<ViajeTableProps> = ({
  viajes,
  loading,
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  searchTerm,
  onSearch,
  onPageChange,
  onPageSizeChange,
  onViewDetails,
  onEdit,
  onDelete
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  const clearSearch = () => {
    onSearch('');
  };

  const getEstadoBadge = (estado: string | undefined) => {
    if (!estado) return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">Sin estado</span>;

    const badgeClasses = {
      [ESTADOS_VIAJE.PROGRAMADO]: 'bg-blue-100 text-blue-800',
      [ESTADOS_VIAJE.EN_CURSO]: 'bg-yellow-100 text-yellow-800',
      [ESTADOS_VIAJE.FINALIZADO]: 'bg-green-100 text-green-800',
      [ESTADOS_VIAJE.CANCELADO]: 'bg-red-100 text-red-800'
    };

    const className = badgeClasses[estado as keyof typeof badgeClasses] || 'bg-gray-100 text-gray-600';

    return (
      <span className={`px-2 py-1 text-xs rounded-full ${className}`}>
        {estado.charAt(0).toUpperCase() + estado.slice(1).replace('_', ' ')}
      </span>
    );
  };

  const getActivoBadge = (activo: boolean | undefined) => {
    return activo ? (
      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Activo</span>
    ) : (
      <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Inactivo</span>
    );
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'No especificada';
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatPrice = (price: number | undefined) => {
    if (!price) return '$0';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Paginación para datos locales (cuando se está buscando)
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedViajes = viajes.slice(startIndex, endIndex);

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-2 text-sm font-medium rounded-md ${currentPage === i
            ? 'bg-blue-600 text-white'
            : 'text-gray-700 hover:bg-gray-100'
            }`}
        >
          {i}
        </button>
      );
    }

    return buttons;
  };

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Viajes</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Mostrar</span>
                <select
                  value={pageSize}
                  onChange={(e) => onPageSizeChange(Number(e.target.value))}
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                  disabled
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-gray-700">por página</span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      {/* Header con controles */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Viajes ({totalItems})
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Mostrar</span>
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-gray-700">por página</span>
            </div>
          </div>
        </div>

        {/* Barra de búsqueda */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por guía, estado, ruta, transportador, precio..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          {searchTerm && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                onClick={clearSearch}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fechas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Capacidad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Guía
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Activo
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedViajes.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  {searchTerm ? 'No se encontraron viajes que coincidan con la búsqueda' : 'No hay viajes disponibles'}
                </td>
              </tr>
            ) : (
              paginatedViajes.map((viaje) => (
                <tr key={viaje.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatDate(viaje.fecha_inicio)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(viaje.fecha_fin)}
                        </div>
                        {viaje.duracion_dias && (
                          <div className="text-xs text-gray-400 flex items-center mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            {viaje.duracion_dias} días
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {viaje.capacidad_disponible || 0} / {viaje.capacidad_total || 0}
                        </div>
                        {viaje.ocupacion_porcentaje !== undefined && (
                          <div className="text-xs text-gray-500">
                            {viaje.ocupacion_porcentaje}% ocupado
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">
                        {formatPrice(viaje.precio)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">
                        {viaje.guia_asignado || 'Sin asignar'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getEstadoBadge(viaje.estado)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getActivoBadge(viaje.activo)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onViewDetails(viaje)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                        title="Ver detalles"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEdit(viaje)}
                        className="text-yellow-600 hover:text-yellow-900 p-1 rounded-full hover:bg-yellow-50"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(viaje.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end space-y-3 sm:space-y-0">
            <div className="flex items-center justify-end space-x-2">
              <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>

              {renderPaginationButtons()}

              <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViajeTable;
