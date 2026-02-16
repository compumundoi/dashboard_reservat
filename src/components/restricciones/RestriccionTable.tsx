import React from 'react';
import { Search, Eye, Edit, Trash2, Calendar, User, X } from 'lucide-react';
import { RestriccionTableProps } from '../../types/restriccion';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { RestriccionData } from '../../types/restriccion';
import { cn } from '../../lib/utils';

const RestriccionTable: React.FC<RestriccionTableProps> = ({
  restricciones,
  loading,
  currentPage,
  pageSize,
  totalPages,
  totalItems,
  searchTerm,
  onPageChange,
  onPageSizeChange,
  onSearch,
  onView,
  onEdit,
  onDelete,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  const clearSearch = () => {
    onSearch('');
  };

  const getStatusBadgeVariant = (active: boolean) => {
    return active ? 'success' : 'secondary';
  };

  return (
    <div className="space-y-6">
      {/* Search & Filters Container */}
      <div className="bg-white p-4 rounded-xl border border-secondary-200 shadow-soft-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Input
            placeholder="Buscar por motivo, servicio, fecha..."
            value={searchTerm}
            onChange={handleSearchChange}
            leftIcon={<Search className="h-4 w-4" />}
            rightIcon={searchTerm ? (
              <button onClick={clearSearch} className="hover:text-secondary-600 transition-colors">
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

      {loading ? (
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
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Servicio</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Bloqueado Por</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Tiempo</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {restricciones.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center text-secondary-400">
                      <Calendar className="h-12 w-12 mb-4 opacity-20" />
                      <p className="text-lg font-medium">No se encontraron restricciones</p>
                      <p className="text-sm">Prueba ajustando los filtros de búsqueda</p>
                      {searchTerm && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearSearch}
                          className="mt-4"
                        >
                          Limpiar búsqueda
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                restricciones.map((restriccion: RestriccionData) => (
                  <TableRow key={restriccion.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 text-orange-700 flex items-center justify-center font-bold border border-orange-200 shadow-sm shrink-0">
                          {restriccion.servicio_nombre?.charAt(0) || 'S'}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium text-secondary-900 truncate max-w-[200px]">{restriccion.servicio_nombre || 'Sin nombre'}</span>
                          <span className="text-xs text-secondary-500 font-mono uppercase tracking-tighter">ID: {restriccion.servicio_id.slice(0, 8)}...</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-secondary-700">
                        <Calendar className="h-3.5 w-3.5 text-secondary-400" />
                        <span className="font-medium">{restriccion.fecha_formateada}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-secondary-600 truncate max-w-[200px] block" title={restriccion.motivo}>
                        {restriccion.motivo}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-secondary-700">
                        <User className="h-3.5 w-3.5 text-secondary-400" />
                        <span>{restriccion.bloqueado_por}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(restriccion.bloqueo_activo)} className="rounded-full">
                        {restriccion.bloqueo_activo ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {restriccion.dias_hasta_fecha !== undefined ? (
                        restriccion.dias_hasta_fecha > 0 ? (
                          <Badge variant="warning" className="rounded-full">
                            {restriccion.dias_hasta_fecha} días
                          </Badge>
                        ) : restriccion.dias_hasta_fecha === 0 ? (
                          <Badge variant="error" className="rounded-full animate-pulse">
                            Hoy
                          </Badge>
                        ) : (
                          <span className="text-secondary-400 text-sm">Pasado</span>
                        )
                      ) : (
                        <span className="text-secondary-400 text-sm">N/A</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() => onView(restriccion.id)}
                          title="Ver detalles"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                          onClick={() => onEdit(restriccion.id)}
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => onDelete(restriccion.id)}
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

          {totalPages > 1 && (
            <div className="bg-white px-6 py-4 rounded-xl border border-secondary-200 shadow-soft-sm flex items-center justify-between">
              <p className="text-sm text-secondary-500">
                Mostrando <span className="font-medium text-secondary-900">{(currentPage - 1) * pageSize + 1}</span> a{' '}
                <span className="font-medium text-secondary-900">{Math.min(currentPage * pageSize, totalItems)}</span> de{' '}
                <span className="font-medium text-secondary-900">{totalItems}</span> resultados
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => onPageChange(currentPage - 1)}
                  className="gap-1 px-3"
                >
                  Anterior
                </Button>

                <div className="flex items-center gap-1">
                  {/* Simplified pagination logic for now, can be expanded if needed or reuse existing function */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    const pageNum = page;
                    // Logic to show only some page numbers if there are too many
                    // ServicioTable uses 0-based index for logic but displays pageNum+1. 
                    // Here our pageNum is 1-based.
                    // Let's adapt ServicioTable logic:
                    // ServicioTable: current index vs totalPages count.
                    // Here currentPage is 1-based.

                    if (
                      totalPages > 7 &&
                      pageNum !== 1 &&
                      pageNum !== totalPages &&
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
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RestriccionTable;
