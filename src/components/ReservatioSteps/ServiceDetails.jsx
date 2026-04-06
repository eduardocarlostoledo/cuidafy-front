import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import clienteAxios from "../../config/axios";

import { useSelector } from "react-redux";

import { NumericFormat } from "react-number-format";
import { GrAddCircle } from "react-icons/gr";
import { TiDelete } from "react-icons/ti";
import { IoIosAddCircleOutline } from "react-icons/io";

import ModalInfo from "../ModalLogin";
import { buildCareRequestFromLegacyJourney, saveCareRequest } from "../../helpers/careFlow";

import { ImWhatsapp } from "react-icons/im";
import { MdOutlineRemoveShoppingCart } from "react-icons/md";

const ServiceDetails = () => {
  const { user } = useSelector((state) => ({ ...state.auth }));

  const { search } = useLocation();
  const id = new URLSearchParams(search).get("id");

  const navigate = useNavigate();

  const [services, setServices] = useState(
    JSON.parse(localStorage.getItem("services"))
      ? JSON.parse(localStorage.getItem("services"))
      : []
  );

  const [modal, setModal] = useState(false);

  const handleModalLogin = () => {
    setModal(!modal);
  };

  const deleteService = ({ producto, index }) => {
    const updatedServices = services.filter(
      (productoState) => productoState.idWP !== producto.idWP
    );

    localStorage.setItem("services", JSON.stringify([...updatedServices]));
    setServices(updatedServices);
  };

  const handleAmount = ({ producto, index }) => {
    let newArray = [...services];

    newArray[index]["cantidad"] = producto.cantidad + 1;

    newArray[index]["precioTotal"] =
      producto.cantidad * newArray[index]["precio"];

    localStorage.removeItem("services");
    localStorage.setItem("services", JSON.stringify([...newArray]));

    setServices(newArray);
  };

  const handleDeleteAmount = ({ producto, index }) => {
    let newArray = [...services];

    newArray[index]["cantidad"] = producto.cantidad - 1;
    newArray[index]["precioTotal"] = producto.precioTotal - producto.precio;

    localStorage.setItem("services", JSON.stringify([...newArray]));

    setServices(newArray);

    if (newArray[index]["cantidad"] <= 0) {
      deleteService({ producto, index });
      return;
    }
  };

  useEffect(() => {
    const obtenerProducto = async () => {
      if (id && !services.some((e) => e.idWP === id)) {
        let { data } = await clienteAxios.get(`/api/products/${id}`);

        data.cantidad = 1;
        data.precioTotal = data.precio;
        localStorage.setItem("services", JSON.stringify([data]));
        // localStorage.setItem("services", JSON.stringify([...services, data]));
        // setServices([...services, data]);
        setServices([data]);
      }
    };

    obtenerProducto();
  }, [id]);

  useEffect(() => {
    if (
      services.length <= 0 &&
      JSON.parse(localStorage.getItem("services"))?.length <= 0
    ) {
      const newUrl = `${window.location.pathname}`;
      window.history.pushState(null, null, newUrl);
    }
  }, [services]);

  const handleVerifeUser = () => {
    if (user) {
      const request = buildCareRequestFromLegacyJourney();
      saveCareRequest(request);
      navigate(request.localidad ? "/cuidado/matches" : "/encontrar-cuidado");
      return;
    }

    setModal(!modal);
  };

  return (
    <>
      <div className="lg:max-w-[1440px] md:max-w-[744px] max-w-[375px] w-full lg:px-10 md:px-6 px-4   bg-white mx-auto">
        <div className="lg:block ">
          <div className="grid grid-cols-6 mt-8 gap-5 max-lg:grid-cols-2">
            <p className="text-xl max-md:text-center font-medium leading-tight text-gray-600 lg:text-xl col-span-2">
              Servicio
            </p>
            <p className="text-xl font-medium leading-tight text-gray-600 lg:pl-0 pl-28 lg:text-xl max-lg:hidden ">
              Detalle
            </p>
            <p className="text-xl font-medium leading-tight text-gray-600 lg:block max-lg:hidden">
              Remover
            </p>
            <p className="text-xl font-medium leading-tight text-gray-600 lg:text-xl max-lg:hidden ">
              Precio
            </p>
            <p className="text-xl font-medium leading-tight text-gray-600 lg:text-xl max-lg:hidden ">
              Total
            </p>
          </div>

          {services.length > 0 ? (
            services?.map((producto, index) => (
              <React.Fragment key={index}>
                <hr className="mt-6" />
                <div className="grid justify-center max-lg:text-center lg:grid-cols-6 mt-8 gap-5 md:grid-cols-[max-content]">
                  <div className=" h-28 w-28 max-lg:mx-auto  flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img
                      src={producto?.img}
                      alt=""
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="lg:text-xl col-span-1">
                    <p className="text-lg font-semibold leading-normal text-gray-800">
                      {producto?.nombre}
                    </p>
                  </div>
                  <a
                    href={`${producto?.link}`}
                    target="_blank"
                    className="text-base font-medium leading-none hover:underline text-gray-800 cursor-pointer mt-2"
                  >
                    Ver detalles
                  </a>
                  {/* <div className="flex items-center justify-center w-20 h-10 p-3 space-x-3 border border-gray-300 ">
                    <button
                      className="outline-none"
                      onClick={() => handleDeleteAmount({ producto, index })}
                      aria-label="decrease quantity"
                    >
                      <svg
                        width={12}
                        height={12}
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.625 1.5L3.375 6L8.625 10.5L8.625 1.5Z"
                          fill="#1F2937"
                        />
                      </svg>
                    </button>
                    <p className="text-base text-gray-800 quantity1 ">
                      {producto?.cantidad}
                    </p>
                    <button
                      className="outline-none"
                      onClick={() => handleAmount({ producto, index })}
                      aria-label="increase quantity"
                    >
                      <svg
                        width={12}
                        height={12}
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3.375 10.5L8.625 6L3.375 1.5L3.375 10.5Z"
                          fill="#1F2937"
                        />
                      </svg>
                    </button>
                  </div> */}
                  <div>
                    <p
                      onClick={() => deleteService({ producto, index })}
                      className="hover:underline cursor-pointer text-base font-medium text-red-500 mt-2"
                    >
                      Remover
                    </p>
                  </div>
                  <div>
                    <p className="text-xl text-gray-800 mt-2">
                      <NumericFormat
                        value={producto?.precio_regular}
                        displayType={"text"}
                        thousandSeparator={true}
                        prefix={"$"}
                        className="line-through font-light text-xs  bg-white"
                      />
                    </p>
                    <p className="text-base max-md:hidden font-semibold leading-none text-gray-800 mt-2">
                      <NumericFormat
                        value={producto?.precio}
                        displayType={"text"}
                        thousandSeparator={true}
                        prefix={"$"}
                      />
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 mt-2">
                      {services.length > 1 ? (
                        <p>
                          {" "}
                          <NumericFormat
                            value={services.reduce(
                              (a, b) =>
                                Number(a.precioTotal) + Number(b.precioTotal)
                            )}
                            displayType={"text"}
                            thousandSeparator={true}
                            prefix={"$"}
                          />
                        </p>
                      ) : (
                        <NumericFormat
                          value={services?.map((a) => a.precioTotal)[0]}
                          displayType={"text"}
                          thousandSeparator={true}
                          prefix={"$"}
                        />
                      )}
                    </p>
                  </div>
                </div>
              </React.Fragment>
            ))
          ) : (
            <>
              <hr className="mt-6" />
              <div className="flex w-full justify-center  items-center flex-col mt-8 gap-5 text-center">
                <MdOutlineRemoveShoppingCart className="w-12 h-12" />
              <p>
                Esta entrada legacy ya no continúa por carrito. Puedes volver al hub y empezar
                una solicitud de cuidado guiada.
              </p>
              </div>
            </>
          )}

          <hr className="mt-6" />
        </div>
        <div
          className={`lg:px-10 md:px-6 md:mt-14 lg:mt-10 lg:flex lg:flex-row flex-row-reverse gap-4 mt-6 ${
            services.length <= 0 ? "justify-end" : "justify-center"
          } `}
        >
          {/* {services.length <= 0 && (
            <Link
              to="https://calyaan.com/categoria-producto/centro-belleza-bogota/masaje-relajante-bogota-domicilio"
              className="flex border border-gray-300 lg:max-w-[296px] w-full justify-center py-3 gap-2 items-center"
            >
              <svg
                width={16}
                height={16}
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.37996 12.5448C6.25329 12.5448 6.12663 12.4981 6.02663 12.3981L1.97996 8.35146C1.78663 8.15812 1.78663 7.83812 1.97996 7.64479L6.02663 3.59812C6.21996 3.40479 6.53996 3.40479 6.73329 3.59812C6.92663 3.79146 6.92663 4.11146 6.73329 4.30479L3.03996 7.99812L6.73329 11.6915C6.92663 11.8848 6.92663 12.2048 6.73329 12.3981C6.63996 12.4981 6.50663 12.5448 6.37996 12.5448Z"
                  fill="#1F2937"
                />
                <path
                  d="M13.6663 8.5H2.44629C2.17296 8.5 1.94629 8.27333 1.94629 8C1.94629 7.72667 2.17296 7.5 2.44629 7.5H13.6663C13.9396 7.5 14.1663 7.72667 14.1663 8C14.1663 8.27333 13.9396 8.5 13.6663 8.5Z"
                  fill="#1F2937"
                />
              </svg>
              <p className="text-base font-medium leading-none text-gray-800">
                Continuar comprando
              </p>
            </Link>
          )} */}
          {services.length <= 0 && (
            <a
              href="/productos"
              className="flex border border-gray-300 lg:max-w-[296px w-full  justify-center py-3 gap-2 items-center"
            >
              <svg
                width={16}
                height={16}
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.37996 12.5448C6.25329 12.5448 6.12663 12.4981 6.02663 12.3981L1.97996 8.35146C1.78663 8.15812 1.78663 7.83812 1.97996 7.64479L6.02663 3.59812C6.21996 3.40479 6.53996 3.40479 6.73329 3.59812C6.92663 3.79146 6.92663 4.11146 6.73329 4.30479L3.03996 7.99812L6.73329 11.6915C6.92663 11.8848 6.92663 12.2048 6.73329 12.3981C6.63996 12.4981 6.50663 12.5448 6.37996 12.5448Z"
                  fill="#1F2937"
                />
                <path
                  d="M13.6663 8.5H2.44629C2.17296 8.5 1.94629 8.27333 1.94629 8C1.94629 7.72667 2.17296 7.5 2.44629 7.5H13.6663C13.9396 7.5 14.1663 7.72667 14.1663 8C14.1663 8.27333 13.9396 8.5 13.6663 8.5Z"
                  fill="#1F2937"
                />
              </svg>
              <p className="text-base  max-md:w-2/3 max-md:text-center font-medium leading-none text-gray-800">
                Volver al hub de cuidado
              </p>
            </a>
          )}

          <button
            onClick={handleVerifeUser}
            className={`text-base font-medium border border-gray-300 lg:max-w-[296px] 
            w-full justify-center py-3 gap-2 bg-primary hover:bg-secondary 
            transition duration-300 text-white lg:mt-0 md:mt-6 mt-4
            ${services.length <= 0 && "disabled:opacity-40"}`}
            disabled={services.length <= 0 ? true : false}
          >
            Continuar en cuidado
          </button>
        </div>
      </div>

      {/* <p className="text-center text-2xl mt-6">o</p>

      <a
        href="https://web.whatsapp.com/send/?phone=543764331313&text&type=phone_number&app_absent=0"
        className="flex border bg-whatsapp  m-auto mt-6 p-5 border-gray-300 lg:max-w-[296px] w-full justify-center py-4 gap-2 items-center"
      >
        <p className="text-base font-medium leading-none text-white">Agenda</p>
        <ImWhatsapp className="w-4 h-4 text-white" />
      </a> */}

      {modal && <ModalInfo handleModalLogin={handleModalLogin} />}
    </>
  );
};

export default ServiceDetails;
