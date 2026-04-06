import { useMemo } from "react";
import { useDisponibilidades } from "./useDisponibilidades";

/**
 * Hook para obtener disponibilidades agrupadas por especialidad
 * @returns {Object} { por_especialidad, loading, error, especialidades_unicas }
 */
export const useDisponibilidadesPorEspecialidad = () => {
  const { disponibilidades, loading, error } = useDisponibilidades();

  const agrupadoPorEspecialidad = useMemo(() => {
    if (!disponibilidades?.length) return {};

    const agrupado = {};

    disponibilidades.forEach((disp) => {
      const especialidad = disp.creador?.especialidad?.[0] || "Sin especialidad";

      if (!agrupado[especialidad]) {
        agrupado[especialidad] = [];
      }

      agrupado[especialidad].push(disp);
    });

    return agrupado;
  }, [disponibilidades]);

  const especialidades_unicas = useMemo(
    () => Object.keys(agrupadoPorEspecialidad),
    [agrupadoPorEspecialidad]
  );

  return {
    por_especialidad: agrupadoPorEspecialidad,
    especialidades_unicas,
    loading,
    error,
    disponibilidades,
  };
};

export default useDisponibilidadesPorEspecialidad;
