import React, { useEffect, useState } from "react";
import ButtonSpinner from "./ButtonSpinner";

import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteError, updateInformation } from "../redux/features/authSlice";
import clienteAxios from "../config/axios";
import { localidades } from "../data";

import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import swal from "sweetalert";

const FormUpdateSettings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => ({ ...state.auth }));

  const [direcciones, setDirecciones] = useState([]);

  const [valueForm, setValueForm] = useState({
    nombre: "",
    apellido: "",
    sexo: "",
    email: "",
    telefono: "",
    direccionDefault: "",
    cedula: "",
  });
  //console.log(valueForm);
  const { nombre, apellido, sexo, email, telefono, direccionDefault, cedula } =
    valueForm;

  useEffect(() => {
    const getUser = async () => {
      try {
        let { data } = await clienteAxios.get("api/usuarios/perfil");

        setValueForm({ ...valueForm, ...data });
      } catch (err) {
        let error = err.response.data.msg
          ? err.response.data.msg
          : err.response && "Estamos presentando problemas internos";
        return toast.error(error);
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    const getUser = async () => {
      try {
        let { data } = await clienteAxios.get("api/usuarios/direcciones");
        setDirecciones([...data]);
      } catch (err) {
        let error = err.response.data.msg
          ? err.response.data.msg
          : err.response && "Estamos presentando problemas internos";
        return toast.error(error);
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    error && toast.error(error);
    dispatch(deleteError());
  }, [error]);

  const handleChange = (e) => {
    setValueForm({
      ...valueForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangePhone = (telefono) => {
    setValueForm({
      ...valueForm,
      telefono,
    });
  };

  const notificacion = () => {
    if (direcciones?.length <= 0) {
      return swal({
        title:
          "Gracias por tus datos. Para brindarte la mejor atención, agrega tu dirección",
        icon: "success",
        type: "success",
        customClass: {
          title: "text-center", // Clase CSS para centrar el título
        },
        buttons: {
          continueEditing: {
            text: "Agendar mi dirección",
            value: "goToAgendar",
          },
          goToService: {
            text: "Volver al hub de cuidado",
            value: "goToService",
          },
        },
      }).then((value) => {
        if (value === "goToService") {
          navigate("/encontrar-cuidado");
        }
        if (value === "goToAgendar") {
          navigate("/direcciones");
        }
      });
    }
    return swal({
      title: "",
      icon: "success",
      text: "Información actualizada",
      type: "success",
      buttons: {
        continueEditing: {
          text: "Continuar editando",
          value: "continue",
        },
        goToService: {
          text: "Volver al hub de cuidado",
          value: "goToService",
        },
      },
    }).then((value) => {
      if (value === "goToService") {
        navigate("/encontrar-cuidado");
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      [nombre, apellido, email, telefono].includes("") ||
      telefono.toString().length < 6
    ) {
      return toast.error(
        "Los campos nombres,apellidos,teléfono,sexo y correo electrónico son obligatorios"
      );
    }

    dispatch(updateInformation({ valueForm, notificacion }));
  };

  return (
    <form
      className="grid gap-4 gap-y-3 text-sm grid-cols-1 md:grid-cols-5"
      onSubmit={handleSubmit}
    >
      <div className="md:col-span-2 w-full">
        <label htmlFor="nombres">Nombres</label>
        <input
          type="text"
          name="nombre"
          id="nombres"
          value={nombre}
          onChange={handleChange}
          className="h-10 border mt-1 rounded px-4 w-full bg-gray-200 focus:border-bgHover focus:bg-white focus:outline-none"
          placeholder="Nombres"
        />
      </div>

      <div className="md:col-span-2">
        <label htmlFor="apellidos">Apellidos</label>
        <input
          type="text"
          name="apellido"
          id="apellidos"
          value={apellido}
          onChange={handleChange}
          className="h-10 border mt-1 rounded px-4 w-full bg-gray-200 focus:border-bgHover focus:bg-white focus:outline-none"
          placeholder="Apellidos"
        />
      </div>

      <div className="md:col-span-1">
        <label
          htmlFor="sexo"
          className="block mb-1 text-sm font-medium text-gray-900"
        >
          Seleccione
        </label>
        <select
          id="sexo"
          className="border border-gray-300 text-gray-900 text-sm rounded-lg bg-gray-200 focus:border-bgHover focus:bg-white focus:outline-none  block w-full p-2.5"
          value={sexo}
          onChange={handleChange}
          name="sexo"
        >
          <option value="" disabled>
            Sexo
          </option>
          <option value="Masculino">Masculino</option>
          <option value="Femenino">Femenino</option>
          <option value="Otro">Otro</option>
        </select>
      </div>

      <div className="md:col-span-3">
        <label htmlFor="email">Correo electrónico</label>
        <input
          type="text"
          name="email"
          id="email"
          value={email}
          onChange={handleChange}
          className="h-10 border mt-1 rounded px-4 w-full bg-gray-200 focus:border-bgHover focus:bg-white focus:outline-none"
          placeholder="Correo electrónico"
        />
      </div>

      <div className="md:col-span-2">
        <label htmlFor="telefono">Teléfono</label>

        <PhoneInput
          international
          countryCallingCodeEditable={false}
          defaultCountry="AR"
          name="telefono"
          className="h-10 border mt-1 rounded px-4 w-full bg-gray-200 focus:border-bgHover focus:bg-white focus:outline-none"
          value={telefono}
          onChange={handleChangePhone}
        />

        {/*         <input
          type="number"
          name="telefono"
          id="telefono"
          value={telefono}
          onChange={handleChange}
          className="h-10 border mt-1 rounded px-4 w-full bg-gray-200 focus:border-bgHover focus:bg-white focus:outline-none"
          placeholder="Teléfono"
        /> */}
      </div>

      <div className="md:col-span-2">
        <label htmlFor="cedula">Cédula</label>
        <input
          type="number"
          name="cedula"
          id="cedula"
          value={cedula}
          onChange={handleChange}
          className="h-10 border mt-1 rounded px-4 w-full bg-gray-200 focus:border-bgHover focus:bg-white focus:outline-none"
          placeholder="Cédula"
        />
      </div>

      {direcciones.length <= 0 ? (
        <div className="md:col-span-3 mt-8">
          <Link
            to="/direcciones"
            className="bg-primary hover:bg-bgHover text-white font-bold py-3 px-6 rounded mt-6 w-full"
          >
            Crea una nueva dirección
          </Link>
        </div>
      ) : (
        <div className="md:col-span-3">
          <label htmlFor="direccion">Dirección</label>
          <select
            id="direccionDefault"
            className="border border-gray-300 text-gray-900 text-sm rounded-lg bg-gray-200 focus:border-bgHover focus:bg-white focus:outline-none block w-full p-3"
            value={direccionDefault}
            onChange={handleChange}
            name="direccionDefault"
          >
            {direcciones?.map((direccion) => (
              <option value={direccion._id} key={direccion._id}>
                {direccion.nombre}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="md:col-span-5 text-right">
        <div className="inline-flex items-end">
          {loading ? (
            <ButtonSpinner />
          ) : (
            <button className="bg-primary hover:bg-bgHover text-white font-bold py-3 px-6 rounded mt-6">
              Actualizar
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default FormUpdateSettings;
