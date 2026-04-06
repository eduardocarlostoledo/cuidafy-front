import React from "react";
import { BsPersonCircle } from "react-icons/bs";
import { IoMdExit } from "react-icons/io";
import { RxMagnifyingGlass } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setLogout } from "../../../../redux/features/authSlice";
import { useNavigate } from "react-router-dom";

const Header = () => {  
  const { user } = useSelector((state) => ({ ...state.auth }));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    dispatch(setLogout());
    navigate("/");
  };

  return (
    <header className="header bg-white shadow py-4 px-4">
      <div className="header-content flex items-center flex-row">
        <form action="#">
          <div className="hidden md:flex relative">
            {/* <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
              <RxMagnifyingGlass className="h-6 w-6" />
            </div> */}

            {/* <input
              id="search"
              type="text"
              name="search"
              className="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-300 w-full h-10 focus:outline-none focus:border-indigo-400"
              placeholder="Buscar página..."
            /> */}
          </div>
          <div className="flex md:hidden">
            <a
              href="#"
              className="flex items-center justify-center h-10 w-10 border-transparent"
            >
              <svg
                className="h-6 w-6 text-gray-500"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </a>
          </div>
        </form>
        <div className="flex ml-auto">
          <div className="flex flex-row items-center">
            <Link to="/ajustes">
              {user?.img ? (
                <img
                  className="w-full h-full rounded-full"
                  src={user?.img}
                  alt="Imagen de usuario"
                />
              ) : (
                <BsPersonCircle className="w-9 h-9 text-gray-300" />
              )}
            </Link>
            <span className="flex flex-col ml-2">
              <span className="truncate w-20 font-semibold tracking-wide leading-none">
                {user?.nombre}
              </span>
              <span className="truncate w-20 text-gray-500 text-xs leading-none mt-1">
                {user?.rol}
              </span>
            </span>
            <button
              onClick={logout}
              className="mx-2 my-2 bg-red-700 transition duration-150 ease-in-out hover:bg-red-600 rounded text-white px-4 py-2 text-xs"
            >
              Cerrar Sesion
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
