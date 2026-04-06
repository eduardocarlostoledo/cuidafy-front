import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import clienteAxios from "../../../../../config/axios";
import limpiarHorarios from "../../../../../helpers/Logic/limpiarHorarios";
import Spinner from "../../../../../components/Spinner";
import swal from "sweetalert";
import { toast } from "react-toastify";

const ScheduleProfessional = ({
  loadingLiberar,
  nombreServicio,
  localidadServicio,
  reserva,
  setReserva,
  id,
  guardarReserva,
}) => {
  const [inputValue, setInputValue] = useState({
    address: "",
    date: "",
    time: "",
  });

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
      localidadServicio: localidadServicio,
    }));

    if (name === "time") {
      const [startTime] = value.split("-"); // Obtener el valor de inicio de la hora
      // console.log("startTime", startTime);

      // const isValidTime = validateTime(startTime); //se comenta la linea para quitar el control del tiempo
      const isValidTime = true;
      setPagar(isValidTime);
      if (!isValidTime) {
        swal("¡Error!", "Se requieren al menos 5hrs de anticipación", "error");
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
  };

  const handleSubmitProfessional = async () => {
    setReserva({
      ...reserva,
      profesional_id: profesional.creador._id,
      cita_servicio: inputValue.date,
      hora_servicio: inputValue.time,
    });

    try {
      const { data } = await clienteAxios.post("api/pay/finish/agendar", {
        id,
        profesional_id: profesional.creador._id,
        cita_servicio: inputValue.date,
        hora_servicio: inputValue.time,
      });
      toast.success(data.msg);
    } catch (err) {
      let error = err.response.data.msg
        ? err.response.data.msg
        : err.response && "Estamos presentando problemas internos";
      return toast.error(error);
    }
  };

  useEffect(() => {
    const obtenerUsuarios = async () => {
      setCargando(true);

      try {
        const nombre = nombreServicio || "";
        const localidad = localidadServicio || "";

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

        setProfesionalesRequest(data);

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
      {reserva.profesional_id || reserva.metodo_pago === "Externo" ? (
        <div className="mx-auto mt-6 flex w-full bg-whitefull-screen flex-wrap items-center justify-around">
          <div
            className="w-full max-w-sm rounded-lg shadow-md 
                   bg-gray-100 border border-gray-200"
          >
            <div className="flex flex-col items-center  p-6 max-lg:my-3">
              <img
                className="w-24 h-24 mb-3 rounded-full shadow-lg"
                src={
                  reserva.profesional_id.creador?.img ||
                  "https://t3.ftcdn.net/jpg/03/58/90/78/360_F_358907879_Vdu96gF4XVhjCZxN2kCG0THTsSQi8IhT.jpg"
                }
                alt=""
              />
              <h5 className="mb-1 text-xl font-medium text-gray-900">
                {reserva.profesional_id?.nombre}{" "}
                {reserva.profesional_id?.apellido}
              </h5>
              <span className="text-sm text-gray-500 text-center">
                {reserva.profesional_id?.descripcion}
              </span>
              <div className="flex mt-4 space-x-3 md:mt-6">
                <p>Dia asignado: {reserva.cita_servicio}</p>
              </div>
              <div className="flex mt-4 space-x-3 md:mt-6">
                <p>Hora asignada: {reserva.hora_servicio}</p>
              </div>
              <div className="flex mt-4 space-x-3  md:mt-6">
                {!loadingLiberar ? (
                  // Condición 1: Si no está cargando y alguna otra condición es verdadera
                  //if si no hay cita y hora entonces hay q reprogramar
                  
                  reserva.metodo_pago &&
                  !reserva.cita_servicio &&
                  !reserva.hora_servicio ? (
                    //then
                    <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6 min-w-4/5 ">
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
                              className="bg-gray-50 border m-auto border-gray-300  text-gray-900 text-sm rounded-lg focus:ring-bgHover focus:border-bgHover block  w-4/5 p-2.5"
                              placeholder="username.example"
                              required=""
                            />
                          </div>

                          {date && !selectCard && reserva.profesional_id && (
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
                                            profesionalMap.creador?.creador
                                              .img ||
                                            "https://t3.ftcdn.net/jpg/03/58/90/78/360_F_358907879_Vdu96gF4XVhjCZxN2kCG0THTsSQi8IhT.jpg"
                                          }
                                          alt=""
                                        />
                                        <h5 className="mb-1 text-xl font-medium text-gray-900">
                                          {
                                            profesionalMap.creador?.creador
                                              .nombre
                                          }
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
                                  <>{profesionalesRequest.msg}</>
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
                                className="bg-gray-50 border m-auto border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-bgHover focus:border-bgHover block w-96 p-2.5"
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
                          <button
                            onClick={handleSubmitProfessional}
                            className="text-white mt-4 mx-auto bg-primary hover:bg-bgHover focus:ring-4 focus:outline-none focus:ring-bgHover font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-40 max-lg:w-3/4 max-sm:w-full"
                          >
                            Confirmar Agenda
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    //else if se supone q tiene esos datos entonces hay q liberar reserva para reprogramar
                    <div
                      onClick={guardarReserva}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-center cursor-pointer text-white bg-primary rounded-lg hover:bg-bgHover focus:ring-4 focus:outline-none focus:ring-bgHover "
                    >
                      Re-Agendar
                    </div>
                  )
                ) : (
                  // Si está cargando
                  <Spinner />
                )}

                {/* {
                    !loadingLiberar ?
                      <div
                        onClick={guardarReserva}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-center cursor-pointer text-white bg-primary rounded-lg hover:bg-bgHover focus:ring-4 focus:outline-none focus:ring-bgHover "
                      >
                        Re-Agendar
                      </div>
                      :
                    (<Spinner />)
                  } */}
              </div>
            </div>
          </div>
        </div>
      ) : (
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
                    className="bg-gray-50 border m-auto border-gray-300  text-gray-900 text-sm rounded-lg focus:ring-bgHover focus:border-bgHover block w-96 p-2.5"
                    placeholder="username.example"
                    required=""
                  />
                </div>

                {date && !selectCard && !reserva.profesional_id && (
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
                        <>{profesionalesRequest.msg}</>
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
                      className="bg-gray-50 border m-auto border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-bgHover focus:border-bgHover block w-96 p-2.5"
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
                <button
                  onClick={handleSubmitProfessional}
                  className="text-white mt-4 mx-auto bg-primary hover:bg-bgHover focus:ring-4 focus:outline-none focus:ring-bgHover font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-40 max-lg:w-3/4 max-sm:w-full"
                >
                  Confirmar Agenda
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ScheduleProfessional;
