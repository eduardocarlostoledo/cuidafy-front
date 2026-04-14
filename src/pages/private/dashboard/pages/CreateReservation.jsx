import React, { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import clienteAxios from "../../../../config/axios";
import Spinner from "../../../../components/Spinner";
import limpiarHorarios from "../../../../helpers/Logic/limpiarHorarios";
import swal from "sweetalert";
import { FaArrowsAltV } from "react-icons/fa"
import ScheduleProfessional from "../components/FormReserva/ScheduleProfessional";
import FormUserEmail from "../components/FormReserva/FormUserEmail";
import FormUser from "../components/FormReserva/FormUser";
import ServiciosComponent from "../components/FormReserva/ServiciosComponent";
import { parseGeorefLocation } from "../../../../helpers/georefLocation";
import axios from "axios";
import e from "cors";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";

const CreateReservation = () => {

  const querystring = window.location.search;
  const params = new URLSearchParams(querystring);
  let id = params.get("id");

  const [image, setImage] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [idOrder, setIDOrder] = useState(id)
  const [datosPago,setDatosPago] = useState({
    origen:"",
    payment_id:"",
    comprobante:"",
  })

  const [linkPago, setLinkPago] = useState("");

  // Estado para saber si el usuario es nuevo o toca registrarlo 
  const [estado, setEstado] = useState("");

  // Para buscar el usuario mediante Email
  const [userEmail, setUserEmail] = useState("");

  const [cargando2, setCargando2] = useState(false);

  const [reserva, setReserva] = useState({
    cliente_id: "",
    cliente_email: "",
    cliente_nombre: "",
    cliente_apellido: "",
    cliente_cedula: "",
    cliente_telefono: "",
    profesional_id: "",
    servicio: "",
    cantidad: "",
    precio: "",
    cita_servicio: "",
    hora_servicio: "",
    direccion_servicio:"",
    adicional_direccion_servicio: "",
    localidad_servicio: "",
    telefono_servicio: "",
    nuevo: true,
    coupon: "",
    metodo_pago: "",
    link_pago: "",
    estadoPago:""

  });
  const [fechaVenta, setFechaVenta] = useState(''); // Nuevo estado para la fecha de venta

  const handleChange = (e) => {
    setReserva({
      ...reserva,
      [e.target.name]: e.target.value,
    });
  };

  const [servicios, setServicios] = useState([]);
  const [liberar, setLiberar] = useState({}); //se va a guardar el dato de la reserva si existe en caso de reprogramacion
  const [loadingLiberar,setLoadingLiberrar] = useState(false)
  const [precioConDescuentos, setPrecioConDescuentos] = useState({}) || null
  //aca toma la orden por id y trae ademas los datos de la factura
  useEffect(() => {
    if (id) {
      const getHistorial = async () => {
        try {

          let { data } = await clienteAxios.get(`api/ordenes/getordenbyid/${id}`);

          if (data.profesional_id) {
            setReserva({
              nuevo: false,
              cliente_id: data.cliente_id._id,
              cliente_email: data.cliente_id.email,
              cliente_nombre: data.cliente_id.nombre,
              cliente_apellido: data.cliente_id.apellido,
              cliente_cedula: data.cliente_id.cedula,
              cliente_telefono: data.cliente_id.telefono,
              telefono_servicio:data.telefono_servicio,
              profesional_id: data.profesional_id,
              cita_servicio: data.cita_servicio,
              hora_servicio: data.hora_servicio,
              localidad_servicio: data.localidad_servicio,
              direccion_servicio:data.direccion_servicio,
              adicional_direccion_servicio: data.adicional_direccion_servicio,
              coupon: "",
              metodo_pago: data.factura.metodo_pago,
              link_pago: data.factura.link_pago,
              estadoPago:data.factura.estadoPago,
              comprobante: data.factura.comprobante,
              paquetesGenerados: data.paquetesGenerados,

            });

            setPrecioConDescuentos(data.factura.precioTotal)

          } else {
            setReserva({
              ...reserva,
              nuevo: false,
              cliente_id: data.cliente_id._id,
              cliente_email: data.cliente_id.email,
              cliente_nombre: data.cliente_id.nombre,
              cliente_apellido: data.cliente_id.apellido,
              cliente_cedula: data.cliente_id.cedula,
              cliente_telefono: data.cliente_id.telefono,
              telefono_servicio: data.telefono_servicio,
              profesional_id: "",
              cita_servicio: "",
              hora_servicio: "",
              direccion_servicio:data.direccion_servicio,
              localidad_servicio: data.localidad_servicio,
              adicional_direccion_servicio: data.adicional_direccion_servicio,
              coupon: "",
              estado_servicio: data.estado_servicio,
              metodo_pago: data.factura.metodo_pago,
              link_pago: data.factura.link_pago,
              estadoPago:data.factura.estadoPago,
              comprobante: data.factura.comprobante,
              paquetesGenerados: data.paquetesGenerados,
            });
            setPrecioConDescuentos(data.servicios[0].precio)
          }    

          setServicios(data.servicios);

          setDatosPago({
            origen:data.factura.origen,
            payment_id:data.factura.payment_id,
            comprobante: data.factura.comprobante,
          });
          setImage(data.factura.comprobante)
          

          setEstado("nuevo");

          if (data.hora_servicio && data.cita_servicio) {

            setLiberar({
              ...data,
              liberar_hora_servicio: data?.hora_servicio,
              liberar_dia_servicio: data?.cita_servicio,
              liberar_profesional_id: data?.profesional_id,
              liberar_profesional_email: data.profesional_id?.email,
              liberar_profesional_telefono: data.profesional_id?.telefono,
            });
          }

        } catch (error) {
          console.log(error);
          const errorMsg =
            error.response?.data?.msg ||
            error.response?.data?.message ||
            "Estamos presentando problemas internos";
          toast.error(errorMsg);
        }
      };
      getHistorial();
    }
  }, [id]);

  const [metodoexterno, setMetodoExterno] = useState(false)

  async function generarPreferencias(metodo) {

    setCargando2(true);
    const structuredServiceLocation = parseGeorefLocation(
      reserva.localidad_servicio
    );

    const clienteNuevo = {
      email: reserva.cliente_email,
      nombre: reserva.cliente_nombre,
      apellido: reserva.cliente_apellido,
      cedula: reserva.cliente_cedula,
      telefono: reserva.cliente_telefono,
      direccion: reserva.direccion_servicio,
      localidad:reserva.localidad_servicio,
      info: reserva.adicional_direccion_servicio,
      ciudad: structuredServiceLocation.provincia || "Argentina",
    };

    try {
      if (reserva.nuevo) {
        try{
          const datos1 = await clienteAxios.post(
            `${import.meta.env.VITE_APP_BACK}/api/usuarios/reserva-usuario`,
            clienteNuevo
          );
  
          const serviciosRequest = servicios.map((servicio) => servicio.idWP);
  
          const reservaRequest = {
            cliente_id: datos1.data._id,
            servicios: serviciosRequest,
            localidad_servicio: reserva.localidad_servicio,
            adicional_direccion_servicio: reserva.adicional_direccion_servicio,
            telefono_servicio: reserva.telefono_servicio,
            direccion_servicio:reserva.direccion_servicio,
            coupon: reserva.coupon,
            fecha_venta: fechaVenta,
            metodo_pago: metodo,
            link_pago: linkPago
          };

          await procesarPreferencias(reservaRequest);

        }catch(err){
          setCargando2(false);
          let error = err.response.data.msg
          ? err.response.data.msg
          : err.response && "Estamos presentando problemas internos";
          return toast.error(error);
        }

      } else {
        const serviciosRequest = servicios.map((servicio) => servicio.idWP);

        const reservaRequest = {
          cliente_id: reserva.cliente_id,
          servicios: serviciosRequest,
          localidad_servicio: reserva.localidad_servicio,
          adicional_direccion_servicio: reserva.adicional_direccion_servicio,
          telefono_servicio: reserva.telefono_servicio,
          direccion_servicio:reserva.direccion_servicio,
          coupon: reserva.coupon,
          fecha_venta: fechaVenta,
          metodo_pago: metodo,
          link_pago: linkPago
        };

        await procesarPreferencias(reservaRequest);
      }

      if(metodo === "Externo"){
        setMetodoExterno(!metodoexterno)
      }

    } catch (err) {
      console.error(err);
      setCargando2(false);
      let error = err.response.data.msg
      ? err.response.data.msg
      : err.response && "Estamos presentando problemas internos";
      return toast.error(error);
  /*     swal({
        title: "Algo salio mal",
        text: ",
        icon: "error",
        button: "Aceptar",
      }); */    
    }
    setCargando2(false);
  }

  async function procesarPreferencias(reservaRequest) {

    const producto = servicios[0].nombre;
    const precio = servicios[0].valorTotal || servicios[0].precio;

    const respuesta1 = await axios.post(
      `${import.meta.env.VITE_APP_BACK}/api/pay/preference-manual`,
      reservaRequest
    );

    const datos1 = respuesta1.data;

    setIDOrder(datos1.order)

    if (reservaRequest.metodo_pago !== "Externo") {

      const respuesta2 = await axios.post(
        "https://api.mercadopago.com/checkout/preferences",
        {
          items: [
            {
              title: producto,
              unit_price: Number(precio),
              quantity: 1,
            },
          ],
          back_urls: {
            success: `${import.meta.env.VITE_APP_BACK}/api/pay/feedback/success/manual`,
            failure: `${import.meta.env.VITE_APP_BACK}/api/pay/feedback/failure/manual`,
            pending: `${import.meta.env.VITE_APP_BACK}/api/pay/feedback/pending/manual`,
          },
          auto_return: "approved",
          payment_methods: {
            excluded_payment_types: [
              { id: "ticket" },
              { id: "bank_transfer" },
            ],
          },
          statement_descriptor: "CUIDAFY",
          external_reference: datos1.factura,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_APP_MERCADOPAGO_ACCESS_TOKEN}`,
          },
        }
      );

      const datos2 = respuesta2.data;

      setLinkPago(datos2.init_point);
    }
  }

  const [orderId, setOrderId] = useState("");

  const handleCopyLink = () => {
    navigator.clipboard.writeText(linkPago);
  };

  const [inputValue, setInputValue] = useState({
    address: "",
    date: "",
    time: "",
  });
  const [cargando3, setCargando3] = useState(false);
  const [profesionalesRequest, setProfesionalesRequest] = useState([]);
  let { date, time } = inputValue;

  const handleChangeProfesional = (e) => {
    setInputValue({
      ...inputValue,
      [e.target.name]: e.target.value,
    });
    setReserva({
      ...reserva,
      hora_servicio: e.target.value,
    });
  };

  useEffect(() => {
    const obtenerProfesional = async () => {
      setCargando3(true);
      try {
        const { data } = await clienteAxios.post(
          "api/reservas/profesionales/fecha",
          {
            fecha: date,
            especialidad: servicios[0]?.nombre,
            localidad: reserva?.localidad_servicio,
          }
        );
        // console.log(data);
        if (data?.length > 0) {
          const filteredData = data.filter((obj) => obj.creador !== null); // Filtrar objetos con creador distinto de null
          const updatedArray = filteredData.map((obj) => ({
            ...obj,
            styles: false,
          }));
          // const updatedArray = data.map((obj) => ({ ...obj, styles: false }));
          setProfesionalesRequest(updatedArray);
        } else {
          setProfesionalesRequest(data);
        }
        setCargando3(false);
      } catch (err) {
        console.log(err);
      }
    };
    obtenerProfesional();
  }, [date]);

  const [confirmarReserva, setConfirmarReserva] = useState(false);
  const [profesional, setProfesional] = useState({});
  const [hourSelect, setHoursSelect] = useState([]); // mapea la disponibilidad.horarios del profesional

  //al parecer no se usa este handle. 5-12-23
  const handleProfesional = (profesional) => {
    const updatedArray = profesionalesRequest.map((obj) =>
      obj._id === profesional._id
        ? { ...obj, styles: true }
        : { ...obj, styles: false }
    );

    setProfesionalesRequest(updatedArray);
    // console.log("Updated Array", updatedArray)
    setProfesional(profesional);

    // console.log("PROFESIONAL.HORARIOS",profesional.horarios)
    let horarios = profesional.horarios;

    setHoursSelect(limpiarHorarios(horarios));
    // console.log("setHoursSelect HOURSELECT", hourSelect)

    setReserva({
      ...reserva,
      dia_servicio: date,
      hora_servicio: time,
      user_profesional_id: profesional.creador.creador._id,
      profesional_id: profesional.creador._id,
      profesional_email: profesional.creador.creador.email,
      profesional_nombre: profesional.creador.creador.nombre,
      profesional_apellido: profesional.creador.creador.apellido,
      profesional_telefono: profesional.creador.creador.telefono,
    });
    swal({
      title: "Profesional seleccionado",
      text: "Has seleccionado un profesional para tu servicio",
      icon: "success",
      button: "Aceptar",
    });
    setConfirmarReserva(true);
  };

  //no va
  const obtenerUsuarios = async () => {
    setCargando2(true);    
    try {    
      const nombre = nombreServicio || "";
      const localidad = localidadServicio || "";    
      // Verificar si los datos son inválidos, nulos o no definidos
      if (!inputValue.date || !nombre) {
        // console.log("Datos inválidos o no definidos");
        setCargando2(false);
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
      setCargando2(false);
    } catch (err) {
      console.log(err);
    }
  };

  const guardarReserva = async () => {
    try {

      if (liberar && Object.keys(liberar).length > 0) {
        setLoadingLiberrar(true)

        //console.log("liberando reserva" , liberar)
        let response = await clienteAxios.post(
          `api/pay/finish/liberar`,
          liberar
        );
        let { data } = await clienteAxios.post(`api/pay/finish/order`, {id:idOrder});
        setConfirmarReserva(false);

        toast.success(response.data.msg);
        toast.success(data.msg);

        swal({
          title: "Reprogramada",
          text: "Recarga tu navegador para ver los cambios",
          icon: "success",
          button: "Aceptar",
        });
      }

      // if (reserva.metodo_pago && !reserva.cita_servicio && !reserva.hora_servicio) {
      //   console.log("reserva sin datos", reserva.metodo_pago)      
      //   //obtenerUsuarios()
      // }     
      
      setLoadingLiberrar(false)
      setConfirmarReserva(false);

  /*     toast.success(dataFree.msg);
      toast.success(data.msg); */
    } catch (err) {
      console.log(err)
      let error = err.response.data.msg
        ? err.response.data.msg
        : err.response && "Estamos presentando problemas internos";

        swal({
          title: "Algo salio mal",
          text: "Recarga tu navegador o consulta con area de tecnologia",
          icon: "error",
          button: "Aceptar",
        });

      return toast.error(error);
    }
  };
//handle imagen, cambiamos por prevencion.
  // const handleChangeImage = async (e) => {
  //   try {
  //     setLoadingImage(true);
  //     const formData = new FormData();
  //     formData.append("upload_preset", `${e.target.files[0].name}`);
  //     formData.append("file", e.target.files[0], "form-data");

  //     let { data } = await clienteAxios.post(`/api/uploads/file`, formData);

  //     setLoadingImage(false);
  //     setImage(data.imageURL);
  //     toast.success(data.msg);
  //   } catch (err) {
  //     let error = err.response.data.msg
  //       ? err.response.data.msg
  //       : err.response && "Estamos presentando problemas internos";
  //     return toast.error(error);
  //   }
  // };

  const handleChangeImage = async (e) => {
    try {
      setLoadingImage(true);
      const formData = new FormData();
      formData.append("upload_preset", `${e.target.files[0].name}`);
      formData.append("file", e.target.files[0], "form-data");

      const { data } = await clienteAxios.post(`/api/uploads/file-firmas`, formData);

      setLoadingImage(false);
      setImage(data.imageURL);
      toast.success(data.msg);
    } catch (err) {
      handleAxiosError(err, "Error al subir la imagen");
    }
  };

  const handleAxiosError = (error, defaultMessage) => {
    console.error("Error:", error);
    const errorMsg = error.response?.data?.msg || defaultMessage;
    toast.error(errorMsg);
  };

  //console.log("IMAGE", image)

  const actualizarPago = async(e)=>{
    
    e.preventDefault()
    try{
      
      if ([datosPago.payment_id, datosPago.origen].includes("")) {
        return toast.error("Se requieren los campos de Nro de pago y Origen de pago");
      }
//console.log("IMAGE", image)
      let {data} = await clienteAxios.post(
        `api/pay/actualizar-pago`,
        {
          ...datosPago,
          id: idOrder,
          comprobante: image,
        }
      );
      toast.success(data.msg)

      const currentUrl = window.location.href;
      // Construir la nueva URL con el parámetro id
      const newUrl = `${currentUrl.substring(0, currentUrl.indexOf("?"))}?id=${idOrder}`;
      // Redirigir a la nueva URL
      window.location.href = newUrl;
    
    }catch (err) {
      let error = err.response.data.msg
        ? err.response.data.msg
        : err.response && "Estamos presentando problemas internos";
      return toast.error(error);
    }
  }

  const generarPaquetes = async (id) => {    
    try {        
      if (reserva.paquetesGenerados === false) {
        let { data } = await clienteAxios.post(`api/pay/generar-paquetes`, { id: id }); // Cambiar "idOrder" por "id"
        toast.success(data.msg);        
         // Obtener la URL actual
      const currentUrl = window.location.href;
      // Construir la nueva URL con el parámetro id
      const newUrl = `${currentUrl.substring(0, currentUrl.indexOf("?"))}?id=${id}`;
      // Redirigir a la nueva URL
      window.location.href = newUrl;

      swal({
        title: "Paquetes generados",          
        icon: "success",
        button: "Aceptar",
      });

      } else {
        swal({
          title: "Ya se generaron los paquetes",
          text: "No se pueden generar más paquetes",
          icon: "success",
          button: "Aceptar",
        });
      }
    } catch (err) {
      console.log(err);
      let error = err.response && err.response.data.msg ? err.response.data.msg : "Estamos presentando problemas internos"; // Mejorar la condición para verificar si existe la propiedad "msg"
      return toast.error(error);
    }
  };  




  return (
    <div className="w-full mx-auto ">
      <div className="relative flex flex-col  break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
        <div className="rounded-t bg-white mb-0 px-6 py-6">
          <div className="text-center flex justify-between">
            <h6 className="text-blueGray-700 text-xl font-bold">
              Crear reserva
            </h6>

            <div className="flex gap-3">
            <Link
              to="/reservar"
              className="flex justify-center items-center  text-center  w-full text-xl font-bold  leading-none  text-white px-6  bg-indigo-700 rounded hover:bg-indigo-600 transform duration-300 ease-in-out"
            >
              Nueva Reserva
            </Link>
          </div>

          </div>
        </div>
        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
          <div className="flex justify-between py-2 mb-5">
            <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
              Información de usuario
            </h6>
            <div className="border border-gray-300  shadow-sm w-56 rounded flex relative">
              <select
                onChange={(e) => setEstado(e.target.value)}
                value={estado}
                className="bg-white  appearance-none z-10 pl-3 py-3 w-full text-sm border border-transparent focus:outline-none focus:border-indigo-700  text-gray-800  rounded"
              >
                <option value="">Estado</option>
                <option value="registrado">Registrado</option>
                <option value="nuevo">Nuevo usuario</option>
              </select>
              <div
                className="px-4 flex items-center border-l border-gray-300  flex-col justify-center text-gray-500
                                       absolute right-0 bottom-0 top-0 mx-auto z-20 pointer-events-none "
              >
                <FaArrowsAltV className="w-4 h-4" />
              </div>
            </div>
          </div>

          {estado === "nuevo" ? (
            <FormUser handleChange={handleChange} reserva={reserva} />
          ) : (
            <FormUserEmail userEmail={userEmail} setUserEmail={setUserEmail} setEstado={setEstado} setReserva={setReserva} reserva={reserva} />
          )}

          <hr className="mt-6 border-b-1 border-blueGray-300" />

          <ServiciosComponent setServicios={setServicios} servicios={servicios} setReserva={setReserva} reserva={reserva} precioConDescuentos={precioConDescuentos} fechaVenta={fechaVenta} setFechaVenta={setFechaVenta}/>

          {
            (reserva.metodo_pago === "") &&
            <>
              <hr className="mt-6 border-b-1 border-blueGray-300" />

              <h6 className="text-blueGray-400 text-sm mt-4 mb-6 font-bold uppercase">
                Formas de pago
              </h6>

              <div className="container  grid grid-cols-2  gap-8">

                <div className="rounded bg-white p-4" >

                  <h4 className="font-bold mb-2">Link de Pago</h4>

                  <p>La generación de enlaces de pago permite enviar un enlace al cliente para que realice el pago correspondiente. Una vez que se ha efectuado el pago, el cliente puede programar sus citas, ya que el pago ha sido aprobado.</p>

                  <button
                    onClick={() => { generarPreferencias("Interno") }
                    }
                    className="mt-4 p-3 bg-primary hover:bg-bgHover focus:bg-bgHover  rounded focus:outline-none"
                  >
                    <p className="text-sm font-medium leading-none text-white">
                      Generar Link de Pago
                    </p>
                  </button>
                </div>

                <div className="rounded bg-white p-4" >

                  <h4 className="font-bold mb-2">Pago Externo</h4>

                  <p>Al utilizar este método de pago externo, se deben actualizar los campos correspondientes al pago en la tabla de facturación al confirmar el pago. Sin embargo, se permitirá agendar una cita con la profesional antes de realizar el pago.</p>

                  <button
                    onClick={(e) => {
                      generarPreferencias("Externo")
                    }}
                    className="mt-4 p-3 bg-primary hover:bg-bgHover focus:bg-bgHover  rounded focus:outline-none"
                  >
                    <p className="text-sm font-medium leading-none text-white">
                      Agendar Profesional
                    </p>
                  </button>
                </div>
              </div>
            </>
          }

          {
           ( reserva.metodo_pago === "Interno" && reserva.estadoPago === "approved") ?
              <>
                <hr className="mt-6 border-b-1 border-blueGray-300" />

                <div className="flex justify-between py-2 ">
                  <h6 className="text-blueGray-400 text-sm mt-3 font-bold uppercase">
                    Formas de pago
                  </h6>
                </div>

                <p>El metodo utilizado fue interno</p>

                <hr className="mt-6 border-b-1 border-blueGray-300" />

                <div className="flex justify-between py-2 ">
                  <h6 className="text-blueGray-400 text-sm mt-3 font-bold uppercase">
                    Agenda de servicio
                  </h6>
                </div>

                <ScheduleProfessional loadingLiberar={loadingLiberar}  guardarReserva={guardarReserva} id={idOrder} reserva={reserva} setReserva={setReserva} nombreServicio={servicios[0]?.nombre} localidadServicio={reserva.localidad_servicio} />

                {/* {console.log("ScheduleProfessional PARAMS","liberar", liberar, "loadingLiberar", loadingLiberar,"guardarReserva", guardarReserva, "idOrder", idOrder , "reserva",reserva ,"setReserva",  setReserva, "servicios[0]?.nombre", servicios[0]?.nombre, "reserva.localidad_servicio", reserva.localidad_servicio)} */}

              </>
              : (reserva.metodo_pago === "Externo" || metodoexterno) &&
              <>
                <hr className="mt-6 border-b-1 border-blueGray-300" />

                <div className="flex justify-between py-2 ">
                  <h6 className="text-blueGray-400 text-sm mt-3 font-bold uppercase">
                    Formas de pago
                  </h6>
                </div>

                <p>El metodo utilizado fue externo</p>

                <hr className="mt-6 border-b-1 border-blueGray-300" />

                <div className="flex justify-between py-2 ">
                  <h6 className="text-blueGray-400 text-sm mt-3 font-bold uppercase">
                    Agenda de servicio
                  </h6>
                </div>

                <ScheduleProfessional loadingLiberar={loadingLiberar} guardarReserva={guardarReserva} id={idOrder} reserva={reserva} setReserva={setReserva} nombreServicio={servicios[0]?.nombre} localidadServicio={reserva.localidad_servicio} />

                    {/* {console.log("ScheduleProfessional PARAMS", "liberar", liberar, "loadingLiberar", loadingLiberar,"guardarReserva", guardarReserva, "idOrder", idOrder , "reserva",reserva ,"setReserva",  setReserva, "servicios[0]?.nombre", servicios[0]?.nombre, "reserva.localidad_servicio", reserva.localidad_servicio)} */}

                <hr className="mt-6 border-b-1 border-blueGray-300" />

                <div className="flex justify-between py-2">
                  <h6 className="text-blueGray-400 text-sm my-6 font-bold uppercase">
                    Datos de pago
                  </h6>
                </div>

                <form className="flex flex-wrap" onSubmit={actualizarPago}>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        ID Pago
                      </label>
                      <input
                        type="text"
                        value={datosPago.payment_id}
                        onChange={(e)=>setDatosPago({
                          ...datosPago,
                          payment_id:e.target.value
                        })}
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="123123213123"
                      />
                    </div>
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        Origen
                      </label>
                      <input
                        type="text"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="Bancolombia"
                        value={datosPago.origen}
                        onChange={(e)=>setDatosPago({
                          ...datosPago,
                          origen:e.target.value
                        })}
                      />
                    </div>

                    <label className="mb-2"> Comprobante Pago</label>
      {loadingImage ? (
        <div className="p-4 flex justify-center">
          <Spinner />
        </div>
      ) : !image ? (
        <>
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center mt-2 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50  hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6 rounded">
              <svg
                aria-hidden="true"
                className="w-10 h-10 mb-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                ></path>
              </svg>
              <p className="text-xs text-gray-500 ">
                SVG, PNG o JPG (MAX. 2MB)
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              onChange={handleChangeImage}
            />
          </label>
        </>
      ) : (
        <div className="flex gap-6">
          <LazyLoadImage
            className="rounded mt-2"
            effect="blur"
            width="240"
            height="240"
            alt="Logo fondo trasparente"
            src={image}
          />
          <div className="mt-1 flex  items-center ">
            <button
              type="button"
              className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
              onClick={(e) => setImage(null)}
            >
              Eliminar
            </button>
          </div>
        </div>
      )}

                    <button type="submit" className="text-white mt-4 mx-auto bg-primary hover:bg-bgHover focus:ring-4 focus:outline-none focus:ring-bgHover font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-40 max-lg:w-3/4 max-sm:w-full">
                      Guardar
                    </button>

                  </div>
                </form>

              </>
          }

          {linkPago && !cargando2 ? (
            <>
              <hr className="mt-6 border-b-1 border-blueGray-300" />

              <div className="flex justify-between py-2 ">
                <h6 className="text-blueGray-400 text-sm mt-3 font-bold uppercase">
                  Link de pago
                </h6>
              </div>

              <div className="flex flex-wrap items-center">
                <div className="w-full lg:w-3/4 px-4">
                  <div className="w-full">
                    <input
                      type="text"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      value={linkPago}
                      readOnly
                    />
                  </div>
                </div>

                <div className="w-full lg:w-1/5 px-4">
                  <button
                    onClick={handleCopyLink}
                    className="p-2 bg-primary hover:bg-bgHover focus:bg-bgHover  rounded focus:outline-none text-white"
                  >
                    {" "}
                    Copiar Link{" "}
                  </button>
                </div>
              </div>
            </>
          ) : cargando2 && (
            <div className="mt-16">
              <Spinner />
            </div>
          )}
          
        </div>        
          {/* ESTE FRAGMENTO DE CODIGO ES PARA GENERAR UN BOTON QUE FINALICE LA ORDEN Y GENERE LOS PAQUETES APUNTANDO AL ENDPOINT DE GENERAR PAQUETES */}
          { (reserva.estadoPago === "approved" && reserva.profesional_id ) ? (            
            <>
              <hr className="mt-6 border-b-1 border-blueGray-300" />
              <h6 className="text-blueGray-400 text-sm mt-4 mb-6 font-bold uppercase">
                Generar Sesiones para Paquetes contratados
              </h6>

              <div className="container  grid grid-cols-2  gap-8">              
                <div className="rounded bg-white p-4" >
                  <h4 className="font-bold mb-2">Generar Paquetes para ID: {id} </h4>                  
                  <p>Una vez ingresado datos del pago, ya sea con Link de Pago, o Pago externo, asignado un profesional, día y hora. Podrá generar las órdenes individuales para gestionar las sesiones del paquete contratado.</p>
                  <button
                    onClick={(e) => {
                      generarPaquetes(id)
                    }}
                    className="mt-4 p-3 bg-primary hover:bg-bgHover focus:bg-bgHover  rounded focus:outline-none"
                  >
                    <p className="text-sm font-medium leading-none text-white">
                      Generar Sesiones
                    </p>
                  </button>
                </div>
              </div>
            </>
          ) :
         (<p> 
          <> SIN TURNO AGENDADO </>         
         </p>)          
          }
          {/* FIN DEL FRAGMENTO DE CODIGO PARA GENERAR PAQUETES */}
      </div>
    </div>
  );
  
};

export default CreateReservation;
