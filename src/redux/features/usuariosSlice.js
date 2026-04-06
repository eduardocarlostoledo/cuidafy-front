import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api";

const initialState = {
  users: [],
  status: "idle",
  error: null,
  update: false,
};

export const obtenerUsuarios = createAsyncThunk(
  "users/get",
  async () => {
    try {
      const response = await api.obtenerTodosUsuarios();
      const info = response.data;
      return info;
    } catch (error) {
      throw new Error("Error al obtener usuarios");
    }
  }
);

const usuarioSlice = createSlice({
  name: "usuarios",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(obtenerUsuarios.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(obtenerUsuarios.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(obtenerUsuarios.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});


export const { usuario } = usuarioSlice.actions;

export default usuarioSlice.reducer;