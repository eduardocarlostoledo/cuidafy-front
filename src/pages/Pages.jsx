import React, { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import clienteAxios from "../config/axios";
import mercadopago from "../../src/components/mercadopago/mercadopago";
import { localidades, provincias as provinciasObj } from "../data";

import { localidadesLaborales } from "../data";
import { AiOutlineArrowDown } from "react-icons/ai";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import swal from "sweetalert";

const Pages = ({ currentStep, pasosReserva, setComplete, setCurrentStep }) => {
  const [customer, setCustomer] = useState({});
  const [metodoPago, setMetodoPago] = useState(false);
  const [orderId, setOrderId] = useState("");
  const { user } = useSelector((state) => ({ ...state.auth }));
  const navigate = useNavigate();
  const provincias = Object.keys(provinciasObj); 

  //aqui se precargan los datos del cliente para que no los tenga que tipear en la seccion de pagos.
  useEffect(() => {
    const getUser = async () => {
      try {
        let { data } = await clienteAxios.get(
          `api/usuarios/perfil/${user._id}`
        );

        const { nombre, apellido, direcciones, telefono, cedula } = data;
        // console.log(
        //   nombre,
        //   apellido,
        //   direcciones,
        //   telefono,
        //   cedula,
        //   "ESTE ES EL LOG"
        // );
        setCustomer({
          email: user?.email || "",
          firstName: user?.nombre || data?.nombre || "",
          lastName: data.apellido || "",
          address: data.direcciones[0]?.direccion || "",
          address2: data.direcciones[0]?.info || "",
          ciudad: data.direcciones[0]?.ciudad || "Posadas",
          localidad: localStorage.getItem("localidad") || "",
          cedula: data?.cedula || "",
          telefono: data?.telefono || "",
        });
      } catch (err) {
        console.error(err);
        let error = err.response?.data?.msg
          ? err.response?.data?.msg
          : "Estamos presentando problemas internos";
        return toast.error(error);
      }
    };
    getUser();
  }, [user._id]);

  const [botonPago, setBotonPago] = useState(false);

  const {
    email,
    firstName,
    lastName,
    address,
    address2,    
    localidad,
    provinciaServicio,
    telefono,
    // cedula,
  } = customer;

  const handleChange = (e) => {
    setCustomer({
      ...customer,
      [e.target.name]: e.target.value,
    });
  };

  const [cargandoOnSubmit,setCargandoOnSubmit] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault();
    setCargandoOnSubmit(true)

    if (
      !email ||
      !firstName ||
      !lastName ||
      !address ||
      !address2 ||
      !localidad ||
      !provinciaServicio ||
      !telefono
    ) {
      // console.log(customer, "customer");
      setBotonPago(false);
      return swal(
        "faltan campos por rellenar",
        "Porfavor rellena todos los campos",
        "info"
      );
    }

    // console.log(customer.localidad, "customer si ta todo joya");
    localStorage.setItem("data_customer", JSON.stringify(customer));

    setBotonPago(true);
    setCargandoOnSubmit(false)
  };

  const [services, setServices] = useState(
    JSON.parse(localStorage.getItem("services"))
      ? JSON.parse(localStorage.getItem("services"))
      : []
  );

  const { estado } = useSelector((state) => ({ ...state.auth }));

  const [estadoState, setEstadoState] = useState(estado);

  useEffect(() => {
    setEstadoState(estado);
    if (localStorage.getItem("localidad", localidad)) {
      setCustomer({
        ...customer,
        localidad: localStorage.getItem("localidad", localidad),
      });
    }
  }, []);

  setTimeout(() => {
    setEstadoState(localStorage.getItem("estado"));
  }, 4000);

  const reservaLink = async () => {
    try {
      //let { data } = await clienteAxios.post(`/reservas/crear/${"asdsad"}`);

      navigate("/resumen");
    } catch (err) {
      console.log(err);
    }
  };

  //capturo de localstorage DateService, ProfessionalService, profile, services, y guardo para la preferencia de respaldo

  let reservationData = {
    DateService: localStorage.getItem("DateService"),
    ProfessionalService: localStorage.getItem("ProfessionalService"),
    profile: localStorage.getItem("profile"),
    services: localStorage.getItem("services"),
    dataCustomer: localStorage.getItem("data_customer"),
  };

  //Obtenemos del localstorage los servicios que contrato el cliente para el renderizado del resumen
  let appointment = {
    date: "",
    time: "",
  };

  if (localStorage.getItem("DateService"))
    try {
      const dataResumenServicios = localStorage.getItem("DateService");
      const parsedDateService = JSON.parse(dataResumenServicios);
      const { date, time } = parsedDateService;
      appointment.date = date;
      appointment.time = time;
    } catch (error) {
      console.log(error);
    }

  //Obtenemos del localstorage los servicios que contrato el cliente para el renderizado del resumen
  let localServices = [];

  const [cargandoButton, setCargandoButton] = useState(false)
  const [pagarButton, setPagarButton] = useState(false)

  const handleCheckout = async (e) => {
    setCargandoButton(true)
    let servicesArray = JSON.parse(localStorage.getItem("services"))
    const idWPArray = servicesArray.map((objeto) => objeto.idWP);

    let reservationData = {
      DateService: localStorage.getItem("DateService"),
      ProfessionalService: localStorage.getItem("ProfessionalService"),
      profile: localStorage.getItem("profile"),
      servicios: idWPArray,
      dataCustomer: localStorage.getItem("data_customer"),
      coupon: couponApply?._idCodigo ? couponApply?._idCodigo : undefined
    };

    let orderData = {};

    if (localStorage.getItem("services")) {
      localServices = JSON.parse(localStorage.getItem("services"));

      orderData = {
        quantity: 1,
        description: localServices[0]?.nombre.toString(),
        price: localServices[0].valorTotal ? localServices[0].valorTotal : localServices[0]?.precioTotal,
      };
    }

    e.preventDefault();

    try {

      const response = await fetch(
        `${import.meta.env.VITE_APP_BACK}/api/pay/preference`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reservationData),
        }
      );

      const data = await response.json();

      const orderId = data.factura._id;
      setOrderId(orderId);

      const secondResponse = await fetch(
        `${import.meta.env.VITE_APP_BACK}/api/pay/create_preference/${orderId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

        }
      );

      const preference = await secondResponse.json();

      setCargandoButton(false)
      setPagarButton(true)
      createCheckoutButton(preference.id);
   
    } catch (error) {
      console.log(error);
      alert("Unexpected error");
    }
  };

  const createCheckoutButton = (preferenceId) => {
    // Initialize the checkout
    mercadopago.checkout({
      preference: {
        id: preferenceId,
      },
      render: {
        container: "#button-checkout", // Class name where the payment button will be displayed
        label: "Pagar", // Change the payment button text (optional)
      },
    });

  };

  const [coupon, setCoupon] = useState("")
  const [couponApply, setCouponApply] = useState({
    codigo: "",
    descuento: "",
    tipoDescuento: "",
    valor: "",
    valorTotal: "",
    _idCodigo:""
  })

  const applyCoupon = async (e) => {
    e.preventDefault()

    try {
      let valor = services?.map((producto) => producto.precioTotal)

      let { data } = await clienteAxios.post(`/api/coupon/discount`, { coupon, valor: valor[0] });

      const servicesLocal = JSON.parse(localStorage.getItem("services"));

      const updatedServices = servicesLocal.map((service) => {
        return {
          ...service,
          codigo: data.codigo,
          descuentos: data.descuento,
          valorTotal: data.valorTotal,
          _idCodigo: data._idCodigo
        };
      });

      localStorage.setItem("services", JSON.stringify(updatedServices));

      setCouponApply(data)

    } catch (error) {
      console.log(error);
      const errorMsg =
        error.response?.data?.msg ||
        error.response?.data?.message ||
        "Estamos presentando problemas internos";
      toast.error(errorMsg);
    }
  };

  return (
    <div>
      <div className="mx-auto p-8 flex gap-4 3xl:gap-8 bg-whitefull-screen flex-wrap items-center justify-center ">
        <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6 w-4/5 max-lg:w-screen">
          <div className="grid  md:grid-cols-2 gap-4 w-full">
            <div>
              <Link
                to="/servicio"
                className="text-base leading-none text-gray-600 pl-1"
              >
                Volver
              </Link>

              <p className="text-4xl font-semibold leading-9 text-gray-800 mt-4 mb-6">
                Finalizar compra
              </p>
              <p className="text-xl font-medium leading-tight text-gray-800 mb-6">
                Información del contacto
              </p>
              <div className="form-container w-full">
                <form onSubmit={onSubmit}>
                  <input
                    type="email"
                    name="email"
                    onChange={handleChange}
                    value={email}
                    className="p-4 rounded border border-gray-300 w-full placeholder-gray-600 focus:ring-0"
                    placeholder="Correo electrónico"
                  />
                  {/* <div className="flex mt-4">
                    <input
                      type="checkbox"
                      name=""
                      id=""
                      className="accent-gray-800 cursor-pointer"
                    />
                    <p className="text-sm leading-none text-gray-600 pl-2">
                      Envíame un correo electrónico con noticias y ofertas.
                    </p>
                  </div> */}
                  <p className="text-xl font-medium leading-tight text-gray-800 mt-6 text-left">
                    Dirección del Servicio
                  </p>
                  <input
                    type="text"
                    name="firstName"
                    onChange={handleChange}
                    value={firstName}
                    className="p-4 rounded border border-gray-300 block w-full placeholder-gray-600 mt-6"
                    placeholder="Nombre"
                  />
                  <input
                    type="text"
                    name="lastName"
                    onChange={handleChange}
                    value={lastName}
                    className="p-4 rounded border border-gray-300 block w-full placeholder-gray-600 mt-6"
                    placeholder="Apellidos"
                  />
                  <input
                    type="text"
                    name="address"
                    onChange={handleChange}
                    value={address}
                    className="p-4 rounded border border-gray-300 block w-full placeholder-gray-600 mt-6"
                    placeholder="Dirección"
                  />
                  <input
                    type="text"
                    name="address2"
                    onChange={handleChange}
                    value={address2}
                    className="p-4 rounded border border-gray-300 block w-full placeholder-gray-600 mt-6"
                    placeholder="Información adicional"
                  />
                  <div className="flex md:flex-row flex-col relative">
                    <div className="mx-auto mt-6 w-full">
                      <div className="relative w-full">
                        <select
                          className=" appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                          name="provinciaServicio"
                          id="provinciaServicio"
                          value={provinciaServicio}
                          onChange={handleChange}
                        >
                          <option value="">Provincia</option>
                          {provincias.map((provincia, index) => (
                            // <option key={index} value={provincia.split(" ")[1]}>
                            <option key={index} value={provincia}>
                              {provincia}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="mx-auto mt-6 w-full md:ml-8">
                      <div className="relative w-full">
                        <select
                          className=" appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                          name="localidad"
                          id="localidad"
                          value={localidad}
                          onChange={handleChange}
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
                  </div>
                  <input
                    type="text"
                    name="telefono"
                    value={telefono}
                    onChange={handleChange}
                    className="p-4 rounded border border-gray-300 block w-full placeholder-gray-600 mt-6"
                    placeholder="Teléfono"
                  />
                  {/* <input
                    type="number"
                    name="cedula"
                    value={cedula}
                    onChange={handleChange}
                    className="p-4 rounded border border-gray-300 block w-full placeholder-gray-600 mt-6"
                    placeholder="Cédula"
                  /> */}
                  {/* <div className="flex mt-4">
                    <input
                      type="checkbox"
                      name=""
                      id=""
                      className="accent-gray-800 cursor-pointer"
                    />
                    <p className="text-sm leading-none text-gray-600 pl-2">
                      Guardar esta información para la próxima vez.
                    </p> 
                  </div> */}
                  <div className="div flex w-full">
                    <button className="text-base font-medium leading-none text-white bg-gray-800 py-4 w-full md:mt-12 mt-8 hover:bg-gray-700 transform duration-300 ease-in-out">
                      Confirmar Datos
                    </button>
                  </div>
                </form>
                {botonPago && (
                  <div className="pb-8">
                    {/* <div className="div flex w-full lg:hidden md:block">
                      <button className="text-base font-medium leading-none text-white bg-gray-800 py-4 w-full md:mt-12 mt-8 hover:bg-gray-700 transform duration-300 ease-in-out">
                        Proceder al pago
                      </button>
                    </div> */}

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        marginTop: "10px",
                      }}
                    >
                      {
                        !cargandoButton ?
                        !pagarButton &&
                          <>
                            <div
                              style={{
                                padding: "0 1.7142857142857142em",
                                fontFamily: "Helvetica Neue, Arial, sans-serif",
                                fontSize: "0.875em",
                                lineHeight: "2.7142857142857144",
                                background: "#009ee3",
                                borderRadius: "0.2857142857142857em",
                                color: "#fff",
                                cursor: "pointer",
                                border: "0",
                                textAlign: "center",
                                marginTop: "1vh",
                              }}
                            >
                              <button className="ButtonCart" onClick={handleCheckout}>
                                Proceder al Pago
                              </button>
                            </div>

                          </>
                          : 
                          <div className="w-full justify-center items-center">
                            <Spinner className="m-auto"/>
                          </div>
                      }

                      <div
                        style={{
                          padding: "0 1.7142857142857142em",
                          fontFamily: "Helvetica Neue, Arial, sans-serif",
                          fontSize: "0.875em",
                          lineHeight: "2.7142857142857144",
                          background: "#009ee3",
                          borderRadius: "0.2857142857142857em",
                          color: "#fff",
                          cursor: "pointer",
                          border: "0",
                          textAlign: "center",
                        }}
                      >
                        <div id="button-checkout"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="relative md:px-6 bg-gray-50 md:pb-20 pb-9 px-4">
              <div className="lg:px-8">
                <div className="lg:col-start-2 md:col-start-0 lg:col-span-10 md:col-span-12 sm:col-span-12 col-span-12">
                  <div className="lg:mt-[153px] md:mt-12 mt-8 lg:ml-8 md:ml-0 ml-0 col-span-10">
                    <p className="text-xl font-semibold leading-tight text-gray-800">
                      Resumen de servicios
                    </p>

                    <div className="product-container">
                      {services?.map((producto, index) => (
                        <>
                          <div className="sm:flex items-start mt-10 text-center">
                            <div className="w-auto">
                              <div className=" h-28 w-28 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                <img
                                  src={producto?.img}
                                  alt=""
                                  className="h-full w-full object-cover object-center"
                                />
                              </div>
                            </div>
                            <div className="flex items-start justify-between w-full">
                              <div className="sm:ml-8">
                                <p className="text-lg font-medium leading-none text-gray-800 mt-6 sm:mt-0">
                                  {producto?.nombre}
                                </p>
                                <p className="text-base leading-none text-gray-600 mt-4 sm:mt-2">
                                 Cantidad: {producto.cantidad}
                                </p>
                                <p className="text-base font-medium leading-none hover:underline text-gray-600 cursor-pointer mt-8">
                                  {/* Ver detalles */}
                                </p>
                              </div>

                              <p className="text-lg font-semibold leading-none text-gray-800 mt-6 sm:mt-0">
                                <NumericFormat
                                  value={producto?.precioTotal}
                                  displayType={"text"}
                                  thousandSeparator={true}
                                  prefix={"$"}
                                />
                              </p>
                            </div>
                          </div>
                          {/* <div className="my-2">
                            <p className="inline-block">
                              El servidor sera atendido por la profesional{" "}
                            </p>
                            <p className="text-base inline-block ml-1 font-medium leading-none hover:underline text-gray-600 cursor-pointer">
                              {" "}
                              Andrea
                            </p>
                          </div> */}
                          <hr className="w-full bg-gray-200 border mt-4 h-[1px]" />
                        </>
                      ))}

                      {
                        couponApply.codigo ?
                          <>
                            <div className="div flex justify-between mt-6">
                              <div className="title">
                                <p className="text-lg leading-none text-gray-600">
                                  Cupón promocional
                                </p>
                              </div>
                              <div className="price">
                                <p className="text-lg font-semibold leading-none text-gray-600">
                                  {couponApply.codigo}
                                </p>
                              </div>
                            </div>

                            <div className="div flex justify-between mt-6">
                              <div className="title">
                                <p className="text-lg leading-none text-gray-600">
                                  Descuento
                                </p>
                              </div>
                              <div className="price">
                                {
                                  couponApply.tipoDescuento === "porcentaje" ?
                                    <p className="text-lg font-semibold leading-none text-gray-600">
                                      {couponApply.descuento} %
                                    </p>
                                    :
                                    <NumericFormat
                                      value={couponApply.descuento}
                                      displayType={"text"}
                                      thousandSeparator={true}
                                      prefix={"$"}
                                    />
                                }
                              </div>
                            </div>
                          </> :
                          <div>
                            <form onSubmit={applyCoupon}>
                              <p className="text-base font-semibold text-gray-800 mt-6">
                                Cupón promocional
                              </p>
                              <div className="md:flex gap-4 mt-4">
                                <input onChange={(e) => setCoupon(e.target.value)} type="text" placeholder="Ingresa Cupón" className=" w-full focus:outline-none border border-gray-300 py-3 px-3" />
                                <button className="bg-gray-800 text-white py-2 w-full  md:mt-0 mt-4 hover:bg-gray-700 duration-300 ease-in-out transition">
                                  Aplicar
                                </button>
                              </div>
                            </form>
                          </div>
                      }

                      <hr className="w-full bg-gray-200 border mt-10 h-[1px]" />

                      <div className="div flex justify-between mt-6">
                        <div className="title">
                          <p className="text-lg leading-none text-gray-600">
                            Fecha
                          </p>
                        </div>
                        <div className="price">
                          <p className="text-lg font-semibold leading-none text-gray-600">
                            {appointment?.date}
                          </p>
                        </div>
                      </div>

                      <div className="div flex justify-between mt-6">
                        <div className="title">
                          <p className="text-lg leading-none text-gray-600">
                            Hora
                          </p>
                        </div>
                        <div className="price">
                          <p className="text-lg font-semibold leading-none text-gray-600">
                            {appointment?.time}
                          </p>
                        </div>
                      </div>

                      <div className="div flex justify-between mt-6">
                        <div className="title">
                          <p className="text-lg leading-none text-gray-600">
                            Servicios Totales
                          </p>
                        </div>

                        <div className="price">
                          <p className="text-lg font-semibold leading-none text-gray-600">
                            {services.length}
                          </p>
                        </div>
                      </div>

                      <div className="div flex justify-between mt-6">
                        <div className="title">
                          <p className="text-lg leading-none text-gray-600">
                            {/* Descuento por Fidelidad */}
                          </p>
                        </div>
                        <div className="price">
                          <p className="text-lg font-semibold leading-none text-gray-600">
                            {/* 0 */}
                          </p>
                        </div>
                      </div>
                      <hr className="w-full bg-gray-200 border mt-6 h-[1px]" />
                      <div className="div flex justify-between mt-6">
                        <div className="title">
                          <p className="text-2xl font-semibold leading-normal text-gray-800">
                            Total
                          </p>
                        </div>
                        <div className="price">
                          <p className="text-2xl font-semibold leading-normal text-gray-800">
                            {
                              !couponApply.codigo ?


                                services.length > 1 ? (
                                  <p>
                                    {" "}
                                    <NumericFormat
                                      value={services.reduce(
                                        (a, b) =>
                                          Number(a.precioTotal) +
                                          Number(b.precioTotal)
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
                                )
                                :
                                <NumericFormat
                                  value={couponApply.valorTotal}
                                  displayType={"text"}
                                  thousandSeparator={true}
                                  prefix={"$"}
                                />
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pages;