import React from 'react';
import { Search, Eye, Edit, Trash2, ChevronLeft, ChevronRight, MapPin, Building, Package, X, Globe, Users } from 'lucide-react';
import { ExperienceTableProps } from '../../types/experience';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../ui/Table';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { cn } from '../../lib/utils';

export const ExperienceTable: React.FC<ExperienceTableProps> = ({
  experiences,
  loading,
  searchTerm,
  onSearchChange,
  onClearSearch,
  currentPage,
  totalPages,
  totalExperiences,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onView,
  onEdit,
  onDelete,
}) => {
  // Helpers para mostrar rango
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalExperiences);

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
      {/* Filters & Search - Match ServicioTable style */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Input
            placeholder="Buscar experiencias..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
            rightIcon={searchTerm ? (
              <button onClick={onClearSearch} className="hover:text-gray-600 transition-colors">
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
            <TableHead>Experiencia</TableHead>
            <TableHead>Proveedor</TableHead>
            <TableHead>Detalles</TableHead>
            <TableHead>Ubicación</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {experiences.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-64 text-center">
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <Package className="h-12 w-12 mb-4 opacity-20" />
                  <p className="text-lg font-medium">No se encontraron experiencias</p>
                  <p className="text-sm">Prueba ajustando los filtros de búsqueda</p>
                  {searchTerm && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onClearSearch}
                      className="mt-4"
                    >
                      Limpiar búsqueda
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            experiences.map((exp) => (
              <TableRow key={exp.id_experiencia}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 flex items-center justify-center font-bold border border-blue-200 shadow-sm shrink-0">
                      {exp.proveedor_nombre.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-medium text-gray-900 truncate">
                        {exp.proveedor_nombre} {/* Using provider name as main identifier for now based on data structure */}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Badge variant="secondary" className="px-1.5 py-0 h-5 text-[10px]">
                          {exp.dificultad}
                        </Badge>
                        <span className="truncate">{exp.duracion} hs</span>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-gray-900 font-medium">
                      <Building className="h-3.5 w-3.5 text-gray-400" />
                      <span className="truncate max-w-[150px]">{exp.proveedor_nombre}</span>
                    </div>
                    {exp.proveedor_verificado && (
                      <span className="text-[10px] text-green-600 font-medium ml-5">
                        Verificado
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-gray-600 text-sm">
                      <Globe className="h-3.5 w-3.5 text-gray-400" />
                      <span>{exp.idioma}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-600 text-sm">
                      <Users className="h-3.5 w-3.5 text-gray-400" />
                      <span>Max. {exp.grupo_maximo} pers.</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-gray-700">
                      <MapPin className="h-3.5 w-3.5 text-gray-400" />
                      <span>{exp.proveedor_ciudad}</span>
                    </div>
                    <span className="text-xs text-gray-500 ml-5">{exp.proveedor_pais}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={exp.proveedor_activo ? 'success' : 'secondary'} className="rounded-full">
                    {exp.proveedor_activo ? 'Activo' : 'Inactivo'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {/* View - Blue */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      title="Ver detalles"
                      onClick={() => onView(exp)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {/* Edit - Amber */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                      title="Editar"
                      onClick={() => onEdit(exp)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {/* Delete - Red */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      title="Eliminar"
                      onClick={() => onDelete(exp.id_experiencia)}
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
      {totalPages > 0 && (
        <div className="bg-white px-6 py-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Mostrando <span className="font-medium text-gray-900">{startItem}</span> a{' '}
            <span className="font-medium text-gray-900">{endItem}</span> de{' '}
            <span className="font-medium text-gray-900">{totalExperiences}</span> resultados
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