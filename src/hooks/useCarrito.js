import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  agregarItem as agregarItemRedux,
  eliminarItem as eliminarItemRedux,
  actualizarCantidad as actualizarCantidadRedux,
  vaciarCarrito as vaciarCarritoRedux,
  cargarCarrito as cargarCarritoRedux,
} from "../redux/features/carritoSlice";

const CARRITO_STORAGE_KEY = "calyaan_carrito";

/**
 * Hook para gestionar carrito sincronizado con Redux y localStorage
 * @returns {Object} { carrito, agregarItem, eliminarItem, vaciarCarrito, total, subtotal }
 */
export const useCarrito = () => {
  const dispatch = useDispatch();
  const carrito = useSelector((state) => state.carrito);

  // Cargar carrito desde localStorage al montar
  useEffect(() => {
    try {
      const carritoGuardado = localStorage.getItem(CARRITO_STORAGE_KEY);
      if (carritoGuardado) {
        const items = JSON.parse(carritoGuardado);
        dispatch(cargarCarritoRedux(items));
      }
    } catch (error) {
      console.error("Error cargando carrito desde localStorage:", error);
    }
  }, [dispatch]);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    try {
      localStorage.setItem(CARRITO_STORAGE_KEY, JSON.stringify(carrito.items));
    } catch (error) {
      console.error("Error guardando carrito en localStorage:", error);
    }
  }, [carrito.items]);

  const agregarItem = useCallback(
    (disponibilidad, horarioId, horaSeleccionada, precio = 0) => {
      const nuevoItem = {
        disponibilidadId: disponibilidad._id,
        profesionalId: disponibilidad.creador?._id,
        usuarioId: disponibilidad.creador?.creador?._id,
        fecha: disponibilidad.fecha,
        horarioId,
        hora: horaSeleccionada,
        profesional: {
          nombre: disponibilidad.creador?.creador?.nombre || "",
          apellido: disponibilidad.creador?.creador?.apellido || "",
          especialidades: disponibilidad.creador?.especialidad || [],
        },
        precio,
      };

      dispatch(agregarItemRedux(nuevoItem));
      return true;
    },
    [dispatch]
  );

  const eliminarItem = useCallback(
    (itemId) => {
      dispatch(eliminarItemRedux(itemId));
    },
    [dispatch]
  );

  const actualizarCantidad = useCallback(
    (itemId, cantidad) => {
      dispatch(actualizarCantidadRedux({ itemId, cantidad }));
    },
    [dispatch]
  );

  const vaciarCarrito = useCallback(() => {
    dispatch(vaciarCarritoRedux());
  }, [dispatch]);

  return {
    items: carrito.items,
    total: carrito.total,
    subtotal: carrito.subtotal,
    agregarItem,
    eliminarItem,
    actualizarCantidad,
    vaciarCarrito,
  };
};

export default useCarrito;
