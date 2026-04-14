import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import swal from "sweetalert";
import * as api from "../api";
import { addMessage } from "./notificationsSlice";
import { ROLES } from "../../helpers/Logic/roles";

export const login = createAsyncThunk(
  "auth/login",
  async ({ userForm, navigate, rute = "/", toast }, thunkAPI) => {
    try {
      const response = await api.signIn(userForm);

      // Si la cuenta está confirmada, navegar automáticamente
      if (response.data.confirmado) {
        thunkAPI.dispatch(
          addMessage({
            type: "successful",
            text: "Inicio de sesión exitoso.",
          })
        );
        navigate(`${rute}`, { replace: true });
      }

      // Retornar los datos (confirmado o no)
      return response.data;
    } catch (err) {
      console.error("Error en login thunk:", err);
      
      let errorMsg = "Error en el inicio de sesión";
      
      if (err.code === "ERR_NETWORK") {
        errorMsg = "Por favor, inténtelo de nuevo más tarde.";
      } else if (err.response?.data?.msg) {
        errorMsg = err.response.data.msg;
      } else if (err.response?.status === 403) {
        errorMsg = "Usuario o contraseña incorrectos";
      }

      thunkAPI.dispatch(
        addMessage({
          type: "error",
          text: errorMsg,
        })
      );

      return thunkAPI.rejectWithValue(errorMsg);
    }
  }
);

export const register = createAsyncThunk(
  "usuarios",
  async ({ userForm, navigate, toast, rute = "/login" }, thunkAPI) => {
    try {
      const response = await api.signUp(userForm);
      toast.success(
        "Registro exitoso, confirma tu cuenta con el email enviado"
      );
      swal(
        "Registro Exitoso!",
        "Por Favor, confirma tu correo electrónico para Ingresar",
        "success"
      );
      navigate(rute);
      return response.data;
    } catch (err) {
      thunkAPI.rejectWithValue();

      if (err.code === "ERR_NETWORK") {
        thunkAPI.dispatch(
          addMessage({
            type: "error",
            text: "Por favor, inténtelo de nuevo más tarde.",
          })
        );
      } else {
        thunkAPI.dispatch(
          addMessage({
            type: "error",
            text: `${err.response.data.msg}`,
          })
        );
      }

      return;
    }
  }
);

export const registerProfessional = createAsyncThunk(
  "usuarios",
  async ({ userForm, navigate, toast }, { rejectWithValue }) => {
    try {
      const response = await api.signUpProfessional(userForm);
      toast.success("Registro exitoso");
      navigate("/loginProfesional");
      return response.data;
    } catch (err) {
      let error = err.response.data.msg
        ? err.response.data.msg
        : err.response && "Estamos presentando problemas internos";
      return rejectWithValue(error);
    }
  }
);

export const confirmAccount = createAsyncThunk(
  "usuarios/confirmar/:idtoken",
  async ({ idtoken, navigate, toast }, { rejectWithValue }) => {
    try {
      const response = await api.confirmAccountRequest(idtoken);
      toast.success("Cuenta confirmada correctamente");
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      let error = err.response.data.msg
        ? err.response.data.msg
        : err.response && "Estamos presentando problemas internos";
      return rejectWithValue(error);
    }
  }
);

