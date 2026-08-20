import React, { useEffect, useState } from 'react';
import { Package, AlertCircle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { listarServiciosPorProveedor } from '../../services/servicioService';
import { RespuestaServicio } from '../../types/servicio';
import { etiquetaDeTipo } from '../../types/servicio';

interface ServiciosDelProveedorModalProps {
    isOpen: boolean;
    onClose: () => void;
    proveedorId: string | null;
    proveedorNombre: string;
}

const formatearPrecio = (precio: number, moneda: string): string =>
    `${Number(precio || 0).toLocaleString('es-CO')} ${moneda || 'COP'}`;

/**
 * Lista los servicios que ofrece un proveedor.
 *
 * En este esquema el id de un hotel, restaurante, experiencia o transporte ES
 * el id de su proveedor (así está definida la llave foránea), por eso alcanza
 * con el id de la fila para consultar sus servicios.
 */
const ServiciosDelProveedorModal: React.FC<ServiciosDelProveedorModalProps> = ({
    isOpen,
    onClose,
    proveedorId,
    proveedorNombre,
}) => {
    const [servicios, setServicios] = useState<RespuestaServicio[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen || !proveedorId) return;

        let vigente = true;
        const cargar = async () => {
            try {
                setLoading(true);
                setError(null);
                const respuesta = await listarServiciosPorProveedor(proveedorId);
                if (!vigente) return;
                setServicios(respuesta.servicios || []);
            } catch (e) {
                if (!vigente) return;
                console.error('Error cargando servicios del proveedor:', e);
                setError('No se pudieron cargar los servicios de este proveedor');
                setServicios([]);
            } finally {
                if (vigente) setLoading(false);
            }
        };

        cargar();
        // Si el usuario cierra y abre otro proveedor mientras carga, la
        // respuesta vieja no debe pintar la lista.
        return () => { vigente = false; };
    }, [isOpen, proveedorId]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Servicios del Proveedor"
            description={proveedorNombre}
            size="2xl"
        >
            {loading ? (
                <div className="space-y-3 animate-pulse">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-16 bg-secondary-50 rounded-xl" />
                    ))}
                </div>
            ) : error ? (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-error-50 border border-error-200 text-error-800">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <p className="font-medium">{error}</p>
                </div>
            ) : servicios.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Package className="h-10 w-10 text-secondary-300 mb-3" />
                    <p className="font-medium text-secondary-900">Sin servicios registrados</p>
                    <p className="text-sm text-secondary-500 mt-1">
                        Este proveedor todavía no ofrece ningún servicio.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    <p className="text-sm text-secondary-500">
                        {servicios.length} {servicios.length === 1 ? 'servicio ofrecido' : 'servicios ofrecidos'}
                    </p>
                    {servicios.map((servicio) => (
                        <div
                            key={servicio.id_servicio}
                            className="p-4 rounded-xl border border-secondary-100 bg-white shadow-sm"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <p className="font-semibold text-secondary-900 break-words">
                                        {servicio.nombre}
                                    </p>
                                    {servicio.descripcion && (
                                        <p className="text-sm text-secondary-500 mt-0.5 break-words">
                                            {servicio.descripcion}
                                        </p>
                                    )}
                                    <div className="flex flex-wrap items-center gap-2 mt-2">
                                        <Badge variant="secondary" className="rounded-md">
                                            {etiquetaDeTipo(servicio.tipo_servicio)}
                                        </Badge>
                                        <Badge
                                            variant={servicio.activo ? 'success' : 'secondary'}
                                            className="rounded-md"
                                        >
                                            {servicio.activo ? 'Activo' : 'Inactivo'}
                                        </Badge>
                                        {servicio.ciudad && (
                                            <span className="text-xs text-secondary-500">
                                                {[servicio.ciudad, servicio.departamento].filter(Boolean).join(', ')}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <span className="font-semibold text-secondary-900 whitespace-nowrap">
                                    {formatearPrecio(servicio.precio, servicio.moneda)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Modal>
    );
};

export default ServiciosDelProveedorModal;
