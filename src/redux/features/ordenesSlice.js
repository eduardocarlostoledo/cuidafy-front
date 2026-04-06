import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api";

const initialState = {
  order: [],
  status: "idle",
  error: null,
  update: false,
};

export const getOrders = createAsyncThunk("api/orders/get", async () => {
  try {
    const response = await api.getAllOrdersRequest();
    const info = response.data;

    return info;
  } catch (error) {
    throw new Error("Error al obtener las órdenes");
  }
});

export const updateOrder = createAsyncThunk(
  "api/orders/update",
  async (orderForm) => {
    try {
      const response = await api.updateOrderRequest(orderForm);
      const info = response.data;

      return info;
    } catch (error) {
      throw new Error("Error al actualizar las órdenes");
    }
  }
);

export const createOrder = createAsyncThunk(
  "api/orders/create",
  async (orderForm) => {
    try {
      const response = await api.createOrderRequest(orderForm);
      const info = response.data;
      // console.log("createOrder", info);
      return info;
    } catch (error) {
      throw new Error("Error al crear las órdenes");
    }
  }
);

export const getOrderById = createAsyncThunk(
  "api/orders/getById",
  async (orderId) => {
    try {
      const response = await api.getOrderByIdRequest(orderId);
      const info = response.data;
      // console.log("getOrderById", info);
      return info;
    } catch (error) {
      throw new Error("Error al obtener las órdenes por Id");
    }
  }
);

export const deleteOrder = createAsyncThunk(
  "api/orders/delete",
  async (orderId) => {
    try {
      const response = await api.deleteOrderRequest(orderId);
      const info = response.data;
      // console.log("deleteOrder", info);
      return info;
    } catch (error) {
      throw new Error("Error al eliminar las órdenes");
    }
  }
);

export const getOrdersByUser = createAsyncThunk(
  "api/orders/getByUser",
  async (userId) => {
    try {
      const response = await api.getOrdersByUserIdRequest(userId);
      const info = response.data;
      // console.log("getOrdersByUser", info);
      return info;
    } catch (error) {
      throw new Error("Error al obtener las órdenes por usuario");
    }
  }
);

const ordenSlice = createSlice({
  name: "ordenes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.order = action.payload;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.order.push(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.order.findIndex((o) => o.id === action.payload.id);
        if (index !== -1) {
          state.order[index] = action.payload;
        }
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(getOrderById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.order = [action.payload];
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.order.findIndex((o) => o.id === action.payload.id);
        if (index !== -1) {
          state.order.splice(index, 1);
        }
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(getOrdersByUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getOrdersByUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.order = action.payload;
      })
      .addCase(getOrdersByUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { orders } = ordenSlice.actions;
export default ordenSlice.reducer;
