import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteError, updatePassword } from "../redux/features/authSlice";
import { toast } from "react-toastify";
import ButtonSpinner from "./ButtonSpinner";

const UpdatePassword = () => {
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => ({ ...state.auth }));

  const [valueForm, setValueForm] = useState({
    password: "",
    nuevapassword: "",
    confnuevapassword: "",
  });

  const { password, nuevapassword, confnuevapassword } = valueForm;

  const handleChange = (e) => {
    setValueForm({
      ...valueForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if ([password, nuevapassword, confnuevapassword].includes("")) {
      return toast.error("Todos los campos son obligatorios");
    }

    if (nuevapassword.length < 6) {
      return toast.error("La nueva contraseña debe ser mayor a 6 caracteres");
    }

    if (nuevapassword !== confnuevapassword) {
      return toast.error("Las contraseñas nuevas no coinciden");
    }

    const body = {
      password: password,
      nuevoPassword: nuevapassword,
    };

    dispatch(updatePassword({ body, toast }));

    setValueForm({
      password: "",
      nuevapassword: "",
      confnuevapassword: "",
    });
  };

  return (
    <>
      <h2 className="font-medium text-xl mb-2 mt-5">Actualizar contraseña</h2>
      <p className="text-gray-600">
        Puedes modificar tu contraseña, utilizando el siguiente formulario.
      </p>

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5 mt-5"
      >
        <div className="md:col-span-5 w-full">
          <label htmlFor="password">Actual contraseña</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={handleChange}
            className="h-10 border mt-1 rounded px-4 w-full bg-gray-200 focus:border-bgHover focus:bg-white focus:outline-none"
            placeholder="************"
          />
        </div>

        <div className="md:col-span-5">
          <label htmlFor="nuevapassword">Nueva contraseña</label>
          <input
            type="password"
            name="nuevapassword"
            id="nuevapassword"
            value={nuevapassword}
            onChange={handleChange}
            className="h-10 border mt-1 rounded px-4 w-full bg-gray-200 focus:border-bgHover focus:bg-white focus:outline-none"
            placeholder="************"
          />
        </div>

        <div className="md:col-span-5">
          <label htmlFor="confnuevapassword">Confirmar nueva contraseña</label>
          <input
            type="password"
            name="confnuevapassword"
            id="confnuevapassword"
            value={confnuevapassword}
            onChange={handleChange}
            className="transition-all flex items-center h-10 border mt-1 rounded px-4 w-full bg-gray-200 focus:border-bgHover focus:bg-white focus:outline-none"
            placeholder="************"
          />
        </div>

        <div className="md:col-span-5 text-right">
          <div className="inline-flex items-end">
            {loading ? (
              <ButtonSpinner />
            ) : (
              <button className="bg-primary hover:bg-bgHover text-white font-bold py-3 px-6 rounded mt-6">
                Actualizar contraseña
              </button>
            )}
          </div>
        </div>
      </form>
    </>
  );
};

export default UpdatePassword;
