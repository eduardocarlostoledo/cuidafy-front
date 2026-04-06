import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import * as api from "../api";

// const initialState = {
//   disponibilidad: [],
//   status: "idle",
//   error: null,
//   update: false,
// };

export const updateProfile = createAsyncThunk(
  "professional/updateProfile",
  async ({ dataP, toast }, { rejectWithValue }) => {
    try {
      const { data } = await api.updateProfileRequest(dataP);
      toast.success(data.msg);
    } catch (err) {
      console.log(err);
      let error =
        err.response?.data?.msg || "Estamos presentando problemas internos";
      return rejectWithValue(error);
    }
  }
);

// Update profesional desde la admin dash ( descripcion,localidades y especialidades)
export const updateProfileAdmin = createAsyncThunk(
  "professional/actualizar-profesional-admin",
  async ({ dataP, toast }, { rejectWithValue }) => {
    try {
      const { data } = await api.updateProfileRequestDash(dataP);
      toast.success(data.msg);
    } catch (err) {
      console.log(err);
      let error =
        err.response?.data?.msg || "Estamos presentando problemas internos";
      return rejectWithValue(error);
    }
  }
);

// Update perfil usuario del profesional(nombre,apellido,email,etc...)
export const updateProfileAdminDash = createAsyncThunk(
  "professional/actualizar-profesional-admin-dash",
  async ({ valueForm, toast }, { rejectWithValue }) => {
    try {
      const { data } = await api.updateProfileRequestDashAdmin(valueForm);
      toast.success(data.msg);
    } catch (err) {
      console.log(err);
      let error =
        err.response?.data?.msg || "Estamos presentando problemas internos";
      return rejectWithValue(error);
    }
  }
);

export const createSchedule = createAsyncThunk(
  "professional/createSchedule",
  async ({ valueForm, toast }, { rejectWithValue }) => {
    try {
      const { data } = await api.createScheduleRequest(valueForm);
      toast.success(data.msg);
    } catch (err) {
      console.log(err);
      let error =
        err.response?.data?.msg || "Estamos presentando problemas internos";
      return rejectWithValue(error);
    }
  }
);

export const disponibilidadesTotalesGet = createAsyncThunk(
  "profesional/disponibilidades-totales",
  async () => {
    try {
      const response = await api.disponibilidadesTotales();
      const info = response.data;

      return info;
    } catch (error) {
      throw new Error("Error al obtener las órdenes");
    }
  }
);

// export const disponibilidadesTotalesGet = createAsyncThunk(
//   "profesional/disponibilidades-totales",
//   async ({ toast }, {}) => {
//     try {
//       const { data } = await api.disponibilidadesTotales();
//       return data;
//     } catch (err) {
//       let error =
//         err.response?.data?.msg || "estamos presetando problemas internos";
//       return rejectWithValue(error);
//     }
//   }
// );

const professionalSlice = createSlice({
  name: "professional",
  initialState: {
    disponibilidad: [],
    errorProfessional: "",
    loadingProfessional: false,
  },
  reducers: {
    clearError: (state) => {
      state.errorProfessional = "";
    },
  },
  extraReducers: (builder) => {
    // Update Profile
    builder
      .addCase(disponibilidadesTotalesGet.pending, (state) => {
        state.status = "loading";
      })
      .addCase(disponibilidadesTotalesGet.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.disponibilidad = action.payload;
      })
      .addCase(disponibilidadesTotalesGet.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loadingProfessional = true;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loadingProfessional = false;
        state.errorProfessional = action.payload;
      })
      .addCase(updateProfile.fulfilled, (state) => {
        state.loadingProfessional = false;
      });

    // Update Profile Admin Dash
    builder
      .addCase(updateProfileAdminDash.pending, (state) => {
        state.loadingProfessional = true;
      })
      .addCase(updateProfileAdminDash.rejected, (state, action) => {
        state.loadingProfessional = false;
        state.errorProfessional = action.payload;
      })
      .addCase(updateProfileAdminDash.fulfilled, (state) => {
        state.loadingProfessional = false;
      });

    // .addCase(updateProfileAdmin.pending, (state) => {
    //   state.loadingProfessional = true;
    // })
    // .addCase(updateProfileAdmin.rejected, (state, action) => {
    //   state.loadingProfessional = false;
    //   state.errorProfessional = action.payload;
    // })
    // .addCase(updateProfileAdmin.fulfilled, (state) => {
    //   state.loadingProfessional = false;
    // });

    // Create Schedule
    builder
      .addCase(createSchedule.pending, (state) => {
        state.loadingProfessional = true;
      })
      .addCase(createSchedule.rejected, (state, action) => {
        state.loadingProfessional = false;
        state.errorProfessional = action.payload;
      })
      .addCase(createSchedule.fulfilled, (state) => {
        state.loadingProfessional = false;
      });
  },
});

export const { clearError } = professionalSlice.actions;

export default professionalSlice.reducer;

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// import * as api from "../api";

// export const updateProfile = createAsyncThunk(
//   "profesional/actualizar-profesional",
//   async ({ dataP, toast }, { rejectWithValue }) => {
//     try {
//       const { data } = await api.updateProfileRequest(dataP);
//       toast.success(data.msg);
//     } catch (err) {
//       console.log(err);
//       let error = err.response.data.msg
//         ? err.response.data.msg
//         : err.response && "Estamos presentando problemas internos";
//       return rejectWithValue(error);
//     }
//   }
// );

// export const updateProfileAdminDash = createAsyncThunk(
//   "profesional/actualizar-profesional",
//   async ({ dataP, toast }, { rejectWithValue }) => {
//     try {
//       const { data } = await api.updateProfileRequestDashAdmin(dataP);
//       toast.success(data.msg);
//     } catch (err) {
//       console.log(err);
//       let error = err.response.data.msg
//         ? err.response.data.msg
//         : err.response && "Estamos presentando problemas internos";
//       return rejectWithValue(error);
//     }
//   }
// );

// export const createSchedule = createAsyncThunk(
//   "profesional/actualizar-profesional",
//   async ({ valueForm, toast }, { rejectWithValue }) => {
//     try {
//       const { data } = await api.createScheduleRequest(valueForm);
//       toast.success(data.msg);
//     } catch (err) {
//       console.log(err);
//       let error = err.response.data.msg
//         ? err.response.data.msg
//         : err.response && "Estamos presentando problemas internos";
//       return rejectWithValue(error);
//     }
//   }
// );

// const professionalSlice = createSlice({
//   name: "professional",
//   initialState: {
//     errorProfessional: "",
//     loadingProfessional: false,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     // Update Profile
//     builder.addCase(updateProfile.pending, (state, action) => {
//       state.loadingProfessional = true;
//     });
//     builder.addCase(updateProfile.rejected, (state, action) => {
//       state.loadingProfessional = false;
//       state.errorProfessional = action.payload;
//     });
//     builder.addCase(updateProfile.fulfilled, (state, action) => {
//       state.loadingProfessional = false;
//     });
//   },
// });

// export default professionalSlice.reducer;
