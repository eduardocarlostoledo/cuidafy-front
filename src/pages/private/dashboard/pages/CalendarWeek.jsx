import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import clienteAxios from "../../../../config/axios";

const CalendarWeek = () => {

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
        let { data } = await clienteAxios.get(`api/profesional/perfil-profesional/${id}`);

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

  const divv_calendar_12 = useRef(null);

  useEffect(() => {
    document.addEventListener("click", () => {
      divv_calendar_12.current.classList.add("hidden");
    });
  }, []);
  function show_calendar_12(el) {
    document.querySelectorAll(".calen_calendar_12").forEach((el) => {
      if (!el.classList.contains("hidden")) {
        el.classList.add("hidden");
      }
    });
    document.getElementById("div1_calendar_12").classList.toggle("hidden");
  }
  function showDate_calendar_12(el) {
    document.querySelectorAll(".calen_calendar_12").forEach((el) => {
      if (
        !el.classList.contains("hidden") &&
        el !== document.getElementById("div2_calendar_12")
      ) {
        el.classList.add("hidden");
      }
    });
    document.getElementById("div2_calendar_12").classList.toggle("hidden");
    document.getElementById("cro_calendar_12").classList.toggle("rotate-90");
  }
  function showCal_calendar_12(el) {
    document.getElementById("div3_calendar_12").classList.toggle("hidden");
    document.getElementById("croo_calendar_12").classList.toggle("rotate-90");
  }

  function showDay_calendar_12(el) {
    divv_calendar_12.current.classList.toggle("hidden");
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
          <div className="py-12 px-4 bg-gray-50 w-full">
            <div className="lg:max-w-[1440px] md:max-w-[744px] max-w-[375px] mx-auto">
              <div className="lg:max-w-[1124px] md:max-w-[696px] max-w-[343px] mx-auto border rounded">
                <div className=" flex justify-center items-center py-3">

                  Semana 
                 
                </div>
                {/*  */}
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
                <div>
                  <div className="lg:block md:block hidden">
                    <table className="w-full mt-4  ">
                      <thead className="cursor-pointer">
                        <tr className="border">
                          <td className="xl:w-[56px] lg:w-[40px] w-[56px] pointer-events-none" />
                          <td className="text-center  xl:w-[163px] lg:w-[114px] w-[99px] text-sm text-gray-600 font-normal border">
                            <div className="hover:border-indigo-700 hover:bg-indigo-50 border">
                              Su <span className="font-bold">11</span>
                            </div>
                          </td>
                          <td className="text-center  xl:w-[148px] lg:w-[80px] w-[90px] text-sm text-gray-600 font-normal">
                            <div className="hover:border-indigo-700 hover:bg-indigo-50 border">
                              Mon <span className="font-bold">12</span>
                            </div>
                          </td>
                          <td className="text-center  xl:w-[148px] lg:w-[115px] w-[90px]  text-sm text-gray-600 font-normal">
                            <div className="hover:border-indigo-700 hover:bg-indigo-50 border">
                              Tue <span className="font-bold">13</span>
                            </div>
                          </td>
                          <td className="text-center  xl:w-[148px] lg:w-[80px] w-[90px] text-sm text-gray-600 font-normal">
                            <div className="hover:border-indigo-700 hover:bg-indigo-50 border">
                              Wed <span className="font-bold">14</span>
                            </div>
                          </td>
                          <td className="text-center  xl:w-[148px] lg:w-[90px] w-[85px]  text-sm text-gray-600 font-normal">
                            <div className="hover:border-indigo-700 hover:bg-indigo-50 border">
                              Thus <span className="font-bold">15</span>
                            </div>
                          </td>
                          <td className="text-center  xl:w-[148px] lg:w-[110px] w-[95px] text-sm text-gray-600 font-normal">
                            <div className="hover:border-indigo-700 hover:bg-indigo-50 border">
                              Fri <span className="font-bold">16</span>
                            </div>
                          </td>
                          <td className="text-center  xl:w-[148px] lg:w-[80px] w-[90px] text-sm text-gray-600 font-normal">
                            <div className="hover:border-indigo-700 hover:bg-indigo-50 border">
                              Sat <span className="font-bold">17</span>
                            </div>
                          </td>
                        </tr>
                      </thead>
                    </table>
                  </div>
                  <div className="lg:hidden md:hidden block ">
                    <div className="flex-col  flex-1 bg-white border-t border-gray-300">
                      <div className=" w-full flex items-center -mt-3 pt-8">
                        <p className="px-2">5AM</p>
                        <div className="border ml-3 w-full   h-40 bg-cyan-50 ">
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
                        <p className="px-2">6AM</p>
                        <div className="border ml-3 w-full  h-40">
                          <div className="  m-3 px-7 p-3 "></div>
                        </div>
                      </div>
                      <div className="pt-3 flex items-center -mt-3">
                        <p className="px-2">7AM</p>
                        <div className="border w-full  h-40  bg-pink-50 rounded ml-3">
                          <div className="  px-7 p-3 m-3">
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
                        <p className="px-2">8AM</p>
                        <div className="border ml-3 w-full  h-40 ">
                          <div className=" m-3 px-7 p-3 "></div>
                        </div>
                      </div>
                      <div>
                        <div className="pt-3 flex items-center -mt-3 ">
                          <p className="px-2">9AM</p>
                          <div className="border w-full  h-40   ml-3">
                            <div className=" px-7 p-3 "></div>
                          </div>
                        </div>
                        <div className="pt-3 flex items-center -mt-3">
                          <p className="px-2">10AM</p>
                          <div className="border w-full  h-40     ml-1">
                            <div className=" px-7 p-3 "></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="lg:block md:block hidden">
                    <div className="flex ">
                      <div className="bg-white">
                        <p className="pt-20 px-2">5PM</p>
                        <p className="pt-32 px-2">6PM</p>
                        <p className="pt-32 px-2">7PM</p>
                        <p className="pt-32 px-2">8PM</p>
                        <p className="pt-32 px-2">9PM</p>
                        <p className="pt-32 px-2">10PM</p>
                      </div>
                      <table className="bg-white pl-24">
                        <tbody>
                          <tr>
                            <th></th>
                          </tr>
                        </tbody>
                        <tbody className>
                          <tr>
                            <td className="lg:w-40 md:w-24 h-20 border-l border-b"></td>
                            <td className="lg:w-40 md:w-24 h-20  border-l  border-b"></td>
                            <td>
                              <div className="lg:w-40 md:w-24 h-20 border-l border-r border-b  ">
                                <div className="bg-cyan-50 mx-2 h-full rounded">
                                  <p className="text-xs leading-3 text-green-600 px-2 pt-2 pb-2">
                                    05:00 am
                                  </p>
                                  <p className="text-xs font-semibold leading-3 text-green-600 px-2 py-2">
                                    Gym
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="lg:w-40 md:w-24 h-20  border-b "></td>
                            <td className="lg:w-40 md:w-24 h-20 border-l  border-b"></td>
                            <td className="lg:w-40 md:w-24 h-20 border-l border-r  border-b"></td>
                            <td className="lg:w-40 md:w-24 h-20  border-r  border-b"></td>
                          </tr>
                          <tr>
                            <td className="lg:w-40 md:w-24 h-20 border-l border-b"></td>
                            <td className="lg:w-40 md:w-24 h-20  border-l  border-b"></td>
                            <td className>
                              <div className="lg:w-40 md:w-24 h-24 border-l pb-1 border-r border-b ">
                                <div className="bg-cyan-50 mx-2 h-full  -mt-2 " />
                              </div>
                            </td>
                            <td className="lg:w-40 md:w-24 h-20   border-b"></td>
                            <td className="lg:w-40 md:w-24 h-20 border-l  border-b"></td>
                            <td className="lg:w-40 md:w-24 h-20 border-l border-r  border-b"></td>
                            <td className="lg:w-40 md:w-24 h-20  border-r  border-b"></td>
                          </tr>
                          <tr>
                            <td className="lg:w-40 md:w-24 h-20 border-l border-b"></td>
                            <td className="lg:w-40 md:w-24 h-20  border-l  border-b"></td>
                            <td className="lg:w-40 md:w-24 h-20 border-l border-r border-b "></td>
                            <td className="lg:w-40 md:w-24 h-20  border-b"></td>
                            <td className="lg:w-40 md:w-24 h-20 border-l  border-b"></td>
                            <td className="lg:w-40 md:w-24 h-20 border-l border-r  border-b"></td>
                            <td className="lg:w-40 md:w-24 h-20  border-r  border-b"></td>
                          </tr>
                          <tr>
                            <td className="lg:w-40 md:w-24 h-20 border-l border-b"></td>
                            <td className="lg:w-40 md:w-24 h-20  border-l  border-b"></td>
                            <td className="lg:w-40 md:w-24 h-20 border-l border-r  border-b "></td>
                            <td className="lg:w-40 md:w-24 h-20  border-b"></td>
                            <td className="lg:w-40 md:w-24 h-20 border-l  border-b"></td>
                            <td className=" ">
                              <div className="lg:w-40 md:w-24 h-20 border-l border-r  border-b ">
                                <div className="bg-[#FAF5FF] h-full mx-2  rounded">
                                  <p className="text-xs leading-3 text-green-600 px-2 pt-2">
                                    07:00 am
                                  </p>
                                  <p className="text-xs font-semibold leading-3 text-green-600 px-2 py-2">
                                    Office
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="lg:w-40 md:w-24 h-20  border-r  border-b"></td>
                          </tr>
                          <tr>
                            <td className="lg:w-40 md:w-24 h-20 border-l border-b"></td>
                            <td className="lg:w-40 md:w-24 h-20  border-l  border-b"></td>
                            <td className=" ">
                              <div className="lg:w-40 md:w-24 h-20 border-l border-r  border-b ">
                                <div className="bg-pink-50 h-full mx-2  rounded">
                                  <p className="text-xs leading-3 text-pink-700 px-2 pt-2">
                                    08:00 am
                                  </p>
                                  <p className="text-xs font-semibold leading-3 text-pink-700 px-2 py-2">
                                    Office Meeting
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="lg:w-40 md:w-24 h-20   border-b"></td>
                            <td className="lg:w-40 md:w-24 h-20 border-l  border-b"></td>
                            <td className>
                              <div className="lg:w-40 md:w-24 h-24 border-l pb-1 border-r  border-b ">
                                <div className="bg-[#FAF5FF] mx-2 h-full  -mt-2 " />
                              </div>
                            </td>
                            <td className="lg:w-40 md:w-24 h-20  border-r  border-b"></td>
                          </tr>
                          <tr>
                            <td className="lg:w-40 md:w-24 h-20 border-l border-b"></td>
                            <td className="lg:w-40 md:w-24 h-20  border-l  border-b"></td>
                            <td className>
                              <div className="lg:w-40 md:w-24 h-24 border-l pb-1 border-r  border-b ">
                                <div className="bg-pink-50 mx-2 h-full  -mt-2 " />
                              </div>
                            </td>
                            <td className="lg:w-40 md:w-24 h-20   border-b"></td>
                            <td className="lg:w-40 md:w-24 h-20 border-l  border-b"></td>
                            <td className>
                              <div className="lg:w-40 md:w-24 h-24 border-l pb-1 border-r  border-b ">
                                <div className="bg-[#FAF5FF] mx-2 h-full  -mt-2 " />
                              </div>
                            </td>
                            <td className="lg:w-40 md:w-24 h-20  border-r  border-b"></td>
                          </tr>
                          <tr>
                            <td className="lg:w-40 md:w-24 h-20 border-l border-b"></td>
                            <td className="lg:w-40 md:w-24 h-20  border-l  border-b"></td>
                            <td className>
                              <div className="lg:w-40 md:w-24 h-24 border-l pb-1 border-r  border-b ">
                                <div className="bg-pink-50 mx-2 h-full  -mt-2 " />
                              </div>
                            </td>
                            <td className="lg:w-40 md:w-24 h-20 border-b"></td>
                            <td className="lg:w-40 md:w-24 h-20 border-l  border-b"></td>
                            <td className>
                              <div className="lg:w-40 md:w-24 h-24 border-l pb-1 border-r  border-b ">
                                <div className="bg-[#FAF5FF] mx-2 h-full  -mt-2 " />
                              </div>
                            </td>
                            <td className="lg:w-40 md:w-24 h-20  border-r  border-b"></td>
                          </tr>
                          <tr>
                            <td className="lg:w-40 md:w-24 h-20 border-l border-b"></td>
                            <td className="lg:w-40 md:w-24 h-20  border-l  border-b"></td>
                            <td className>
                              <div className="lg:w-40 md:w-24 h-24 border-l pb-1 border-r  border-b ">
                                <div className="bg-pink-50 mx-2 h-full  -mt-2 " />
                              </div>
                            </td>
                            <td className="lg:w-40 md:w-24 h-20   border-b"></td>
                            <td className="lg:w-40 md:w-24 h-20 border-l  border-b"></td>
                            <td className>
                              <div className="lg:w-40 md:w-24 h-24 border-l pb-1 border-r  border-b ">
                                <div className="bg-[#FAF5FF] mx-2 h-full  -mt-2 " />
                              </div>
                            </td>
                            <td className="lg:w-40 md:w-24 h-20  border-r  border-b"></td>
                          </tr>
                          <tr>
                            <td className="lg:w-40 md:w-24 h-20 border-l border-b"></td>
                            <td className="lg:w-40 md:w-24 h-20  border-l  border-b"></td>
                            <td className>
                              <div className="lg:w-40 md:w-24 h-24 border-l pb-1 border-r  border-b ">
                                <div className="bg-pink-50 mx-2 h-full  -mt-2 " />
                              </div>
                            </td>
                            <td className="lg:w-40 md:w-24 h-20  border-b"></td>
                            <td className="lg:w-40 md:w-24 h-20 border-l  border-b "></td>
                            <td className>
                              <div className="lg:w-40 md:w-24 h-24 border-l pb-1 border-r  border-b ">
                                <div className="bg-[#FAF5FF] mx-2 h-full  -mt-2 " />
                              </div>
                            </td>
                            <td className="lg:w-40 md:w-24 h-20  border-r  border-b"></td>
                          </tr>
                          <tr>
                            <td>
                              <div className="lg:w-40 md:w-24 h-20 border-l border-b  ">
                                <div className="bg-gray-100 h-full mx-2 rounded">
                                  <p className="text-xs leading-3 line-through text-gray-500 px-2 ">
                                    09:30 am
                                  </p>
                                  <p className="text-xs font-semibold leading-3 line-through text-gray-500 px-2 ">
                                    Doctor’s visit
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="lg:w-40 md:w-24 h-20  border-l  border-b"></td>
                            <td className>
                              <div className="lg:w-40 md:w-24 h-24 border-l pb-1 border-r  border-b ">
                                <div className="bg-pink-50 mx-2 h-full  -mt-2 " />
                              </div>
                            </td>
                            <td className="lg:w-40 md:w-24 h-20  border-b"></td>
                            <td className="lg:w-40 md:w-24 h-20 border-l  border-b"></td>
                            <td className>
                              <div className="lg:w-40 md:w-24 h-24 border-l pb-1 border-r  border-b ">
                                <div className="bg-[#FAF5FF] mx-2 h-full -mt-2 " />
                              </div>
                            </td>
                            <td className="lg:w-40 md:w-24 h-20  border-r  border-b"></td>
                          </tr>
                          <tr>
                            <td className>
                              <div className="lg:w-40 md:w-24 h-24 border-l pb-1  border-b ">
                                <div className="bg-gray-100 mx-2 h-full  -mt-2 " />
                              </div>
                            </td>
                            <td className="lg:w-40 md:w-24 h-20  border-l  border-b"></td>
                            <td>
                              <div className="lg:w-40 md:w-24 h-20 border-l border-r   border-b "></div>
                            </td>
                            <td className="lg:w-40 md:w-24 h-20  border-b"></td>
                            <td className="lg:w-40 md:w-24 h-20 border-l  border-b"></td>
                            <td className>
                              <div className="lg:w-40 md:w-24 h-24 border-l pb-1 border-r  border-b ">
                                <div className="bg-[#FAF5FF] mx-2 h-full rounded -mt-2 " />
                              </div>
                            </td>
                            <td className="lg:w-40 md:w-24 h-20  border-r  border-b"></td>
                          </tr>
                          <tr>
                            <td className="lg:w-40 md:w-24 h-24 border-l border-b">
                              <div className="-mt-2"></div>
                            </td>
                            <td className="lg:w-40 md:w-24 h-20  border-l  border-b"></td>
                            <td>
                              <div className="lg:w-40 md:w-24 h-24 border-l border-r  border-b "></div>
                            </td>
                            <td className="lg:w-40 md:w-24 h-24  border-b"></td>
                            <td className="lg:w-40 md:w-24 h-24 border-l  border-b"></td>
                            <td className="lg:w-40 md:w-24 h-24 border-l border-r  border-b "></td>
                            <td className="lg:w-40 md:w-24 h-24  border-r  border-b"></td>
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
      </div>
    </>
  );
};

export default CalendarWeek;
