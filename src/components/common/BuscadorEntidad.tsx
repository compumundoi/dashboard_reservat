import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Loader2 } from 'lucide-react';

export interface OpcionEntidad {
    id: string;
    titulo: string;
    detalle?: string;
}

interface BuscadorEntidadProps {
    label: string;
    placeholder: string;
    /** Texto sin resultados, para nombrar la entidad que se está buscando. */
    textoVacio: string;
    value: string;
    selectedName: string;
    buscar: (termino: string) => Promise<OpcionEntidad[]>;
    onChange: (id: string, titulo: string) => void;
    error?: string;
}

/**
 * Buscador con autocompletado sobre cualquier listado del backend.
 *
 * Existe para no seguir pidiéndole al usuario que escriba un UUID: recibe una
 * función de búsqueda y muestra un título con una línea de detalle que sirva
 * para distinguir dos registros parecidos.
 */
const BuscadorEntidad: React.FC<BuscadorEntidadProps> = ({
    label,
    placeholder,
    textoVacio,
    value,
    selectedName,
    buscar,
    onChange,
    error,
}) => {
    const [search, setSearch] = useState(selectedName || '');
    const [results, setResults] = useState<OpcionEntidad[]>([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    // Sólo la última búsqueda pedida puede pintar la lista.
    const ultimaPeticion = useRef(0);

    useEffect(() => {
        if (selectedName) setSearch(selectedName);
    }, [selectedName]);

    const ejecutarBusqueda = useCallback(async (termino: string) => {
        if (!termino.trim()) {
            setResults([]);
            setShowDropdown(false);
            return;
        }
        const peticion = ++ultimaPeticion.current;
        setLoading(true);
        try {
            const opciones = await buscar(termino);
            if (peticion !== ultimaPeticion.current) return;
            setResults(opciones);
            setShowDropdown(true);
        } catch (err) {
            if (peticion !== ultimaPeticion.current) return;
            console.error(`Error buscando ${label}:`, err);
            setResults([]);
        } finally {
            if (peticion === ultimaPeticion.current) setLoading(false);
        }
    }, [buscar, label]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearch(val);
        onChange('', '');
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = setTimeout(() => ejecutarBusqueda(val), 300);
    };

    const handleSelect = (opcion: OpcionEntidad) => {
        setSearch(opcion.titulo);
        setShowDropdown(false);
        setResults([]);
        onChange(opcion.id, opcion.titulo);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => () => {
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    }, []);

    useEffect(() => {
        if (!value && !selectedName) {
            setSearch('');
            setResults([]);
            setShowDropdown(false);
        }
    }, [value, selectedName]);

    return (
        <div ref={dropdownRef} className="relative">
            <label className="block text-sm font-medium text-secondary-700 mb-1.5">{label}</label>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
                <input
                    type="text"
                    value={search}
                    onChange={handleSearchChange}
                    onFocus={() => { if (results.length > 0) setShowDropdown(true); }}
                    className={`flex h-10 w-full rounded-xl border bg-white pl-10 pr-10 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 transition-all duration-200 ${
                        error ? 'border-error-500' : 'border-secondary-200'
                    }`}
                    placeholder={placeholder}
                    autoComplete="off"
                />
                {loading && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-500 animate-spin" />
                )}
            </div>

            {showDropdown && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-secondary-200 rounded-xl shadow-soft-lg max-h-60 overflow-auto">
                    {results.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-secondary-500">{textoVacio}</div>
                    ) : (
                        results.map((opcion) => (
                            <button
                                type="button"
                                key={opcion.id}
                                onClick={() => handleSelect(opcion)}
                                className="w-full text-left px-4 py-2.5 hover:bg-secondary-50 border-b border-secondary-50 last:border-b-0 transition-colors"
                            >
                                <span className="block font-medium text-secondary-900">{opcion.titulo}</span>
                                {opcion.detalle && (
                                    <span className="block text-xs text-secondary-500 truncate mt-0.5">
                                        {opcion.detalle}
                                    </span>
                                )}
                            </button>
                        ))
                    )}
                </div>
            )}

            {error && <p className="mt-1 text-sm text-error-600">{error}</p>}
        </div>
    );
};

export default BuscadorEntidad;
