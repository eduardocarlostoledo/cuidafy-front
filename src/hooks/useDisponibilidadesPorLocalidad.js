import { useMemo } from "react";
import { useDisponibilidades } from "./useDisponibilidades";

/**
 * Hook para obtener disponibilidades agrupadas por localidad
 * @returns {Object} { por_localidad, loading, error, localidades_unicas }
 */
export const useDisponibilidadesPorLocalidad = () => {
  const { disponibilidades, loading, error } = useDisponibilidades();

  const agrupadoPorLocalidad = useMemo(() => {
    if (!disponibilidades?.length) return {};

    const agrupado = {};

    disponibilidades.forEach((disp) => {
      const localidad =
        disp.creador?.localidadesLaborales?.[0] || "Sin localidad";

      if (!agrupado[localidad]) {
        agrupado[localidad] = [];
      }

      agrupado[localidad].push(disp);
    });

    return agrupado;
  }, [disponibilidades]);

  const localidades_unicas = useMemo(
    () => Object.keys(agrupadoPorLocalidad),
    [agrupadoPorLocalidad]
  );

  return {
    por_localidad: agrupadoPorLocalidad,
    localidades_unicas,
    loading,
    error,
    disponibilidades,
  };
};

export default useDisponibilidadesPorLocalidad;
