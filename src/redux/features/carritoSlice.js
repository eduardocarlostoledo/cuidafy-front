import { createSlice } from "@reduxjs/toolkit";

/**
 * Redux slice para gestionar carrito con disponibilidades
 * Estado: { items: [], total: 0, subtotal: 0 }
 */

const initialState = {
  items: [],
  total: 0,
  subtotal: 0,
};

export const carritoSlice = createSlice({
  name: "carrito",
  initialState,

  reducers: {
    /**
     * Agregar item al carrito
     * payload: { disponibilidadId, profesionalId, fecha, horarioId, hora, profesional }
     */
    agregarItem: (state, action) => {
      const nuevoItem = {
        id: `${action.payload.disponibilidadId}-${action.payload.horarioId}`,
        disponibilidadId: action.payload.disponibilidadId,
        profesionalId: action.payload.profesionalId,
        usuarioId: action.payload.usuarioId,
        fecha: action.payload.fecha,
        horarioId: action.payload.horarioId,
        hora: action.payload.hora,
        profesional: action.payload.profesional,
        precio: action.payload.precio || 0,
        cantidad: 1,
        createdAt: new Date().toISOString(),
      };

      // Evitar duplicados
      const existe = state.items.find(
        (item) =>
          item.disponibilidadId === nuevoItem.disponibilidadId &&
          item.horarioId === nuevoItem.horarioId
      );

      if (!existe) {
        state.items.push(nuevoItem);
        state.total = state.items.length;
        state.subtotal = state.items.reduce(
          (sum, item) => sum + item.precio * item.cantidad,
          0
        );
      }
    },

    /**
     * Eliminar item del carrito
     * payload: string (id del item)
     */
    eliminarItem: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.total = state.items.length;
      state.subtotal = state.items.reduce(
        (sum, item) => sum + item.precio * item.cantidad,
        0
      );
    },

    /**
     * Actualizar cantidad de item
     * payload: { itemId: string, cantidad: number }
     */
    actualizarCantidad: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload.itemId);
      if (item) {
        item.cantidad = Math.max(1, action.payload.cantidad);
        state.subtotal = state.items.reduce(
          (sum, item) => sum + item.precio * item.cantidad,
          0
        );
      }
    },

    /**
     * Vaciar carrito completamente
     */
    vaciarCarrito: (state) => {
      state.items = [];
      state.total = 0;
      state.subtotal = 0;
    },

    /**
     * Cargar carrito desde localStorage
     * payload: array de items
     */
    cargarCarrito: (state, action) => {
      state.items = action.payload || [];
      state.total = state.items.length;
      state.subtotal = state.items.reduce(
        (sum, item) => sum + item.precio * item.cantidad,
        0
      );
    },

    /**
     * Actualizar precio de item
     * payload: { itemId: string, precio: number }
     */
    actualizarPrecio: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload.itemId);
      if (item) {
        item.precio = action.payload.precio;
        state.subtotal = state.items.reduce(
          (sum, item) => sum + item.precio * item.cantidad,
          0
        );
      }
    },
  },
});

export const {
  agregarItem,
  eliminarItem,
  actualizarCantidad,
  vaciarCarrito,
  cargarCarrito,
  actualizarPrecio,
} = carritoSlice.actions;

export default carritoSlice.reducer;
