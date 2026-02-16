import React from 'react';
import { Search, X, Eye, Edit, Trash2, Calendar, Users, Clock, DollarSign } from 'lucide-react';
import { ViajeTableProps, ESTADOS_VIAJE } from '../../types/viaje';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

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
    if (!estado) return <Badge variant="secondary">Sin estado</Badge>;

    const variants: Record<string, "info" | "warning" | "success" | "error"> = {
      [ESTADOS_VIAJE.PROGRAMADO]: 'info',
      [ESTADOS_VIAJE.EN_CURSO]: 'warning',
      [ESTADOS_VIAJE.FINALIZADO]: 'success',
      [ESTADOS_VIAJE.CANCELADO]: 'error'
    };

    const variant = variants[estado] || 'secondary';

    return (
      <Badge variant={variant}>
        {estado.charAt(0).toUpperCase() + estado.slice(1).replace('_', ' ')}
      </Badge>
    );
  };

  const getActivoBadge = (activo: boolean | undefined) => {
    return activo ? (
      <Badge variant="success">Activo</Badge>
    ) : (
      <Badge variant="error">Inactivo</Badge>
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

  // Paginación para datos locales
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
          className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${currentPage === i
            ? 'bg-blue-600 text-white shadow-sm'
            : 'text-gray-600 hover:bg-gray-100'
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
      <div className="space-y-6">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm animate-pulse h-20"></div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm animate-pulse h-96"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search & Filters Card */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Input
            placeholder="Buscar por guía, estado, ruta..."
            value={searchTerm}
            onChange={handleSearchChange}
            leftIcon={<Search className="h-4 w-4" />}
            rightIcon={searchTerm ? (
              <button onClick={clearSearch} className="hover:text-gray-700">
                <X className="h-4 w-4" />
              </button>
            ) : null}
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">Mostrar</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="border-gray-200 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 py-2 pl-3 pr-8"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span className="text-sm text-gray-500">por página</span>
        </div>
      </div>

      {/* Table Card */}
      <div className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fechas</TableHead>
              <TableHead>Capacidad</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Guía</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Activo</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedViajes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <div className="flex flex-col items-center justify-center py-12 text-center h-64">
                    <div className="bg-gray-50 p-4 rounded-full mb-3">
                      <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-900 font-medium text-lg">No se encontraron viajes</p>
                    <p className="text-gray-500 text-sm mt-1 max-w-sm">
                      {searchTerm ? 'Intenta ajustar los términos de búsqueda' : 'No hay viajes disponibles en este momento'}
                    </p>
                    {searchTerm && (
                      <Button variant="outline" size="sm" onClick={clearSearch} className="mt-4">
                        Limpiar búsqueda
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedViajes.map((viaje) => (
                <TableRow key={viaje.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-50 rounded-lg mr-3">
                        <Calendar className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatDate(viaje.fecha_inicio)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(viaje.fecha_fin)}
                        </div>
                        {viaje.duracion_dias && (
                          <div className="text-xs text-gray-400 flex items-center mt-0.5">
                            <Clock className="h-3 w-3 mr-1" />
                            {viaje.duracion_dias} días
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm text-gray-900">
                          <span className="font-medium">{viaje.capacidad_disponible}</span>
                          <span className="text-gray-400 mx-1">/</span>
                          <span className="text-gray-500">{viaje.capacidad_total}</span>
                        </div>
                        {viaje.ocupacion_porcentaje !== undefined && (
                          <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${viaje.ocupacion_porcentaje > 90 ? 'bg-red-500' :
                                viaje.ocupacion_porcentaje > 70 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                              style={{ width: `${viaje.ocupacion_porcentaje}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-gray-900 font-medium">
                      <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                      {formatPrice(viaje.precio)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-2 text-xs font-medium text-gray-600">
                        {viaje.guia_asignado?.charAt(0) || '?'}
                      </div>
                      <span className="text-sm text-gray-700">
                        {viaje.guia_asignado || 'Sin asignar'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getEstadoBadge(viaje.estado)}
                  </TableCell>
                  <TableCell>
                    {getActivoBadge(viaje.activo)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetails(viaje)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 h-8 w-8"
                        title="Ver detalles"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(viaje)}
                        className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 p-2 h-8 w-8"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(viaje.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 h-8 w-8"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-500">
              Mostrando <span className="font-medium">{startIndex + 1}</span> a <span className="font-medium">{Math.min(endIndex, totalItems)}</span> de <span className="font-medium">{totalItems}</span> resultados
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <div className="flex items-center gap-1">
                {renderPaginationButtons()}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViajeTable;
