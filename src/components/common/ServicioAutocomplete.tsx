import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { buscarServicios, ServicioOption } from '../../services/servicioSearchService';
import { cn } from '../../lib/utils';

interface ServicioAutocompleteProps {
    value: string;
    selectedName: string;
    onChange: (servicioId: string, nombre: string) => void;
    error?: string;
    className?: string;
}

const ServicioAutocomplete: React.FC<ServicioAutocompleteProps> = ({
    value,
    selectedName,
    onChange,
    error,
    className
}) => {
    const [search, setSearch] = useState(selectedName || '');
    const [results, setResults] = useState<ServicioOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Sync external selectedName with internal search state
    useEffect(() => {
        if (selectedName) {
            setSearch(selectedName);
        }
    }, [selectedName]);

    const searchServicios = useCallback(async (query: string) => {
        if (!query.trim()) {
            setResults([]);
            setShowDropdown(false);
            return;
        }
        setLoading(true);
        try {
            const response = await buscarServicios(query);
            setResults(response.servicios);
            setShowDropdown(true);
        } catch (err) {
            console.error('Error buscando servicios:', err);
            setResults([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearch(val);
        onChange('', '');

        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = setTimeout(() => {
            searchServicios(val);
        }, 300);
    };

    const handleSelect = (servicio: ServicioOption) => {
        setSearch(servicio.nombre || '');
        setShowDropdown(false);
        setResults([]);
        onChange(servicio.id_servicio, servicio.nombre || '');
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Cleanup debounce timer
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        };
    }, []);

    // Reset internal state when value is cleared externally (form reset)
    useEffect(() => {
        if (!value && !selectedName) {
            setSearch('');
            setResults([]);
            setShowDropdown(false);
        }
    }, [value, selectedName]);

    return (
        <div ref={dropdownRef} className={cn("relative", className)}>
            <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                Servicio *
            </label>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
                <input
                    type="text"
                    value={search}
                    onChange={handleSearchChange}
                    onFocus={() => {
                        if (results.length > 0) setShowDropdown(true);
                    }}
                    className={cn(
                        "w-full pl-10 pr-10 py-2 border rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-secondary-900 placeholder-secondary-400 text-sm",
                        error ? "border-error-300 focus:ring-error-500" : "border-secondary-300 hover:border-secondary-400"
                    )}
                    placeholder="Buscar servicio por nombre..."
                    autoComplete="off"
                />
                {loading && (
                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary-500 animate-spin" />
                )}
            </div>

            {showDropdown && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-secondary-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {results.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-secondary-500">No se encontraron servicios</div>
                    ) : (
                        results.map((servicio) => (
                            <button
                                key={servicio.id_servicio}
                                type="button"
                                onClick={() => handleSelect(servicio)}
                                className="w-full text-left px-4 py-2.5 text-sm hover:bg-primary-50 transition-colors border-b border-secondary-100 last:border-b-0 group"
                            >
                                <span className="font-medium text-secondary-900 block group-hover:text-primary-700">{servicio.nombre || 'Sin nombre'}</span>
                                <span className="block text-xs text-secondary-500 truncate mt-0.5">{servicio.id_servicio}</span>
                            </button>
                        ))
                    )}
                </div>
            )}

            {error && <p className="mt-1.5 text-sm text-error-600 animate-slide-up ml-1">{error}</p>}

            {selectedName && !error && (
                <p className="mt-1.5 text-sm text-success-600 ml-1 flex items-center">
                    <span className="mr-1">✓</span> Seleccionado: {selectedName}
                </p>
            )}
        </div>
    );
};

export default ServicioAutocomplete;
