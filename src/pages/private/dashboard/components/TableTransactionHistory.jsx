import { useCallback, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { MdKeyboardArrowDown } from "react-icons/md";
import { NumericFormat } from "react-number-format";
import { AiOutlineCloudDownload } from "react-icons/ai";
import Spinner from "../../../../components/Spinner";
import useGetDateTableReservas from "../../../../hooks/useGetDateTableReservas";
import { BsPersonCircle } from "react-icons/bs";
import ModalUserInfo from "./ModalUserInfo";

const TableTransactionHistory = () => {
  const [historial, setHistorial] = useState([]);

  const { paginado, setLimite, limite, pagina, setPagina, loading } =
    useGetDateTableReservas();

  const [userState, setUserState] = useState({});
  const [modal, setModal] = useState(false);

  const handleUser = (user) => {
    setUserState(user);
    setModal(true);
  };

  const handleModalView = () => {
    setModal(!modal);
  };

  // console.log(paginado)

  const fetchHistorial = useCallback(async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BACK}/api/ordenes/orden`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setHistorial(data);
    } catch (error) {
      console.log(error);
      const errorMsg =
        error.response?.data?.msg || "Estamos presentando problemas internos";
      toast.error(errorMsg);
    }
  }, []);

  useEffect(() => {
    fetchHistorial();
  }, [fetchHistorial]);

  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const [ventas, setVentas] = useState("");
  const [cargando, setCargando] = useState("");

  const filtrarVentasPorFecha = () => {
    setCargando(true);
    let ventasFiltradas = historial.filter(
      (venta) => venta.createdAt.split("T")[0] === fechaSeleccionada
    );

    let totalVentas = ventasFiltradas.reduce(
      (total, venta) => total + parseFloat(venta.precio), //el valor precio es un string, por eso lo parseamos a float
      0
    );

    setTimeout(() => {
      setCargando(false);
      setVentas(totalVentas);
    }, 500);
  };



  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-6">Transacciones</h2>
      <div className="my-2 flex justify-between mx-4">
        <div className="flex sm:flex-row flex-col gap-6 mb-6">
          <div className="flex flex-row mb-1 sm:mb-0">
            <div className="relative">
              <input
                type="date"
                value={fechaSeleccionada}
                onChange={(e) => setFechaSeleccionada(e.target.value)}
                className="appearance-none h-full rounded-l border block a w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              />
            </div>
          </div>

          <div className="block relative">
            <button
              onClick={filtrarVentasPorFecha}
              className="text-white bg-primary hover:bg-bgHover focus:ring-4 focus:outline-none focus:ring-primary font-medium rounded-lg text-sm px-5 py-2.5 text-cente"
            >
              {" "}
              Filtrar ventas{" "}
            </button>
          </div>

          <div className="flex justify-center items-center">
            {cargando ? (
              <Spinner />
            ) : ventas !== 0 && ventas ? (
              <>
                <p className="mr-2">Total Ventas:</p>
                <NumericFormat
                  value={ventas}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"$"}
                />
              </>
            ) : (
              ventas === 0 && (
                <div>
                  <p className="mr-2">No se reportaron ventas</p>
                </div>
              )
            )}
          </div>
        </div>

        <div>
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center mr-2 "
            disabled={true}
          >
            <AiOutlineCloudDownload />
            <span className="sr-only">Exportar Excel</span>
          </button>
        </div>
      </div>

      <div className="-mx-4 px-4 sm:px-8 py-4 overflow-x-auto">
        <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  ID Pago
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Servicio
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Día
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Estado del Servicio
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tipo de pago
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
                paginado?.resultados?.map((reserva) => (
                  <tr key={reserva._id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <div className="flex items-center">{reserva._id}</div>
                    </td>

                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10">
                          {reserva?.cliente?.img ? (
                            <img
                              className="w-full h-full rounded-full"
                              src={user?.img}
                              alt="Imagen de usuario"
                              onClick={() =>
                                handleUser(reserva?.cliente_id?._id)
                              }
                            />
                          ) : (
                            <BsPersonCircle
                              className="w-full h-full text-gray-300"
                              onClick={() =>
                                handleUser(reserva?.cliente_id?._id)
                              }
                            />
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <div className="flex items-center">
                        {reserva?.servicios[0]}
                      </div>
                    </td>

                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        <NumericFormat
                          value={reserva?.factura?.precioTotal}
                          displayType={"text"}
                          thousandSeparator={true}
                          prefix={"$"}
                        />
                      </p>
                    </td>

                    <td className="px-5 py-5  text-sm border-b border-gray-200 bg-white">
                      {reserva.createdAt.split("T")[0]}
                    </td>

                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        <div className="relative inline-block px-3 py-1 font-semibold text-yellow-900 leading-tight">
                          <p
                            aria-hidden
                            className={`absolute inset-0 opacity-50 rounded-full ${
                              reserva.factura === "approved"
                                ? "bg-green-200"
                                : reserva === "pending"
                                ? "bg-yellow-200"
                                : "bg-red-200"
                            }`}
                          ></p>
                          <p className="relative">
                            {" "}
                            Factura
                            {/* {reserva.factura} */}
                          </p>
                        </div>
                      </p>
                    </td>

                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {reserva.factura}
                      </p>
                    </td>

                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {reserva.factura}
                      </p>
                    </td>

                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <Link
                        to={`/resumen-admin/${reserva._id}`}
                        className="text-gray-900 whitespace-no-wrap"
                      >
                        Ver reserva
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
                  className={`text-sm font-semibold py-2 px-4 rounded-r ${
                    pagina !== 1
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
                  className={`text-sm font-semibold py-2 px-4 rounded-r ${
                    pagina < paginado.totalPaginas
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

      {modal && (
        <ModalUserInfo
          userState={userState}
          handleModalView={handleModalView}
        />
      )}
    </div>
  );
};

export default TableTransactionHistory;
