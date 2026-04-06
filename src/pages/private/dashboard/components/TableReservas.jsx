import fileDownload from "js-file-download";
import React, { useState, useMemo, useEffect } from "react";
import { AiOutlineCloudDownload } from "react-icons/ai";
import { BsPersonCircle } from "react-icons/bs";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Spinner from "../../../../components/Spinner";
import clienteAxios from "../../../../config/axios";
import useGetDateTableReservas from "../../../../hooks/useGetDateTableReservas";
import { estadoAction } from "../../../../redux/features/authSlice";
import ModalUserInfo from "./ModalUserInfo";
import { Badge } from "antd";
import { getAuthToken } from "../../../../helpers/auth/getSessionData";


const OrdenesBusquedaReservas = () => {
  const [loading, setLoading] = useState(false);
  const [ordenes, setOrdenes] = useState([]);
  const token = getAuthToken();
  const [filtro, setFiltro] = useState({
    emailCliente: '',
    horaReserva: '',
    diaReserva: '',
    servicio: '',
  });

  const handleInputChange = (e) => {
    setFiltro({
      ...filtro,
      [e.target.name]: e.target.value,
    });
  };

  const buscarOrdenes = async () => {
    try {
      setLoading(true);
      const response = await clienteAxios.post('/api/buscar/ordenes-busqueda-reservas/', filtro, {
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token de autenticación
        },
      });

      setOrdenes(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      // Manejar errores de la solicitud
    }
  };

  return (
    <div>
      <div className="text-center">


        <h1>Busqueda Avanzada de Reservas(Ordenes) </h1>
        <div className="px-6 py-3">
          <label>Email del Cliente: Ejemplo "cliente@email.com"  </label>
          <input type="text" name="emailCliente" value={filtro.emailCliente} onChange={handleInputChange} />
        </div>
        <div className="px-6 py-3">
          <label>Hora de Reserva: Ejemplo "21:00-22:00" </label>
          <input type="text" name="horaReserva" value={filtro.horaReserva} onChange={handleInputChange} />
        </div>
        <div className="px-6 py-3">
          <label>Día de Reserva: Ejemplo "2023-07-23" </label>
          <input type="text" name="diaReserva" value={filtro.diaReserva} onChange={handleInputChange} />
        </div>
        <div className="px-6 py-3">
          <label>Servicio: Ejemplo "Masaje reductor paquete x 10" </label>
          <input type="text" name="servicio" value={filtro.servicio} onChange={handleInputChange} />
        </div>


        <button
          className="inline-block w-full max-w-md mx-auto text-center text-sm font-medium leading-none text-white px-6 py-2 bg-indigo-700 rounded hover:bg-indigo-600 transform duration-300 ease-in-out"
          onClick={buscarOrdenes}
        >
          {loading ? 'Buscando...' : 'Buscar Ordenes'}
        </button>

        <div className="px-6 py-3">
          <div className="container mx-auto px-4 sm:px-8">
            <h2>Resultado:</h2>

            {loading ? (
              <div className="text-center mt-4">
                <p>Cargando...</p>
                {/* Aquí puedes agregar tu spinner si lo tienes */}
              </div>
            ) : (

            <table className="min-w-full divide-y divide-gray-200 mt-4">
              <thead>
                <tr>
                  <th className="px-6 py-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-20 py-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-5 py-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Profesional
                  </th>
                  <th className="px-4 py-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Servicio
                  </th>
                  <th className="px-4 py-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Fecha de Venta
                  </th>
                  <th className="px-2 py-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Estado del Servicio
                  </th>
                  <th className="px-8 py-4 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Hora y Día Reserva
                  </th>
                  <th className="px-5 py-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody>
                {ordenes?.map((reserva) => (
                  <tr key={reserva._id}>
                    <td className="px-6 py-3 whitespace-nowrap border-b border-gray-200">
                      <div className="text-sm font-medium text-gray-900">
                        {`${reserva?.cliente_id.nombre} ${reserva?.cliente_id.apellido}`}
                      </div>
                    </td>

                    <td className="px-20 py-3 whitespace-nowrap border-b border-gray-200">
                      <div className="text-sm text-gray-900">{reserva?.cliente_id?.email}</div>
                    </td>

                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <div className="flex justify-start">
                        <div className="flex-shrink-0 w-10 h-10">
                          <p className="text-sm">
                            {reserva?.profesional_id?.creador.nombre
                              ? `${reserva?.profesional_id?.creador.nombre.split(" ")[0]} ${reserva?.profesional_id?.creador.apellido
                                ? reserva?.profesional_id?.creador.apellido.split(" ")[0]
                                : "Agendar"}`
                              : "Agendar"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {`${reserva?.servicios[0].nombre} ${reserva?.nroSesion ? ` ${reserva?.nroSesion}` : ''}`}
                      </p>
                    </td>

                    <td className="px-4 py-4 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {reserva?.factura?.fecha_venta && (
                          new Date(reserva?.factura?.fecha_venta).toLocaleString()
                        )}
                      </p>
                    </td>

                    <td className="px-2 py-4 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {reserva.estado_servicio}
                      </p>
                    </td>

                    <td className="px-8 py-3 whitespace-nowrap border-b border-gray-200 text-center">
                      <div className="text-sm text-gray-900">
                        {reserva?.hora_servicio && reserva?.cita_servicio
                          ? `${reserva?.hora_servicio} ${reserva?.cita_servicio}`
                          : "Agendar"}
                      </div>
                    </td>

                    <td className="px-5 py-3 whitespace-nowrap border-b border-gray-200 flex justify-center">
                      <Link to={`/resumen-admin/${reserva._id}`} className="text-gray-900 whitespace-no-wrap p-3">
                        Ver reserva
                      </Link>

                      <Link to={`/reservar?id=${reserva._id}`} className="text-gray-900 whitespace-no-wrap ml-8 p-3">
                        Formulario
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
 )}
          </div>
        </div>
      </div>

    </div>
  )
};

const TableReservas = () => {
  const { paginado, setLimite, limite, pagina, setPagina, loading } =
    useGetDateTableReservas();
  const [userState, setUserState] = useState(null);
  const [modal, setModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtrado, setFiltrado] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});

  const dispatch = useDispatch();

  const { estado } = useSelector((state) => state.auth);

  // Fetch unread message counts for all reservas
  useEffect(() => {
    if (paginado?.resultados && paginado.resultados.length > 0) {
      const fetchUnreadCounts = async () => {
        const counts = {};
        for (const reserva of paginado.resultados) {
          try {
            const stats = await clienteAxios.get(`api/chat/stats/${reserva._id}`);
            counts[reserva._id] = stats.data.unreadMessages || 0;
          } catch (error) {
            counts[reserva._id] = 0;
          }
        }
        setUnreadCounts(counts);
      };
      fetchUnreadCounts();
    }
  }, [paginado?.resultados]);

  const handleDownload = (url, filename) => {
    clienteAxios
      .get(url, {
        responseType: "blob",
      })
      .then((res) => {
        fileDownload(res.data, filename);
      })
      .catch((error) => {
        console.error("Error al descargar el archivo:", error);
      });
  };

  useMemo(() => {
    if (!paginado || !paginado.resultados) {
      setFiltrado([]);
    } else {
      setFiltrado(
        paginado.resultados.filter((item) => {
          const searchTermLower = searchTerm.toLowerCase();
          const idReserva = item._id && item._id.toLowerCase();
          const clienteNombre =
            item.cliente_nombre && item.cliente_nombre.toLowerCase();
          const clienteApellido =
            item.cliente_apellido && item.cliente_apellido.toLowerCase();
          const clienteCedula =
            item.cliente_cedula && item.cliente_cedula.toLowerCase();
          const clienteTelefono =
            item.cliente_telefono && item.cliente_telefono.toLowerCase();
          const clienteEmail =
            item.cliente_email && item.cliente_email.toLowerCase();

          return (
            (clienteNombre && clienteNombre.includes(searchTermLower)) ||
            (clienteApellido && clienteApellido.includes(searchTermLower)) ||
            (clienteCedula && clienteCedula.includes(searchTermLower)) ||
            (clienteTelefono && clienteTelefono.includes(searchTermLower)) ||
            (clienteEmail && clienteEmail.includes(searchTermLower)) ||
            (idReserva && idReserva.includes(searchTermLower))
          );
        })
      );
    }
  }, [searchTerm, paginado]);

  //console.log("filtrado", filtrado)
  const handleState = () => {
    dispatch(estadoAction());
  };

  const handleUser = (user) => {
    setUserState(user);
    setModal(true);
  };

  const handleModalView = () => {
    setModal(!modal);
  };

  return (
    <>
      <div className="py-8">
        <h2 className="text-2xl font-bold ml-8 mb-6">Reservas</h2>
        <div className="my-2 flex justify-between mx-8">
          <div className="flex sm:flex-row flex-col">
            <div className="flex flex-row mb-1 sm:mb-0">
              <div className="relative">
                <select
                  value={limite}
                  onChange={(e) => setLimite(e.target.value || 50)}
                  className="appearance-none h-full rounded-l border block a w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                >
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <MdKeyboardArrowDown className="fill-current h-4 w-4" />
                </div>
              </div>
            </div>

            <div className="block relative w-80">
              <p className="h-full absolute inset-y-0 left-0 flex items-center pl-2">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 fill-current text-gray-500 "
                >
                  <path d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z"></path>
                </svg>
              </p>
              <input
                placeholder="Nombre, Apellido, Cedula o Email"
                className="appearance-none rounded-r rounded-l sm:rounded-l-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              to="/reservar"
              className="flex justify-center items-center  text-center  w-full text-sm font-medium leading-none  text-white px-6  bg-indigo-700 rounded hover:bg-indigo-600 transform duration-300 ease-in-out"
            >
              Crear reserva
            </Link>
            <button
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center mr-2 "
              onClick={() =>
                handleDownload(`api/usuarios/excel-horarios`, `horarios.xlsx`)
              }
            >
              <AiOutlineCloudDownload />
              <span className="sr-only">Exportar Excel</span>
            </button>
          </div>
        </div>
        <div className="-mx-4 px-4 sm:px-8 py-4 overflow-x-auto ">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>

                  <th className="px-6 py-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-20 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Profesional
                  </th>
                  <th className="px-4 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Servicio
                  </th>
                  <th className="px-4 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Fecha de Venta
                  </th>
                  <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Estado del Servicio
                  </th>
                  <th className="px-8 text-center py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Hora y Día Reserva
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <>
                    <tr>
                      <td></td>
                      <td></td>
                      <td className="h-48 flex items-center">
                        <Spinner />
                      </td>
                    </tr>
                  </>
                ) : paginado?.resultados?.length <= 0 ? (
                  <tr>
                    <td></td>
                    <td></td>
                    <td className="h-48 flex items-center">
                      <p>No hay reservas registradas</p>
                    </td>
                  </tr>
                ) : (
                  filtrado?.map((reserva) => (
                    <tr key={reserva?._id}>


                      <td className="px-6 py-5 border-b border-gray-200 bg-white text-sm truncate">
                        <div className="text-gray-900 whitespace-no-wrap">
                          <div className="flex-shrink-0 w-10 h-10">
                            {reserva?.cliente_id?.nombre} {reserva?.cliente_id?.apellido}
                          </div>
                        </div>
                      </td>


                      <td className="px-6 py-5 border-b border-gray-200 bg-white text-sm truncate">
                        <div className="text-gray-900 whitespace-no-wrap">
                          <div className="flex-shrink-0 w-10 h-10">
                            {reserva?.cliente_id?.email}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 border-b border-gray-200 bg-white text-sm ">
                        <div className="flex justify-start">
                          <div className="flex-shrink-0 w-10 h-10">
                            <p className="text-sm">
                              {reserva?.profesional_id?.creador.nombre
                                ? `${reserva?.profesional_id?.creador.nombre.split(" ")[0]} ${reserva?.profesional_id?.creador.apellido
                                  ? reserva?.profesional_id?.creador.apellido.split(" ")[0]
                                  : "Agendar"
                                }`
                                : "Agendar"}
                            </p>
                          </div>
                        </div>
                      </td>


                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {reserva?.servicios[0].nombre}{" "} {reserva?.nroSesion}
                        </p>
                      </td>

                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                        {reserva?.factura?.fecha_venta && (
  new Date(reserva?.factura?.fecha_venta).toLocaleString()
)}
                        </p>
                      </td>

                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {reserva.estado_servicio}
                        </p>
                      </td>

                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {reserva?.hora_servicio && reserva?.cita_servicio ? `${reserva?.hora_servicio} ${reserva?.cita_servicio}` : "Agendar"}

                        </p>
                      </td>

                      <td className="px-5 py-5 h-full border-b border-gray-200 bg-white text-sm flex justify-center gap-2">
                        <Badge count={unreadCounts[reserva._id] || 0}>
                          <Link
                            to={`/resumen-admin/${reserva._id}`}
                            className="text-gray-900 whitespace-no-wrap p-3"
                          >
                            Chat
                          </Link>
                        </Badge>

                        <Link
                          to={`/reservar?id=${reserva._id}`}
                          className="text-gray-900 whitespace-no-wrap ml-2 p-3"
                        >
                          Formulario
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {!loading && paginado?.resultados?.length !== 0 && (
              <div className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between          ">
                <p className="text-xs xs:text-sm text-gray-900 mb-1">
                  Pag {pagina} de {paginado.totalPaginas}
                </p>
                <p className="text-xs xs:text-sm text-gray-900">
                  Mostrando 1 a {limite} de {paginado.totalUsuarios} entradas
                </p>

                <div className="inline-flex mt-2 xs:mt-0">
                  <button
                    onClick={() => pagina !== 1 && setPagina(pagina - 1)}
                    className={`text-sm font-semibold py-2 px-4 rounded-r ${pagina !== 1
                      ? "bg-gray-300 hover:bg-gray-400 text-gray-800"
                      : "disabled:opacity-25"
                      }`}
                    disabled={pagina !== 1 ? false : true}
                  >
                    Ant
                  </button>
                  <button
                    onClick={() =>
                      pagina < paginado.totalPaginas && setPagina(pagina + 1)
                    }
                    className={`text-sm font-semibold py-2 px-4 rounded-r ${pagina < paginado.totalPaginas
                      ? "bg-gray-300 hover:bg-gray-400 text-gray-800"
                      : "disabled:opacity-25"
                      }`}
                    disabled={pagina < paginado.totalPaginas ? false : true}
                  >
                    Sig
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {modal && (
        <ModalUserInfo
          userState={userState}
          handleModalView={handleModalView}
        />
      )}

      <OrdenesBusquedaReservas />
    </>
  );
};

export default TableReservas;
