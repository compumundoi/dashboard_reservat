import React, { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { Input } from "./Input";
import { Select } from "./Select";
import { ubicacionService } from "../../services/ubicacionService";
import {
  Departamento,
  Municipio,
  Pais,
  ValorUbicacion,
} from "../../types/ubicacion";

export interface LocationFieldsProps {
  value: ValorUbicacion;
  onChange: (valor: ValorUbicacion) => void;
  /** Errores por campo, con las mismas claves que `ValorUbicacion`. */
  errors?: Partial<Record<keyof ValorUbicacion, string>>;
  /** Marca los tres campos con asterisco y agrega `required` al select. */
  required?: boolean;
  /** El formulario de servicios rotula la dirección como punto de encuentro. */
  direccionLabel?: string;
  direccionPlaceholder?: string;
  /** Permite ocultar la dirección donde el formulario ya la pide aparte. */
  mostrarDireccion?: boolean;
  className?: string;
}

/**
 * Campos de ubicación estandarizados: País, Departamento, Municipio y Dirección.
 *
 * País queda fijo en Colombia y deshabilitado — es el único país para el que
 * existe catálogo de departamentos y municipios. Se envía igual al backend
 * (vía el municipio) para que el dato quede explícito y no implícito.
 *
 * El componente sólo produce ids. Los nombres en texto los deriva el backend
 * desde el catálogo, para que nadie pueda guardar una ciudad inventada.
 */
export const LocationFields: React.FC<LocationFieldsProps> = ({
  value,
  onChange,
  errors = {},
  required = false,
  direccionLabel = "Dirección",
  direccionPlaceholder = "Calle 123 #45-67",
  mostrarDireccion = true,
  className = "",
}) => {
  const [pais, setPais] = useState<Pais | null>(null);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [cargandoMunicipios, setCargandoMunicipios] = useState(false);
  const [errorCatalogo, setErrorCatalogo] = useState<string | null>(null);

  // País por defecto y departamentos: una sola vez, el catálogo es estático.
  useEffect(() => {
    let vigente = true;

    Promise.all([
      ubicacionService.getPaisPorDefecto(),
      ubicacionService.getDepartamentos(),
    ])
      .then(([paisPorDefecto, lista]) => {
        if (!vigente) return;
        setPais(paisPorDefecto);
        setDepartamentos(lista);
        setErrorCatalogo(null);

        // El país nunca lo elige el usuario: si el formulario abrió sin él
        // (alta nueva) se completa acá.
        if (value.paisId !== paisPorDefecto.id) {
          onChange({ ...value, paisId: paisPorDefecto.id });
        }
      })
      .catch(() => {
        if (!vigente) return;
        setErrorCatalogo("No se pudo cargar el catálogo de ubicaciones");
      });

    return () => {
      vigente = false;
    };
    // Sólo al montar: recargar el catálogo en cada cambio de `value` haría
    // una petición por tecla.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Municipios: dependen del departamento elegido.
  useEffect(() => {
    if (value.departamentoId === null) {
      setMunicipios([]);
      return;
    }

    let vigente = true;
    setCargandoMunicipios(true);

    ubicacionService
      .getMunicipios(value.departamentoId)
      .then((lista) => {
        if (!vigente) return;
        setMunicipios(lista);
        setErrorCatalogo(null);
      })
      .catch(() => {
        if (!vigente) return;
        setMunicipios([]);
        setErrorCatalogo("No se pudieron cargar los municipios");
      })
      .finally(() => {
        if (vigente) setCargandoMunicipios(false);
      });

    return () => {
      vigente = false;
    };
  }, [value.departamentoId]);

  const cambiarDepartamento = (crudo: string) => {
    const departamentoId = crudo === "" ? null : Number(crudo);
    // Cambiar de departamento invalida el municipio: dejarlo colgado
    // guardaría un municipio que no pertenece al departamento mostrado.
    onChange({ ...value, departamentoId, municipioId: null });
  };

  const cambiarMunicipio = (crudo: string) => {
    onChange({ ...value, municipioId: crudo === "" ? null : Number(crudo) });
  };

  const marca = required ? " *" : "";

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="País"
          value={pais?.nombre ?? "Colombia"}
          readOnly
          disabled
          leftIcon={<MapPin className="w-4 h-4" />}
          title="Sólo se opera en Colombia"
        />

        <Select
          label={`Departamento${marca}`}
          value={value.departamentoId ?? ""}
          onChange={(e) => cambiarDepartamento(e.target.value)}
          error={errors.departamentoId}
          required={required}
        >
          <option value="">Seleccionar departamento...</option>
          {departamentos.map((d) => (
            <option key={d.id} value={d.id}>
              {d.nombre}
            </option>
          ))}
        </Select>

        <Select
          label={`Municipio${marca}`}
          value={value.municipioId ?? ""}
          onChange={(e) => cambiarMunicipio(e.target.value)}
          error={errors.municipioId}
          required={required}
          disabled={value.departamentoId === null || cargandoMunicipios}
        >
          <option value="">
            {value.departamentoId === null
              ? "Elegí un departamento primero"
              : cargandoMunicipios
                ? "Cargando..."
                : "Seleccionar municipio..."}
          </option>
          {municipios.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nombre}
            </option>
          ))}
        </Select>
      </div>

      {mostrarDireccion && (
        <div className="mt-4">
          <Input
            label={`${direccionLabel}${marca}`}
            value={value.direccion}
            onChange={(e) => onChange({ ...value, direccion: e.target.value })}
            placeholder={direccionPlaceholder}
            error={errors.direccion}
            required={required}
            leftIcon={<MapPin className="w-4 h-4" />}
          />
        </div>
      )}

      {errorCatalogo && (
        <p className="mt-2 text-xs text-error-600">{errorCatalogo}</p>
      )}
    </div>
  );
};
