import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import bg3 from "../../../../assets/bg-3-auth.jpg";
import clienteAxios from "../../../../config/axios";
import { localidades } from "../../../../data";
import { AiOutlineCheck, AiOutlineClose, AiOutlineEdit } from "react-icons/ai";
import { updateProfileAdminDash } from "../../../../redux/features/professionalSlice";
import { useDispatch } from "react-redux";
import { getEstadoPagoClass } from "../../../../helpers/Logic/coloresEstadoPago";
import { getEstadoOrdenClass } from "../../../../helpers/Logic/coloresEstadoOrden";
import { Badge } from "antd";
import { resetUserAndConfirm } from "../../../../helpers/admin/resetUserAndConfirm";

const HistoryServices = () => {
  const { id } = useParams();
  const [historial, setHistorial] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  
  useEffect(() => {
    const getHistorial = async () => {
      try {
        let { data } = await clienteAxios.get(
          `api/usuarios/historial/${id}`
        );  
        setHistorial(data);
        
        // Fetch chat stats for each order
        const unreadStats = {};
        for (const orden of data) {
          try {
            const stats = await clienteAxios.get(`api/chat/stats/${orden._id}`);
            unreadStats[orden._id] = stats.data.unreadMessages || 0;
          } catch (error) {
            unreadStats[orden._id] = 0;
          }
        }
        setUnreadCounts(unreadStats);
      } catch (error) {
        console.log(error);
        const errorMsg =
          error.response?.data?.msg || "Estamos presentando problemas internos";
        toast.error(errorMsg);
      }
    };
    getHistorial();
  }, [id]);

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="bg-white p-1 w-full">
        <h5 className="text-xl font-medium leading-none mb-4 text-center">
          Servicios en Curso
        </h5>  
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="responsive-th text-center">
                  Servicio
                </th>
                <th scope="col" className="responsive-th text-center">
                  Sesión
                </th>
                <th scope="col" className="responsive-th hidden md:table-cell text-center">
                  Fecha
                </th>
                <th scope="col" className="responsive-th hidden md:table-cell text-center">
                  Hora
                </th>
                <th scope="col" className="responsive-th hidden md:table-cell text-center">
                  Profesional
                </th>
                <th scope="col" className="responsive-th hidden md:table-cell text-center">
                  Estado
                </th>
                <th scope="col" className="responsive-th hidden md:table-cell text-center">
                  Pago Servicio
                </th>               
                <th scope="col" className="responsive-th text-center">
                  Chat y Orden 
                </th>
              </tr>
            </thead>
            <tbody>
              {historial?.map((reserva) => (
                <tr key={reserva._id} className="bg-white border-b">
                  <td className="responsive-td">
                    {reserva?.servicios?.map((servicio) => servicio.nombre)}
                  </td>
                  <td className="responsive-td text-center">{reserva?.nroSesion}</td>
                  <td className="responsive-td hidden md:table-cell text-center">{reserva?.cita_servicio ? reserva?.cita_servicio : "Agendar" }</td>
                  <td className="responsive-td hidden md:table-cell text-center">{reserva?.hora_servicio ? reserva?.hora_servicio : "Agendar "}</td>
                  <td className="responsive-th hidden md:table-cell text-center">{reserva?.profesional_id?.creador?.nombre ? reserva?.profesional_id?.creador?.nombre : "Agendar"}</td>
                  <td className={`responsive-td hidden md:table-cell text-center ${getEstadoOrdenClass(reserva?.estado_servicio)}`}>{reserva?.estado_servicio}</td>
                  <td className={`responsive-td hidden md:table-cell text-center ${getEstadoPagoClass(reserva?.factura?.estadoPago)}`}>
  {reserva?.factura?.estadoPago} </td>  
  <td className="responsive-td text-center">
  <Badge count={unreadCounts[reserva._id] || 0}>
    <Link to={`/resumen/${reserva._id}`} className="text-blue-600 font-semibold">CHAT</Link>
  </Badge>
</td>
<td className="px-6 py-4 text-center">
</td>

                </tr>
              ))}
            </tbody>  
          </table>
        </div>
      </div>
    </div>
  );
}

