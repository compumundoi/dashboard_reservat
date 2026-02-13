import React, { useState, useEffect, useCallback } from 'react';
import { UserStats } from './UserStats';
import { UserTable } from './UserTable';
import { UserCharts } from './UserCharts';
import { CreateUserModal } from './CreateUserModal';
import { User } from '../../types/user';
import { userService } from '../../services/userService';
import { Download, Plus, Users } from 'lucide-react';
import { Button } from '../ui/Button';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

export const UsersSection: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Estados para estadísticas
  const [stats, setStats] = useState({
    total: 0,
    proveedores: 0,
    mayoristas: 0,
    administrativos: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Estados para gráficos
  const [monthlyRegistrations, setMonthlyRegistrations] = useState<{ month: string; count: number }[]>([]);
  const [chartsLoading, setChartsLoading] = useState(true);
  const [recentLogins, setRecentLogins] = useState<{ date: string; count: number }[]>([]);

  const loadStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const statsData = await userService.getUserStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      if (searchTerm.trim()) {
        const allUsersData = await userService.getUsers(1, 1000);
        const allUsers = Array.isArray(allUsersData) ? allUsersData : (allUsersData?.usuarios || []);

        const filteredUsers = allUsers.filter((user: User) =>
          user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.tipo_usuario.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;

        setUsers(filteredUsers.slice(startIndex, endIndex));
        setTotalUsers(filteredUsers.length);
        setTotalPages(Math.ceil(filteredUsers.length / pageSize));
      } else {
        const usersData = await userService.getUsers(currentPage, pageSize);
        if (usersData && typeof usersData === 'object' && 'usuarios' in usersData) {
          setUsers(usersData.usuarios || []);
          setTotalUsers(usersData.total || 0);
          setTotalPages(Math.ceil((usersData.total || 0) / pageSize));
        } else if (Array.isArray(usersData)) {
          setUsers(usersData);
          setTotalUsers(usersData.length);
          setTotalPages(1);
        }
      }
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchTerm]);

  const loadChartsData = useCallback(async () => {
    try {
      setChartsLoading(true);
      const allUsersData = await userService.getUsers(1, 1000);
      const allUsers = Array.isArray(allUsersData) ? allUsersData : (allUsersData?.usuarios || []);

      // Procesa registros mensuales
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      const months = [];
      for (let i = 4; i >= 0; i--) {
        const date = new Date(currentYear, currentMonth - i, 1);
        months.push({
          monthName: date.toLocaleDateString('es-ES', { month: 'short' }).replace('.', ''),
          key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        });
      }
      const monthCounts: Record<string, number> = {};
      months.forEach(m => monthCounts[m.key] = 0);
      allUsers.forEach((user: User) => {
        if (user.fecha_registro) {
          const d = new Date(user.fecha_registro);
          const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
          if (Object.prototype.hasOwnProperty.call(monthCounts, k)) monthCounts[k]++;
        }
      });
      setMonthlyRegistrations(months.map(m => ({ month: m.monthName, count: monthCounts[m.key] })));

      // Procesa logins
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const days = [];
      for (let i = 4; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        days.push({
          date: date.toISOString(),
          dateKey: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        });
      }
      const dayCounts: Record<string, number> = {};
      days.forEach(d => dayCounts[d.dateKey] = 0);
      allUsers.forEach((user: User) => {
        if (user.ultimo_login) {
          const d = new Date(user.ultimo_login);
          const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
          if (Object.prototype.hasOwnProperty.call(dayCounts, k)) dayCounts[k]++;
        }
      });
      setRecentLogins(days.map(d => ({ date: d.date, count: dayCounts[d.dateKey] })));
    } catch (error) {
      console.error('Error cargando gráficas:', error);
    } finally {
      setChartsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
    loadStats();
    loadChartsData();
  }, [loadUsers, loadStats, loadChartsData]);

  const handleCreateUser = async (userData: any) => {
    try {
      setCreateLoading(true);
      await userService.createUser(userData);
      setCreateModalOpen(false);
      await Promise.all([loadUsers(), loadStats(), loadChartsData()]);

      await Swal.fire({
        title: '¡Usuario Creado!',
        text: 'El usuario ha sido registrado exitosamente.',
        icon: 'success',
        confirmButtonColor: '#10b981',
        confirmButtonText: 'Entendido',
        customClass: {
          popup: 'rounded-xl shadow-2xl',
          title: 'text-xl font-bold text-gray-900',
          confirmButton: 'px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
        },
        buttonsStyling: false,
        timer: 3000,
        timerProgressBar: true
      });
    } catch (error: any) {
      await Swal.fire({
        title: 'Error',
        text: error.message || 'Error al crear el usuario',
        icon: 'error',
        confirmButtonColor: '#dc2626',
        confirmButtonText: 'Entendido',
        customClass: {
          popup: 'rounded-xl shadow-2xl',
          title: 'text-xl font-bold text-gray-900',
          confirmButton: 'px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
        },
        buttonsStyling: false
      });
    } finally {
      setCreateLoading(false);
    }
  };

  const handleExportUsers = async () => {
    try {
      setExportLoading(true);
      const allUsersData = await userService.getUsers(1, 1000);
      const allUsers = Array.isArray(allUsersData) ? allUsersData : (allUsersData?.usuarios || []);

      if (allUsers.length === 0) {
        await Swal.fire({
          title: 'Sin datos',
          text: 'No hay usuarios para exportar',
          icon: 'info',
          confirmButtonColor: '#3b82f6',
          confirmButtonText: 'Entendido',
          customClass: {
            popup: 'rounded-xl shadow-2xl',
            title: 'text-xl font-bold text-gray-900',
            confirmButton: 'px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
          },
          buttonsStyling: false
        });
        return;
      }

      const excelData = allUsers.map((user: User, index: number) => ({
        'No.': index + 1,
        'ID': user.id,
        'Nombre': user.nombre,
        'Apellido': user.apellido,
        'Email': user.email,
        'Tipo': user.tipo_usuario,
        'Estado': user.activo ? 'Activo' : 'Inactivo',
        'Registro': user.fecha_registro ? new Date(user.fecha_registro).toLocaleString() : 'N/A',
        'Último Login': user.ultimo_login ? new Date(user.ultimo_login).toLocaleString() : 'Nunca'
      }));

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Usuarios');
      XLSX.writeFile(workbook, `usuarios_export_${new Date().getTime()}.xlsx`);

      await Swal.fire({
        title: '¡Exportación Exitosa!',
        text: `Se han exportado ${allUsers.length} usuarios exitosamente.`,
        icon: 'success',
        confirmButtonColor: '#10b981',
        confirmButtonText: 'Perfecto',
        customClass: {
          popup: 'rounded-xl shadow-2xl',
          title: 'text-xl font-bold text-gray-900',
          confirmButton: 'px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
        },
        buttonsStyling: false,
        timer: 3000
      });
    } catch (error) {
      console.error('Error exportando:', error);
    } finally {
      setExportLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      html: `<p class="text-secondary-600">Vas a eliminar al usuario: <span class="font-bold text-secondary-900">${user?.nombre} ${user?.apellido}</span></p>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-xl shadow-2xl',
        title: 'text-xl font-bold text-secondary-900',
        confirmButton: 'px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
        cancelButton: 'px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
      },
      buttonsStyling: false
    });

    if (result.isConfirmed) {
      try {
        await userService.deleteUser(userId);
        await Promise.all([loadUsers(), loadStats()]);
        await Swal.fire({
          title: '¡Eliminado!',
          text: 'El usuario ha sido eliminado.',
          icon: 'success',
          confirmButtonColor: '#10b981',
          customClass: {
            popup: 'rounded-xl shadow-2xl',
            title: 'text-xl font-bold text-secondary-900',
            confirmButton: 'px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
          },
          buttonsStyling: false,
          timer: 2000
        });
      } catch (error) {
        console.error('Error eliminando:', error);
      }
    }
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setIsSearching(!!term);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setIsSearching(false);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-secondary-900">Gestión de Usuarios</h1>
          </div>
          <p className="text-secondary-600 mt-2">Administra y monitorea el acceso a la plataforma</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleExportUsers}
            disabled={exportLoading}
          >
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>{exportLoading ? 'Exportando...' : 'Exportar Usuarios'}</span>
            </div>
          </Button>
          <Button
            variant="primary"
            onClick={() => setCreateModalOpen(true)}
          >
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Crear Usuario</span>
            </div>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <UserStats
        totalUsers={stats.total}
        proveedores={stats.proveedores}
        mayoristas={stats.mayoristas}
        administrativos={stats.administrativos}
        loading={statsLoading}
      />

      {/* Table */}
      <UserTable
        users={users}
        searchTerm={searchTerm}
        isSearching={isSearching}
        onSearchChange={handleSearchChange}
        onClearSearch={handleClearSearch}
        onDelete={handleDeleteUser}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        totalUsers={totalUsers}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      {/* Charts */}
      <UserCharts
        monthlyRegistrations={monthlyRegistrations}
        recentLogins={recentLogins}
        chartsLoading={chartsLoading}
      />

      {/* Modals */}
      <CreateUserModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleCreateUser}
        loading={createLoading}
      />
    </div>
  );
};