import React from "react";

import { Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "../../../../redux/features/authSlice";

import { LazyLoadImage } from "react-lazy-load-image-component";

import { AiOutlineLink, AiOutlineSchedule } from "react-icons/ai";
import { BiHomeAlt } from "react-icons/bi";
import { HiOutlineSparkles, HiOutlineUsers } from "react-icons/hi";
import { VscTools } from "react-icons/vsc";
import { RiAdminLine, RiSettings3Line, RiUserStarLine } from "react-icons/ri";
import { GiHealing } from "react-icons/gi";
import { FaRegCalendarAlt, FaTools } from "react-icons/fa";
import { SiContactlesspayment, SiMercedes } from "react-icons/si";
import { MdOutlinePayment } from "react-icons/md";
import { BiShoppingBag } from "react-icons/bi";

const Sidebar = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => ({ ...state.auth }));

  const logout = () => {
    dispatch(setLogout());
  };

  return (
    <aside className="sidebar w-64 md:shadow transform -translate-x-full md:translate-x-0 transition-transform duration-150 ease-in bg-indigo-500">
      <div className="flex items-center justify-center py-4">
        <div className=" flex flex-col flex-auto flex-shrink-0 antialiased bg-gray-50 text-gray-800">
          <div className="fixed flex flex-col top-0 left-0 w-64 bg-white h-full border-r">
            <div className="flex items-center justify-center h-14 mt-6 ">
              <Link to="/servicio">
                <LazyLoadImage
                  effect="blur"
                  width="150"
                  height="14"
                  alt="Logo fondo trasparente"
                  //src="https://www.calyaan.com.co/static/media/logo.7391fed19edfcfb85f3d.png"
                />
              </Link>
            </div>
            <div className="overflow-y-auto overflow-x-hidden flex-grow">
              <ul className="flex flex-col py-4 space-y-1">
                <li className="px-5">
                  <div className="flex flex-row items-center h-8">
                    <div className="text-sm font-light tracking-wide text-gray-500">
                      Menu
                    </div>
                  </div>
                </li>
                <li>
                  <Link
                    to="/dashboard"
                    className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6"
                  >
                    <span className="inline-flex justify-center items-center ml-4">
                      <BiHomeAlt className="w-5 h-5" />
                    </span>
                    <p className="ml-2 text-sm tracking-wide truncate">
                      Dashboard
                    </p>
                  </Link>
                </li>

                <li>
                  <Link
                    to="/herramientas"
                    className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6"
                  >
                    <span className="inline-flex justify-center items-center ml-4">
                      <VscTools className="w-5 h-5" />
                    </span>
                    <p className="ml-2 text-sm tracking-wide truncate">
                      Herramientas
                    </p>
                  </Link>
                </li>

                <li className="px-5">
                  <div className="flex flex-row items-center h-8">
                    <div className="text-sm font-light tracking-wide text-gray-500">
                      Usuarios
                    </div>
                  </div>
                </li>

                <li>
                  <Link
                    to="/usuarios"
                    className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6"
                  >
                    <span className="inline-flex justify-center items-center ml-4">
                      <HiOutlineUsers className="w-5 h-5" />
                    </span>
                    <p className="ml-2 text-sm tracking-wide truncate">
                      Usuarios
                    </p>
                    {/* <span className="px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-green-500 bg-green-50 rounded-full">15</span> */}
                  </Link>
                </li>

                <li>
                  <Link
                    to="/clientes"
                    className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6"
                  >
                    <span className="inline-flex justify-center items-center ml-4">
                      <RiUserStarLine className="w-5 h-5" />
                    </span>
                    <p className="ml-2 text-sm tracking-wide truncate">
                      Clientes
                    </p>
                  </Link>
                </li>

                <li>
                  <Link
                    to="/profesionales"
                    className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6"
                  >
                    <span className="inline-flex justify-center items-center ml-4">
                      <HiOutlineSparkles className="w-5 h-5" />
                    </span>
                    <p className="ml-2 text-sm tracking-wide truncate">
                      Profesionales
                    </p>
                  </Link>
                </li>

                <li>
                  <Link
                    to="/administradores"
                    className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6"
                  >
                    <span className="inline-flex justify-center items-center ml-4">
                      <RiAdminLine className="w-5 h-5" />
                    </span>
                    <p className="ml-2 text-sm tracking-wide truncate">
                      Administradores
                    </p>
                  </Link>
                </li>

                <li className="px-5">
                  <div className="flex flex-row items-center h-8">
                    <div className="text-sm font-light tracking-wide text-gray-500">
                      Horarios
                    </div>
                  </div>
                </li>

                <li>
                  <Link
                    to="horarios-usuarios"
                    className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6"
                  >
                    <span className="inline-flex justify-center items-center ml-4">
                      <AiOutlineSchedule className="w-5 h-5" />
                    </span>
                    <p className="ml-2 text-sm tracking-wide truncate">
                      Horarios
                    </p>
                    {/* <span className="px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-green-500 bg-green-50 rounded-full">15</span> */}
                  </Link>
                </li>
                <li>
                  <Link
                    to="horarios-profesionales"
                    className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6"
                  >
                    <span className="inline-flex justify-center items-center ml-4">
                      <AiOutlineSchedule className="w-5 h-5" />
                    </span>
                    <p className="ml-2 text-sm tracking-wide truncate">
                      Disponibilidades
                    </p>
                    {/* <span className="px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-green-500 bg-green-50 rounded-full">15</span> */}
                  </Link>
                </li>

                <li className="px-5">
                  <div className="flex flex-row items-center h-8">
                    <div className="text-sm font-light tracking-wide text-gray-500">
                      Reservas
                    </div>
                  </div>
                </li>

                <li>
                  <Link
                    to="reservas"
                    className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6"
                  >
                    <span className="inline-flex justify-center items-center ml-4">
                      <GiHealing className="w-5 h-5" />
                    </span>
                    <p className="ml-2 text-sm tracking-wide truncate">
                      Reservas
                    </p>
                    {/* <span className="px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-green-500 bg-green-50 rounded-full">15</span> */}
                  </Link>
                </li>

                <li>
                  <Link
                    to="calendario-reservas"
                    className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6"
                  >
                    <span className="inline-flex justify-center items-center ml-4">
                      <FaRegCalendarAlt className="w-5 h-5" />
                    </span>
                    <p className="ml-2 text-sm tracking-wide truncate">
                      Calendario
                    </p>
                  </Link>
                </li>

                <li className="px-5">
                  <div className="flex flex-row items-center h-8">
                    <div className="text-sm font-light tracking-wide text-gray-500">
                      Productos
                    </div>
                  </div>
                </li>

                <li>
                  <Link
                    to="/productos"
                    className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6"
                  >
                    <span className="inline-flex justify-center items-center ml-4">
                      <BiShoppingBag className="w-5 h-5" />
                    </span>
                    <p className="ml-2 text-sm tracking-wide truncate">
                      Gestión de Productos
                    </p>
                  </Link>
                </li>

                <li>
                  <Link
                    to="/set-productos"
                    className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6"
                  >
                    <span className="inline-flex justify-center items-center ml-4">
                      <BiShoppingBag className="w-5 h-5" />
                    </span>
                    <p className="ml-2 text-sm tracking-wide truncate">
                      Configurar Productos
                    </p>
                  </Link>
                </li>

                <li className="px-5">
                  <div className="flex flex-row items-center h-8">
                    <div className="text-sm font-light tracking-wide text-gray-500">
                      Transacciones
                    </div>
                  </div>
                </li>

                <li>
                  <Link
                    to="/ordenesantdesing"
                    className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6"
                  >
                    <span className="inline-flex justify-center items-center ml-4">
                      <SiContactlesspayment className="w-5 h-5" />
                    </span>
                    <p className="ml-2 text-sm tracking-wide truncate">
                      Ordenes
                    </p>
                    {/* <span className="px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-green-500 bg-green-50 rounded-full">
                      15
                    </span> */}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/facturacionantdesing"
                    className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6"
                  >
                    <span className="inline-flex justify-center items-center ml-4">
                      <SiContactlesspayment className="w-5 h-5" />
                    </span>
                    <p className="ml-2 text-sm tracking-wide truncate">
                      Facturacion
                    </p>
                    {/* <span className="px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-green-500 bg-green-50 rounded-full">15</span> */}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/liquidacionantdesing"
                    className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6"
                  >
                    <span className="inline-flex justify-center items-center ml-4">
                      <SiContactlesspayment className="w-5 h-5" />
                    </span>
                    <p className="ml-2 text-sm tracking-wide truncate">
                      Liquidacion
                    </p>
                    {/* <span className="px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-green-500 bg-green-50 rounded-full">15</span> */}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/liquidacionestotales"
                    className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6"
                  >
                    <span className="inline-flex justify-center items-center ml-4">
                      <SiContactlesspayment className="w-5 h-5" />
                    </span>
                    <p className="ml-2 text-sm tracking-wide truncate">
                      Liquidaciones totales
                    </p>{" "}
                    {/* <span className="px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-green-500 bg-green-50 rounded-full">
                      15
                    </span> */}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/logs"
                    className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6"
                  >
                    <span className="inline-flex justify-center items-center ml-4">
                      <SiContactlesspayment className="w-5 h-5" />
                    </span>
                    <p className="ml-2 text-sm tracking-wide truncate">
                      Logs
                    </p>{" "}                    
                  </Link>                  
                </li>

              </ul>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
