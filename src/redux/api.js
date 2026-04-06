import clienteAxios from "../config/axios";
import { getAuthToken } from "../helpers/auth/getSessionData";

clienteAxios.interceptors.request.use((req) => {
  const token = getAuthToken();
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Auth
export const signIn = (userForm) =>
  clienteAxios.post("api/auth/login", userForm);
export const signUp = (userForm) => clienteAxios.post("api/usuarios", userForm);
export const signUpProfessional = (userForm) =>
  clienteAxios.post("api/usuarios/registro-profesional", userForm);
export const confirmAccountRequest = (token) =>
  clienteAxios.get(`api/usuarios/confirmar/${token}`);
export const resendConfirmationEmailRequest = (email) =>
  clienteAxios.post("api/usuarios/confirmar/", { email });
export const googleSignIn = (accessToken) =>
  clienteAxios.post(`api/auth/google`, { token: accessToken });
export const forgotPasswordRequest = (email) =>
  clienteAxios.post("api/usuarios/olvide-password", email);
export const newPasswordRequest = ({ password, token }) =>
  clienteAxios.post(`api/usuarios/olvide-password/${token}`, { password });
export const updateInformationRequest = (userForm) =>
  clienteAxios.put("api/usuarios/actualizar-perfil", userForm);
export const updatePasswordRequest = (valueForm) =>
  clienteAxios.put("api/usuarios/cambiar-password", valueForm);
export const obtenerTodosUsuarios = () =>
  clienteAxios.get("api/buscar/obtenertodosusuarios");

// Professional
export const updateProfileRequest = (valueForm) =>
  clienteAxios.put("api/profesional/actualizar-profesional", valueForm);
export const updateProfileRequestDash = (valueForm) =>
  clienteAxios.put("api/profesional/actualizar-profesional-admin", valueForm);
export const updateProfileRequestDashAdmin = (valueForm) =>
  clienteAxios.put(
    "api/profesional/actualizar-profesional-admin-dash",
    valueForm
  );
export const createScheduleRequest = (valueForm) =>
  clienteAxios.post("api/profesional", valueForm);

export const disponibilidadesTotales = () =>
  clienteAxios.get("api/profesional/disponibilidades-totales");
// Order
export const getAllOrdersRequest = () => clienteAxios.get("api/ordenes/orden");

export const createOrderRequest = (orderForm) =>
  clienteAxios.post("api/ordenes/orden", orderForm);
export const updateOrderRequest = (orderForm) =>
  clienteAxios.put("api/ordenes/updateorden", orderForm);

export const getOrderByIdRequest = (orderId) =>
  clienteAxios.get(`api/ordenes/getordenbyid/${orderId}`);
export const deleteOrderRequest = (orderId) =>
  clienteAxios.delete(`api/ordenes/orden/${orderId}`);
export const getOrdersByUserIdRequest = (userId) =>
  clienteAxios.get(`api/ordenes/ordenbyuserid/${userId}`);

// Liquidaciones
export const getAllLiquidacionRequest = () =>
  clienteAxios.get("api/liquidaciones/settlement");

export const createLiquidacionRequest = (orderForm) =>
  clienteAxios.post("api/liquidaciones/settlement", orderForm);

export const updateLiquidacionRequest = (orderForm) =>
  clienteAxios.put("api/liquidaciones/updatesettlement", orderForm);

export const getLiquidacionByIdRequest = (liquidacionId) =>
  clienteAxios.get(`api/liquidaciones/getsettlementbyid/${liquidacionId}`);

export const deleteLiquidacionRequest = (liquidacionId) =>
  clienteAxios.delete(`api/liquidaciones/settlement/${liquidacionId}`);

export const getLiquidacionByUserIdRequest = (userId) =>
  clienteAxios.get(`api/liquidaciones/settlementbyuserid/${userId}`);
