import React, { useEffect, useState } from "react";
import { BsPersonCircle } from "react-icons/bs";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import clienteAxios from "../../../../config/axios";
import HistoryTableCustomer from "../components/HistoryTableCustomer";
import HistoryTableProfessional from "../components/HistoryTableProfessional";

const HistoryScheduledProfessional = () => {
  const { id } = useParams();

  const [valueForm, setValueForm] = useState({
    nombre: "",
    apellido: "",
    sexo: "",
    email: "",
    telefono: "",
    direccionDefault: "",
    direcciones: "",
    cedula: "",
    reviews: 0,
    reservas: [],
    estado: "",
    ultimaConexion: "",
    img: "",
    ciudad: "",
    profesional: "",
  });

  const {
    nombre,
    apellido,
    sexo,
    email,
    telefono,
    ciudad,
    direccionDefault,
    direcciones,
    cedula,
    reviews,
    reservas,
    estado,
    confirmado,
    ultimaConexion,
    img,
    profesional,
  } = valueForm;

  useEffect(() => {
    const getUser = async () => {
      try {
        let { data } = await clienteAxios.get(`api/usuarios/perfil/${id}`);

        setValueForm({ ...valueForm, ...data });
      } catch (err) {
        let error = err.response.data.msg
          ? err.response.data.msg
          : err.response && "Estamos presentando problemas internos";
        return toast.error(error);
      }
    };
    getUser();
  }, [id]);

  // console.log(valueForm)

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white  shadow rounded xl:flex lg:flex w-full">
        <div className="xl:w-2/5 lg:w-2/5 bg-white  py-8 border-gray-300  xl:border-r rounded-tl xl:rounded-bl rounded-tr xl:rounded-tr-none lg:border-r-2 border-b xl:border-b-0 flex justify-center items-center">
          <div className="flex flex-col items-center">
            <div className="h-24 w-24 rounded-full mb-3">
              {img ? (
                <img
                  className="h-full w-full object-cover rounded-full shadow"
                  src={img}
                  alt="Imagen de usuario"
                />
              ) : (
                <img
                  className="h-full w-full object-cover rounded-full shadow"
                  src="https://t3.ftcdn.net/jpg/03/58/90/78/360_F_358907879_Vdu96gF4XVhjCZxN2kCG0THTsSQi8IhT.jpg"
                  alt="Imagen de usuario"
                />
              )}
            </div>
            <p className="mb-2 text-lg font-bold text-gray-900 ">
              {nombre} {apellido}
            </p>
            <p className="mb-6 text-sm text-gray-700 ">
              {email}
            </p>
            <button className="bg-whatsapp font-medium transition duration-150 ease-in-out  rounded text-white px-6 py-2 text-sm border border-gray-300  focus:outline-none">
              Enviar mensaje
            </button>
            <Link
              to={`/dashboard/perfil-profesional/${id}`}
              className="bg-white font-medium transition duration-150 ease-in-out mt-2 hover:bg-gray-200 rounded text-gray-800 px-6 py-2 text-sm border border-gray-300  focus:outline-none"
            >
              Volver a perfil
            </Link>
          </div>
        </div>
        <div className="xl:w-3/5 lg:w-3/5 px-6 py-8">
          <div className="flex flex-wrap justify-between">
            <div className="w-2/5 mb-8">
              <div className="border-b pb-3">
                <p className="mb-2 text-sm text-gray-700  font-medium">
                  Teléfono
                </p>
                <p className="text-sm text-gray-700 ">
                  {telefono}
                </p>
              </div>
            </div>
            <div className="w-2/5 mb-8">
              <div className="border-b pb-3">
                <p className="mb-2 text-sm text-gray-700  font-medium">
                  Sexo
                </p>
                <p className="text-sm text-gray-700 ">
                  {sexo}
                </p>
              </div>
            </div>
            <div className="w-2/5 mb-8">
              <div className="border-b pb-3">
                <p className="mb-2 text-sm text-gray-700  font-medium">
                  Ciudad
                </p>
                <p className="text-sm text-gray-700 ">
                  {ciudad}
                </p>
              </div>
            </div>
            <div className="w-2/5 mb-8">
              <div className="border-b pb-3">
                <p className="mb-2 text-sm text-gray-700  font-medium">
                  Cédula
                </p>
                <p className="text-sm text-gray-700 ">
                  {cedula}
                </p>
              </div>
            </div>
            <div className="w-2/5">
              <div className="border-b pb-3">
                <p className="mb-2 text-sm text-gray-700  font-medium">
                  Última conexión
                </p>
                <p className="text-sm text-gray-700 ">
                  {ultimaConexion?.split("T")[0]} -{" "}
                  {ultimaConexion?.split("T")[1]?.slice(0, 5)}
                </p>
              </div>
            </div>
            <div className="w-2/5">
              <div className="border-b pb-3">
                <p className="mb-2 text-sm text-gray-700  font-medium">
                  Estado
                </p>
                <p className="text-sm text-gray-700 ">
                  {estado ? "Cuenta Verificada" : "Cuenta Sin Verificada"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <HistoryTableProfessional id={profesional} />
    </div>
  );
};

export default HistoryScheduledProfessional;
