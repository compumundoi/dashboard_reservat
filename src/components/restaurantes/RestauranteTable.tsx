import React from 'react';
import { Search, X, Eye, Edit, Trash2, MapPin, Clock, Star, Users, Calendar, ChevronLeft, ChevronRight, Utensils } from 'lucide-react';
import { RestauranteData } from '../../types/restaurante';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../ui/Table';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { cn } from '../../lib/utils';

interface RestauranteTableProps {
  restaurantes: RestauranteData[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  searchTerm: string;
  isSearching: boolean;
  onSearch: (term: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onViewDetails: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const RestauranteTable: React.FC<RestauranteTableProps> = ({
  restaurantes,
  loading,
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  searchTerm,
  isSearching,
  onSearch,
  onPageChange,
  onPageSizeChange,
  onViewDetails,
  onEdit,
  onDelete
}) => {
  // Calcular rango de elementos mostrados
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-soft-sm p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-gray-100 rounded-lg w-full"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-50 rounded-lg w-full"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters & Search - Separate Card */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Input
            placeholder="Buscar restaurantes..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
            rightIcon={searchTerm ? (
              <button onClick={() => onSearch('')} className="hover:text-gray-600 transition-colors">
                <X className="h-4 w-4" />
              </button>
            ) : null}
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-sm text-gray-500 whitespace-nowrap">Mostrar:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="h-10 border border-gray-200 rounded-xl px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Proveedor</TableHead>
            <TableHead>Ubicación</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Horario & Capacidad</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Registro</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isSearching ? (
            <TableRow>
              <TableCell colSpan={7} className="h-64 text-center">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="text-gray-500 font-medium">Buscando...</p>
                </div>
              </TableCell>
            </TableRow>
          ) : restaurantes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-64 text-center">
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <Utensils className="h-12 w-12 mb-4 opacity-20" />
                  <p className="text-lg font-medium text-gray-900">No se encontraron restaurantes</p>
                  <p className="text-sm">Prueba ajustando los filtros de búsqueda</p>
                  {searchTerm && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSearch('')}
                      className="mt-4"
                    >
                      Limpiar búsqueda
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            restaurantes.map((restaurante) => (
              <TableRow key={restaurante.id_restaurante}>
                {/* Proveedor */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 text-white flex items-center justify-center font-bold border border-orange-200 shadow-sm shrink-0">
                      {restaurante.nombre.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-medium text-gray-900 truncate">{restaurante.nombre}</span>
                      <span className="text-xs text-gray-500 truncate">{restaurante.email}</span>
                      <div className="flex items-center mt-1">
                        <Star className="h-3 w-3 text-yellow-400 mr-1" />
                        <span className="text-[10px] text-gray-600">
                          {restaurante.rating_promedio.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* Ubicación */}
                <TableCell>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-gray-900 font-medium text-sm">
                      <MapPin className="h-3.5 w-3.5 text-gray-400" />
                      <span>{restaurante.ciudad}</span>
                    </div>
                    <span className="text-xs text-gray-500 ml-5">{restaurante.pais}</span>
                  </div>
                </TableCell>

                {/* Categoría */}
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Badge variant="secondary" className="rounded-md w-fit font-normal">
                      {restaurante.tipo_cocina}
                    </Badge>
                    {restaurante.tipo_comida && (
                      <Badge variant="outline" className="rounded-md w-fit bg-blue-50 text-blue-700 border-blue-100 font-normal">
                        {restaurante.tipo_comida}
                      </Badge>
                    )}
                  </div>
                </TableCell>

                {/* Detalles */}
                <TableCell>
                  <div className="flex flex-col gap-1 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-gray-400" />
                      <span>{restaurante.horario_apertura} - {restaurante.horario_cierre}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-gray-400" />
                      <span>{restaurante.capacidad} personas</span>
                    </div>
                  </div>
                </TableCell>

                {/* Estado */}
                <TableCell>
                  <Badge
                    variant={restaurante.verificado ? 'success' : 'error'}
                    className="rounded-full"
                  >
                    {restaurante.verificado ? 'Verificado' : 'No verificado'}
                  </Badge>
                </TableCell>

                {/* Registro */}
                <TableCell>
                  <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <Calendar className="h-3.5 w-3.5 text-gray-400" />
                    <span>
                      {restaurante.fecha_registro
                        ? new Date(restaurante.fecha_registro).toLocaleDateString('es-ES')
                        : 'N/A'
                      }
                    </span>
                  </div>
                </TableCell>

                {/* Acciones */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails(restaurante.id_restaurante)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      title="Ver detalles"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(restaurante.id_restaurante)}
                      className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(restaurante.id_restaurante)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white px-6 py-4 rounded-xl border border-gray-200 shadow-soft-sm flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Mostrando <span className="font-medium text-gray-900">{startItem}</span> a{' '}
            <span className="font-medium text-gray-900">{endItem}</span> de{' '}
            <span className="font-medium text-gray-900">{totalItems}</span> resultados
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="gap-1 px-3"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Anterior</span>
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                if (
                  totalPages > 7 &&
                  pageNum !== 1 &&
                  pageNum !== totalPages &&
                  (pageNum < currentPage - 1 || pageNum > currentPage + 1)
                ) {
                  if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                    return <span key={pageNum} className="px-2 text-gray-400">...</span>;
                  }
                  return null;
                }

                return (
                  <Button
                    key={pageNum}
                    size="sm"
                    variant={currentPage === pageNum ? 'primary' : 'ghost'}
                    onClick={() => onPageChange(pageNum)}
                    className={cn(
                      "min-w-[32px] w-8 h-8 p-0 rounded-lg",
                      currentPage !== pageNum && "text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="gap-1 px-3"
            >
              <span className="hidden sm:inline">Siguiente</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestauranteTable;
