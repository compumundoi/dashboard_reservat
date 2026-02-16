import React, { useState, useEffect } from 'react';
import { Search, X, Eye, Edit, Trash2, Car, Users, Shield, Wifi, ChevronLeft, ChevronRight, Mail } from 'lucide-react';
import { TransporteTableProps } from '../../types/transporte';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { cn } from '../../lib/utils';

const TransporteTable: React.FC<TransporteTableProps> = ({
  transportes,
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
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // Sync local search term with prop when it changes externally
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearchTerm !== searchTerm) {
        onSearch(localSearchTerm);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearchTerm, onSearch, searchTerm]);

  // Generar números de página para la paginación
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handleClearSearch = () => {
    setLocalSearchTerm('');
    onSearch('');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-10 w-64 bg-gray-100 rounded-xl animate-pulse" />
          <div className="h-10 w-32 bg-gray-100 rounded-xl animate-pulse" />
        </div>
        <div className="rounded-xl border border-secondary-200 bg-white shadow-soft-sm overflow-hidden">
          <div className="space-y-4 p-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex space-x-4">
                <div className="h-12 w-12 rounded-full bg-gray-100 animate-pulse" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white p-4 rounded-xl border border-secondary-200 shadow-soft-sm">
        <div className="w-full sm:w-72 md:w-96">
          <Input
            placeholder="Buscar por proveedor, modelo, placa..."
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
            rightIcon={
              localSearchTerm ? (
                <button onClick={handleClearSearch} className="hover:bg-secondary-100 p-1 rounded-full text-secondary-500 transition-colors">
                  <X className="h-3 w-3" />
                </button>
              ) : undefined
            }
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 text-sm text-secondary-600 whitespace-nowrap">
            <span>Mostrar:</span>
            <Select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="w-20 h-9"
              options={[
                { value: 5, label: '5' },
                { value: 10, label: '10' },
                { value: 20, label: '20' },
                { value: 50, label: '50' },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Proveedor</TableHead>
            <TableHead>Vehículo</TableHead>
            <TableHead>Detalles</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Características</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transportes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-64 text-center">
                <div className="flex flex-col items-center justify-center text-secondary-400">
                  <Car className="h-12 w-12 mb-4 opacity-20" />
                  <p className="text-lg font-medium text-secondary-900">No se encontraron transportes</p>
                  <p className="text-sm">Intenta ajustar los filtros de búsqueda</p>
                  {localSearchTerm && (
                    <Button variant="ghost" onClick={handleClearSearch} className="mt-4 text-primary-600">
                      Limpiar búsqueda
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            transportes.map((transporte) => (
              <TableRow key={transporte.transporte.id_transporte}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 font-bold border border-blue-200 shadow-sm shrink-0">
                      <Car className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-secondary-900 truncate max-w-[180px]" title={transporte.proveedor.nombre}>
                        {transporte.proveedor.nombre}
                      </div>
                      <div className="flex items-center text-xs text-secondary-500 mt-0.5">
                        <Mail className="h-3 w-3 mr-1 shrink-0" />
                        <span className="truncate max-w-[150px]">{transporte.proveedor.email}</span>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="min-w-0">
                    <div className="font-medium text-secondary-900">{transporte.transporte.tipo_vehiculo}</div>
                    <div className="text-xs text-secondary-500 mt-0.5">
                      {transporte.transporte.modelo} ({transporte.transporte.anio})
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center text-xs text-secondary-700 font-medium">
                      <span className="bg-secondary-100 px-1.5 py-0.5 rounded mr-1.5">Placa</span>
                      {transporte.transporte.placa}
                    </div>
                    <div className="flex items-center text-xs text-secondary-500">
                      <Users className="h-3 w-3 mr-1.5" />
                      {transporte.transporte.capacidad} personas
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1.5">
                    <Badge variant={transporte.transporte.disponible ? 'success' : 'error'} className="w-fit">
                      {transporte.transporte.disponible ? 'Disponible' : 'No Disponible'}
                    </Badge>
                    <Badge variant={transporte.transporte.seguro_vigente ? 'info' : 'warning'} className="w-fit gap-1">
                      <Shield className="h-3 w-3" />
                      {transporte.transporte.seguro_vigente ? 'Con Seguro' : 'Sin Seguro'}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1.5">
                    {transporte.transporte.aire_acondicionado && (
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100">A/C</Badge>
                    )}
                    {transporte.transporte.wifi && (
                      <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-100 gap-1">
                        <Wifi className="h-3 w-3" />
                        WiFi
                      </Badge>
                    )}
                    <Badge variant="secondary" className="bg-gray-50 text-gray-700 border-gray-200">
                      {transporte.transporte.combustible}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails(transporte)}
                      className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      title="Ver detalles"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(transporte)}
                      className="h-8 w-8 p-0 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(transporte.transporte.id_transporte)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2">
          <div className="text-sm text-secondary-500">
            Mostrando <span className="font-medium text-secondary-900">{((currentPage - 1) * pageSize) + 1}</span> a <span className="font-medium text-secondary-900">{Math.min(currentPage * pageSize, totalItems)}</span> de <span className="font-medium text-secondary-900">{totalItems}</span> transportes
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-9"
              leftIcon={<ChevronLeft className="h-4 w-4" />}
            >
              Anterior
            </Button>

            <div className="flex items-center gap-1">
              {generatePageNumbers().map((page, index) => (
                <React.Fragment key={index}>
                  {page === '...' ? (
                    <span className="px-2 text-secondary-400">...</span>
                  ) : (
                    <button
                      onClick={() => onPageChange(page as number)}
                      className={cn(
                        "h-9 w-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors",
                        currentPage === page
                          ? "bg-primary-600 text-white shadow-primary-500/30 shadow-md"
                          : "text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900"
                      )}
                    >
                      {page}
                    </button>
                  )}
                </React.Fragment>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-9"
              rightIcon={<ChevronRight className="h-4 w-4" />}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransporteTable;
