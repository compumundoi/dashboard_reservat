import React from 'react';
import { Search, Eye, Edit, Trash2, ChevronLeft, ChevronRight, MapPin, Building, Package, X } from 'lucide-react';
import { ServicioTableProps } from '../../types/servicio';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../ui/Table';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { cn } from '../../lib/utils';

const ServicioTable: React.FC<ServicioTableProps> = ({
  servicios,
  loading,
  searchTerm,
  onSearchChange,
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  onView,
  onEdit,
  onDelete
}) => {
  // Calcular rango de elementos mostrados
  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalItems);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-secondary-200 shadow-soft-sm p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-secondary-100 rounded-lg w-full"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-secondary-50 rounded-lg w-full"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-secondary-200 shadow-soft-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Input
            placeholder="Buscar servicios..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
            rightIcon={searchTerm ? (
              <button onClick={() => onSearchChange('')} className="hover:text-secondary-600 transition-colors">
                <X className="h-4 w-4" />
              </button>
            ) : null}
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-sm text-secondary-500 whitespace-nowrap">Mostrar:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="h-10 border border-secondary-200 rounded-xl px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
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
            <TableHead>Servicio</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Proveedor</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Ubicación</TableHead>
            <TableHead>Relevancia</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {servicios.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-64 text-center">
                <div className="flex flex-col items-center justify-center text-secondary-400">
                  <Package className="h-12 w-12 mb-4 opacity-20" />
                  <p className="text-lg font-medium">No se encontraron servicios</p>
                  <p className="text-sm">Prueba ajustando los filtros de búsqueda</p>
                  {searchTerm && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSearchChange('')}
                      className="mt-4"
                    >
                      Limpiar búsqueda
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            servicios.map((servicio) => (
              <TableRow key={servicio.id_servicio}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 text-primary-700 flex items-center justify-center font-bold border border-primary-200 shadow-sm shrink-0">
                      {servicio.nombre.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-medium text-secondary-900 truncate">{servicio.nombre}</span>
                      <span className="text-xs text-secondary-500 truncate max-w-[200px]">{servicio.descripcion}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="rounded-md capitalize">
                    {servicio.tipo_servicio}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-secondary-900 font-medium">
                      <Building className="h-3.5 w-3.5 text-secondary-400" />
                      <span className="truncate max-w-[150px]">{servicio.proveedorNombre}</span>
                    </div>
                    <span className="text-[10px] text-secondary-400 ml-5 font-mono uppercase tracking-tighter">
                      {servicio.proveedor_id.slice(-8)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-semibold text-secondary-900">
                    {servicio.precioFormateado}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-secondary-700">
                      <MapPin className="h-3.5 w-3.5 text-secondary-400" />
                      <span>{servicio.ciudad}</span>
                    </div>
                    <span className="text-xs text-secondary-500 ml-5">{servicio.departamento}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      servicio.relevancia === 'Alta' ? 'error' :
                        servicio.relevancia === 'Media' ? 'warning' :
                          'success'
                    }
                    className="rounded-full"
                  >
                    {servicio.relevancia}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={servicio.activo ? 'success' : 'secondary'}
                    className="rounded-full"
                  >
                    {servicio.activo ? 'Activo' : 'Inactivo'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(servicio)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      title="Ver detalles"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(servicio)}
                      className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(servicio.id_servicio)}
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
        <div className="bg-white px-6 py-4 rounded-xl border border-secondary-200 shadow-soft-sm flex items-center justify-between">
          <p className="text-sm text-secondary-500">
            Mostrando <span className="font-medium text-secondary-900">{startItem}</span> a{' '}
            <span className="font-medium text-secondary-900">{endItem}</span> de{' '}
            <span className="font-medium text-secondary-900">{totalItems}</span> resultados
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 0}
              onClick={() => onPageChange(currentPage - 1)}
              className="gap-1 px-3"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Anterior</span>
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i).map((pageNum) => {
                // Logic to show only some page numbers if there are too many
                if (
                  totalPages > 7 &&
                  pageNum !== 0 &&
                  pageNum !== totalPages - 1 &&
                  (pageNum < currentPage - 1 || pageNum > currentPage + 1)
                ) {
                  if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                    return <span key={pageNum} className="px-2 text-secondary-400">...</span>;
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
                      currentPage !== pageNum && "text-secondary-600 hover:bg-secondary-100"
                    )}
                  >
                    {pageNum + 1}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages - 1}
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

export default ServicioTable;
