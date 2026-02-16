/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from 'react';
import { ExperienceStats } from './ExperienceStats';
import { CreateExperienceModal } from './CreateExperienceModal';
import { ExperienceTable } from './ExperienceTable';
import { ExperienceCharts } from './ExperienceCharts';
import { EditExperienceModal } from './EditExperienceModal';
import { ExperienceDetailModal } from './ExperienceDetailModal';
import { ExperienciaCompleta } from '../../types/experience';
import { experienceService } from '../../services/experienceService';
import { Plus, Download, Compass } from 'lucide-react';
import { Button } from '../ui/Button';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

export const ExperiencesSection: React.FC = () => {
  const [experiences, setExperiences] = useState<ExperienciaCompleta[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalExperiences, setTotalExperiences] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<ExperienciaCompleta | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  // Estados para estadísticas
  const [stats, setStats] = useState({
    total: 0,
    verificadas: 0,
    espanol: 0,
    ingles: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Estados para gráficos
  const [difficultyDistribution, setDifficultyDistribution] = useState<{ difficulty: string; count: number }[]>([]);
  const [languageDistribution, setLanguageDistribution] = useState<{ language: string; count: number }[]>([]);
  const [chartsLoading, setChartsLoading] = useState(true);

  // --- Helpers ---
  const loadExperiences = useCallback(async () => {
    try {
      setLoading(true);
      const experiencesData = await experienceService.getExperiences(currentPage, pageSize);
      if (experiencesData && typeof experiencesData === 'object' && 'experiencias' in experiencesData) {
        setExperiences(experiencesData.experiencias || []);
        setTotalExperiences(experiencesData.total || 0);
        setTotalPages(Math.ceil((experiencesData.total || 0) / pageSize));
      } else {
        setExperiences([]);
        setTotalExperiences(0);
        setTotalPages(0);
      }
    } catch (error) {
      console.error('Error cargando experiencias:', error);
      setExperiences([]);
      setTotalExperiences(0);
      setTotalPages(0);
      Swal.fire({
        title: 'Error',
        text: 'Error al cargar las experiencias',
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
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  const loadStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const statsData = await experienceService.getExperienceStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
      setStats({
        total: 0,
        verificadas: 0,
        espanol: 0,
        ingles: 0
      });
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const handleSearch = useCallback(async (term: string) => {
    if (!term.trim()) {
      setIsSearching(false);
      setSearchTerm('');
      loadExperiences();
      return;
    }

    try {
      setIsSearching(true);
      setLoading(true);

      // Obtener todas las experiencias para búsqueda local
      const allExperiencesData = await experienceService.getExperiences(1, 300);
      const allExperiences = Array.isArray(allExperiencesData)
        ? allExperiencesData
        : (allExperiencesData as any).experiencias || [];

      // Filtrar localmente
      const filteredExperiences = allExperiences.filter((exp: ExperienciaCompleta) =>
        exp.proveedor_nombre.toLowerCase().includes(term.toLowerCase()) ||
        exp.proveedor_ciudad.toLowerCase().includes(term.toLowerCase()) ||
        exp.proveedor_pais.toLowerCase().includes(term.toLowerCase()) ||
        exp.idioma.toLowerCase().includes(term.toLowerCase()) ||
        exp.dificultad.toLowerCase().includes(term.toLowerCase()) ||
        exp.punto_de_encuentro.toLowerCase().includes(term.toLowerCase())
      );

      // Aplicar paginación manual
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedResults = filteredExperiences.slice(startIndex, endIndex);

      setExperiences(paginatedResults);
      setTotalExperiences(filteredExperiences.length);
      setTotalPages(Math.ceil(filteredExperiences.length / pageSize));

      if (filteredExperiences.length === 0) {
        Swal.fire({
          title: 'Sin resultados',
          text: `No se encontraron experiencias que coincidan con "${term}"`,
          icon: 'info',
          confirmButtonColor: '#3b82f6',
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
      }
    } catch (error) {
      console.error('Error en búsqueda local:', error);
      setExperiences([]);
      setTotalExperiences(0);
      setTotalPages(0);
      Swal.fire({
        title: 'Error',
        text: 'Error al buscar experiencias',
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
      setLoading(false);
    }
  }, [currentPage, pageSize, loadExperiences]);

  const loadChartsData = useCallback(async () => {
    try {
      setChartsLoading(true);
      const allExperiencesData = await experienceService.getExperiences(1, 300);
      const allExperiences = allExperiencesData.experiencias || [];

      // Procesar distribución por dificultad
      const difficultyCount: { [key: string]: number } = {};
      allExperiences.forEach((exp: ExperienciaCompleta) => {
        const difficulty = exp.dificultad.toLowerCase();
        difficultyCount[difficulty] = (difficultyCount[difficulty] || 0) + 1;
      });
      setDifficultyDistribution(Object.entries(difficultyCount).map(([difficulty, count]) => ({
        difficulty,
        count
      })).sort((a, b) => b.count - a.count));

      // Procesar distribución por idioma
      const languageCount: { [key: string]: number } = {};
      allExperiences.forEach((exp: ExperienciaCompleta) => {
        const language = exp.idioma.toLowerCase();
        languageCount[language] = (languageCount[language] || 0) + 1;
      });
      setLanguageDistribution(Object.entries(languageCount).map(([language, count]) => ({
        language,
        count
      })).sort((a, b) => b.count - a.count));

    } catch (error) {
      console.error('Error cargando datos para gráficas:', error);
      setDifficultyDistribution([]);
      setLanguageDistribution([]);
    } finally {
      setChartsLoading(false);
    }
  }, []);

  // --- Effects ---
  useEffect(() => {
    if (!isSearching) {
      loadExperiences();
    }
  }, [isSearching, loadExperiences]);

  useEffect(() => {
    if (searchTerm.trim()) {
      handleSearch(searchTerm);
    }
  }, [searchTerm, handleSearch]);

  useEffect(() => {
    loadStats();
    loadChartsData();
  }, [loadStats, loadChartsData]);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);

    if (!term.trim()) {
      setIsSearching(false);
      loadExperiences();
    } else {
      setIsSearching(true);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setIsSearching(false);
    setCurrentPage(1);
    loadExperiences();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleDataChange = () => {
    loadExperiences();
    loadStats();
    loadChartsData();
  };

  // Actions Handlers
  const handleView = (experience: ExperienciaCompleta) => {
    setSelectedExperience(experience);
    setShowDetailModal(true);
  };

  const handleEdit = (experience: ExperienciaCompleta) => {
    setSelectedExperience(experience);
    setShowEditModal(true);
  };

  const handleDelete = async (id: string) => {
    const experience = experiences.find(e => e.id_experiencia === id);
    const providerName = experience?.proveedor_nombre || 'esta experiencia';

    const result = await Swal.fire({
      title: "¿Estás seguro?",
      html: `
        <div class="text-center">
          <div class="mb-4">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m-4 0h14" />
              </svg>
            </div>
          </div>
          <p class="text-gray-600 mb-2">Vas a eliminar la experiencia de:</p>
          <p class="font-semibold text-gray-900 text-lg">${providerName}</p>
          <p class="text-sm text-gray-500 mt-2">Esta acción no se puede deshacer</p>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      customClass: {
        popup: 'rounded-xl shadow-2xl',
        title: 'text-xl font-bold text-gray-900',
        confirmButton: 'px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
        cancelButton: 'px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
      },
      buttonsStyling: false,
    });

    if (result.isConfirmed) {
      try {
        await experienceService.deleteExperience(id);

        await Swal.fire({
          icon: "success",
          title: "¡Eliminado!",
          text: "La experiencia ha sido eliminada correctamente",
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            popup: 'rounded-xl shadow-2xl',
            title: 'text-xl font-bold text-gray-900',
          }
        });

        handleDataChange();
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo eliminar la experiencia",
          customClass: {
            popup: 'rounded-xl shadow-2xl',
            title: 'text-xl font-bold text-gray-900',
          }
        });
      }
    }
  };

  const handleSaveEdit = async (data: any) => {
    if (!selectedExperience) return;
    try {
      setSaving(true);
      await experienceService.updateExperience(selectedExperience.id_experiencia, data);

      await Swal.fire({
        icon: "success",
        title: "¡Actualizado!",
        text: "La experiencia ha sido actualizada correctamente",
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: 'rounded-xl shadow-2xl',
          title: 'text-xl font-bold text-gray-900',
        }
      });

      setShowEditModal(false);
      setSelectedExperience(null);
      handleDataChange();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al actualizar la experiencia",
        customClass: {
          popup: 'rounded-xl shadow-2xl',
          title: 'text-xl font-bold text-gray-900',
        }
      });
    } finally {
      setSaving(false);
    }
  };

  // Exportar experiencias a Excel
  const handleExportExperiences = async () => {
    try {
      await Swal.fire({
        title: 'Generando archivo...',
        text: 'Por favor espera mientras se genera el archivo Excel',
        icon: 'info',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true
      });

      const data = await experienceService.getExperiences(1, 1000);
      const experiencias: ExperienciaCompleta[] = Array.isArray(data)
        ? data
        : data.experiencias || [];

      if (!experiencias.length) {
        await Swal.fire({
          title: 'Sin datos',
          text: 'No hay experiencias para exportar',
          icon: 'warning',
          confirmButtonColor: '#f59e0b',
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

      // Convertir a formato plano para la hoja
      const rows = (experiencias as Record<string, any>[]).map(exp => ({
        Proveedor: exp.proveedor_nombre,
        Ciudad: exp.proveedor_ciudad || '',
        Pais: exp.proveedor_pais || '',
        Idioma: exp.idioma,
        Dificultad: exp.dificultad,
        Duracion_horas: exp.duracion,
        'Incluye Transporte': exp.incluye_transporte ? 'Sí' : 'No',
        'Guía Incluido': exp.guia_incluido ? 'Sí' : 'No',
        'Grupo Máximo': exp.grupo_maximo,
        Verificado: exp.proveedor_verificado ? 'Sí' : 'No',
        Registro: exp.fecha_registro,
      }));

      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Experiencias');

      const fecha = new Date().toISOString().split('T')[0];
      const timestamp = new Date().getTime();
      const fileName = `experiencias_${fecha}_${timestamp}.xlsx`;

      const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.style.display = 'none';
      link.target = '_blank';

      document.body.appendChild(link);
      setTimeout(() => {
        link.click();
        setTimeout(() => {
          if (document.body.contains(link)) {
            document.body.removeChild(link);
          }
          URL.revokeObjectURL(url);
        }, 200);
      }, 50);

      await Swal.fire({
        title: '¡Archivo Exportado!',
        text: `Se han exportado ${experiencias.length} experiencias exitosamente.`,
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

    } catch (error) {
      console.error('Error exportando experiencias:', error);
      await Swal.fire({
        title: 'Error',
        text: 'No se pudo exportar el archivo. Por favor intenta nuevamente.',
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
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <Compass className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Experiencias</h1>
          </div>
          <p className="text-gray-600 mt-2">
            Administra los servicios, tours y experiencias del sistema
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleExportExperiences}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            <span>Exportar Experiencias</span>
          </Button>
          <Button
            onClick={() => setShowCreateModal(true)}
            variant="primary"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Crear Experiencia</span>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <ExperienceStats
        totalExperiences={stats.total}
        verificadas={stats.verificadas}
        espanol={stats.espanol}
        ingles={stats.ingles}
        loading={statsLoading}
      />

      {/* Table */}
      <ExperienceTable
        experiences={experiences}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onClearSearch={clearSearch}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        totalExperiences={totalExperiences}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isSearching={isSearching}
        onDataChange={handleDataChange}
      />

      {/* Charts */}
      <ExperienceCharts
        difficultyDistribution={difficultyDistribution}
        languageDistribution={languageDistribution}
        chartsLoading={chartsLoading}
      />

      {/* Modals */}
      <CreateExperienceModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        loading={creating}
        onSave={async (payload) => {
          try {
            setCreating(true);
            await experienceService.createExperience(payload);

            await Swal.fire({
              title: '¡Experiencia Creada!',
              text: 'La experiencia ha sido creada exitosamente.',
              icon: 'success',
              confirmButtonColor: '#10b981',
              confirmButtonText: 'Entendido',
              customClass: {
                popup: 'rounded-xl shadow-2xl',
                title: 'text-xl font-bold text-gray-900',
                confirmButton: 'px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
              },
              buttonsStyling: false,
              timer: 2000,
              timerProgressBar: true
            });

            setShowCreateModal(false);
            setCurrentPage(1);
            await loadExperiences();
            loadStats();
            loadChartsData();
          } catch (e: any) {
            Swal.fire({
              title: 'Error',
              text: e.message || 'Error creando experiencia',
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
            setCreating(false);
          }
        }}
      />

      <EditExperienceModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedExperience(null);
        }}
        experience={selectedExperience}
        onSave={handleSaveEdit}
        loading={false}
        isSaving={saving}
      />

      <ExperienceDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        experience={selectedExperience}
      />
    </div>
  );
};