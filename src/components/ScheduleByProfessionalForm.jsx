import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import clienteAxios from "../config/axios";
import limpiarHorarios from "../helpers/Logic/limpiarHorarios";
import Spinner from "./Spinner";
import swal from "sweetalert";
import RecomendationCards from "./RecomendationCards";
import { BiLinkExternal } from "react-icons/bi";

const ScheduleByProfessionalForm = () => {
  const [inputValue, setInputValue] = useState({
    address: "",
    date: "",
    time: "",
  });

  localStorage.setItem("DateService", JSON.stringify(inputValue));

  const [pagar, setPagar] = useState(false);
  const [profesional, setProfesional] = useState({});
  const [cargando, setCargando] = useState(false);
  const [selectCard, setSelectCard] = useState(false);
  const [profesionalesRequest, setProfesionalesRequest] = useState([]);
  const [hourSelect, setHoursSelect] = useState([]);

  // contempla el dia y la hora de la reserva
  const validateTime = (selectedTime) => {
    const diaReserva = inputValue.date;
    const [year, month, day] = diaReserva.split("-").map(Number);
    const diaReservaDate = new Date(year, month - 1, day);

    const horaReserva = selectedTime;

    const [selectedHours, selectedMinutes] = horaReserva.split(":").map(Number);
    const horaReservaDate = new Date(diaReservaDate);
    horaReservaDate.setHours(selectedHours);
    horaReservaDate.setMinutes(selectedMinutes);

    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 4); //Agregamos intervalo de anticipacion para la reserva

    return horaReservaDate >= currentTime;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setInputValue((prevState) => ({
      ...prevState,
      [name]: value,
      localidadServicio: localStorage.getItem("localidad"),
    }));

    if (name === "time") {
      const [startTime] = value.split("-"); // Obtener el valor de inicio de la hora
      // console.log("startTime", startTime);
      const isValidTime = validateTime(startTime);
      setPagar(isValidTime);
      if (isValidTime) {
        swal("¡Bien!", "Ahora al Siguiente Paso", "success");
      } else {
        swal("¡Error!", "Se requieren al menos 5hrs de anticipación", "error");
        setHoursSelect([]);
        setProfesional({});
        setSelectCard(false);
      }
    }
  };

  const handleProfesional = (profesional) => {
    const updatedArray = profesionalesRequest.map((obj) =>
      obj._id === profesional._id
        ? { ...obj, styles: true }
        : { ...obj, styles: false }
    );

    setProfesionalesRequest(updatedArray);
    setProfesional(profesional);
    setHoursSelect(limpiarHorarios(profesional.horarios));
    swal("¡Bien!", "Profesional seleccionado, elige la Hora", "success");
    window.scrollTo(0, 0);
  };

  const handleSubmitProfessional = () => {
    localStorage.setItem(
      "ProfessionalService",
      JSON.stringify({ profesional_id: profesional.creador._id })
    );
  };

  useEffect(() => {
    const obtenerUsuarios = async () => {
      setCargando(true);

      try {
        const services = JSON.parse(localStorage.getItem("services")) || [];
        const nombre = services[0]?.nombre || "";
        const localidad = localStorage.getItem("localidad") || "";

        // Verificar si los datos son inválidos, nulos o no definidos
        if (!inputValue.date || !nombre) {
          // console.log("Datos inválidos o no definidos");
          setCargando(false);
          return;
        }

        const { data } = await clienteAxios.post(
          "api/reservas/profesionales/fecha",
          {
            fecha: inputValue.date,
            especialidad: [nombre],
            localidad,
          }
        );

        if (data?.length > 0) {
          // Filtrar objetos con creador distinto de null y con teléfono definido
          const filteredData = data.filter(
            (obj) =>
              obj.creador !== null &&
              obj.creador !== undefined &&
              obj.creador?.creador?.telefono !== null &&
              obj.creador?.creador?.telefono !== undefined &&
              obj.creador?.creador?.img !== null &&
              obj.creador?.creador?.img !== undefined &&
              obj.horarios.some((horario) => horario.stock === true)
          );
          const updatedArray = filteredData.map((obj) => ({
            ...obj,
            styles: false,
          }));
          if (!selectCard) {
            if (filteredData.length > 0 || updatedArray.length > 0) {
              swal({
                title: "Información encontrada",
                text: "Se encontraron resultados",
                type: "success",
                timer: 2000, // Tiempo en milisegundos
                showConfirmButton: false,
              });
            } else {
              swal({
                title: "No se encontró información",
                text: "No se encontraron resultados",
                type: "info",
                timer: 2000, // Tiempo en milisegundos
                showConfirmButton: false,
              });
            }
          }

          setProfesionalesRequest(updatedArray);
        } else {
          setProfesionalesRequest(data);
        }
        setCargando(false);
      } catch (err) {
        console.log(err);
      }
    };

    obtenerUsuarios();
  }, [inputValue.date]);
  const { date, time } = inputValue;

  return (
    <>
      <div className="mx-auto max-lg:my-8 p-8 flex gap-4 3xl:gap-8 bg-whitefull-screen flex-wrap items-center justify-center">
        <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6 w-4/5 max-lg:w-screen">
          <div>
            <h3 className="mb-10 text-lg font-bold text-center leading-none text-gray-900">
              Agenda tu reserva por profesional
            </h3>
          </div>
          <form className="text-center">
            <h4 className="mb-4 mx-auto font-medium leading-none text-gray-900">
              Selecciona fecha y hora para tu reserva
            </h4>
            <div className="grid gap-4 grid-cols-1 mb-4 ">
              {!profesional._id && (
                <div>
                  <label
                    htmlFor="date"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Fecha
                  </label>
                  <input
                    type="date"
                    name="date"
                    id="date"
                    onChange={handleChange}
                    className="bg-gray-50 border m-auto border-gray-300  text-gray-900 text-sm rounded-lg focus:ring-bgHover focus:border-bgHover block w-96 max-lg:w-48 p-2.5"
                    placeholder="username.example"
                    required=""
                  />
                </div>
              )}

              {date && !selectCard && (
                <div className="mx-auto mt-6 flex w-full bg-whitefull-screen flex-wrap items-center justify-around">
                  {!cargando ? (
                    profesionalesRequest.length > 0 ? (
                      profesionalesRequest.map((profesionalMap) => (
                        <div
                          key={profesionalMap._id}
                          className={`w-full max-w-sm rounded-lg shadow-md ${
                            profesionalMap.styles
                              ? "bg-gray-100 border border-gray-200"
                              : ""
                          }`}
                        >
                          <div className="flex flex-col items-center p-6 max-lg:my-3">
                            <img
                              className="w-24 h-24 mb-3 rounded-full shadow-lg"
                              src={
                                profesionalMap.creador?.creador.img ||
                                "https://t3.ftcdn.net/jpg/03/58/90/78/360_F_358907879_Vdu96gF4XVhjCZxN2kCG0THTsSQi8IhT.jpg"
                              }
                              alt=""
                            />
                            <h5 className="mb-1 text-xl font-medium text-gray-900">
                              {profesionalMap.creador?.creador.nombre}
                            </h5>
                            <span className="text-sm text-gray-500 text-center">
                              {profesionalMap.creador?.descripcion}
                            </span>
                            <div className="flex mt-4 space-x-3 md:mt-6">
                              <div
                                onClick={() =>
                                  handleProfesional(profesionalMap)
                                }
                                className={`inline-flex items-center px-4 py-2 text-sm font-medium text-center cursor-pointer text-white bg-primary rounded-lg hover:bg-bgHover focus:ring-4 focus:outline-none focus:ring-bgHover ${
                                  hourSelect.length > 0 && "hidden"
                                }`}
                              >
                                Seleccionar
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <>
                        <p className="text-xl font-normal text-center">
                          No encontramos profesionales con disponibilidad para
                          la fecha indicada, no te preocupes 😉, agenda mediante
                          alguna de nuestras asesoras mediante
                          <a
                            href="https://web.whatsapp.com/send/?phone=543764331313&text&type=phone_number&app_absent=0"
                            className="ml-1 text-whatsapp"
                            target="_blank" rel="noopener noreferrer"

                          >
                            Whatsapp.
                            <BiLinkExternal style={{ display: "inline" }} />
                          </a>
                        </p>
                      </>
                    )
                  ) : (
                    <Spinner />
                  )}
                </div>
              )}

              {hourSelect.length > 0 && (
                <div>
                  <label
                    htmlFor="time"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Hora
                  </label>
                  <select
                    name="time"
                    id="time"
                    onChange={handleChange}
                    className="bg-gray-50 border m-auto border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-bgHover focus:border-bgHover block w-96 max-lg:w-48 p-2.5"
                    required=""
                  >
                    <option value="">Horas</option>
                    {hourSelect.map((hour, index) => (
                      <option key={index} value={hour}>
                        {hour}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </form>
          {pagar && time && (
            <div className="flex items-center">
              <Link
                onClick={handleSubmitProfessional}
                to="/pago"
                className="text-white mt-4 mx-auto bg-primary hover:bg-bgHover focus:ring-4 focus:outline-none focus:ring-bgHover font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-40 max-lg:w-3/4 max-sm:w-full"
              >
                Siguiente paso: información de pago
              </Link>
            </div>
          )}
        </div>
      </div>
      {!profesional._id && (
        <RecomendationCards
          // profesional={profesional}
          // setProfesional={setProfesional}
          // setProfesionalesRequest={setProfesionalesRequest}
          // profesionalesRequest={profesionalesRequest}
          // limpiarHorarios={limpiarHorarios}
          // setHoursSelect={setHoursSelect}
          handleProfesional={handleProfesional}
          setInputValue={setInputValue}
          inputValue={inputValue}
          setSelectCard={setSelectCard}
        />
      )}
    </>
  );
};

export default ScheduleByProfessionalForm;
