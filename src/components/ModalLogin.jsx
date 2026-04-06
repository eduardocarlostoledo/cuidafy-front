import React, { lazy, useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";

import { Link, useNavigate, useParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import {
  deleteError,
  googleSignIn,
  login,
  setLogout,
} from "../redux/features/authSlice";

import { LazyLoadImage } from "react-lazy-load-image-component";
import { toast } from "react-toastify";

// const ButtonSpinner = lazy(() => import('../components/ButtonSpinner'))
import ButtonSpinner from "../components/ButtonSpinner";
import { useGoogleLogin } from "@react-oauth/google";

const ModalLogin = ({ handleModalLogin }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => ({ ...state.auth }));

  const [userForm, setUserForm] = useState({
    email: "",
    password: "",
    rol: "CLIENTE",
  });

  const { email, password } = userForm;

  function handleGoogleLoginSuccess(tokenResponse) {
    const accessToken = tokenResponse.access_token;

    dispatch(googleSignIn({ accessToken, navigate, toast, rute: "/servicio" }));

    handleModalLogin();
  }

  const logincongoogle = useGoogleLogin({
    onSuccess: handleGoogleLoginSuccess,
  });

  const handleChange = (e) => {
    setUserForm({
      ...userForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ([email, password].includes("")) {
      return toast.error("Todos los campos son obligatorios");
    }

    const response = await dispatch(
      login({ userForm, navigate, rute: "/servicio" })
    );

    // console.log(!response.payload)

    setUserForm({ email: "", password: "" });
    if (response.payload) {
      handleModalLogin();
    }
  };

  return (
    <div className="relative z-10">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full justify-center p-4 text-center items-center sm:p-0">
          <div className="container mx-auto w-11/12 md:w-2/3 max-w-lg flex justify-center">
            <div className="relative w-11/12 sm:w-8/12 md:w-10/12 bg-white shadow  rounded">
              <img
                className="rounded-tl rounded-tr"
                src="https://gifts.gouldsalonspa.com/wp-content/uploads/2020/03/Relaxation-Massage-768x512.jpeg"
              />
              <div className="md:px-10 py-4 px-5 md:py-6">
                <p className="text-2xl font-bold leading-normal text-gray-800 ">
                  Inicia sesión para Continuar
                </p>
                <p className="text-sm leading-3 mt-4 mb-5 text-gray-600 ">
                  Disfruta de todos los beneficios especiales que tenemos para
                  ti
                </p>
                <form onSubmit={handleSubmit}>
                  <div className="bg-gray-50  border rounded  border-gray-200">
                    <input
                      className="py-3 pl-4 bg-transparent text-sm font-medium leading-none text-gray-600 placeholder-gray-600  w-full focus:outline-none"
                      type="email"
                      placeholder="Ingresa tu dirección de correo electrónico"
                      onChange={handleChange}
                      value={email}
                      name="email"
                    />
                  </div>
                  <div className="bg-gray-50 mt-3  border-gray-200">
                    <input
                      className="py-3 pl-4 bg-transparent text-sm font-medium leading-none text-gray-600 placeholder-gray-600  w-full focus:outline-none"
                      type="password"
                      placeholder="••••••••"
                      onChange={handleChange}
                      value={password}
                      name="password"
                    />
                  </div>
                  <div className="md:flex  justify-between flex-col gap-2 mt-4 md:mt-6">
                    <Link
                      to="/olvide-password"
                      className="text-xs leading-3 text-right text-gray-600  hover:text-bgHover focus:text-bgHover"
                    >
                      ¿Has olvidado tu contraseña?
                    </Link>

                    {loading ? (
                      <ButtonSpinner />
                    ) : (
                      <button className="mt-4 p-3 bg-primary hover:bg-bgHover focus:bg-bgHover  rounded focus:outline-none">
                        <p className="text-sm font-medium leading-none text-white">
                          Iniciar sesión
                        </p>
                      </button>
                    )}
                  </div>
                </form>

                <hr className="my-6 border-gray-300 w-full" />

                <div
                  type="button"
                  className="w-full block bg-white hover:bg-gray-100 focus:bg-gray-100 text-gray-900 font-semibold rounded-lg p-2 border border-gray-300"
                >
                  <button
                    className="flex items-center justify-center w-full"
                    onClick={logincongoogle}
                  >
                    <FcGoogle />
                    <span className="ml-2">Continuar con Google</span>
                  </button>
                </div>

                <div className="md:flex items-center justify-between flex-col gap-2 mt-4 md:mt-6">
                  <p className="text-xs leading-3 text-gray-600  hover:text-bgHover focus:text-bgHover">
                    ¿No tienes cuenta?{" "}
                    <Link
                      to="/registro"
                      className="text-primary hover:text-bgHover font-semibold"
                    >
                      Créate una cuenta gratis
                    </Link>
                  </p>
                </div>
              </div>
              <div className="cursor-pointer absolute top-0 right-0 m-3 text-gray-800 transition duration-150 ease-in-out">
                <AiOutlineClose
                  onClick={handleModalLogin}
                  className="w-5 h-5 text-white icon icon-tabler icon-tabler-x"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalLogin;
