import { useState, useCallback, useEffect } from "react";
import { crearItemCarrito } from "../helpers/disponibilidadesHelper";

const CARRITO_KEY = "calyaan_carrito_disponibilidades";

/**
 * Hook para manejar carrito con disponibilidades dinámicas
 * @returns {Object} { carrito, agregarAlCarrito, eliminarDelCarrito, vaciarCarrito, total }
 */
export const useCarritoDisponibilidades = () => {
  const [carrito, setCarrito] = useState([]);

  // Cargar carrito desde localStorage
  useEffect(() => {
    try {
      const carritoGuardado = localStorage.getItem(CARRITO_KEY);
      if (carritoGuardado) {
        setCarrito(JSON.parse(carritoGuardado));
      }
    } catch (error) {
      console.error("Error cargando carrito:", error);
      setCarrito([]);
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  const guardarCarrito = useCallback((nuevoCarrito) => {
    try {
      localStorage.setItem(CARRITO_KEY, JSON.stringify(nuevoCarrito));
      setCarrito(nuevoCarrito);
    } catch (error) {
      console.error("Error guardando carrito:", error);
    }
  }, []);

  const agregarAlCarrito = useCallback(
    (disponibilidad, horarioId, horaSeleccionada) => {
      const item = crearItemCarrito(disponibilidad, horarioId, horaSeleccionada);

      if (!item) {
        console.error("Error creando item de carrito");
        return false;
      }

      const nuevoCarrito = [...carrito, item];
      guardarCarrito(nuevoCarrito);
      return true;
    },
    [carrito, guardarCarrito]
  );

  const eliminarDelCarrito = useCallback(
    (disponibilidadId) => {
      const nuevoCarrito = carrito.filter(
        (item) => item.disponibilidadId !== disponibilidadId
      );
      guardarCarrito(nuevoCarrito);
    },
    [carrito, guardarCarrito]
  );

  const vaciarCarrito = useCallback(() => {
    guardarCarrito([]);
  }, [guardarCarrito]);

  const total = carrito.length;

  return {
    carrito,
    agregarAlCarrito,
    eliminarDelCarrito,
    vaciarCarrito,
    total,
  };
};

export default useCarritoDisponibilidades;
