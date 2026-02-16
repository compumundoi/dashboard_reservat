import React from 'react';
import { Search, Eye, Edit, Trash2, ChevronLeft, ChevronRight, X, User } from 'lucide-react';
import { MayoristaData } from '../../types/mayorista';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../ui/Table';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { cn } from '../../lib/utils';

interface MayoristaTableProps {
  mayoristas: MayoristaData[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  searchTerm: string;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSearchChange: (term: string) => void;
  onViewMayorista: (id: string) => void;
  onEditMayorista: (id: string) => void;
  onDeleteMayorista: (id: string) => void;
}

const MayoristaTable: React.FC<MayoristaTableProps> = ({
  mayoristas,
  loading,
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  searchTerm,
  onPageChange,
  onPageSizeChange,
  onSearchChange,
  onViewMayorista,
  onEditMayorista,
  onDeleteMayorista,
}) => {
  // Calcular rango de elementos mostrados
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
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
      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Input
            placeholder="Buscar mayoristas..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
            rightIcon={searchTerm ? (
              <button onClick={() => onSearchChange('')} className="hover:text-gray-600 transition-colors">
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
            <TableHead>Mayorista</TableHead>
            <TableHead>Contacto</TableHead>
            <TableHead>Ubicación</TableHead>
            <TableHead>Tipo/Intereses</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Verificado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mayoristas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-64 text-center">
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <User className="h-12 w-12 mb-4 opacity-20" />
                  <p className="text-lg font-medium">No se encontraron resultados</p>
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
            mayoristas.map((mayorista) => (
              <TableRow key={mayorista.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold border border-blue-200 shadow-sm shrink-0">
                      {mayorista.nombre.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-medium text-gray-900 truncate">
                        {mayorista.nombre} {mayorista.apellidos}
                      </span>
                      <span className="text-xs text-gray-500 truncate max-w-[200px]">
                        {mayorista.tipo_documento}: {mayorista.numero_documento}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-900">{mayorista.email}</span>
                    <span className="text-xs text-gray-500">{mayorista.telefono}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-900">{mayorista.ciudad}</span>
                    <span className="text-xs text-gray-500">{mayorista.pais}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">
                      {mayorista.recurente ? 'Recurrente' : 'Ocasional'}
                    </span>
                    <span className="text-xs text-gray-500 truncate max-w-[150px]">
                      {mayorista.intereses || 'Sin intereses'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={mayorista.activo ? 'success' : 'secondary'}
                    className="rounded-full"
                  >
                    {mayorista.activo ? 'Activo' : 'Inactivo'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={mayorista.verificado ? 'success' : 'warning'}
                    className="rounded-full"
                  >
                    {mayorista.verificado ? 'Verificado' : 'No verificado'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewMayorista(mayorista.id)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      title="Ver detalles"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditMayorista(mayorista.id)}
                      className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteMayorista(mayorista.id)}
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
        <div className="bg-white px-6 py-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
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
                // Logic to show only some page numbers if there are too many
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

export default MayoristaTable;
