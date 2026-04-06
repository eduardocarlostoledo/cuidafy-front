import React from "react";

import { AiOutlineArrowDown, AiOutlineClose } from "react-icons/ai";

import Profile from "../../../../assets/profile.png";
import { Link } from "react-router-dom";

const LinksPerfiles = {
  CLIENTE: "/dashboard/perfil-cliente",
  ADMIN: "/dashboard/perfil-admin",
  PROFESIONAL: "/dashboard/perfil-profesional",
};

const ModalUserInfo = ({ handleModalView, userState }) => {
  // console.log(userState);

  return (
    <div className="relative z-10">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full justify-center p-4 text-center items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="flex items-start justify-between p-4 border-b rounded-t">
              <h3 className="text-xl font-semibold text-gray-900">
                Información del usuario {userState.nombre}
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-cente"
                data-modal-hide="staticModal"
                onClick={handleModalView}
              >
                <AiOutlineClose className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              <div className="">
                <div className="flex items-center justify-center">
                  <div className="w-40 h-40 bg-gray-100 rounded-md flex items-center justify-center">
                    <img
                      src="https://t3.ftcdn.net/jpg/03/58/90/78/360_F_358907879_Vdu96gF4XVhjCZxN2kCG0THTsSQi8IhT.jpg"
                      className="w-full h-full"
                    />
                  </div>
                </div>
                <form className="mt-11">
                  <div className="flex items-center space-x-9">
                    <div className="flex flex-col w-1/2">
                      <label className="text-xs font-semibold leading-3 text-gray-800 ">
                        {" "}
                        Nombre{" "}
                      </label>
                      <input
                        value={`${userState?.nombre} ${userState?.apellido}`}
                        placeholder="Nombre"
                        disabled={true}
                        className="text-xs font-medium leading-3 text-gray-500 resize-none bg-gray-50 border rounded-lg border-gray-200  focus:outline-none px-4 py-3 mt-2"
                      />
                    </div>
                    <div className="flex flex-col w-1/2">
                      <label className="text-xs font-semibold leading-3 text-gray-800 ">
                        {" "}
                        Cédula{" "}
                      </label>
                      <input
                        value={`${userState?.cedula ? userState?.cedula : ""}`}
                        placeholder="Cédula"
                        disabled={true}
                        className="text-xs font-medium leading-3 text-gray-500  resize-none bg-gray-50  border rounded-lg border-gray-200  focus:outline-none px-4 py-3 mt-2"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-9 mt-8">
                    <div className="flex flex-col w-1/2">
                      <label className="text-xs font-semibold leading-3 text-gray-800 ">
                        {" "}
                        Email{" "}
                      </label>
                      <input
                        value={`${userState?.email}`}
                        placeholder="Email"
                        disabled={true}
                        className="text-xs font-medium leading-3 text-gray-500  resize-none bg-gray-50  border rounded-lg border-gray-200  focus:outline-none px-4 py-3 mt-2"
                      />
                    </div>
                    <div className="flex flex-col w-1/2">
                      <label className="text-xs font-semibold leading-3 text-gray-800 ">
                        {" "}
                        Ciudad{" "}
                      </label>
                      <input
                        value={`${userState?.ciudad}`}
                        placeholder="Bogota"
                        disabled={true}
                        className="text-xs font-medium leading-3 text-gray-500  resize-none bg-gray-50 border rounded-lg border-gray-200 focus:outline-none px-4 py-3 mt-2"
                      />
                    </div>
                  </div>
                </form>
              </div>
              <div className="flex items-center py-6 space-x-2 border-t border-gray-200 rounded-b">
                <button
                  data-modal-hide="staticModal"
                  type="button"
                  className="text-white bg-primary hover:bg-bgHover focus:ring-4 focus:outline-none focus:ring-primary font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  onClick={handleModalView}
                >
                  Confirmar
                </button>
                <Link
                  to={`${LinksPerfiles[userState.rol]}/${userState._id}`}
                  type="button"
                  className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10"
                >
                  Ver perfil
                </Link>
                <button
                  data-modal-hide="staticModal"
                  type="button"
                  className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10"
                  onClick={handleModalView}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalUserInfo;
