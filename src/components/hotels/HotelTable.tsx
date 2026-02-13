import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, X, CheckCircle, XCircle, MapPin, Star, Eye, Edit, Trash2, Building, Phone, Mail } from 'lucide-react';
import { HotelUnificado } from '../../types/hotel';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { cn } from '../../lib/utils';

interface HotelTableProps {
  hotels: HotelUnificado[];
  searchTerm: string;
  isSearching: boolean;
  onSearchChange: (term: string) => void;
  onClearSearch: () => void;
  loading: boolean;
  currentPage: number;
  totalPages: number;
  totalHotels: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const HotelTable: React.FC<HotelTableProps> = ({
  hotels,
  searchTerm,
  isSearching,
  onSearchChange,
  onClearSearch,
  loading,
  currentPage,
  totalPages,
  totalHotels,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onView,
  onEdit,
  onDelete
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // Sync local search term with prop when it changes externally (e.g. clear)
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  const safeHotels = Array.isArray(hotels) ? hotels : [];
  const displayHotels = safeHotels;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearchTerm !== searchTerm) {
        onSearchChange(localSearchTerm);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearchTerm, onSearchChange, searchTerm]);

  const getVerificationBadge = (isVerified: boolean) => {
    return (
      <Badge variant={isVerified ? 'success' : 'error'} className="gap-1">
        {isVerified ? (
          <>
            <CheckCircle className="h-3 w-3" />
            Verificado
          </>
        ) : (
          <>
            <XCircle className="h-3 w-3" />
            No Verificado
          </>
        )}
      </Badge>
    );
  };

  const getStarRating = (rating: number) => {
    return (
      <div className="flex items-center" title={`${rating} estrellas`}>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-3.5 w-3.5",
              i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
            )}
          />
        ))}
        <span className="ml-1.5 text-xs font-medium text-secondary-600">{rating}</span>
      </div>
    );
  };

  const getServiceBadge = (hasService: boolean) => {
    return (
      <Badge variant={hasService ? 'success' : 'secondary'} className="px-1.5 py-0 text-[10px]">
        {hasService ? 'Sí' : 'No'}
      </Badge>
    );
  };

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
    onClearSearch();
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
    )
  }

  return (
    <div className="space-y-4">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white p-4 rounded-xl border border-secondary-200 shadow-soft-sm">
        <div className="w-full sm:w-72 md:w-96">
          <Input
            placeholder="Buscar por proveedor, ciudad..."
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
            rightIcon={
              (localSearchTerm || isSearching) ? (
                <button onClick={handleClearSearch} className="hover:bg-secondary-100 p-1 rounded-full text-secondary-500">
                  <X className="h-3 w-3" />
                </button>
              ) : undefined
            }
            className={isSearching ? 'border-primary-300 bg-primary-50/30' : ''}
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

      {isSearching && (
        <div className="bg-primary-50 text-primary-700 px-4 py-2 rounded-lg text-sm flex items-center animate-fade-in border border-primary-100">
          <Search className="w-4 h-4 mr-2 animate-pulse" />
          Resultados de búsqueda: <span className="font-semibold mx-1">{totalHotels}</span> hoteles encontrados
          {searchTerm && <span> para "{searchTerm}"</span>}
        </div>
      )}

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Proveedor</TableHead>
            <TableHead>Ubicación</TableHead>
            <TableHead>Hotel</TableHead>
            <TableHead>Servicios</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Documento</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayHotels.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-64 text-center">
                <div className="flex flex-col items-center justify-center text-secondary-400">
                  <Search className="h-12 w-12 mb-4 opacity-20" />
                  <p className="text-lg font-medium text-secondary-900">No se encontraron hoteles</p>
                  <p className="text-sm">Intenta ajustar los filtros de búsqueda</p>
                  {(localSearchTerm || isSearching) && (
                    <Button variant="ghost" onClick={handleClearSearch} className="mt-4 text-primary-600">
                      Limpiar búsqueda
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            displayHotels.map((hotel) => (
              <TableRow key={hotel.id_hotel}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-primary-700 font-bold border border-primary-200 shadow-sm shrink-0">
                      {hotel.nombre_proveedor.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-secondary-900 truncate max-w-[180px]" title={hotel.nombre_proveedor}>
                        {hotel.nombre_proveedor}
                      </div>
                      <div className="flex flex-col gap-0.5 mt-0.5">
                        <div className="flex items-center text-xs text-secondary-500">
                          <Mail className="h-3 w-3 mr-1 shrink-0" />
                          <span className="truncate max-w-[150px]">{hotel.email || 'N/A'}</span>
                        </div>
                        <div className="flex items-center text-xs text-secondary-500">
                          <Phone className="h-3 w-3 mr-1 shrink-0" />
                          <span>{hotel.telefono || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-start gap-2 max-w-[150px]">
                    <MapPin className="h-4 w-4 text-secondary-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-secondary-900 leading-tight">{hotel.ciudad}</div>
                      <div className="text-xs text-secondary-500 mt-0.5">{hotel.pais}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1.5">
                    {getStarRating(hotel.estrellas || 0)}
                    <div className="flex items-center text-xs text-secondary-600 bg-secondary-50 px-2 py-1 rounded-md w-fit border border-secondary-100">
                      <Building className="h-3 w-3 mr-1.5" />
                      {hotel.numero_habitaciones || 0} habs
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2 max-w-[100px]">
                      <span className="text-xs text-secondary-600">24h</span>
                      {getServiceBadge(hotel.recepcion_24_horas || false)}
                    </div>
                    <div className="flex items-center justify-between gap-2 max-w-[100px]">
                      <span className="text-xs text-secondary-600">Piscina</span>
                      {getServiceBadge(hotel.piscina || false)}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {getVerificationBadge(hotel.verificado || false)}
                </TableCell>
                <TableCell>
                  <div className="space-y-0.5">
                    <div className="text-xs font-semibold text-secondary-700 bg-secondary-100 px-2 py-0.5 rounded w-fit">
                      {hotel.tipo_documento || 'N/A'}
                    </div>
                    <div className="text-xs text-secondary-500 font-mono pl-0.5">
                      {hotel.numero_documento || 'N/A'}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="sm" onClick={() => onView(hotel.id_hotel)} className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50" title="Ver detalles">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onEdit(hotel.id_hotel)} className="h-8 w-8 p-0 text-amber-600 hover:text-amber-700 hover:bg-amber-50" title="Editar">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(hotel.id_hotel);
                      }}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50" title="Eliminar">
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
            Mostrando <span className="font-medium text-secondary-900">{((currentPage - 1) * pageSize) + 1}</span> a <span className="font-medium text-secondary-900">{Math.min(currentPage * pageSize, totalHotels)}</span> de <span className="font-medium text-secondary-900">{totalHotels}</span> hoteles
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
