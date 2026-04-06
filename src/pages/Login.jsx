import React, { lazy, useEffect, useState } from "react";

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

import bg1 from "../assets/bg-1-auth.jpg";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import clienteAxios from "../config/axios";

const Login = () => {
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

    dispatch(googleSignIn({ accessToken, navigate, toast }));
  }

  const logincongoogle = useGoogleLogin({
    onSuccess: handleGoogleLoginSuccess,
  });

  useEffect(() => {
    dispatch(setLogout());
  }, []);

  const handleChange = (e) => {
    setUserForm({
      ...userForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email === "" || password === "") {
      return toast.error("Todos los campos son obligatorios");
    }

    try {
      console.log("Enviando login con:", userForm);
      const result = await dispatch(login({ userForm, toast, navigate, rute: "/" })).unwrap();

      console.log("Login exitoso, resultado:", result);

      // Si el usuario no está confirmado, mostrar aviso y reenviar email en paralelo
      if (result && !result.confirmado) {
        toast.warning("Por favor confirma tu email para acceso completo");
        
        // Reenviar email de confirmación en paralelo (sin bloquear el login)
        try {
          await clienteAxios.post("api/usuarios/confirmar", { email });
          toast.info("Email de confirmación reenviado. Revisa tu bandeja de entrada");
        } catch (emailError) {
          console.log("Error al reenviar email:", emailError);
          toast.error("No pudimos reenviar el email. Contacta con soporte al WhatsApp 3764331313");
        }
      } else if (result.confirmado) {
        // Si está confirmado, el thunk ya navegó, pero nos aseguramos
        navigate("/", { replace: true });
      }

      setUserForm({ email: "", password: "", rol: "CLIENTE" });
    } catch (error) {
      console.error("Error en login:", error);
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Datos error:", error.response.data);
        // El servidor respondió con un status code fuera de rango 2xx
        toast.error(error.response.data.msg || "Error en el inicio de sesión");
      } else if (error.request) {
        // La solicitud fue hecha pero no se recibió una respuesta
        console.error("No se recibió una respuesta del servidor");
        toast.error("No se recibió respuesta del servidor. Verifica tu conexión.");
      } else {
        // Se produjo un error al configurar la solicitud
        console.error("Error al configurar la solicitud:", error.message);
        toast.error("Error al procesar la solicitud");
      }
    }
  };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if ([email, password].includes("")) {
  //     return toast.error("Todos los campos son obligatorios");
  //   }

  //   dispatch(login({ userForm, toast, navigate }));

  //   setUserForm({ email: "", password: "" });
  // };

  return (
    <section className="flex flex-col md:flex-row h-screen items-center">
      <div className="bg-primary hidden lg:block w-full md:w-1/2 xl:w-2/3 h-full">
        <LazyLoadImage
          src={bg1}
          alt=""
          width="100%"
          height="100%"
          className="h-full w-full object-cover"
          effect="blur"
        />
      </div>

      <div
        className="bg-white w-full md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12
            flex items-center justify-center"
      >
        <div className="w-full h-100">
          <div className="flex flex-col justify-center items-center">
            {/* <LazyLoadImage
              width="150"
              height="80"
              alt="Logo fondo trasparente"
              src="https://www.calyaan.com.co/static/media/logo.7391fed19edfcfb85f3d.png"
              effect="blur"
            /> */}
            <h1
              data-cy="title-login"
              className="text-xl md:text-2xl font-bold leading-tight"
            >
              Acceso Clientes
            </h1>
          </div>

          <form className="mt-6" onSubmit={handleSubmit}>
            <div className="mt-4">
              <label className="block text-gray-700">Correo electrónico</label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                value={email}
                placeholder="Ingresa tu dirección de correo electrónico"
                className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-bgHover focus:bg-white focus:outline-none"
                autoFocus
              />
            </div>

            <div className="mt-4">
              <label className="block text-gray-700">Contraseña</label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                value={password}
                placeholder="••••••••"
                minLength="6"
                className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-bgHover
                  focus:bg-white focus:outline-none"
              />
            </div>

            <div className="text-right mt-2">
              <Link
                to="/olvide-password"
                className="text-sm font-semibold text-gray-700 hover:text-bgHover focus:text-bgHover"
              >
                ¿Has olvidado tu contraseña?
              </Link>
            </div>

            {loading ? (
              <ButtonSpinner />
            ) : (
              <button
                type="submit"
                className="w-full block bg-primary hover:bg-bgHover focus:bg-bgHover text-white font-semibold rounded-lg
                            px-4 py-3 mt-6"
              >
                Iniciar sesión
              </button>
            )}
          </form>

          <hr className="my-6 border-gray-300 w-full" />

          <button
            onClick={logincongoogle}
            type="button"
            className="w-full block bg-white hover:bg-gray-100 focus:bg-gray-100 text-gray-900 font-semibold rounded-lg px-4 py-3 border border-gray-300"
          >
            <div className="flex items-center justify-center">
              <FcGoogle />
              <span className="ml-2">Continuar con Google</span>
            </div>
          </button>

          <p className="mt-8 text-center">
            ¿No tienes cuenta?{" "}
            <Link
              to="/registro"
              className="text-primary hover:text-bgHover font-semibold text-center"
            >
              Créate una cuenta gratis
            </Link>
          </p>
          {/* <div className="flex flex-row max-lg:flex-col max-lg:items-center">
            <div className="w-1/2  text-center max-lg:w-full ">
              <h1
                data-cy="title-login"
                className="text-xl md:text-xl font-bold leading-tight mt-4"
              >
                Acceso Profesionales
              </h1>

              <p className="mt-8 mx-5">
                <Link to="/loginProfesional">
                  <button className="w-full text-sm block bg-gray-800 hover:bg-gray-900 focus:bg-gray-900 text-white font-semibold rounded-lg px-4 py-3 mt-4">
                    Acceder al Panel
                  </button>
                </Link>
              </p>
            </div>
            <div className="w-1/2 text-center max-lg:w-full">
              <h1
                data-cy="title-login"
                className="text-xl md:text-xl font-bold leading-tight mt-8 mx-5"
              >
                Acceso Administración
              </h1>
              <p className="mt-8 mx-5">
                <Link to="/logindashboard">
                  <button className="w-full text-sm block bg-gray-800 hover:bg-gray-900 focus:bg-gray-900 text-white font-semibold rounded-lg px-4 py-3 mt-4">
                    Acceder al Panel
                  </button>
                </Link>
              </p>{" "}
            </div>
          </div> */}

          <div className="flex flex-col sm:flex-row">
            <div className="w-full sm:w-1/2">
              <h1
                data-cy="title-login"
                className="text-sm md:text-xl font-bold leading-tight mt-8 mx-5 text-center"
              >
                Acceso Profesionales
              </h1>

              <p className="mt-8 mx-5">
                <Link to="/loginProfesional">
                  <button className="w-full text-sm sm:text-base block bg-gray-800 hover:bg-gray-900 focus:bg-gray-900 text-white font-semibold rounded-lg px-4 py-3 mt-4">
                    Acceder al Panel
                  </button>
                </Link>
              </p>
            </div>
            <div className="w-full sm:w-1/2 mt-8 sm:mt-0">
              <h1
                data-cy="title-login"
                className="text-xl md:text-xl font-bold leading-tight mt-2 sm:mt-8 mx-5 text-center"
              >
                Acceso Administrador
              </h1>
              <p className="mt-4 sm:mt-8 mx-5">
                <Link to="/logindashboard">
                  <button className="w-full text-sm sm:text-base block bg-gray-800 hover:bg-gray-900 focus:bg-gray-900 text-white font-semibold rounded-lg px-4 py-3 mt-4">
                    Acceder al Panel
                  </button>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
