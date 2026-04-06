import clienteAxios from "../config/axios";

/**
 * API helpers para procesar reservas/órdenes
 */

/**
 * Crear una orden desde items del carrito
 * @param {Array} items - Items del carrito
 * @param {Object} datos - Datos adicionales { metodoPago, direccion, etc }
 * @returns {Promise<Object>} Respuesta del backend
 */
export const crearOrden = async (items, datos = {}) => {
  try {
    const payload = {
      items: items.map((item) => ({
        disponibilidadId: item.disponibilidadId,
        profesionalId: item.profesionalId,
        horarioId: item.horarioId,
        hora: item.hora,
        fecha: item.fecha,
        precio: item.precio,
        cantidad: item.cantidad,
      })),
      ...datos,
    };

    const { data } = await clienteAxios.post("/api/ordenes", payload);
    return data;
  } catch (error) {
    const mensaje =
      error.response?.data?.msg ||
      error.message ||
      "Error al crear la orden";
    throw new Error(mensaje);
  }
};

/**
 * Confirmar pago de una orden
 * @param {string} ordenId - ID de la orden
 * @param {Object} datoPago - Datos del pago
 * @returns {Promise<Object>} Respuesta del backend
 */
export const confirmarPago = async (ordenId, datoPago = {}) => {
  try {
    const { data } = await clienteAxios.put(
      `/api/ordenes/${ordenId}/confirmar-pago`,
      datoPago
    );
    return data;
  } catch (error) {
    const mensaje =
      error.response?.data?.msg ||
      error.message ||
      "Error al confirmar pago";
    throw new Error(mensaje);
  }
};

/**
 * Obtener una orden específica
 * @param {string} ordenId - ID de la orden
 * @returns {Promise<Object>} Datos de la orden
 */
export const obtenerOrden = async (ordenId) => {
  try {
    const { data } = await clienteAxios.get(`/api/ordenes/${ordenId}`);
    return data;
  } catch (error) {
    const mensaje =
      error.response?.data?.msg ||
      error.message ||
      "Error al obtener la orden";
    throw new Error(mensaje);
  }
};

/**
 * Obtener órdenes del usuario actual
 * @param {Object} filtros - { estado, fecha_inicio, fecha_fin }
 * @returns {Promise<Object>} Lista de órdenes
 */
export const obtenerMisOrdenes = async (filtros = {}) => {
  try {
    const { data } = await clienteAxios.get("/api/ordenes/mis-ordenes", {
      params: filtros,
    });
    return data;
  } catch (error) {
    const mensaje =
      error.response?.data?.msg ||
      error.message ||
      "Error al obtener órdenes";
    throw new Error(mensaje);
  }
};

/**
 * Cancelar una orden
 * @param {string} ordenId - ID de la orden
 * @param {string} razon - Razón de cancelación
 * @returns {Promise<Object>} Respuesta del backend
 */
export const cancelarOrden = async (ordenId, razon = "") => {
  try {
    const { data } = await clienteAxios.put(`/api/ordenes/${ordenId}/cancelar`, {
      razon,
    });
    return data;
  } catch (error) {
    const mensaje =
      error.response?.data?.msg ||
      error.message ||
      "Error al cancelar orden";
    throw new Error(mensaje);
  }
};

/**
 * Generar resumen de orden para checkout
 * @param {Array} items - Items del carrito
 * @returns {Object} Resumen con totales
 */
export const generarResumenOrden = (items) => {
  const subtotal = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  
  // Calcular impuestos (ejemplo: 10%)
  const impuestos = subtotal * 0.1;
  
  // Calcular total
  const total = subtotal + impuestos;

  return {
    items,
    cantidad_items: items.length,
    subtotal: parseFloat(subtotal.toFixed(2)),
    impuestos: parseFloat(impuestos.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
  };
};

/**
 * Procesar pago con Mercado Pago
 * @param {string} ordenId - ID de la orden
 * @param {Object} tokenMP - Token de Mercado Pago
 * @returns {Promise<Object>} Resultado del pago
 */
export const procesarPagoMP = async (ordenId, tokenMP) => {
  try {
    const { data } = await clienteAxios.post(
      `/api/ordenes/${ordenId}/pagar-mp`,
      { token: tokenMP }
    );
    return data;
  } catch (error) {
    const mensaje =
      error.response?.data?.msg ||
      error.message ||
      "Error procesando pago";
    throw new Error(mensaje);
  }
};

export default {
  crearOrden,
  confirmarPago,
  obtenerOrden,
  obtenerMisOrdenes,
  cancelarOrden,
  generarResumenOrden,
  procesarPagoMP,
};
