import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { buscarServicios, ServicioOption } from '../../services/servicioSearchService';

interface ServicioAutocompleteProps {
    value: string;
    selectedName: string;
    onChange: (servicioId: string, nombre: string) => void;
    error?: string;
}

const ServicioAutocomplete: React.FC<ServicioAutocompleteProps> = ({
    value,
    selectedName,
    onChange,
    error,
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
        <div ref={dropdownRef} className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Servicio *
            </label>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    value={search}
                    onChange={handleSearchChange}
                    onFocus={() => {
                        if (results.length > 0) setShowDropdown(true);
                    }}
                    className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${error ? 'border-red-500' : 'border-gray-300'
                        }`}
                    placeholder="Buscar servicio por nombre..."
                    autoComplete="off"
                />
                {loading && (
                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500 animate-spin" />
                )}
            </div>
            {selectedName && (
                <p className="text-green-600 text-xs mt-1">✓ Seleccionado: {selectedName}</p>
            )}
            {showDropdown && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {results.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-gray-500">No se encontraron servicios</div>
                    ) : (
                        results.map((servicio) => (
                            <button
                                key={servicio.id_servicio}
                                type="button"
                                onClick={() => handleSelect(servicio)}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                            >
                                <span className="font-medium text-gray-900">{servicio.nombre || 'Sin nombre'}</span>
                                <span className="block text-xs text-gray-400 truncate">{servicio.id_servicio}</span>
                            </button>
                        ))
                    )}
                </div>
            )}
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};

export default ServicioAutocomplete;
