import { configureStore } from "@reduxjs/toolkit";

import AuthReducer from "./features/authSlice";
import professionalReducer from "./features/professionalSlice";
import notificationsReducer from "./features/notificationsSlice";
import ordenesReducer from "./features/ordenesSlice";
import usuarioReducer from "./features/usuariosSlice";
import liquidacionesReducer from "./features/liquidacionesSlice";
import carritoReducer from "./features/carritoSlice";

export default configureStore({
  reducer: {
    auth: AuthReducer,
    professional: professionalReducer,
    notifications: notificationsReducer,
    ordenes: ordenesReducer,
    usuarios: usuarioReducer,
    liquidaciones: liquidacionesReducer,
    carrito: carritoReducer,
  },
});