const CustomerProfile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [forEdit, setForEdit] = useState(true);
  const [valueForm, setValueForm] = useState({
    nombre: "",
    apellido: "",
    sexo: "",
    email: "",
    telefono: "",
    localidad: "",
    direccion:"",
    direcciones: [],
    cedula: "",
    reviews: 0,
    reservas: [],
    estado: "",
    ultimaConexion: "",
  });

  const getUser = async () => {
    try {
      let { data } = await clienteAxios.get(`api/usuarios/perfil/${id}`);

      setValueForm({ ...valueForm, ...data });
    } catch (err) {
      let error = err.response.data.msg
        ? err.response.data.msg
        : err.response && "Estamos presentando problemas internos";
      return toast.error(error);
    }
  };
 
console.log(valueForm)

  const {
    nombre,
    apellido,
    sexo,
    email,
    telefono,
    direcciones,
    direccion,
    localidad,
    cedula,
    reviews,
    reservas,
    estado,
    confirmado,
    ultimaConexion,
  } = valueForm;
  console.log(valueForm);
  useEffect(() => {
    getUser();
  }, [id]);

  const options = localidades.map((localid) => {
    const [value, ...rest] = localid.split("."); // Dividir por el primer punto
    const label = rest.join(".").trim(); // Unir lo restante y eliminar espacios innecesarios
    return {
      value: localid,
      label,
    };
  });

  const handleChange = (e) => {

    setValueForm((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));

  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (![nombre, apellido, email].every(Boolean)) {
      return toast.error(
        "Los campos nombres, apellidos y correo electrónico son obligatorios"
      );
    }

    try {
      dispatch(updateProfileAdminDash({ valueForm, toast }));
      setForEdit(true);
      toast.success("Enviando...");
    } catch (error) {
      console.log(error);
      toast.error("Ha ocurrido un error al enviar los datos");
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      return toast.error("El cliente no tiene email registrado");
    }

    const newPassword = window.prompt(
      `Ingresa la nueva contraseña para ${email}`
    );

    if (newPassword === null) {
      return;
    }

    const normalizedPassword = newPassword.trim();

    if (!normalizedPassword) {
      return toast.error("La contraseña no puede estar vacía");
    }

    if (normalizedPassword.length < 6) {
      return toast.error("La contraseña debe tener mínimo 6 caracteres");
    }

    try {
      await resetUserAndConfirm({
        email,
        password: normalizedPassword,
      });
      toast.success("Contraseña actualizada y cuenta confirmada");
    } catch (error) {
      console.log(error);
      const errorMsg =
        error.response?.data?.msg || "Estamos presentando problemas internos";
      toast.error(errorMsg);
    }
  };

  
  

  return (
    <>
      <div className="bg-white  shadow rounded mx-auto w-full">
        <div className="relative">
          <img
            className="h-56 shadow rounded-t w-full object-cover object-center"
            src={bg3}
            alt
          />
          <div className="inset-0 m-auto w-24 h-24 absolute bottom-0 -mb-12  rounded border-2 shadow border-white">
            <img
              className="w-full h-full overflow-hidden object-cover rounded"
              src="https://t3.ftcdn.net/jpg/03/58/90/78/360_F_358907879_Vdu96gF4XVhjCZxN2kCG0THTsSQi8IhT.jpg"
              alt
            />
          </div>
        </div>
        <div className="px-5 pb-10">
          <div className="flex justify-center  w-full pt-16 "></div>
          <div className="pt-18  flex flex-col  items-start  justify-between">
            <div className=" w-full ">
              <div className="text-center   flex flex-col  items-center justify-between ">
                <h2 className="  text-2xl text-gray-800  font-medium tracking-normal">
                  {nombre} {apellido}
                </h2>
              </div>
            </div>
            <div className=" w-full py-5 flex items-start justify-center ">
              <div className="mr-6 ">
                <h2 className="text-gray-600  font-bold text-xl  leading-6 mb-2 text-center">
                  {reviews}
                </h2>
                <p className="text-gray-800  text-sm leading-5">Reviews</p>
              </div>
              <div className="mr-6 ">
                <h2 className="text-gray-600  font-bold text-xl  leading-6 mb-2 text-center">
                  {reservas.length}
                </h2>
                <p className="text-gray-800  text-sm leading-5">Servicos</p>
              </div>
              <div>
                <h2 className="text-gray-600  font-bold text-xl  leading-6 mb-2 text-center">
                  {reservas.length}
                </h2>
                <p className="text-gray-800  text-sm  leading-5">Completados</p>
              </div>
            </div>
            <div className="w-full flex-col  justify-center  ">
              <div className="flex items-center justify-center  mt-1 md:mt-0 mb-5 md:mb-0">
                <div className="ml-5 rounded-full bg-green-200 text-green-500 text-sm px-6 py-2 flex justify-center items-center">
                  {confirmado ? "Activo" : "Inactivo"}
                </div>
                <div className="ml-5 rounded-full bg-green-200 text-green-500 text-sm px-6 py-2 flex justify-center items-center">
                  {estado ? "Cuenta Verificada" : "Cuenta Sin Verificada"}
                </div>
                <button
                  onClick={handleResetPassword}
                  className="focus:outline-none ml-5 bg-indigo-700 transition duration-150 ease-in-out hover:bg-indigo-600 rounded text-white px-3 md:px-6 py-2 text-sm"
                >
                  Cambiar contraseña
                </button>
                {telefono && (
                  <button className="focus:outline-none ml-0 md:ml-5 bg-indigo-700  transition duration-150 ease-in-out hover:bg-indigo-600 rounded text-white px-3 md:px-6 py-2 text-sm">
                    Mensaje
                  </button>
                )}
              </div>
            </div>
            <p className="text-gray-800  text-sm text-center w-full mt-4  leading-5">
              Última conexión {ultimaConexion?.split("T")[0]} -{" "}
              {ultimaConexion?.split("T")[1]?.slice(0, 5)}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 pt-6 gap-8">
        <div className="bg-white  shadow p-8">
          <div
            className={`grid ${!forEdit ? "grid-cols-3" : "grid-cols-2"
              } justify-items-end items-center`}
          >
            <h3 className="text-2xl font tracking-widest mr-auto">
              Datos personales
            </h3>
            {!forEdit && (
              <AiOutlineCheck
                size={30}
                color="green"
                className="cursor-pointer"
                onClick={(e) => handleSubmit(e)}
              />
            )}
            {forEdit ? (
              <AiOutlineEdit
                size={30}
                className="cursor-pointer"
                onClick={() => setForEdit(!forEdit)}
              />
            ) : (
              <AiOutlineClose
                size={30}
                color="red"
                className="cursor-pointer"
                onClick={() => (setForEdit(!forEdit), getUser())}
              />
            )}
          </div>

          <div className="flex lg:flex-row md:flex-col-reverse flex-col-reverse justify-between mt-4  ">
            <div className="text">
              <div className=" lg:mt-0 mt-6">
                <p className="text-base text-gray-800">Nombres</p>
                <input
                  type="text"
                  name="nombre"
                  id="nombres"
                  onChange={handleChange}
                  value={nombre}
                  className="placeholder:text-sm placeholdertext-gray-500 focus:outline-none border border-gray-300 lg:min-w-[540px] w-full py-3 px-3 rounded mt-4"
                  placeholder="No registrado"
                  disabled={forEdit}
                />
              </div>

              <div className>
                <div className="mt-6">
                  <p className="text-base text-gray-800">Apellidos</p>
                  <input
                    type="text"
                    name="apellido"
                    id="apellido"
                    onChange={handleChange}
                    value={apellido}
                    className="placeholder:text-sm placeholdertext-gray-500 focus:outline-none border border-gray-300 lg:min-w-[540px] w-full py-3 px-3 rounded mt-4"
                    placeholder="No registrado"
                    disabled={forEdit}
                  />
                </div>
              </div>
              <div className="  mt-6">
                <p className="text-base text-gray-800">Correo electrónico</p>
                <input
                  type="text"
                  name="email"
                  id="email"
                  onChange={handleChange}
                  value={email}
                  className="placeholder:text-sm placeholdertext-gray-500 focus:outline-none border border-gray-300 lg:min-w-[540px] w-full py-3 px-3 rounded mt-4"
                  placeholder="No registrado"
                  disabled={forEdit}
                />
              </div>

              <div className="lg:flex md:flex block gap-8  mt-6">
                <div className="w-full">
                  <p className="text-base text-gray-800">Teléfono</p>
                  <input
                    type="text"
                    name="telefono"
                    id="telefono"
                    onChange={handleChange}
                    value={telefono}
                    className="placeholder:text-sm placeholdertext-gray-500 focus:outline-none border border-gray-300 lg:min-w-[250px] w-full py-3 px-3 rounded mt-4"
                    placeholder="No registrado"
                    disabled={forEdit}
                  />
                </div>
                <div className="lg:mt-0 md:mt-0 mt-4 w-full">
                  <p className="text-base text-gray-800">Cédula</p>
                  <input
                    type="text"
                    name="cedula"
                    id="cedula"
                    onChange={handleChange}
                    value={cedula}
                    placeholder="No registrado"
                    className="placeholder:text-sm placeholdertext-gray-500 focus:outline-none border border-gray-300 lg:min-w-[250px] w-full py-3 px-3 rounded mt-4"
                    disabled={forEdit}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-base leading-none text-gray-800">Sexo</p>
            <select
              id="sexo"
              className="placeholder:text-sm placeholdertext-gray-500 focus:outline-none border border-gray-300 lg:min-w-[250px] w-full py-3 px-3 rounded mt-4"
              value={sexo}
              onChange={handleChange}
              name="sexo"
              disabled={forEdit}
            >
              <option value="">No registrado</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <h3 className="mt-6">Dirección por defecto </h3>

          <div className="lg:flex md:flex block gap-8  mt-6">
            <div className="w-full">
              <p className="text-base leading-none text-gray-800">Ciudad</p>
              <select
                id="ciudad"
                className="placeholder:text-sm placeholdertext-gray-500 focus:outline-none border border-gray-300 lg:min-w-[250px] w-full py-3 px-3 rounded mt-4"
                value={direcciones[0]?.ciudad}
                onChange={handleChange}
                name="direcciones"
                disabled={true}
              >
                <option value="">No registrado</option>
                <option value={direcciones[0]?.ciudad}>
                  {direcciones[0]?.ciudad}
                </option>
              </select>
            </div>
           
          </div>

          <div className="lg:flex md:flex block gap-8  mt-6">           
            <div className="lg:mt-0 md:mt-0 mt-4 w-full">
              <p className="text-base leading-none text-gray-800">Localidad</p>
              <input
                type="text"
                name="localidad"
                id="localidad"
                onChange={handleChange}
                value={localidad} 
                placeholder="No registrado"
                className="placeholder:text-sm placeholdertext-gray-500 focus:outline-none border border-gray-300 lg:min-w-[250px] w-full py-3 px-3 rounded mt-4"
                disabled={forEdit}
              />
            </div>
          </div>

          <div className="lg:flex md:flex block gap-8  mt-6">
            <div className="w-full">
              <p className="text-base leading-none text-gray-800">Dirección</p>
              <input
                type="text"
                name="direccion"
                id="direccion"
                onChange={handleChange}
                value={direccion}
                placeholder="No registrado"
                className="placeholder:text-sm placeholdertext-gray-500 focus:outline-none border border-gray-300 lg:min-w-[250px] w-full py-3 px-3 rounded mt-4"
                disabled={forEdit}
              />
            </div>         
          </div>
        </div>

        <div className="bg-white w-full h-full">
<HistoryServices/>
        </div>
      
      </div>
      <div className="bg-white  shadow p-8 mt-5">
        <div className="mx-2 my-2 px-6 flex flex-wrap justify-center">
          <Link
            to={`/historial-servicios/cliente/${id}`}
            className="mx-2 my-2 flex items-center bg-white transition duration-150 ease-in-out hover:border-indigo-600 border border-indigo-700 rounded text-indigo-700 hover:text-indigo-600 pl-3 pr-6 py-2 text-sm"
          >
            <span className="h-4 w-4 mr-2">
              <svg
                xmlns="www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" />
                <rect x={3} y={5} width={18} height={14} rx={2} />
                <polyline points="3 7 12 13 21 7" />
              </svg>
            </span>
            Reservas
          </Link>
        </div>
      </div>
    </>
  );
};

export default CustomerProfile;

