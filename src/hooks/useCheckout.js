import { useState, useCallback } from "react";
import { useCarrito } from "./useCarrito";
import { generarResumenOrden, crearOrden, procesarPagoMP } from "../api/ordenesAPI";

/**
 * Hook para manejar el proceso de checkout
 * @returns {Object} { resumen, crearOrden, procesarPago, loading, error }
 */
export const useCheckout = () => {
  const { items, subtotal, vaciarCarrito } = useCarrito();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ordenCreada, setOrdenCreada] = useState(null);

  const resumen = generarResumenOrden(items);

  const crearOrdenCheckout = useCallback(
    async (datosAdicionales = {}) => {
      if (!items.length) {
        setError("El carrito está vacío");
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const respuesta = await crearOrden(items, datosAdicionales);

        setOrdenCreada(respuesta);
        return respuesta;
      } catch (err) {
        const mensaje = err.message || "Error al crear la orden";
        setError(mensaje);
        console.error("Error creando orden:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [items]
  );

  const procesarPagoCheckout = useCallback(
    async (ordenId, tokenPago) => {
      setLoading(true);
      setError(null);

      try {
        const resultado = await procesarPagoMP(ordenId, tokenPago);

        if (resultado.status === "approved" || resultado.status === "pagada") {
          // Pago exitoso - vaciar carrito
          vaciarCarrito();
          setOrdenCreada(resultado);
          return resultado;
        } else {
          throw new Error("Pago no fue aprobado");
        }
      } catch (err) {
        const mensaje = err.message || "Error procesando pago";
        setError(mensaje);
        console.error("Error en pago:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [vaciarCarrito]
  );

  return {
    items,
    resumen,
    ordenCreada,
    loading,
    error,
    crearOrden: crearOrdenCheckout,
    procesarPago: procesarPagoCheckout,
    limpiarError: () => setError(null),
  };
};

export default useCheckout;
