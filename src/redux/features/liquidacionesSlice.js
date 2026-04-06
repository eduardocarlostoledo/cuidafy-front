import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api";

const initialState = {
  liquidacion: [],
  status: "idle",
  error: null,
  update: false,
};

export const getLiquidacion = createAsyncThunk("api/liquidaciones/get", async () => {
  try {
    const response = await api.getAllLiquidacionRequest();
    const info = response.data;

    return info;
  } catch (error) {
    throw new Error("Error al obtener las liquidaciones");
  }
});

export const updateLiquidacion = createAsyncThunk(
  "api/liquidaciones/update",
  async (liquidacionForm) => {
    try {
      const response = await api.updateLiquidacionRequest(liquidacionForm);
      const info = response.data;

      return info;
    } catch (error) {
      throw new Error("Error al actualizar las liquidaciones");
    }
  }
);

export const createLiquidacion = createAsyncThunk(
  "api/liquidaciones/create",
  async (liquidacionForm) => {
    try {
      const response = await api.createLiquidacionRequest(liquidacionForm);
      const info = response.data;
      // console.log("createLiquidacion", info);
      return info;
    } catch (error) {
      throw new Error("Error al crear las liquidaciones");
    }
  }
);

export const getLiquidacionById = createAsyncThunk(
  "api/liquidaciones/getById",
  async (liquidacionId) => {
    try {
      const response = await api.getLiquidacionByIdRequest(liquidacionId);
      const info = response.data;
      // console.log("getLiquidacionById", info);
      return info;
    } catch (error) {
      throw new Error("Error al obtener las liquidaciones por Id");
    }
  }
);

export const deleteLiquidacion = createAsyncThunk(
  "api/liquidaciones/delete",
  async (liquidacionId) => {
    try {
      const response = await api.deleteLiquidacionRequest(liquidacionId);
      const info = response.data;
      // console.log("deleteLiquidacion", info);
      return info;
    } catch (error) {
      throw new Error("Error al eliminar las liquidaciones");
    }
  }
);

export const getLiquidacionByUser = createAsyncThunk(
  "api/liquidaciones/getByUser",
  async (userId) => {
    try {
      const response = await api.getLiquidacionByUserIdRequest(userId);
      const info = response.data;
      // console.log("getLiquidacionByUser", info);
      return info;
    } catch (error) {
      throw new Error("Error al obtener las liquidaciones por usuario");
    }
  }
);

const liquidacionSlice = createSlice({
  name: "liquidaciones",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLiquidacion.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getLiquidacion.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.liquidacion = action.payload;
      })
      .addCase(getLiquidacion.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createLiquidacion.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createLiquidacion.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.liquidacion.push(action.payload);
      })
      .addCase(createLiquidacion.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateLiquidacion.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateLiquidacion.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.liquidacion.findIndex((o) => o.id === action.payload.id);
        if (index !== -1) {
          state.liquidacion[index] = action.payload;
        }
      })
      .addCase(updateLiquidacion.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(getLiquidacionById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getLiquidacionById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.liquidacion = [action.payload];
      })
      .addCase(getLiquidacionById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteLiquidacion.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteLiquidacion.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.liquidacion.findIndex((o) => o.id === action.payload.id);
        if (index !== -1) {
          state.liquidacion.splice(index, 1);
        }
      })
      .addCase(deleteLiquidacion.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(getLiquidacionByUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getLiquidacionByUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.liquidacion = action.payload;
      })
      .addCase(getLiquidacionByUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { liquidaciones } = liquidacionSlice.actions;
export default liquidacionSlice.reducer;
