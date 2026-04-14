import { useMemo } from "react";
import { useDisponibilidades } from "./useDisponibilidades";

export const ESPECIALIDADES_SERVICIOS = [
  "ACV y neurológicos",
  "Acompañamiento básico",
  "Acompañamiento terapéutico",
  "Compañía y vigilancia",
  "Cuidados post-operatorios",
  "Enfermería general",
  "Guardia 24 horas",
  "Terapia ocupacional",
];

const getHorariosDisponibles = (disponibilidad) =>
  (disponibilidad?.horarios || disponibilidad?.disponibilidad || []).filter(
    (slot) => slot?.stock !== false
  );

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
      const horariosDisponibles = getHorariosDisponibles(disp);
      const especialidades = Array.isArray(disp?.creador?.especialidad)
        ? disp.creador.especialidad
        : [];

      if (!horariosDisponibles.length || !especialidades.length) {
        return;
      }

      especialidades.forEach((especialidad) => {
        if (!ESPECIALIDADES_SERVICIOS.includes(especialidad)) {
          return;
        }

        if (!agrupado[especialidad]) {
          agrupado[especialidad] = [];
        }

        agrupado[especialidad].push({
          ...disp,
          disponibilidad: horariosDisponibles,
        });
      });
    });

    return agrupado;
  }, [disponibilidades]);

  const especialidades_unicas = useMemo(
    () =>
      ESPECIALIDADES_SERVICIOS.filter(
        (especialidad) => (agrupadoPorEspecialidad[especialidad] || []).length > 0
      ),
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
