import React from "react";
import { AiOutlineArrowDown, AiOutlineClose } from "react-icons/ai";
import Hour from "../../professional/components/Hour";
import limpiarHorarios from "../../../../helpers/Logic/limpiarHorarios";
import limpiarHorario from "../../../../helpers/Logic/limpiarHorario";

const ModalUser = ({ handleModalView, userState }) => {
  // console.log("handleModalView", handleModalView);
  // console.log("userState", userState.horarios);
  return (
    <div className="relative z-10">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full justify-center p-4 text-center items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="flex items-start justify-between p-4 border-b rounded-t">
              <h3 className="text-xl font-semibold text-gray-900">
                Horario del usuario {userState?.nombre}
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

            <div className="p-6 space-y-4">
              {userState?.horarios?.length > 0 ? (
                userState?.horarios
                  ?.slice(userState?.horarios?.length - 5)
                  ?.map((horario) => (
                    <div className="" key={horario._id}>
                      <div className="rounded-md shadow-sm">
                        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
                          <p className="text-md font-medium text-gray-500">
                            {horario.fecha}
                          </p>
                        </div>
                      </div>

                      <div className="px-4 py-3 flex flex-wrap gap-4">
                        {horario?.horarios?.map((horarioDetalle, index) => (
                          <p
                            key={horarioDetalle._id}
                            className={`text-center text-xs font-medium flex items-center px-2.5 py-3 rounded cursor-pointer ${
                              horarioDetalle.stock
                                ? "bg-gray-100 text-gray-800 border-gray-500"
                                : "bg-red-200 text-red-700 border-red-500"
                            }`}
                          >
                            {horarioDetalle.hora}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))
              ) : (
                <p>No se tiene registro de horarios</p>
              )}
            </div>

            <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b">
              <button
                data-modal-hide="staticModal"
                type="button"
                className="text-white bg-primary hover:bg-bgHover focus:ring-4 focus:outline-none focus:ring-primary font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                onClick={handleModalView}
              >
                Confirmar
              </button>
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
  );
};

export default ModalUser;
