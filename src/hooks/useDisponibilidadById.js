import { useState, useEffect, useCallback } from "react";
import clienteAxios from "../config/axios";

/**
 * Hook para obtener una disponibilidad específica por ID
 * @param {string} id ID de la disponibilidad
 * @returns {Object} { disponibilidad, loading, error, refetch }
 */
export const useDisponibilidadById = (id) => {
  const [disponibilidad, setDisponibilidad] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDisponibilidad = useCallback(async () => {
    if (!id) {
      setDisponibilidad(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Intentar obtener desde disponibilidades-totales y filtrar
      const { data } = await clienteAxios.get("/api/disponibilidades-totales");
      
      if (data?.resultados && Array.isArray(data.resultados)) {
        const disp = data.resultados.find((d) => d._id === id);
        
        if (disp) {
          setDisponibilidad(disp);
        } else {
          setError("Disponibilidad no encontrada");
        }
      } else {
        setError("Formato de respuesta inválido");
      }
    } catch (err) {
      const mensaje =
        err.response?.status === 404
          ? "Disponibilidad no encontrada"
          : err.response?.data?.msg ||
            "Error al cargar la disponibilidad";
      setError(mensaje);
      setDisponibilidad(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDisponibilidad();
  }, [id, fetchDisponibilidad]);

  return {
    disponibilidad,
    loading,
    error,
    refetch: fetchDisponibilidad,
  };
};

export default useDisponibilidadById;
