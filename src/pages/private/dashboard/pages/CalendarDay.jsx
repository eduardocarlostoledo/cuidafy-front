import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import clienteAxios from "../../../../config/axios";

const CalendarDay = () => {
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
  } = valueForm;

  useEffect(() => {
    const getUser = async () => {
      try {
        let { data } = await clienteAxios.get(
          `api/profesional/perfil-profesional/${id}`
        );

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

  const divv_calendar_10 = useRef(null);

  useEffect(() => {
    document.addEventListener("click", () => {
      divv_calendar_10.classList.add("hidden");
    });
  }, []);
  function show_calendar_10(el) {
    document.querySelectorAll(".calen_calendar_10").forEach((el) => {
      if (!el.classList.contains("hidden")) {
        el.classList.add("hidden");
      }
    });
    document.getElementById("div1_calendar_10").classList.toggle("hidden");
  }
  function showDate_calendar_10(el) {
    document.querySelectorAll(".calen_calendar_10").forEach((el) => {
      if (
        !el.classList.contains("hidden") &&
        el !== document.getElementById("div2_calendar_10")
      ) {
        el.classList.add("hidden");
      }
    });
    document.getElementById("div2_calendar_10").classList.toggle("hidden");
    document.getElementById("cro_calendar_10").classList.toggle("rotate-90");
  }
  function showCal_calendar_10(el) {
    document.getElementById("div3_calendar_10").classList.toggle("hidden");
    document.getElementById("croo_calendar_10").classList.toggle("rotate-90");
  }
  function showDay_calendar_10(el) {
    divv_calendar_10.classList.toggle("hidden");
  }
  return (
    <>
      <div className="container mx-auto">
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
          <div className="w-full">
            <div className="py-12 px-4 bg-gray-50">
              <div className="lg:max-w-[1140px] md:max-w-[744px] max-w-[375px]  mx-auto border  ">
                <div className=" flex justify-between items-center">
                  <div className="pl-4 lg:pt-0 md:pt-0 pt-4 ">
                    <p className="text-base font-semibold leading-none text-gray-800 py-2">
                      Feburary 15, 2023
                    </p>
                    <p className="text-sm leading-none text-gray-600 pt-2">
                      Tuesday
                    </p>
                  </div>

                  <div className="lg:hidden md:hidden block pr-3 relative">
                    <div
                      className="bg-white mt-6 min-w-[243px] lg:hidden md:hidden px-3 py-5 rounded absolute right-0 hidden shadow-lg cursor-pointer"
                      id="div1_calendar_10"
                    >
                      <div
                        onClick={(e) => {
                          showDate_calendar_10(e.target);
                        }}
                        className="flex justify-between relative"
                      >
                        <div>
                          <p className="text-sm font-medium leading-none text-gray-800 cursor-pointer">
                            Select your view
                          </p>
                        </div>
                        <div>
                          <svg
                            id="cro_calendar_10"
                            width={14}
                            height={14}
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.56721 2.59846C4.31093 2.85474 4.31093 3.27026 4.56721 3.52654L8.04067 7L4.56721 10.4735C4.31093 10.7297 4.31093 11.1453 4.56721 11.4015C4.82349 11.6578 5.23901 11.6578 5.49529 11.4015L9.43279 7.46404C9.68907 7.20776 9.68907 6.79224 9.43279 6.53596L5.49529 2.59846C5.23901 2.34218 4.82349 2.34218 4.56721 2.59846Z"
                              fill="#4B5563"
                            />
                          </svg>
                        </div>
                        <div
                          className="bg-white mt-3 py-5 px-4 rounded min-w-[243px] absolute shadow-lg -right-3 hidden"
                          id="div2_calendar_10"
                        >
                          <p className="text-sm font-medium leading-none text-gray-800 border-b pb-4 cursor-pointer">
                            Daily
                          </p>
                          <p className="text-sm font-medium leading-none text-gray-800 pt-4 border-b pb-3 cursor-pointer">
                            Weekly
                          </p>
                          <p className="text-sm font-medium leading-none text-gray-800  pt-4 cursor-pointer">
                            Monthly{" "}
                          </p>
                        </div>
                      </div>
                      <div
                        onClick={(e) => {
                          showCal_calendar_10(e.target);
                        }}
                        className="flex justify-between pt-6  "
                      >
                        <div>
                          <p className="text-sm font-medium leading-none text-gray-800 cursor-pointer">
                            Set Date
                          </p>
                        </div>
                        <div>
                          <svg
                            id="croo_calendar_10"
                            width={14}
                            height={14}
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.56721 2.59846C4.31093 2.85474 4.31093 3.27026 4.56721 3.52654L8.04067 7L4.56721 10.4735C4.31093 10.7297 4.31093 11.1453 4.56721 11.4015C4.82349 11.6578 5.23901 11.6578 5.49529 11.4015L9.43279 7.46404C9.68907 7.20776 9.68907 6.79224 9.43279 6.53596L5.49529 2.59846C5.23901 2.34218 4.82349 2.34218 4.56721 2.59846Z"
                              fill="#4B5563"
                            />
                          </svg>
                        </div>
                        <div
                          className="calen_calendar_10 pt-8 right-0 absolute top-20 hidden bg-white shadow-lg "
                          id="div3_calendar_10"
                        >
                          <div className="w-full rounded-t">
                            <div className="px-4 flex items-center justify-between w-full">
                              <div className="flex items-center justify-between gap-4 w-full">
                                <button
                                  aria-label="calendar backward"
                                  className="focus:text-gray-400 hover:text-gray-400 text-gray-800 bg-indigo-50"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="icon icon-tabler icon-tabler-chevron-left"
                                    width={24}
                                    height={24}
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path
                                      stroke="none"
                                      d="M0 0h24v24H0z"
                                      fill="none"
                                    />
                                    <polyline points="15 6 9 12 15 18" />
                                  </svg>
                                </button>
                                <span
                                  tabIndex={0}
                                  className="focus:outline-none  text-base font-bold 0 text-gray-800"
                                >
                                  Feburary 2023
                                </span>
                                <button
                                  aria-label="calendar forward"
                                  className="focus:text-gray-400 hover:text-gray-400 ml-3 text-gray-800 bg-indigo-50"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="icon icon-tabler  icon-tabler-chevron-right"
                                    width={24}
                                    height={24}
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path
                                      stroke="none"
                                      d="M0 0h24v24H0z"
                                      fill="none"
                                    />
                                    <polyline points="9 6 15 12 9 18" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            <div className="  pt-12 px-[5px] w-full">
                              <table className="w-full">
                                <thead>
                                  <tr>
                                    <th>
                                      <div className="w-full flex justify-center">
                                        <p className="text-base font-medium text-center text-gray-800 ">
                                          Su
                                        </p>
                                      </div>
                                    </th>
                                    <th>
                                      <div className="w-full flex justify-center">
                                        <p className="text-base font-medium text-center text-gray-800 ">
                                          Mo
                                        </p>
                                      </div>
                                    </th>
                                    <th>
                                      <div className="w-full flex justify-center">
                                        <p className="text-base font-medium text-center text-gray-800 ">
                                          Tu
                                        </p>
                                      </div>
                                    </th>
                                    <th>
                                      <div className="w-full flex justify-center">
                                        <p className="text-base font-medium text-center text-gray-800 ">
                                          We
                                        </p>
                                      </div>
                                    </th>
                                    <th>
                                      <div className="w-full flex justify-center">
                                        <p className="text-base font-medium text-center text-gray-800 ">
                                          Th
                                        </p>
                                      </div>
                                    </th>
                                    <th>
                                      <div className="w-full flex justify-center">
                                        <p className="text-base font-medium text-center text-gray-800 ">
                                          Fr
                                        </p>
                                      </div>
                                    </th>
                                    <th>
                                      <div className="w-full flex justify-center">
                                        <p className="text-base font-medium text-center text-gray-800 ">
                                          Sa
                                        </p>
                                      </div>
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="border">
                                  <tr className="border-b">
                                    <td className="border-r">
                                      <div className="px-3 py-2 cursor-pointer flex w-full justify-center">
                                        30
                                      </div>
                                    </td>
                                    <td className="border-r">
                                      <div className="px-3 py-2 cursor-pointer flex w-full justify-center">
                                        31
                                      </div>
                                    </td>
                                    <td className="border-r">
                                      <div className="px-3 py-2 cursor-pointer flex w-full justify-center">
                                        1
                                      </div>
                                    </td>
                                    <td className="border-r">
                                      <div className="px-3 py-2 cursor-pointer flex w-full justify-center">
                                        <p className="text-base text-gray-500  font-medium">
                                          2
                                        </p>
                                      </div>
                                    </td>
                                    <td className="border-r">
                                      <div className="px-3 py-2 cursor-pointer flex w-full justify-center">
                                        <p className="text-base text-gray-500  font-medium">
                                          3
                                        </p>
                                      </div>
                                    </td>
                                    <td className="border-r">
                                      <div className="px-3 py-2 cursor-pointer flex w-full justify-center">
                                        <p className="text-base text-gray-500 ">
                                          4
                                        </p>
                                      </div>
                                    </td>
                                    <td className>
                                      <div className="px-3 py-2 cursor-pointer flex  justify-center">
                                        <p className="text-base text-gray-500 ">
                                          5
                                        </p>
                                      </div>
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="border-r">
                                      <div className=" cursor-pointer flex justify-center">
                                        <p className="text-base text-gray-500  font-medium">
                                          6
                                        </p>
                                      </div>
                                    </td>
                                    <td className="border-r">
                                      <div className=" cursor-pointer flex  justify-center">
                                        <p className="text-base text-gray-500  font-medium">
                                          7
                                        </p>
                                      </div>
                                    </td>
                                    <td className="border-r">
                                      <div className=" cursor-pointer flex  justify-center">
                                        <p className="text-base text-gray-500  font-medium">
                                          8
                                        </p>
                                      </div>
                                    </td>
                                    <td className="border-r">
                                      <div className=" cursor-pointer flex  justify-center">
                                        <p className="text-base text-gray-500  font-medium">
                                          9
                                        </p>
                                      </div>
                                    </td>
                                    <td className="border-r">
                                      <div className="px-3 py-2 cursor-pointer flex w-full justify-center">
                                        <p className="text-base text-gray-500  font-medium">
                                          10
                                        </p>
                                      </div>
                                    </td>
                                    <td className="border-r">
                                      <div className="px-3 py-2 cursor-pointer flex w-full justify-center">
                                        <p className="text-base text-gray-500 ">
                                          11
                                        </p>
                                      </div>
                                    </td>
                                    <td className>
                                      <div className="px-3 py-2 cursor-pointer flex w-full justify-center">
                                        <p className="text-base text-gray-500 ">
                                          12
                                        </p>
                                      </div>
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="border-r">
                                      <div className="px-3 py-2 cursor-pointer flex w-full justify-center">
                                        <p className="text-base text-gray-500  font-medium">
                                          13
                                        </p>
                                      </div>
                                    </td>
                                    <td className="border-r">
                                      <div className="px-3 py-2 cursor-pointer flex w-full justify-center">
                                        <p className="text-base text-gray-500  font-medium">
                                          14
                                        </p>
                                      </div>
                                    </td>
                                    <td className="border-r">
                                      <div className=" cursor-pointer flex justify-center">
                                        <p className="text-base text-indigo-700  font-medium  bg-indigo-50 px-3 py-1 rounded">
                                          15
                                        </p>
                                      </div>
                                    </td>
                                    <td className="border-r">
                                      <div className="w-full h-full">
                                        <div className="flex items-center justify-center w-full rounded-full cursor-pointer">
                                          <p className="text-base w-8 h-8  flex items-center justify-center ">
                                            16
                                          </p>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="border-r">
                                      <div className="px-3 py-2 cursor-pointer flex w-full justify-center">
                                        <p className="text-base text-gray-500  font-medium">
                                          17
                                        </p>
                                      </div>
                                    </td>
                                    <td className="border-r">
                                      <div className="px-3 py-2 cursor-pointer flex w-full justify-center">
                                        <p className="text-base text-gray-500 ">
                                          18
                                        </p>
                                      </div>
                                    </td>
                                    <td>
                                      <div className="px-3 py-2 cursor-pointer flex w-full justify-center">
                                        <p className="text-base text-gray-500 ">
                                          19
                                        </p>
                                      </div>
                                    </td>
                                  </tr>
                                  <tr className="border-b ">
                                    <td className="border-r">
                                      <div className="px-3 py-2 cursor-pointer flex w-full justify-center">
                                        <p className="text-base text-gray-500  font-medium">
                                          20
                                        </p>
                                      </div>
                                    </td>
                                    <td className="border-r">
                                      <div className="px-3 py-2 cursor-pointer flex w-full justify-center">
                                        <p className="text-base text-gray-500  font-medium">
                                          21
                                        </p>
                                      </div>
                                    </td>
                                    <td className="border-r">
                                      <div className="px-3 py-2 cursor-pointer flex w-full justify-center">
                                        <p className="text-base text-gray-500  font-medium">
                                          22
                                        </p>
                                      </div>
                                    </td>
                                    <td className="border-r">
                                      <div className="px-3 py-2 cursor-pointer flex w-full justify-center">
                                        <p className="text-base text-gray-500  font-medium">
                                          23
                                        </p>
                                      </div>
                                    </td>
                                    <td className="border-r">
                                      <div className="px-3 py-2 cursor-pointer flex w-full justify-center">
                                        <p className="text-base text-gray-500  font-medium">
                                          24
                                        </p>
                                      </div>
                                    </td>
                                    <td className="border-r">
                                      <div className="px-3 py-2 cursor-pointer flex w-full justify-center">
                                        <p className="text-base text-gray-500 ">
                                          25
                                        </p>
                                      </div>
                                    </td>
                                    <td>
                                      <div className="px-3 py-2 cursor-pointer flex w-full justify-center">
                                        <p className="text-base text-gray-500 ">
                                          26
                                        </p>
                                      </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-r">
                                      <div className="px-3 py-2 cursor-pointer flex w-full justify-center">
                                        <p className="text-base text-gray-500  font-medium">
                                          27
                                        </p>
                                      </div>
                                    </td>
                                    <td className="border-r">
                                      <div className="px-3 py-2 cursor-pointer flex w-full justify-center">
                                        <p className="text-base text-gray-500  font-medium">
                                          28
                                        </p>
                                      </div>
                                    </td>
                                    <td className="border-r">
                                      <div className="px-3 py-2 cursor-pointer flex w-full justify-center">
                                        <p className="text-base text-gray-500  font-medium">
                                          1
                                        </p>
                                      </div>
                                    </td>
                                    <td className="border-r">
                                      <div className="px-3 py-2 cursor-pointer flex w-full justify-center">
                                        <p className="text-base text-gray-500  font-medium">
                                          2
                                        </p>
                                      </div>
                                    </td>
                                    <td className="border-r">
                                      <div className="px-3 py-2 cursor-pointer flex w-full justify-center">
                                        <p className="text-base text-gray-500  font-medium">
                                          3
                                        </p>
                                      </div>
                                    </td>
                                    <td className="border-r">
                                      <div className="px-3 py-2 cursor-pointer flex w-full justify-center">
                                        <p className="text-base text-gray-500  font-medium">
                                          4
                                        </p>
                                      </div>
                                    </td>
                                    <td className="border-r">
                                      <div className="px-3 py-2 cursor-pointer flex w-full justify-center">
                                        <p className="text-base text-gray-500  font-medium">
                                          5
                                        </p>
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between pt-6">
                        <div>
                          <p className="text-sm font-medium leading-none text-gray-800 cursor-pointer">
                            Add Event
                          </p>
                        </div>
                        <div>
                          <svg
                            width={14}
                            height={14}
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.56721 2.59846C4.31093 2.85474 4.31093 3.27026 4.56721 3.52654L8.04067 7L4.56721 10.4735C4.31093 10.7297 4.31093 11.1453 4.56721 11.4015C4.82349 11.6578 5.23901 11.6578 5.49529 11.4015L9.43279 7.46404C9.68907 7.20776 9.68907 6.79224 9.43279 6.53596L5.49529 2.59846C5.23901 2.34218 4.82349 2.34218 4.56721 2.59846Z"
                              fill="#4B5563"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                    {/*  */}
                  </div>
                </div>
                <div className="lg:hidden md:hidden block pt-3 bg-white mt-4">
                  <table>
                    <tbody>
                      <tr>
                        <th>
                          <div className="w-full flex justify-center">
                            <p className="text-base font-medium text-center text-gray-800 ">
                              Su
                            </p>
                          </div>
                        </th>
                        <th>
                          <div className="w-full flex justify-center">
                            <p className="text-base font-medium text-center text-gray-800 ">
                              Mo
                            </p>
                          </div>
                        </th>
                        <th>
                          <div className="w-full flex justify-center">
                            <p className="text-base font-medium text-center text-gray-800 ">
                              Tu
                            </p>
                          </div>
                        </th>
                        <th>
                          <div className="w-full flex justify-center">
                            <p className="text-base font-medium text-center text-gray-800 ">
                              We
                            </p>
                          </div>
                        </th>
                        <th>
                          <div className="w-full flex justify-center">
                            <p className="text-base font-medium text-center text-gray-800 ">
                              Th
                            </p>
                          </div>
                        </th>
                        <th>
                          <div className="w-full flex justify-center">
                            <p className="text-base font-medium text-center text-gray-800 ">
                              Fr
                            </p>
                          </div>
                        </th>
                        <th>
                          <div className="w-full flex justify-center">
                            <p className="text-base font-medium text-center text-gray-800 ">
                              Sa
                            </p>
                          </div>
                        </th>
                      </tr>
                      <tr className="border-b">
                        <td className>
                          <div className="px-3 py-2 cursor-pointer flex w-full justify-center">
                            <p className="text-base text-gray-500  font-medium">
                              13
                            </p>
                          </div>
                        </td>
                        <td className>
                          <div className="px-3 py-2 cursor-pointer flex w-full justify-center">
                            <p className="text-base text-gray-500  font-medium">
                              14
                            </p>
                          </div>
                        </td>
                        <td className>
                          <div className="px-3 py-2 cursor-pointer flex w-full justify-center">
                            <p className="text-base text-indigo-700  font-medium  bg-indigo-50 px-3 py-1 rounded">
                              15
                            </p>
                          </div>
                        </td>
                        <td className>
                          <div className="w-full h-full">
                            <div className="flex items-center justify-center w-full rounded-full cursor-pointer">
                              <p className="text-base w-8 h-8  flex items-center justify-center ">
                                16
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className>
                          <div className="px-3 py-2 cursor-pointer flex w-full justify-center">
                            <p className="text-base text-gray-500  font-medium">
                              17
                            </p>
                          </div>
                        </td>
                        <td className>
                          <div className="px-3 py-2 cursor-pointer flex w-full justify-center">
                            <p className="text-base text-gray-500 ">18</p>
                          </div>
                        </td>
                        <td>
                          <div className="px-3 py-2 cursor-pointer flex w-full justify-center">
                            <p className="text-base text-gray-500 ">19</p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="bg-white py-5 px-3  lg:mt-3 md:mt-4 mt-4">
                  <div className="lg:flex justify-between gap-6  md:block  block pt-2">
                    <div className="flex-col  flex-1">
                      <div className="w-full flex items-center -mt-3 pt-8">
                        <p>5AM</p>
                        <div className="border ml-3 w-full  min- h-40 bg-cyan-50 ">
                          <div className=" w-full  rounded px-7 p-3">
                            <p className="text-xs leading-3 text-green-600">
                              05:00 am
                            </p>
                            <p className="text-xs font-semibold leading-3 text-green-600 pt-2">
                              Gym
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="pt-3 flex items-center -mt-3">
                        <p>6AM</p>
                        <div className="border ml-3 w-full  h-40">
                          <div className=" px-7 p-3 "></div>
                        </div>
                      </div>
                      <div className="pt-3 flex items-center -mt-3">
                        <p>7AM</p>
                        <div className="border w-full  h-40  bg-pink-50 rounded ml-3">
                          <div className="  px-7 p-3 ">
                            <p className="text-xs leading-3 text-pink-700">
                              07:00 am
                            </p>
                            <p className="text-xs font-semibold leading-3 text-pink-700 pt-2">
                              Meeting with clint
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="pt-3 flex items-center -mt-3">
                        <p>8AM</p>
                        <div className="border ml-3 w-full  h-40 ">
                          <div className="  px-7 p-3 "></div>
                        </div>
                      </div>
                      <div>
                        <div className="pt-3 flex items-center -mt-6 ">
                          <p>9AM</p>
                          <div className="border w-full  h-40  bg-[#FAF5FF] ml-3">
                            <div className=" px-7 p-3 ">
                              <p className="text-xs leading-3 text-purple-700">
                                09:00 am
                              </p>
                              <p className="text-xs font-semibold leading-3 text-purple-700 pt-2">
                                Office Trip
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="pt-3 flex items-center -mt-3">
                          <p>10AM</p>
                          <div className="border w-full  h-40  -mt-4bg-[#FAF5FF] ml-1">
                            <div className=" px-7 p-3 "></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className=" pt-8 lg:block md:block hidden">
                      <div className="  rounded-t lg:max-w-[383px] mx-auto md:w-full">
                        <div className="px-4 flex items-center justify-between">
                          <div className="flex items-center justify-between lg:gap-20 md:gap-56 md:mx-auto">
                            <button
                              aria-label="calendar backward"
                              className="focus:text-gray-400 hover:text-gray-400 text-gray-800 bg-indigo-50"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="icon icon-tabler icon-tabler-chevron-left"
                                width={24}
                                height={24}
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path
                                  stroke="none"
                                  d="M0 0h24v24H0z"
                                  fill="none"
                                />
                                <polyline points="15 6 9 12 15 18" />
                              </svg>
                            </button>
                            <span
                              tabIndex={0}
                              className="focus:outline-none  text-base font-bold 0 text-gray-800"
                            >
                              Feburary 2023
                            </span>
                            <button
                              aria-label="calendar forward"
                              className="focus:text-gray-400 hover:text-gray-400 ml-3 text-gray-800 bg-indigo-50"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="icon icon-tabler  icon-tabler-chevron-right"
                                width={24}
                                height={24}
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path
                                  stroke="none"
                                  d="M0 0h24v24H0z"
                                  fill="none"
                                />
                                <polyline points="9 6 15 12 9 18" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div className="  pt-12">
                          <table className="md:w-full">
                            <thead>
                              <tr>
                                <th>
                                  <div className="w-full flex justify-center">
                                    <p className="text-base font-medium text-center text-gray-800 ">
                                      Su
                                    </p>
                                  </div>
                                </th>
                                <th>
                                  <div className="w-full flex justify-center">
                                    <p className="text-base font-medium text-center text-gray-800 ">
                                      Mo
                                    </p>
                                  </div>
                                </th>
                                <th>
                                  <div className="w-full flex justify-center">
                                    <p className="text-base font-medium text-center text-gray-800 ">
                                      Tu
                                    </p>
                                  </div>
                                </th>
                                <th>
                                  <div className="w-full flex justify-center">
                                    <p className="text-base font-medium text-center text-gray-800 ">
                                      We
                                    </p>
                                  </div>
                                </th>
                                <th>
                                  <div className="w-full flex justify-center">
                                    <p className="text-base font-medium text-center text-gray-800 ">
                                      Th
                                    </p>
                                  </div>
                                </th>
                                <th>
                                  <div className="w-full flex justify-center">
                                    <p className="text-base font-medium text-center text-gray-800 ">
                                      Fr
                                    </p>
                                  </div>
                                </th>
                                <th>
                                  <div className="w-full flex justify-center">
                                    <p className="text-base font-medium text-center text-gray-800 ">
                                      Sa
                                    </p>
                                  </div>
                                </th>
                              </tr>
                            </thead>
                            <tbody className="border">
                              <tr className="border-b">
                                <td className="border-r">
                                  <div className="px-4 py-2 cursor-pointer flex w-full justify-center">
                                    30
                                  </div>
                                </td>
                                <td className="border-r">
                                  <div className="px-4 py-2 cursor-pointer flex w-full justify-center">
                                    31
                                  </div>
                                </td>
                                <td className="border-r">
                                  <div className="px-4 py-2 cursor-pointer flex w-full justify-center">
                                    1
                                  </div>
                                </td>
                                <td className="border-r">
                                  <div className="px-4 py-2 cursor-pointer flex w-full justify-center">
                                    <p className="text-base text-gray-500  font-medium">
                                      2
                                    </p>
                                  </div>
                                </td>
                                <td className="border-r">
                                  <div className="px-4 py-2 cursor-pointer flex w-full justify-center">
                                    <p className="text-base text-gray-500  font-medium">
                                      3
                                    </p>
                                  </div>
                                </td>
                                <td className="border-r">
                                  <div className="px-4 py-2 cursor-pointer flex w-full justify-center">
                                    <p className="text-base text-gray-500 ">
                                      4
                                    </p>
                                  </div>
                                </td>
                                <td className>
                                  <div className="px-4 py-2 cursor-pointer flex  justify-center">
                                    <p className="text-base text-gray-500 ">
                                      5
                                    </p>
                                  </div>
                                </td>
                              </tr>
                              <tr className="border-b">
                                <td className="border-r">
                                  <div className=" cursor-pointer flex justify-center">
                                    <p className="text-base text-gray-500  font-medium">
                                      6
                                    </p>
                                  </div>
                                </td>
                                <td className="border-r">
                                  <div className=" cursor-pointer flex  justify-center">
                                    <p className="text-base text-gray-500  font-medium">
                                      7
                                    </p>
                                  </div>
                                </td>
                                <td className="border-r">
                                  <div className=" cursor-pointer flex  justify-center">
                                    <p className="text-base text-gray-500  font-medium">
                                      8
                                    </p>
                                  </div>
                                </td>
                                <td className="border-r">
                                  <div className=" cursor-pointer flex  justify-center">
                                    <p className="text-base text-gray-500  font-medium">
                                      9
                                    </p>
                                  </div>
                                </td>
                                <td className="border-r">
                                  <div className="px-4 py-2 cursor-pointer flex w-full justify-center">
                                    <p className="text-base text-gray-500  font-medium">
                                      10
                                    </p>
                                  </div>
                                </td>
                                <td className="border-r">
                                  <div className="px-4 py-2 cursor-pointer flex w-full justify-center">
                                    <p className="text-base text-gray-500 ">
                                      11
                                    </p>
                                  </div>
                                </td>
                                <td className>
                                  <div className="px-4 py-2 cursor-pointer flex w-full justify-center">
                                    <p className="text-base text-gray-500 ">
                                      12
                                    </p>
                                  </div>
                                </td>
                              </tr>
                              <tr className="border-b">
                                <td className="border-r">
                                  <div className="px-4 py-2 cursor-pointer flex w-full justify-center">
                                    <p className="text-base text-gray-500  font-medium">
                                      13
                                    </p>
                                  </div>
                                </td>
                                <td className="border-r">
                                  <div className="px-4 py-2 cursor-pointer flex w-full justify-center">
                                    <p className="text-base text-gray-500  font-medium">
                                      14
                                    </p>
                                  </div>
                                </td>
                                <td className="border-r">
                                  <div className=" cursor-pointer flex justify-center">
                                    <p className="text-base text-indigo-700  font-medium  bg-indigo-50 px-4 py-1 rounded">
                                      15
                                    </p>
                                  </div>
                                </td>
                                <td className="border-r">
                                  <div className="w-full h-full">
                                    <div className="flex items-center justify-center w-full rounded-full cursor-pointer">
                                      <p className="text-base w-8 h-8  flex items-center justify-center ">
                                        16
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className="border-r">
                                  <div className="px-4 py-2 cursor-pointer flex w-full justify-center">
                                    <p className="text-base text-gray-500  font-medium">
                                      17
                                    </p>
                                  </div>
                                </td>
                                <td className="border-r">
                                  <div className="px-4 py-2 cursor-pointer flex w-full justify-center">
                                    <p className="text-base text-gray-500 ">
                                      18
                                    </p>
                                  </div>
                                </td>
                                <td>
                                  <div className="px-4 py-2 cursor-pointer flex w-full justify-center">
                                    <p className="text-base text-gray-500 ">
                                      19
                                    </p>
                                  </div>
                                </td>
                              </tr>
                              <tr className="border-b ">
                                <td className="border-r">
                                  <div className="px-4 py-2 cursor-pointer flex w-full justify-center">
                                    <p className="text-base text-gray-500  font-medium">
                                      20
                                    </p>
                                  </div>
                                </td>
                                <td className="border-r">
                                  <div className="px-4 py-2 cursor-pointer flex w-full justify-center">
                                    <p className="text-base text-gray-500  font-medium">
                                      21
                                    </p>
                                  </div>
                                </td>
                                <td className="border-r">
                                  <div className="px-4 py-2 cursor-pointer flex w-full justify-center">
                                    <p className="text-base text-gray-500  font-medium">
                                      22
                                    </p>
                                  </div>
                                </td>
                                <td className="border-r">
                                  <div className="px-4 py-2 cursor-pointer flex w-full justify-center">
                                    <p className="text-base text-gray-500  font-medium">
                                      23
                                    </p>
                                  </div>
                                </td>
                                <td className="border-r">
                                  <div className="px-4 py-2 cursor-pointer flex w-full justify-center">
                                    <p className="text-base text-gray-500  font-medium">
                                      24
                                    </p>
                                  </div>
                                </td>
                                <td className="border-r">
                                  <div className="px-4 py-2 cursor-pointer flex w-full justify-center">
                                    <p className="text-base text-gray-500 ">
                                      25
                                    </p>
                                  </div>
                                </td>
                                <td>
                                  <div className="px-4 py-2 cursor-pointer flex w-full justify-center">
                                    <p className="text-base text-gray-500 ">
                                      26
                                    </p>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-r">
                                  <div className="px-4 py-2 cursor-pointer flex w-full justify-center">
                                    <p className="text-base text-gray-500  font-medium">
                                      27
                                    </p>
                                  </div>
                                </td>
                                <td className="border-r">
                                  <div className="px-4 py-2 cursor-pointer flex w-full justify-center">
                                    <p className="text-base text-gray-500  font-medium">
                                      28
                                    </p>
                                  </div>
                                </td>
                                <td className="border-r">
                                  <div className="px-4 py-2 cursor-pointer flex w-full justify-center">
                                    <p className="text-base text-gray-500  font-medium">
                                      1
                                    </p>
                                  </div>
                                </td>
                                <td className="border-r">
                                  <div className="px-4 py-2 cursor-pointer flex w-full justify-center">
                                    <p className="text-base text-gray-500  font-medium">
                                      2
                                    </p>
                                  </div>
                                </td>
                                <td className="border-r">
                                  <div className="px-4 py-2 cursor-pointer flex w-full justify-center">
                                    <p className="text-base text-gray-500  font-medium">
                                      3
                                    </p>
                                  </div>
                                </td>
                                <td className="border-r">
                                  <div className="px-4 py-2 cursor-pointer flex w-full justify-center">
                                    <p className="text-base text-gray-500  font-medium">
                                      4
                                    </p>
                                  </div>
                                </td>
                                <td className="border-r">
                                  <div className="px-4 py-2 cursor-pointer flex w-full justify-center">
                                    <p className="text-base text-gray-500  font-medium">
                                      5
                                    </p>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <style>
              {`
              @media (min-width:400px) {
                .calen{
                width: 365px;
                }
            }`}
            </style>
          </div>
        </div>
      </div>
    </>
  );
};

export default CalendarDay;
