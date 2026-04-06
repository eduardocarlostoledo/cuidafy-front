import React, { useState } from "react";
import { AiFillCaretLeft, AiOutlineArrowDown } from "react-icons/ai";
import { BsCalendarDate } from "react-icons/bs";
import { FaHandSparkles } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

import ScheduleByDateForm from "../../components/ScheduleByDateForm";
import ScheduleByProfessionalForm from "../../components/ScheduleByProfessionalForm";
// import { localidades } from "../../data";
import { localidadesLaborales } from "../../data";

const Reservation = () => {
  window.scrollTo(0, 0);
  const [formProfessional, setFormProfessional] = useState(false);

  const navigate = useNavigate();

  const [localidad, setLocalidad] = useState("");

  const handleOption = (link) => {
    localStorage.setItem("localidad", localidad);
    navigate(link);
  };

  return (
    <>
      <div className="mx-auto max-lg:my-8 p-8 flex gap-4 3xl:gap-8 bg-whitefull-screen flex-wrap items-center justify-center ">
        <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6 w-4/5 max-lg:w-screen max-lg:shadow-xl">
          <div>
            <h3 className="mb-2 text-lg font-semibold text-center leading-none text-gray-900">
              Agenda tu reserva
            </h3>
          </div>

          <div className="container mx-auto">
            <p className="text-center my-4">
              Para mejorar tu experiencia proporciónanos la localidad a la cual
              quieres el servicio
            </p>
            <div className="flex justify-center">
              <div className="relative">
                <select
                  className="appearance-none  bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white max-md:w-full focus:border-gray-500"
                  name="localidad"
                  id="localidad"
                  onChange={(e) => setLocalidad(e.target.value)}
                  value={localidad}
                >
                  <option value="">Localidad</option>
                  {localidadesLaborales.map((localidad, index) => (
                    // <option key={index} value={localidad.split(" ")[1]}>
                    <option key={index} value={localidad}>
                      {localidad}
                    </option>
                  ))}
                </select>

                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <AiOutlineArrowDown className="fill-current h-4 w-4" />
                </div>
              </div>
            </div>

            {/* <p className="text-center my-4">Tenemos dos opciones para ti</p> */}

            <div style={{ backgroundColor: "rgb(255, 255, 255)" }}>
              <div className="grid grid-cols-1 gap-4  cursor-pointer">
                {/* <button
                  onClick={() => handleOption("/reserva/fecha")}
                  disabled={localidad ? false : true}
                  className={`p-6 bg-gray-100 rounded-lg text-center  ${
                    !localidad && "disabled:opacity-40"
                  }`}
                >
                  <div className="mb-5">
                    <BsCalendarDate className="hi-outline hi-template inline-block w-12 h-12 text-primary" />
                  </div>

                  <h3 className="text-lg font-bold mb-2">
                    1. Selecciona por fecha
                  </h3>

                  <p className="text-sm leading-6 text-gray-600">
                    Se te dispondrá las profesionales que estén disponibles en
                    la fecha y hora que selecciones.
                  </p>
                </button> */}

                <button
                  onClick={() => handleOption("/reserva/profesional")}
                  // disabled={localidad ? false : true}
                  className={`p-6 bg-gray-100 w-3/4 mx-auto  max-lg:w-full rounded-lg text-center mt-5  ${
                    !localidad && "hidden"
                  }`}
                >
                  <div className="mb-5">
                    <FaHandSparkles className="hi-outline hi-template inline-block w-12 h-12 text-primary" />
                  </div>

                  <h3 className="text-lg font-bold mb-2">
                    Selecciona Nuestr@s Profesionales
                  </h3>

                  <p className="text-sm leading-6 text-gray-600">
                    Podrás seleccionar la profesional de tu preferencia.
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reservation;
