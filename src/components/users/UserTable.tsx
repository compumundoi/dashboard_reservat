import React, { useState } from 'react';
import { Search, Trash2, ChevronLeft, ChevronRight, X, User as UserIcon, Mail, Calendar, Info } from 'lucide-react';
import { User } from '../../types/user';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '../ui/Table';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface UserTableProps {
  users: User[];
  searchTerm: string;
  isSearching: boolean;
  onSearchChange: (term: string) => void;
  onClearSearch: () => void;
  onDelete: (userId: string) => void;
  loading: boolean;
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  searchTerm,
  isSearching,
  onSearchChange,
  onClearSearch,
  onDelete,
  loading,
  currentPage,
  totalPages,
  totalUsers,
  pageSize,
  onPageChange,
  onPageSizeChange
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  const safeUsers = Array.isArray(users) ? users : [];

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Fecha inválida';
    }
  };

  const getUserTypeBadge = (tipo: string) => {
    const variants: Record<string, "default" | "secondary" | "success" | "warning" | "error" | "info" | "outline"> = {
      'administrador': 'warning',
      'proveedor': 'success',
      'mayoristas': 'default',
      'cliente': 'secondary'
    };

    return (
      <Badge variant={variants[tipo.toLowerCase()] || 'secondary'} className="capitalize">
        {tipo}
      </Badge>
    );
  };

  const handleLocalSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchTerm(value);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const newTimeout = setTimeout(() => {
      onSearchChange(value);
    }, 500);

    setSearchTimeout(newTimeout);
  };

  const handleClearSearch = () => {
    setLocalSearchTerm('');
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    onClearSearch();
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

  return (
    <div className="space-y-4">
      {/* Filters Area */}
      <div className="bg-white p-4 rounded-xl border border-secondary-200 shadow-soft-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Input
            placeholder="Buscar por nombre, email o tipo..."
            value={localSearchTerm}
            onChange={handleLocalSearchChange}
            leftIcon={<Search className="h-4 w-4" />}
            rightIcon={localSearchTerm ? (
              <button onClick={handleClearSearch}>
                <X className="h-4 w-4 text-secondary-400 hover:text-secondary-600" />
              </button>
            ) : null}
            className="w-full"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-secondary-500 whitespace-nowrap">Mostrar:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="border border-secondary-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white min-w-[70px]"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {isSearching && (
        <div className="bg-primary-50 text-primary-700 px-4 py-2 rounded-lg text-sm flex items-center gap-2 border border-primary-100 animate-pulse">
          <Info className="h-4 w-4" />
          <span>Buscando en toda la base de datos...</span>
        </div>
      )}

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-secondary-200 shadow-soft-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Registro</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: pageSize }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={6}>
                    <div className="h-12 bg-secondary-50 animate-pulse rounded-lg" />
                  </TableCell>
                </TableRow>
              ))
            ) : safeUsers.length > 0 ? (
              safeUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 text-primary-700 flex items-center justify-center font-bold border border-primary-200">
                        {user.nombre.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-secondary-900 leading-none mb-1">
                          {user.nombre} {user.apellido}
                        </div>
                        <div className="text-xs text-secondary-500 flex items-center gap-1">
                          <UserIcon className="h-3 w-3" />
                          ID: {user.id.slice(0, 8)}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-secondary-600">
                      <Mail className="h-3.5 w-3.5" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getUserTypeBadge(user.tipo_usuario)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.activo ? 'success' : 'error'} className="rounded-full">
                      {user.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-secondary-500">
                      <Calendar className="h-3.5 w-3.5" />
                      <span className="text-sm">{user.fecha_registro ? formatDate(user.fecha_registro) : 'N/A'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(user.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Eliminar usuario"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-64">
                  <div className="flex flex-col items-center justify-center text-secondary-400">
                    <UserIcon className="h-12 w-12 opacity-20 mb-4" />
                    <p className="text-lg font-medium">No se encontraron usuarios</p>
                    <p className="text-sm">Intenta ajustar los filtros de búsqueda</p>
                    {localSearchTerm && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={handleClearSearch}
                      >
                        Limpiar filtros
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-secondary-100 bg-secondary-50/50 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="text-sm text-secondary-500">
              Mostrando <span className="font-medium text-secondary-900">{((currentPage - 1) * pageSize) + 1}</span> a <span className="font-medium text-secondary-900">{Math.min(currentPage * pageSize, totalUsers)}</span> de <span className="font-medium text-secondary-900">{totalUsers}</span> usuarios
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>

              <div className="flex items-center gap-1">
                {generatePageNumbers().map((page, index) => (
                  <React.Fragment key={index}>
                    {page === '...' ? (
                      <span className="px-3 py-1 text-secondary-400">...</span>
                    ) : (
                      <button
                        onClick={() => onPageChange(page as number)}
                        className={`min-w-[32px] h-8 px-2 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                          ? 'bg-primary-600 text-white shadow-sm'
                          : 'text-secondary-600 hover:bg-secondary-100'
                          }`}
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
                className="gap-1"
              >
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};