export const googleSignIn = createAsyncThunk(
  "auth/googleSignIn",
  async (
    { accessToken, navigate, toast, rute = "/" },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.googleSignIn(accessToken);
      toast.success("Inicio de sesión con Google exitoso");
      navigate(`${rute}`);
      return response.data;
    } catch (err) {
      console.log(err);
      let error = err.response?.data?.msg
        ? err.response.data.msg
        : "Estamos presentando problemas internos";
      return rejectWithValue(error);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "usuarios/olvide-password",
  async ({ email, toast }, { rejectWithValue }) => {
    try {
      await api.forgotPasswordRequest({ email });
      toast.success("Instrucciones enviadas al correo electrónico");
    } catch (err) {
      let error = err.response.data.msg
        ? err.response.data.msg
        : err.response && "Estamos presentando problemas internos";
      return rejectWithValue(error);
    }
  }
);

export const newPassword = createAsyncThunk(
  "usuarios/olvide-password/:idtoken",
  async ({ values, navigate, toast }, { rejectWithValue }) => {
    try {
      await api.newPasswordRequest(values);
      toast.success("Contraseña actualizada exitosamente");
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      let error = err.response.data.msg
        ? err.response.data.msg
        : err.response && "Estamos presentando problemas internos";
      return rejectWithValue(error);
    }
  }
);

export const updateInformation = createAsyncThunk(
  "usuarios/actualizar-perfil",
  async ({ valueForm, notificacion }, { rejectWithValue }) => {
    try {
      await api.updateInformationRequest(valueForm);
      notificacion();
    } catch (err) {
      let error = err.response.data.msg
        ? err.response.data.msg
        : err.response && "Estamos presentando problemas internos";
      return rejectWithValue(error);
    }
  }
);

export const updatePassword = createAsyncThunk(
  "usuarios/actualizar-password",
  async ({ body, toast }, { rejectWithValue }) => {
    try {
      await api.updatePasswordRequest(body);
      toast.success("Contraseña actualizada exitosamente");
    } catch (err) {
      let error = err.response.data.msg
        ? err.response.data.msg
        : err.response && "Estamos presentando problemas internos";
      return rejectWithValue(error);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: localStorage.getItem("profile")
      ? JSON.parse(localStorage.getItem("profile"))
      : null,
    /*     trafficLightBase128: localStorage.getItem("trafficLightBase128")
          ? JSON.parse(localStorage.getItem("trafficLightBase128"))
          : null, */
    error: "",
    loading: false,
    estado: localStorage.getItem("estado")
      ? JSON.parse(localStorage.getItem("estado"))
      : false,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setLogout: (state, action) => {
      let servicios = localStorage.getItem("services");
      let careRequest = localStorage.getItem("calyaan_care_request");
      let careShortlist = localStorage.getItem("calyaan_care_shortlist");
      let careSelection = localStorage.getItem("calyaan_care_selection");
      let careContractDraft = localStorage.getItem("calyaan_care_contract_draft");
      localStorage.clear();
      state.user = null;
      localStorage.setItem("services", servicios);
      if (careRequest) localStorage.setItem("calyaan_care_request", careRequest);
      if (careShortlist) localStorage.setItem("calyaan_care_shortlist", careShortlist);
      if (careSelection) localStorage.setItem("calyaan_care_selection", careSelection);
      if (careContractDraft) {
        localStorage.setItem("calyaan_care_contract_draft", careContractDraft);
      }
      //state.trafficLightBase128 = null;
    },
    deleteError: (state, action) => {
      state.error = "";
    },
    estadoAction: (state, action) => {
      state.estado = true;
      localStorage.setItem("estado", true);
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(login.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      localStorage.setItem(
        "profile",
        JSON.stringify({
          confirmado: action?.payload?.confirmado,
          email: action.payload?.email,
          nombre: action.payload?.nombre,
          profesionalId: action.payload?.profesionalId,
          token: action.payload?.token,
          _id: action.payload?._id,
          trafficLightBase128: ROLES[action.payload?.rol],
        })
      );

      //localStorage.setItem("trafficLightBase128", JSON.stringify({ time: ROLES[action.payload.rol] }));

      //state.trafficLightBase128 = { time: ROLES[action.payload.rol] };
      state.user = {
        confirmado: action.payload?.confirmado,
        email: action.payload?.email,
        nombre: action.payload?.nombre,
        profesionalId: action.payload?.profesionalId,
        token: action.payload?.token,
        _id: action.payload?._id,
        trafficLightBase128: ROLES[action.payload?.rol],
      };
    });

    // Register
    builder.addCase(register.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload?.token) {
        localStorage.setItem(
          "profile",
          JSON.stringify({
            confirmado: action?.payload?.confirmado,
            email: action.payload?.email,
            nombre: action.payload?.nombre,
            profesionalId: action.payload?.profesionalId,
            token: action.payload?.token,
            _id: action.payload?._id,
            trafficLightBase128: ROLES[action.payload?.rol],
          })
        );

        state.user = {
          confirmado: action.payload?.confirmado,
          email: action.payload?.email,
          nombre: action.payload?.nombre,
          profesionalId: action.payload?.profesionalId,
          token: action.payload?.token,
          _id: action.payload?._id,
          trafficLightBase128: ROLES[action.payload?.rol],
        };
      }
    });

    // Google Sign In
    builder.addCase(googleSignIn.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(googleSignIn.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(googleSignIn.fulfilled, (state, action) => {
      state.loading = false;
      localStorage.setItem(
        "profile",
        JSON.stringify({
          confirmado: action?.payload?.confirmado,
          email: action.payload?.email,
          nombre: action.payload?.nombre,
          profesionalId: action.payload?.profesionalId,
          token: action.payload?.token,
          _id: action.payload?._id,
          trafficLightBase128: ROLES[action.payload?.rol],
        })
      );

      state.user = {
        confirmado: action.payload?.confirmado,
        email: action.payload?.email,
        nombre: action.payload?.nombre,
        profesionalId: action.payload?.profesionalId,
        token: action.payload?.token,
        _id: action.payload?._id,
        trafficLightBase128: ROLES[action.payload?.rol],
      };
    });

    // Confirm Account
    builder.addCase(confirmAccount.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(confirmAccount.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(confirmAccount.fulfilled, (state, action) => {
      state.loading = false;
    });

    // Forgot Password
    builder.addCase(forgotPassword.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(forgotPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(forgotPassword.fulfilled, (state, action) => {
      state.loading = false;
    });

    // New Password
    builder.addCase(newPassword.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(newPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(newPassword.fulfilled, (state, action) => {
      state.loading = false;
    });

    // Update Information
    builder.addCase(updateInformation.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(updateInformation.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(updateInformation.fulfilled, (state, action) => {
      state.loading = false;
    });

    // Update Password
    builder.addCase(updatePassword.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(updatePassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(updatePassword.fulfilled, (state, action) => {
      state.loading = false;
    });
  },
});

export const { setUser, setLogout, deleteError, estadoAction } =
  authSlice.actions;

export default authSlice.reducer;
