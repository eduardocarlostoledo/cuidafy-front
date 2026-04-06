import clienteAxios from "../../config/axios";

export const resetUserAndConfirm = async ({ email, password }) => {
  const { data } = await clienteAxios.post("/api/usuarios/reset-user", {
    email,
    password,
  });

  return data;
};

export default resetUserAndConfirm;
