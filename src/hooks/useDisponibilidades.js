import { useEffect, useState, useCallback, useRef } from "react";
import clienteAxios from "../config/axios";

// Cache global para disponibilidades
const cacheDisponibilidades = {
  data: null,
  timestamp: null,
  ttl: 5 * 60 * 1000, // 5 minutos
};

/**
 * Hook para obtener y cachear disponibilidades
 * @returns {Object} { disponibilidades, loading, error, refetch }
 */
export const useDisponibilidades = () => {
  const [disponibilidades, setDisponibilidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isMountedRef = useRef(true);

  const fetch = useCallback(async (forceRefresh = false) => {
    // Verificar si hay cache válido y no es un force refresh
    if (!forceRefresh && cacheDisponibilidades.data && cacheDisponibilidades.timestamp) {
      const ahora = Date.now();
      if (ahora - cacheDisponibilidades.timestamp < cacheDisponibilidades.ttl) {
        if (isMountedRef.current) {
          setDisponibilidades(cacheDisponibilidades.data);
          setLoading(false);
        }
        return cacheDisponibilidades.data;
      }
    }

    setLoading(true);
    setError(null);
    try {
      const { data } = await clienteAxios.get("/api/profesional/disponibilidades-totales");
      
      // El endpoint devuelve array directo o dentro de alguna propiedad
      const resultado = Array.isArray(data) ? data : (data.resultados || data.disponibilidades || data.data || []);
      
      // Actualizar cache
      cacheDisponibilidades.data = resultado;
      cacheDisponibilidades.timestamp = Date.now();

      if (isMountedRef.current) {
        setDisponibilidades(resultado);
        console.log("✅ Disponibilidades cargadas:", resultado.length);
      }
    } catch (err) {
      const mensaje = 
        err.response?.status === 404
          ? "No hay disponibilidades disponibles"
          : err.response?.data?.msg || err.message || "Error desconocido";
      
      console.error("❌ Error cargando disponibilidades:", mensaje);
      
      if (isMountedRef.current) {
        setError(mensaje);
        setDisponibilidades([]);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetch();
    
    return () => {
      isMountedRef.current = false;
    };
  }, [fetch]);

  return {
    disponibilidades,
    loading,
    error,
    refetch: () => fetch(true), // Force refresh
  };
};

export default useDisponibilidades;