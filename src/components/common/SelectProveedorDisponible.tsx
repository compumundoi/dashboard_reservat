import React, { useEffect, useState } from 'react';
import { Select } from '../ui/Select';
import {
    listarProveedoresDisponibles,
    ProveedorDisponible,
} from '../../services/proveedorDisponibleService';

interface SelectProveedorDisponibleProps {
    label?: string;
    value: string;
    onChange: (email: string) => void;
    error?: string;
    /** Se vuelve a consultar cada vez que el formulario se abre. */
    isOpen: boolean;
}

/**
 * Elige el correo de un usuario proveedor que todavía no tiene registro.
 *
 * El alta de un hotel, restaurante, experiencia o transporte se hace sobre un
 * usuario proveedor que ya existe, y cada uno puede tener un solo registro.
 * Escribir el correo a mano dejaba crear proveedores sueltos, sin usuario que
 * los respalde, y repetir uno ya tomado.
 */
const SelectProveedorDisponible: React.FC<SelectProveedorDisponibleProps> = ({
    label = 'Email del Proveedor *',
    value,
    onChange,
    error,
    isOpen,
}) => {
    const [proveedores, setProveedores] = useState<ProveedorDisponible[]>([]);
    const [loading, setLoading] = useState(false);
    const [fallo, setFallo] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        let vigente = true;

        const cargar = async () => {
            try {
                setLoading(true);
                setFallo(false);
                const lista = await listarProveedoresDisponibles();
                if (vigente) setProveedores(lista);
            } catch (e) {
                console.error('Error cargando proveedores disponibles:', e);
                if (vigente) { setFallo(true); setProveedores([]); }
            } finally {
                if (vigente) setLoading(false);
            }
        };

        cargar();
        return () => { vigente = false; };
    }, [isOpen]);

    const etiqueta = (p: ProveedorDisponible) => {
        const nombre = [p.nombre, p.apellido].filter(Boolean).join(' ').trim();
        return nombre ? `${p.email} — ${nombre}` : p.email;
    };

    const sinDisponibles = !loading && !fallo && proveedores.length === 0;

    return (
        <div className="space-y-1.5">
            <Select
                label={label}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                error={error}
                disabled={loading || sinDisponibles || fallo}
                options={[
                    {
                        value: '',
                        label: loading
                            ? 'Cargando proveedores...'
                            : fallo
                                ? 'No se pudo cargar la lista'
                                : sinDisponibles
                                    ? 'No hay proveedores disponibles'
                                    : 'Seleccionar proveedor...',
                    },
                    ...proveedores.map((p) => ({ value: p.email, label: etiqueta(p) })),
                ]}
            />
            {sinDisponibles && (
                // Sin esto el formulario parece roto: el desplegable está
                // vacío y no hay forma de saber que falta crear el usuario.
                <p className="text-xs text-secondary-500">
                    Todos los usuarios proveedor ya tienen un registro asociado. Creá un
                    usuario de tipo proveedor en la sección Usuarios para poder continuar.
                </p>
            )}
        </div>
    );
};

export default SelectProveedorDisponible;
