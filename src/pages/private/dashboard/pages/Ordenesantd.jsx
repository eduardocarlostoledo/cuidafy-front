import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, List, Spin, Alert, Tag, Input, DatePicker } from "antd";
import { AiFillSetting, AiOutlineClose } from "react-icons/ai";
import { BiEditAlt, BiRefresh } from "react-icons/bi";
import {
  getOrders,
  updateOrder,
  createOrder,
} from "./../../../../redux/features/ordenesSlice";
import moment from "moment";
import swal from "sweetalert";
import "./Ordenesantd.css";
import { newHourArray } from "../../../../data";
import { obtenerUsuarios } from "../../../../redux/features/usuariosSlice";

const { RangePicker } = DatePicker;

const ProductExpanded = ({
  _id,
  cliente_id,
  direccion_servicio,
  estado_servicio,
  servicios,
  estadoPago,
  payment_id,
  hora_servicio,
  // cliente_email,
  // cliente_nombre,
  // cliente_apellido,
  // cliente_cedula,
  // cliente_telefono,
  // adicional_direccion_Servicio,
  // localidad_Servicio,
  // telefono_Servicio,
  // estadoFacturacion,
  // numeroFacturacion,
  // estadoLiquidacion,
  // numeroLiquidacion,
  // profesional_email,
  // profesional_nombre,
  // profesional_apellido,
  editProduct,
  setEditProduct,
}) => {
  const dispatch = useDispatch();
  const [input, setInput] = useState({
    _id,
    cliente_id,
    servicios,
    direccion_servicio,
    estado_servicio,
    estadoPago,
    payment_id,
    hora_servicio,
    profesional_id: "",
    // _id,
    // cliente_id,
    // // cliente_email,
    // // cliente_nombre,
    // // cliente_apellido,
    // // cliente_cedula,
    // // cliente_telefono,
    // direccion_Servicio,
    // adicional_direccion_Servicio,
    // localidad_Servicio,
    // telefono_Servicio,
    // estadoServicio,
    // estadoPago,
    // payment_id,
    // profesional_email,
    // profesional_nombre,
    // profesional_apellido,
    // estadoFacturacion,
    // numeroFacturacion,
    // estadoLiquidacion,
    // numeroLiquidacion,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [horariosForm, setHorariosForm] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const change = useSelector((state) => state.ordenes.update);
  let orders = useSelector((state) => state.ordenes.order || []);
  if (!Array.isArray(orders)) {
    orders = [];
  }
  //separo los useEffect para que no se renderize todo junto
  // useEffect(() => {
  //   dispatch(getOrders())
  //     .then(() => setLoading(false))
  //     .catch((error) => setError(error.message));
  // }, [dispatch, change]);
  // }, [orders, change]);

  useEffect(() => {
    // dispatch(updateOrder(false))
    dispatch(getOrders())
      .then(() => setLoading(false))
      .catch((error) => setError(error.message));
  }, [loading]);

  useEffect(() => {
    dispatch(obtenerUsuarios())
      .then(() => setLoading(false))
      .catch((error) => setError(error.message));
  }, []);

  let users = useSelector((state) => state.usuarios.users || []);
  if (!Array.isArray(users)) {
    users = [];
  }
  const filtered = users.filter((user) => {
    const fullNameProfesional =
      `${user?.nombre} ${user?.apellido}`.toLowerCase();
    const fullNameProfesionalInverso =
      `${user?.apellido} ${user?.nombre} `.toLowerCase();

    const isProfessional = user.rol === "PROFESIONAL";
    const matchesSearch = fullNameProfesional.includes(
      searchTerm.toLowerCase()
    );
    const matchesSearchInverso = fullNameProfesionalInverso.includes(
      searchTerm.toLowerCase()
    );

    return (
      isProfessional &&
      (user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        matchesSearch ||
        matchesSearchInverso)
    );
  });
  //console.log(input);

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
    //console.log(input, "input");
  };
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleChangeHorarios = (e) => {
    if (e.target.value !== "") {
      setHorariosForm([...horariosForm, { hora: e.target.value, stock: true }]);
    }
    setHoraInicio(e.target.value.split("-")[0]);
    setHoraFin(e.target.value.split("-")[1]);
  };

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(false);

    const data = new FormData();
    Object.keys(input).forEach((key) => data.append(key, input[key]));
    dispatch(updateOrder(input));

    setEditProduct(0);
    swal("success", "ORDEN MODIFICADA", "success");
    setLoading(true);
  }
  // console.log(input);
  return (
    <div>
      {!(editProduct === _id) && (
        <div className="productExpandedDiv">
          <BiEditAlt
            onClick={() => setEditProduct(input._id)}
            style={{ cursor: "pointer" }}
            size="40px"
          />
          <div
            className="NameImgDiv"
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "nowrap",
            }}
          >
            <div style={{ width: "50%" }}>
              <p
                className="PDivInfo"
                style={{
                  border: "1px solid gray",
                  padding: "12px",
                  borderRadius: "5px",
                  fontSize: "17px",
                }}
              >
                email: {input?.cliente_id?.email}
              </p>
              <p
                className="PDivInfo"
                style={{
                  border: "1px solid gray",
                  padding: "12px",
                  borderRadius: "5px",
                  fontSize: "17px",
                }}
              >
                Nombre: {input?.cliente_id?.nombre}
              </p>
              <p
                className="PDivInfo"
                style={{
                  border: "1px solid gray",
                  padding: "12px",
                  borderRadius: "5px",
                  fontSize: "17px",
                }}
              >
                Apellido: {input?.cliente_id?.apellido}
              </p>
              <p
                className="PDivInfo"
                style={{
                  border: "1px solid gray",
                  padding: "12px",
                  borderRadius: "5px",
                  fontSize: "17px",
                }}
              >
                Cédula: {input?.cliente_id?.cedula}
              </p>

              {/* <p
                className="PDivInfo"
                style={{
                  border: "1px solid gray",
                  padding: "12px",
                  borderRadius: "5px",
                  fontSize: "17px",
                }}
              >
                Dirección de servicio: {input.direccion_Servicio}
              </p> */}
              {/* <p
                className="PDivInfo"
                style={{
                  border: "1px solid gray",
                  padding: "12px",
                  borderRadius: "5px",
                  fontSize: "17px",
                }}
              >
                Dirección adicional de servicio:{" "}
                {input.adicional_direccion_Servicio}
              </p> */}

              {/* <p
                className="PDivInfo"
                style={{
                  border: "1px solid gray",
                  padding: "12px",
                  borderRadius: "5px",
                  fontSize: "17px",
                }}
              >
                Localidad de servicio: {input.localidad_Servicio}
              </p> */}
            </div>
            <div style={{ width: "50%" }}>
              {/* <p
                className="PDivInfo"
                style={{
                  border: "1px solid gray",
                  padding: "12px",
                  borderRadius: "5px",
                  fontSize: "17px",
                }}
              >
                Teléfono de servicio: {input.telefono_Servicio}
              </p> */}
              <p
                className="PDivInfo"
                style={{
                  border: "1px solid gray",
                  padding: "12px",
                  borderRadius: "5px",
                  fontSize: "17px",
                }}
              >
                Teléfono: {input?.cliente_id?.telefono}
              </p>
              <p
                className="PDivInfo"
                style={{
                  border: "1px solid gray",
                  padding: "12px",
                  borderRadius: "5px",
                  fontSize: "17px",
                }}
              >
                Estado del servicio: {input.estado_servicio}
              </p>
              <p
                className="PDivInfo"
                style={{
                  border: "1px solid gray",
                  padding: "12px",
                  borderRadius: "5px",
                  fontSize: "17px",
                }}
              >
                Estado del Pago: {input.estadoPago}
              </p>
              <p
                className="PDivInfo"
                style={{
                  border: "1px solid gray",
                  padding: "12px",
                  borderRadius: "5px",
                  fontSize: "17px",
                }}
              >
                Payment id: {input.payment_id}
              </p>

              {/* <p
                className="PDivInfo"
                style={{
                  border: "1px solid gray",
                  padding: "12px",
                  borderRadius: "5px",
                  fontSize: "17px",
                }}
              >
                Estado de facturación: {input.estadoFacturacion}
              </p> */}
              {/* <p
                className="PDivInfo"
                style={{
                  border: "1px solid gray",
                  padding: "12px",
                  borderRadius: "5px",
                  fontSize: "17px",
                }}
              >
                Número de facturación: {input.numeroFacturacion}
              </p> */}
              {/* <p
                className="PDivInfo"
                style={{
                  border: "1px solid gray",
                  padding: "12px",
                  borderRadius: "5px",
                  fontSize: "17px",
                }}
              >
                Estado de liquidación: {input.estadoLiquidacion}
              </p> */}
              {/* <p
                className="PDivInfo"
                style={{
                  border: "1px solid gray",
                  padding: "12px",
                  borderRadius: "5px",
                  fontSize: "17px",
                }}
              >
                Número de liquidación: {input.numeroLiquidacion}
              </p> */}
            </div>
          </div>
        </div>
      )}

      {editProduct === _id && (
        <div className="productExpandedDiv">
          <AiOutlineClose
            onClick={() => setEditProduct(0)}
            color="red"
            size="40px"
            style={{ cursor: "pointer" }}
          />
          <div
            className="NameImgDiv"
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "nowrap",
            }}
          >
            <div style={{ width: "50%" }}>
              <div>
                <label className="LabelNameImg">
                  <strong>Email </strong>
                </label>
                <input
                  className="InputsEdits"
                  value={input.cliente_id.email}
                  onChange={(e) => handleChange(e)}
                  name="cliente_email"
                  placeholder="Email del cliente"
                ></input>
              </div>

              <div>
                <label className="LabelNameImg">
                  <strong>Nombre </strong>
                </label>
                <input
                  className="InputsEdits"
                  value={input.cliente_id.nombre}
                  onChange={(e) => handleChange(e)}
                  name="cliente_nombre"
                  placeholder="Nombre"
                ></input>
              </div>

              <div>
                <label className="LabelNameImg">
                  <strong>Apellido </strong>
                </label>
                <input
                  className="InputsEdits"
                  value={input.cliente_id.apellido}
                  onChange={(e) => handleChange(e)}
                  name="cliente_apellido"
                  placeholder="Apellido del cliente"
                ></input>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Buscar Profesional..."
                  // className="InputsEdits"
                  className="LabelNameImg"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <select
                  className="InputsEdits"
                  name="profesional_id"
                  onChange={handleChange}
                >
                  {filtered
                    .sort((a, b) => a.nombre.localeCompare(b.nombre)) // Ordenar por nombre
                    .map((profesional, index) => (
                      <option
                        key={index}
                        value={profesional._id}
                        className="InputsEdits"
                      >
                        {profesional.nombre} {profesional.apellido} <br />
                        Email: {profesional.email}
                      </option>
                    ))}
                </select>
              </div>

              {/* comentado y reemplazado por otra funcion que ordena el array de prof.
              <div>
                <input
                  type="text"
                  placeholder="Buscar Profesional..."
                  className="InputsEdits"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <select
                  className="InputsEdits"
                  name="profesional_id"
                  onChange={handleChange}
                >
                  {filtered.map((profesional, index) => (
                    <option
                      key={index}
                      value={profesional._id}
                      className="InputsEdits"
                    >
                      {profesional.nombre} {profesional.apellido} <br />
                      Email: {profesional.email}
                    </option>
                  ))}
                </select>
              </div> */}
            </div>
            <div style={{ width: "50%" }}>
              <div>
                <label className="LabelNameImg">
                  <strong>Cédula </strong>
                </label>
                <input
                  className="InputsEdits"
                  value={input.cliente_id.cedula}
                  onChange={(e) => handleChange(e)}
                  name="cliente_cedula"
                  placeholder="Cédula del cliente"
                ></input>
              </div>

              <div>
                <label className="LabelNameImg">
                  <strong>Teléfono </strong>
                </label>
                <input
                  className="InputsEdits"
                  value={input.cliente_id.telefono}
                  onChange={(e) => handleChange(e)}
                  name="cliente_telefono"
                  placeholder="Teléfono del cliente"
                ></input>
              </div>
              <div>
                <label className="LabelNameImg">
                  <strong>Estado del servicio</strong>
                </label>
                <select
                  className="InputsEdits"
                  value={input.estado_servicio}
                  onChange={(e) => handleChange(e)}
                  name="estado_servicio"
                  placeholder="Estado del servicio"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Agendar">Agendar</option>
                  <option value="Completado">Completado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>

              <form>
                <label className="LabelNameImg">
                  <strong>Hora de servicio</strong>
                </label>
                <select
                  id="disponibilidad"
                  name="hora_servicio"
                  className="InputsEdits"
                  onChange={handleChange}
                  value={input.hora_servicio}
                >
                  <option value={input.hora_servicio}>
                    {input.hora_servicio || "Selecciona horario"}
                  </option>
                  {newHourArray.map((hora, index) => (
                    <option
                      key={index}
                      value={`${hora.horaInicio}-${hora.horaFin}`}
                    >
                      {`${hora.horaInicio}-${hora.horaFin}`}
                    </option>
                  ))}
                </select>

                {horariosForm?.length > 0 && (
                  <div className="my-4 flex flex-wrap gap-4">
                    {horariosForm.map((horario, index) => (
                      <p
                        key={index}
                        className="text-center text-xs font-medium flex items-center px-2.5 py-3 rounded cursor-pointer bg-gray-100 text-gray-800 border-gray-500 "
                      >
                        {horario.hora}
                        <AiFillCloseCircle
                          className="ml-2"
                          onClick={() => eliminarHorario(horario.hora)}
                        />
                      </p>
                    ))}
                  </div>
                )}
              </form>
              <div>
                <label className="LabelNameImg">
                  <strong>Fecha</strong>
                </label>
                <input
                  type="date"
                  name="cita_servicio"
                  className="InputsEdits"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="ButtonDiv" style={{ justifyContent: "center" }}>
            <button onClick={(e) => handleSubmit(e)} className="ButtonSubmit">
              Enviar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const OrdenesAntDesing = (props) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [editProduct, setEditProduct] = useState(0);
  const change = useSelector((state) => state.ordenes.update);
  //separo los useEffect para que no se renderize todo junto
  useEffect(() => {
    dispatch(getOrders())
      .then(() => setLoading(false))
      .catch((error) => setError(error.message));
  }, [dispatch]);

  let orders = useSelector((state) => state.ordenes.order || []);
  if (!Array.isArray(orders)) {
    orders = [];
  }
  const newProducts = orders?.map((product) => ({
    ...product,
    key: product._id,
  }));

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleDateChange = (dates) => {
    const dateNow = dates ? moment(dates[0].$d).format("YYYY/MM/DD") : null;
    const dateNow2 = dates ? moment(dates[1].$d).format("YYYY/MM/DD") : null;

    dates ? setStartDate(dateNow) : setStartDate("");
    dates ? setEndDate(dateNow2) : setEndDate("");
  };

  const refreshData = () => {
    dispatch(getOrders())
      .then(() => setLoading(false))
      .catch((error) => setError(error.message));
  };

  //se filtran las ordenes para renderizado de la tabla

  const filteredOrdenes = useMemo(() => {
    if (!newProducts || newProducts.length === 0) {
      return [];
    }

    const searchTextLower = searchText.toLowerCase();
    return newProducts.filter((orden) => {
      const fullNameProfesional =
        `${orden.profesional_id?.nombre} ${orden.profesional_id?.apellido}`.toLowerCase();
      const fullNameCliente =
        `${orden.cliente_id?.nombre} ${orden.cliente_id?.apellido}`.toLowerCase();
      const fullNameProfesionalInverso =
        `${orden.profesional_id?.apellido} ${orden.profesional_id?.nombre} `.toLowerCase();
      const fullNameClienteInverso =
        `${orden.cliente_id?.apellido} ${orden.cliente_id?.nombre}`.toLowerCase();

      const orderDate = moment(orden?.factura?.fecha_venta, "YYYY/MM/DD");

      if (startDate && endDate) {
        return (
          (fullNameProfesional?.includes(searchTextLower) ||
            fullNameCliente?.includes(searchTextLower) ||
            fullNameProfesionalInverso?.includes(searchTextLower) ||
            fullNameClienteInverso?.includes(searchTextLower) ||
            orden?.factura?.nrofacturacion?.includes(searchTextLower) ||
            orden?.factura?.payment_id?.includes(searchTextLower) ||
            orden?._id?.includes(searchTextLower) ||
            orden?.cliente_id?.cedula?.toString()?.includes(searchTextLower) ||
            orden?.cliente_id?.telefono?.includes(searchTextLower) ||
            orden?.cliente_id?.email?.includes(searchTextLower) ||
            orden?.servicio?.toLowerCase().includes(searchTextLower) ||
            orden?.direccion_servicio
              ?.toLowerCase()
              .includes(searchTextLower)) &&
          orderDate.isBetween(startDate, endDate, null, "[]")
        );
      }

      return (
        fullNameProfesional?.includes(searchTextLower) ||
        fullNameCliente?.includes(searchTextLower) ||
        fullNameProfesionalInverso?.includes(searchTextLower) ||
        fullNameClienteInverso?.includes(searchTextLower) ||
        orden.factura?.nrofacturacion?.includes(searchTextLower) ||
        orden.factura?.payment_id?.includes(searchTextLower) ||
        orden._id?.includes(searchTextLower) ||
        orden?.cliente_id?.cedula?.toString()?.includes(searchTextLower) ||
        orden?.cliente_id?.telefono?.includes(searchTextLower) ||
        orden?.cliente_id?.email?.includes(searchTextLower) ||
        orden?.servicio?.toLowerCase().includes(searchTextLower) ||
        orden?.direccion_servicio?.toLowerCase().includes(searchTextLower)
      );
    });
  }, [newProducts, searchText, startDate, endDate]);
  //console.log(filteredOrdenes);
  const columns = [
    Table.EXPAND_COLUMN,
    {
      title: "Cliente",
      dataIndex: "cliente_id",
      render: (text) => (
        <div>
          <div>
            <b>Nombre y apellido</b>
            <p>
              {text?.apellido} {text?.nombre}
            </p>
          </div>
          <hr />
          <div>
            <b>Cedula</b>
            <p>{text?.cedula}</p>
          </div>
          <hr />
          <div>
            <b>Telefono</b>
            <p>{text?.telefono}</p>
          </div>
          <hr />
          <div>
            <b>Email</b>
            <p>{text?.email}</p>
          </div>
        </div>
      ),
    },
    {
      title: "Profesional",
      dataIndex: "profesional_id",
      // sorter: (a, b) => a.id - b.id,
      // defaultSortOrder: "descend",
      render: (text) =>
        text ? (
          <div>
            <div>
              <b>Nombre y apellido</b>
              <p>
                {text?.apellido} {text?.nombre}
              </p>
            </div>
            <hr />
            <div>
              <b>Cedula</b>
              <p>{text?.cedula}</p>
            </div>
            <hr />
            <div>
              <b>Telefono</b>
              <p>{text?.telefono}</p>
            </div>
            <hr />
            <div>
              <b>Email</b>
              <p>{text?.email}</p>
            </div>
          </div>
        ) : (
          <div>
            <b>Profesional no seleccionado</b>
          </div>
        ),
    },
    // {
    //   title: "Facturacion",
    //   dataIndex: "factura",
    //   filters: [
    //     { text: "Facturado", value: "Facturado" },
    //     { text: "NoFacturado", value: "NoFacturado" },
    //     { text: "Error", value: "Error" },
    //   ],
    //   onFilter: (value, record) => record?.estado_facturacion === value,
    //   render: ({
    //     estado_facturacion,
    //     nro_factura,
    //     fecha_venta,
    //     precioTotal,
    //     payment_id,
    //     origen,
    //   }) => (
    //     <>
    //       {estado_facturacion === "Facturado" ? (
    //         <Tag style={{ margin: "auto" }} color="green">
    //           Facturado
    //         </Tag>
    //       ) : estado_facturacion === "Error" ? (
    //         <Tag style={{ margin: "auto" }} color="red">
    //           Error
    //         </Tag>
    //       ) : (
    //         <Tag style={{ margin: "auto" }} color="yellow">
    //           No Facturado
    //         </Tag>
    //       )}
    //       {payment_id && (
    //         <div style={{ marginTop: ".5rem" }}>
    //           <b>id del pago: </b>
    //           <p>{payment_id}</p>
    //           <hr></hr>
    //         </div>
    //       )}

    //       {origen && (
    //         <div style={{ marginTop: ".5rem" }}>
    //           <b>Origen del pago: </b>
    //           <p>{origen}</p>
    //           <hr></hr>
    //         </div>
    //       )}

    //       {nro_factura && (
    //         <div style={{ marginTop: ".5rem" }}>
    //           <hr />
    //           <b>Nro de factura: </b>
    //           {nro_factura}
    //           <hr></hr>
    //         </div>
    //       )}
    //       {precioTotal && (
    //         <div style={{ marginTop: ".5rem" }}>
    //           <b>Precio: </b>
    //           {precioTotal}
    //           <hr></hr>
    //         </div>
    //       )}
    //       {fecha_venta && (
    //         <div style={{ marginTop: ".5rem" }}>
    //           <b>Dia de venta: </b>
    //           {moment(fecha_venta).format("YYYY-MM-DD HH:mm:ss")}
    //           <hr></hr>
    //         </div>
    //       )}
    //     </>
    //   ),
    // },
    {
      title: "Servicio",
      dataIndex: "servicios",
      // sorter: (a, b) => a.id - b.id,
      // defaultSortOrder: "descend",
      render: (text, record) =>
        text ? (
          <div>
            {record?._id && (
              <p>
                <b>Id de orden </b> <br />
                {record?._id}
                <br />
                <hr></hr>
              </p>
            )}
            {record?._id && (
              <p>
                <b>Sesion </b> <br />
                {record?.nroSesion}
                <br />
                <hr></hr>
              </p>
            )}
            <b>Servicio: {text[0]?.nombre}</b>

            {record?.direccion_servicio && (
              <p>
                <hr></hr>
                <b>Direccion</b> <br />
                {record?.direccion_servicio.slice(0, 20)} ... <br />
              </p>
            )}
            {record?.localidad_servicio && (
              <p>
                <hr></hr>
                <b>Localidad</b> <br />
                {record?.localidad_servicio} <br />
              </p>
            )}
            {record?.localidad_servicio && (
              <p>
                <hr></hr>
                <b>Fecha Venta</b> <br />
                {new Date(record?.factura?.fecha_venta).toLocaleString()}

                 
                <br />
              </p>
            )}
          </div>
        ) : (
          <div>
            <b>Sin servicio</b>
          </div>
        ),
    },
    // {
    //   title: "Direccion",
    //   dataIndex: "direccion_servicio",
    //   // sorter: (a, b) => a.id - b.id,
    //   // defaultSortOrder: "descend",
    //   render: (text) => (
    //     <p>
    //       {text && text.slice(0, 20)} ... <br />
    //     </p>
    //   ),
    // },
    {
      title: "Fecha Servicio",
      dataIndex: "cita_servicio",
      // sorter: (a, b) => a.id - b.id,
      // defaultSortOrder: "descend",
      render: (text, record) =>
        text ? (
          <p>
            {text}
            <hr />
            {record.hora_servicio} <b>hs</b>
          </p>
        ) : (
          <b>Sin horario</b>
        ),
    },
    // {
    //   title: "Hora",
    //   dataIndex: "hora_servicio",
    //   // sorter: (a, b) => a.id - b.id,
    //   // defaultSortOrder: "descend",
    //   render: (text) => <p>{text}</p>,
    // },
    // {
    //   title: "Estado Pago",
    //   dataIndex: "factura",
    //   filters: [
    //     { text: "Pending", value: "pending" },
    //     { text: "Rejected", value: "rejected" },
    //     { text: "Approved", value: "approved" },
    //   ],
    //   onFilter: (value, record) => record?.estadoPago?.indexOf(value) === 0,
    //   render: (text) => (
    //     <>
    //       {text?.estadoPago === "approved" ? (
    //         <Tag color="green">Aprobado</Tag>
    //       ) : text?.estadoPago === "rejected" ? (
    //         <Tag color="red">Rechazado</Tag>
    //       ) : (
    //         <Tag color="yellow">Pendiente</Tag>
    //       )}
    //     </>
    //   ),
    // },
    {
      title: "Estado Pago",
      dataIndex: "factura.estadoPago",
      filters: [
        { text: "Pendiente", value: "pending" },
        { text: "Rechazado", value: "rejected" },
        { text: "Aprobado", value: "approved" },
      ],
      onFilter: (value, record) => record?.factura?.estadoPago === value,
      render: (value, record) => (
        <>
          {record?.factura?.estadoPago === "approved" ? (
            <Tag color="green">Aprobado</Tag>
          ) : record?.factura?.estadoPago === "rejected" ? (
            <Tag color="red">Rechazado</Tag>
          ) : (
            <Tag color="yellow">Pendiente</Tag>
          )}
        </>
      ),
    },
    {
      title: "Estado Servicio",
      dataIndex: "estado_servicio",
      filters: [
        { text: "Pendiente", value: "Pendiente" },
        { text: "Agendar", value: "Agendar" },
        { text: "Completado", value: "Completado" },
        { text: "Cancelado", value: "Cancelado" },
      ],
      onFilter: (value, record) =>
        record?.estado_servicio?.indexOf(value) === 0,
      render: (estado_servicio) => (
        <>
          {estado_servicio === "Completado" ? (
            <Tag color="green">Completado</Tag>
          ) : estado_servicio === "Cancelado" ? (
            <Tag color="red">Cancelado</Tag>
          ) : estado_servicio === "Agendar" ? (
            <Tag color="orange">Agendar</Tag>
          ) : (
            <Tag color="yellow">Pendiente</Tag>
          )}
        </>
      ),
    },
    // {
    //   title: "Cedula",
    //   dataIndex: "cliente_id",
    //   sorter: (a, b) => a.id - b.id,
    //   defaultSortOrder: "descend",
    //   render: (text) => <p>{text.cedula}</p>,
    // },
    // {
    //   title: "Telefono",
    //   dataIndex: "cliente_id",
    //   sorter: (a, b) => a.id - b.id,
    //   defaultSortOrder: "descend",
    //   render: (text) => <p>{text.telefono}</p>,
    // },
    // {
    //   title: "email",
    //   dataIndex: "cliente_id",
    //   sorter: (a, b) => a.id - b.id,
    //   defaultSortOrder: "descend",
    //   render: (text) => <p>{text.email}</p>,
    // },

    // {
    //   title: "Precio",
    //   dataIndex: "factura",
    //   sorter: (a, b) => a.id - b.id,
    //   defaultSortOrder: "descend",
    //   render: (text) => <p>{text.precioTotal}</p>,
    // },

    // {
    //   title: "Profesional",
    //   dataIndex: "profesional_id",
    //   sorter: (a, b) => a.id - b.id,
    //   defaultSortOrder: "descend",
    //   render: (text) => (
    //     <p>
    //       {text}
    //     </p>
    //   ),
    // },
    // {
    //   title: "Telefono",
    //   dataIndex: "profesional_telefono",
    //   sorter: (a, b) => a.id - b.id,
    //   defaultSortOrder: "descend",
    //   render: (text) => <p>{text}</p>,
    // },

    // {
    //   title: "EDITAR",
    //   dataIndex: "",
    //   render: (value) => (
    //     <div className="ActionsDiv">
    //       <button
    //         className="ButtonsActions"
    //         onClick={() => setEditProduct(value._id)}
    //       >
    //         <BiEditAlt />
    //       </button>
    //     </div>
    //   ),
    //   // },
    //   // {
    //   //   title: <>Operation</>,
    //   //   key: 'operation',
    //   //   fixed: 'right',
    //   //   width: '8%',
    //   //   render: (text, record) => {
    //   //     return (
    //   //       <DropOption
    //   //         onMenuClick={e => this.handleMenuClick(record, e)}
    //   //         menuOptions={[
    //   //           { key: '1', name: t`Update` },
    //   //           { key: '2', name: t`Delete` },
    //   //         ]}
    //   //       />
    //   //     )
    //   //   },
    // },
  ];

  return (
    <div
      style={{
        textAlign: "center",
        alignItems: "center",
        overflow: "auto",
      }}
    >
      <p className="p">ORDENES </p>
      <div>
        <p className="p">
          Aplica Filtros a la tabla por Estado de Pago, Estado de Servicio,
          Facturacion.
          <br /> Puede realizar búsquedas por{" "}
          <b>
            {" "}
            Id Pago, Nro Factura, Nombre y/o Apellido, Cedula, Telefono o Email
          </b>
        </p>
        <div style={{ display: "flex", margin: "1rem" }}>
          <Input.Search
            style={{
              width: "40%",
              marginLeft: "auto",
            }}
            placeholder="Buscar Ordenes"
            enterButton={<span style={{ color: "black" }}>Search</span>}
            size="large"
            onChange={(e) => setSearchText(e.target.value)}
          />
          <BiRefresh
            onClick={() => refreshData()}
            size={40}
            style={{ cursor: "pointer", marginRight: "auto" }}
          />
        </div>
        <div style={{ margin: "1rem" }}>
          <p>
            <b>Filtrar Fecha</b>
          </p>
          <RangePicker onChange={handleDateChange} format={"DD/MM/YYYY"} />
        </div>
      </div>

      <div
        style={{
          margin: "0px",
          marginLeft: "0px",
          marginTop: "0px",
          padding: "0px",
        }}
      >
        <Table
          style={{ backgroundColor: "rgb(245, 245, 235)" }}
          columns={columns}
          dataSource={filteredOrdenes}
          expandable={{
            expandedRowRender: (record) => (
              <ProductExpanded
                key={record.key}
                _id={record._id}
                cliente_id={record.cliente_id}
                servicios={record.servicios}
                direccion_servicio={record.direccion_servicio}
                estadoPago={record.factura?.estadoPago}
                payment_id={record.factura?.payment_id}
                estado_servicio={record?.estado_servicio}
                hora_servicio={record?.hora_servicio}
                editProduct={editProduct}
                setEditProduct={setEditProduct}
                // cliente_nombre={record.cliente_nombre}
                // cliente_apellido={record.cliente_apellido}
                // cliente_cedula={record.cliente_cedula}
                // cliente_telefono={record.cliente_telefono}
                // profesional_email={record.profesional_email}
                // profesional_nombre={record.profesional_nombre}
                // profesional_apellido={record.profesional_apellido}
                // adicional_direccion_Servicio={
                //   record.adicional_direccion_Servicio
                // }
                // localidad_Servicio={record.localidad_Servicio}
                // telefono_Servicio={record.telefono_servicio}
                // estadoFacturacion={record?.estadoFacturacion}
                // numeroFacturacion={record?.numeroFacturacion}
                // estadoLiquidacion={record?.estadoLiquidacion}
                // numeroLiquidacion={record?.numeroLiquidacion}
              />
            ),
          }}
          scroll={{ x: 1200 }}
        />
      </div>
    </div>
  );
};

export default OrdenesAntDesing;

// import React, { useEffect, useState, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Table, List, Spin, Alert, Tag, Input } from "antd";
// import { AiFillSetting, AiOutlineClose } from "react-icons/ai";
// import { BiEditAlt } from "react-icons/bi";
// import {
//   getOrders,
//   updateOrder,
//   createOrder,
// } from "./../../../../redux/features/ordenesSlice";
// import moment from "moment";
// import swal from "sweetalert";
// import "./Ordenesantd.css";

// const ProductExpanded = ({
//   _id,
//   cliente_email,
//   cliente_nombre,
//   cliente_apellido,
//   cliente_cedula,
//   cliente_telefono,
//   direccion_Servicio,
//   adicional_direccion_Servicio,
//   localidad_Servicio,
//   telefono_Servicio,
//   estadoServicio,
//   estadoFacturacion,
//   numeroFacturacion,
//   estadoLiquidacion,
//   numeroLiquidacion,
//   profesional_email,
//   profesional_nombre,
//   profesional_apellido,
//   editProduct,
//   setEditProduct,
// }) => {
//   const dispatch = useDispatch();
//   const [input, setInput] = useState({
//     _id,
//     cliente_email,
//     cliente_nombre,
//     cliente_apellido,
//     cliente_cedula,
//     cliente_telefono,
//     direccion_Servicio,
//     adicional_direccion_Servicio,
//     localidad_Servicio,
//     telefono_Servicio,
//     estadoServicio,
//     profesional_email,
//     profesional_nombre,
//     profesional_apellido,
//     estadoFacturacion,
//     numeroFacturacion,
//     estadoLiquidacion,
//     numeroLiquidacion,
//   });

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const change = useSelector((state) => state.ordenes.update);
//   const orders = useSelector((state) => state.ordenes.order || []);
//   //separo los useEffect para que no se renderize todo junto
//   useEffect(() => {
//     dispatch(getOrders())
//       .then(() => setLoading(false))
//       .catch((error) => setError(error.message));
//   }, [dispatch, change]);
//   // }, [orders, change]);

//   useEffect(() => {
//     setLoading(true); // updateinprogress
//     dispatch(updateOrder(false))
//       // dispatch(getOrders())

//       .then(() => setLoading(false))
//       .catch((error) => setError(error.message));
//   }, [dispatch, change, orders]);

//   const handleChange = (e) => {
//     setInput({ ...input, [e.target.name]: e.target.value });
//   };

//   function handleSubmit(e) {
//     e.preventDefault();
//     // console.log("INPUT",input);
//     const data = new FormData();
//     Object.keys(input).forEach((key) => data.append(key, input[key]));
//     dispatch(updateOrder(input));
//     setEditProduct(0);
//     swal("success", "ORDEN MODIFICADA", "success");
//   }

//   return (
//     <div>
//       {!(editProduct === _id) && (
//         <div className="productExpandedDiv">
//           <AiOutlineClose
//             color="red"
//             size="30px"
//             style={{ display: "flex", flexDirection: "row" }}
//           />
//           <div
//             className="NameImgDiv"
//             // style={{ display: 'flex', flexDirection: 'row' }}
//           >
// //             <p className="PDivInfo"
//                 style={{
//                   border: "1px solid gray",
//                   padding: "12px",
//                   borderRadius: "5px",
//                   fontSize: "17px",
//
//                 }}
//               >email: {input.cliente_email}</p>
// //             <p className="PDivInfo"
//                 style={{
//                   border: "1px solid gray",
//                   padding: "12px",
//                   borderRadius: "5px",
//                   fontSize: "17px",
//
//                 }}
//               >Nombre: {input.cliente_nombre}</p>
// //             <p className="PDivInfo"
//                 style={{
//                   border: "1px solid gray",
//                   padding: "12px",
//                   borderRadius: "5px",
//                   fontSize: "17px",
//
//                 }}
//               >Apellido: {input.cliente_apellido}</p>
// //             <p className="PDivInfo"
//                 style={{
//                   border: "1px solid gray",
//                   padding: "12px",
//                   borderRadius: "5px",
//                   fontSize: "17px",
//
//                 }}
//               >Cédula: {input.cliente_cedula}</p>
// //             <p className="PDivInfo"
//                 style={{
//                   border: "1px solid gray",
//                   padding: "12px",
//                   borderRadius: "5px",
//                   fontSize: "17px",
//
//                 }}
//               >Teléfono: {input.cliente_telefono}</p>
// //             <p className="PDivInfo"
//                 style={{
//                   border: "1px solid gray",
//                   padding: "12px",
//                   borderRadius: "5px",
//                   fontSize: "17px",
//
//                 }}
//               >
// //               Dirección de servicio: {input.direccion_Servicio}
// //             </p>
// //             <p className="PDivInfo"
//                 style={{
//                   border: "1px solid gray",
//                   padding: "12px",
//                   borderRadius: "5px",
//                   fontSize: "17px",
//
//                 }}
//               >
// //               Dirección adicional de servicio:{" "}
// //               {input.adicional_direccion_Servicio}
// //             </p>
// //             <p className="PDivInfo"
//                 style={{
//                   border: "1px solid gray",
//                   padding: "12px",
//                   borderRadius: "5px",
//                   fontSize: "17px",
//
//                 }}
//               >
// //               Localidad de servicio: {input.localidad_Servicio}
// //             </p>
// //             <p className="PDivInfo"
//                 style={{
//                   border: "1px solid gray",
//                   padding: "12px",
//                   borderRadius: "5px",
//                   fontSize: "17px",
//
//                 }}
//               >
// //               Teléfono de servicio: {input.telefono_Servicio}
// //             </p>
// //             <p className="PDivInfo"
//                 style={{
//                   border: "1px solid gray",
//                   padding: "12px",
//                   borderRadius: "5px",
//                   fontSize: "17px",
//
//                 }}
//               >
// //               Estado del servicio: {input.estadoServicio}
// //             </p>
// //             <p className="PDivInfo"
//                 style={{
//                   border: "1px solid gray",
//                   padding: "12px",
//                   borderRadius: "5px",
//                   fontSize: "17px",
//
//                 }}
//               >
// //               Estado de facturación: {input.estadoFacturacion}
// //             </p>
// //             <p className="PDivInfo"
//                 style={{
//                   border: "1px solid gray",
//                   padding: "12px",
//                   borderRadius: "5px",
//                   fontSize: "17px",
//
//                 }}
//               >
// //               Número de facturación: {input.numeroFacturacion}
// //             </p>
// //             <p className="PDivInfo"
//                 style={{
//                   border: "1px solid gray",
//                   padding: "12px",
//                   borderRadius: "5px",
//                   fontSize: "17px",
//
//                 }}
//               >
// //               Estado de liquidación: {input.estadoLiquidacion}
// //             </p>
// //             <p className="PDivInfo"
//                 style={{
//                   border: "1px solid gray",
//                   padding: "12px",
//                   borderRadius: "5px",
//                   fontSize: "17px",
//
//                 }}
//               >
// //               Número de liquidación: {input.numeroLiquidacion}
// //             </p>
// //           </div>
// //         </div>
// //       )}

// //       {editProduct === _id && (
// //         <div className="productExpandedDiv">
// //           <AiOutlineClose
// //             onClick={() => setEditProduct(0)}
// //             // color="red"
// //             // size="30px"
// //             // style={{ display: 'flex', flexDirection: 'column' }}
// //           />
// //           <div
// //             className="NameImgDiv"
// //             // style={{ display: 'flex', flexDirection: 'column' }}
// //           >
// //             <div>
// //               <label className="LabelNameImg">
//                 <strong>Email </strong>
//               </label>
//               <input
//                 className="InputsEdits"
//                 value={input.cliente_email}
//                 onChange={(e) => handleChange(e)}
//                 name="cliente_email"
//                 placeholder="Email del cliente"
//               ></input>
//             </div>

//             <div>
//               <label className="LabelNameImg">
//                 <strong>Nombre </strong>
//               </label>
//               <input
//                 className="InputsEdits"
//                 value={input.cliente_nombre}
//                 onChange={(e) => handleChange(e)}
//                 name="cliente_nombre"
//                 placeholder="Nombre"
//               ></input>
//             </div>

//             <div>
//               <label className="LabelNameImg">
//                 <strong>Apellido </strong>
//               </label>
//               <input
//                 className="InputsEdits"
//                 value={input.cliente_apellido}
//                 onChange={(e) => handleChange(e)}
//                 name="cliente_apellido"
//                 placeholder="Apellido del cliente"
//               ></input>
//             </div>

//             <div>
//               <label className="LabelNameImg">
//                 <strong>Cédula </strong>
//               </label>
//               <input
//                 className="InputsEdits"
//                 value={input.cliente_cedula}
//                 onChange={(e) => handleChange(e)}
//                 name="cliente_cedula"
//                 placeholder="Cédula del cliente"
//               ></input>
//             </div>

//             <div>
//               <label className="LabelNameImg">
//                 <strong>Teléfono </strong>
//               </label>
//               <input
//                 className="InputsEdits"
//                 value={input.cliente_telefono}
//                 onChange={(e) => handleChange(e)}
//                 name="cliente_telefono"
//                 placeholder="Teléfono del cliente"
//               ></input>
//             </div>

//             <div>
//               <label className="LabelNameImg">
//                 <strong>Dirección </strong>
//               </label>
//               <input
//                 className="InputsEdits"
//                 value={input.direccion_Servicio}
//                 onChange={(e) => handleChange(e)}
//                 name="direccion_Servicio"
//                 placeholder="Dirección de servicio"
//               ></input>
//             </div>

//             <div>
//               <label className="LabelNameImg">
//                 <strong>Datos Adicionales</strong>
//               </label>
//               <input
//                 className="InputsEdits"
//                 value={input.adicional_direccion_Servicio}
//                 onChange={(e) => handleChange(e)}
//                 name="adicional_direccion_Servicio"
//                 placeholder="Dirección adicional de servicio"
//               ></input>
//             </div>

//             <div>
//               <label className="LabelNameImg">
//                 <strong>Localidad de servicio</strong>
//               </label>
//               <input
//                 className="InputsEdits"
//                 value={input.localidad_Servicio}
//                 onChange={(e) => handleChange(e)}
//                 name="localidad_Servicio"
//                 placeholder="Localidad de servicio"
//               ></input>
//             </div>

//             <div>
//               <label className="LabelNameImg">
//                 <strong>Estado del servicio</strong>
//               </label>
//               <select
//                 className="InputsEdits"
//                 // defaultValue="Pendiente"
//                 value={input.estadoServicio}
//                 onChange={(e) => handleChange(e)}
//                 name="estadoServicio"
//                 placeholder="Estado del servicio"
//               >
//                 <option value="Pendiente">Pendiente</option>
//                 <option value="Completado">Completado</option>
//                 <option value="Cancelado">Cancelado</option>
//               </select>
//             </div>

//             <div>
//               <label className="LabelNameImg">
//                 <strong>Facturación</strong>
//               </label>
//               <select
//                 className="InputsEdits"
//                 // defaultValue="NoFacturado"
//                 value={input.estadoFacturacion}
//                 onChange={(e) => handleChange(e)}
//                 name="estadoFacturacion"
//                 placeholder="Estado de facturación"
//               >
//                 <option value="Facturado">Facturado</option>
//                 <option value="NoFacturado">No facturado</option>
//                 <option value="Error">Error</option>
//               </select>
//             </div>

//             <div>
//               <label className="LabelNameImg">
//                 <strong>NºFactura</strong>
//               </label>
//               <input
//                 className="InputsEdits"
//                 // defaultValue=""
//                 value={input.numeroFacturacion}
//                 onChange={(e) => handleChange(e)}
//                 name="numeroFacturacion"
//                 placeholder="Número de facturación"
//               ></input>
//             </div>

//             <div>
//               <label className="LabelNameImg">
//                 <strong>Liquidación</strong>
//               </label>
//               <select
//                 className="InputsEdits"
//                 // defaultValue="NoLiquidado"
//                 value={input.estadoLiquidacion}
//                 onChange={(e) => handleChange(e)}
//                 name="estadoLiquidacion"
//                 placeholder="Estado de liquidación"
//               >
//                 <option value="Liquidado">Liquidado</option>
//                 <option value="NoLiquidado">No liquidado</option>
//                 <option value="Error">Error</option>
//               </select>
//             </div>

//             <div>
//               <label className="LabelNameImg">
//                 <strong>NºLiquidación</strong>
//               </label>
//               <input
//                 className="InputsEdits"
//                 // defaultValue=""
//                 value={input.numeroLiquidacion}
//                 onChange={(e) => handleChange(e)}
//                 name="numeroLiquidacion"
//                 placeholder="Número de liquidación"
//               ></input>
//             </div>
//           </div>

//           <div className="ButtonDiv">
//             <button onClick={(e) => handleSubmit(e)} className="ButtonSubmit">
//               Enviar
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const OrdenesAntDesing = () => {
//   const dispatch = useDispatch();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchText, setSearchText] = useState("");
//   const [editProduct, setEditProduct] = useState(0);
//   const change = useSelector((state) => state.ordenes.update);
//   //separo los useEffect para que no se renderize todo junto
//   useEffect(() => {
//     dispatch(getOrders())
//       .then(() => setLoading(false))
//       .catch((error) => setError(error.message));
//   }, [dispatch]);

//   useEffect(() => {
//     dispatch(updateOrder(false))
//       .then(() => setLoading(false))
//       .catch((error) => setError(error.message));
//   }, [change]);

//   const orders = useSelector((state) => state.ordenes.order || []);

//   //// Mapeo ordenes para agregar una key a cada fila
//   const newProducts = orders?.map((product) => ({
//     ...product,
//     key: product._id,
//   }));

//   //se filtran las ordenes para renderizado de la tabla
//   const filteredOrdenes = useMemo(() => {
//     if (!newProducts || newProducts.length === 0) {
//       return [];
//     }

//     const searchTextLower = searchText.toLowerCase();

//     return newProducts.filter((orden) => {

//       const fullNameProfesional = `${orden.profesional_nombre} ${orden.profesional_apellido}`.toLowerCase();
//       const fullNameCliente = `${orden.cliente_nombre} ${orden.cliente_apellido}`.toLowerCase();
//       const fullNameProfesionalInverso = `${orden.profesional_apellido} ${orden.profesional_nombre} `.toLowerCase();
//       const fullNameClienteInverso = `${orden.cliente_apellido} ${orden.cliente_nombre}`.toLowerCase();

//       return (
//         fullNameProfesional.includes(searchTextLower) ||
//         fullNameCliente.includes(searchTextLower) ||
//         fullNameProfesionalInverso.includes(searchTextLower) ||
//         fullNameClienteInverso.includes(searchTextLower) ||
//         orden.numeroFacturacion?.includes(searchTextLower) ||
//         orden.payment_id?.includes(searchTextLower) ||
//         orden._id.includes(searchTextLower) ||
//         orden.cliente_cedula.includes(searchTextLower) ||
//         orden.cliente_telefono.includes(searchTextLower) ||
//         orden.cliente_email.includes(searchTextLower) ||
//         orden.servicio.toLowerCase().includes(searchTextLower) ||
//         orden.direccion_Servicio.toLowerCase().includes(searchTextLower) ||
//         moment(orden.dia_servicio, "YYYY-MM-DD")
//           .format("YYYY-MM-DD")
//           .includes(searchText) || // Verifica si la búsqueda coincide con la fecha de la orden
//         moment(orden.hora_servicio, "hh:mm-hh:mm")
//           .format("hh:mm a")
//           .includes(searchText) // Verifica si la búsqueda coincide con la hora de la orden
//     );
//   });

//   }, [newProducts, searchText]);

//   const columns = [

//     {
//       title: "Cliente",
//       dataIndex: "cliente_nombre",
//       sorter: (a, b) => a.id - b.id,
//       defaultSortOrder: "descend",
//       render: (text, record) => <p>{record.cliente_apellido} {text}</p>,
//     },
//     {
//       title: "Cedula",
//       dataIndex: "cliente_cedula",
//       sorter: (a, b) => a.id - b.id,
//       defaultSortOrder: "descend",
//       render: (text) => <p>{text}</p>,
//     },
//     {
//       title: "Telefono",
//       dataIndex: "cliente_telefono",
//       sorter: (a, b) => a.id - b.id,
//       defaultSortOrder: "descend",
//       render: (text) => <p>{text}</p>,
//     },
//     {
//       title: "email",
//       dataIndex: "cliente_email",
//       sorter: (a, b) => a.id - b.id,
//       defaultSortOrder: "descend",
//       render: (text) => <p>{text}</p>,
//     },
//     {
//       title: "Servicio",
//       dataIndex: "servicio",
//       sorter: (a, b) => a.id - b.id,
//       defaultSortOrder: "descend",
//       render: (text) => <p>{text}</p>,
//     },
//     {
//       title: "Precio",
//       dataIndex: "precio",
//       sorter: (a, b) => a.id - b.id,
//       defaultSortOrder: "descend",
//       render: (text) => <p>{text}</p>,
//     },
//     {
//       title: "Direccion",
//       dataIndex: "localidad_Servicio",
//       sorter: (a, b) => a.id - b.id,
//       defaultSortOrder: "descend",
//       render: (text, record) => <p>{record.direccion_Servicio} {text}</p>,
//     },
//     {
//       title: "Hora/Dia",
//       dataIndex: "dia_servicio",
//       sorter: (a, b) => a.id - b.id,
//       defaultSortOrder: "descend",
//       render: (text, record) => <p>{record.hora_servicio} {text}</p>,
//     },
//     {
//       title: "Profesional",
//       dataIndex: "profesional_nombre",
//       sorter: (a, b) => a.id - b.id,
//       defaultSortOrder: "descend",
//       render: (text, record) => <p>{record.profesional_apellido} {text}</p>,
//     },
//     {
//       title: "Telefono",
//       dataIndex: "profesional_telefono",
//       sorter: (a, b) => a.id - b.id,
//       defaultSortOrder: "descend",
//       render: (text) => <p>{text}</p>,
//     },
//     {
//       title: "Estado Pago",
//       dataIndex: "estadoPago",
//       filters: [
//         { text: "Pending", value: "pending" },
//         { text: "Rejected", value: "rejected" },
//         { text: "Approved", value: "approved" },
//       ],
//       onFilter: (value, record) => record?.estadoPago?.indexOf(value) === 0,
//       render: (estadoPago) => (
//         <>
//           {estadoPago === "approved" ? (
//             <Tag color="green">Approved</Tag>
//           ) : estadoPago === "rejected" ? (
//             <Tag color="red">Failure</Tag>
//           ) : (
//             <Tag color="yellow">Pending</Tag>
//           )}
//         </>
//       ),
//     },
//     {
//       title: "Estado Servicio",
//       dataIndex: "estadoServicio",
//       filters: [
//         { text: "Pendiente", value: "Pendiente" },
//         { text: "Completado", value: "Completado" },
//         { text: "Cancelado", value: "Cancelado" },
//       ],
//       onFilter: (value, record) => record?.estadoServicio?.indexOf(value) === 0,
//       render: (estadoServicio) => (
//         <>
//           {estadoServicio === "Completado" ? (
//             <Tag color="green">Completado</Tag>
//           ) : estadoServicio === "Cancelado" ? (
//             <Tag color="red">Cancelado</Tag>
//           ) : (
//             <Tag color="yellow">Pendiente</Tag>
//           )}
//         </>
//       ),
//     },
//     // {
//     //   title: "payment_id",
//     //   dataIndex: "payment_id",
//     //   render: (text) => <p>{text}</p>,
//     // },
//     // {
//     //   title: "payment_type",
//     //   dataIndex: "payment_type",
//     //   render: (text) => <p>{text}</p>,
//     // },
//     // {
//     //   title: "merchant_order_id",
//     //   dataIndex: "merchant_order_id",
//     //   render: (text) => <p>{text}</p>,
//     // },
//     {
//       title: "EDITAR",
//       dataIndex: "",
//       render: (value) => (
//         <div className="ActionsDiv">
//           <button
//             className="ButtonsActions"
//             onClick={() => setEditProduct(value._id)}
//           >
//             <BiEditAlt />
//           </button>
//         </div>
//       ),
//     },
//     Table.EXPAND_COLUMN,
//   ];

//   return (
//     // style={{ width: '100%', height: '400px', overflow: 'auto' }}
//     <div
//       style={{ textAlign: "center", alignItems: "center", overflow: "auto" }}
//     >
//       <p className="p">ORDENES </p>
//       <p className="p">
//         Busqueda : Id de Orden, ó Datos de cliente, Datos Profesional, Fecha y
//         Hora del Servicio (YYYY-MM-DD){" "}
//       </p>
//       <h1 style={{ textAlign: "center", alignItems: "center" }}>
//         <Input.Search
//           placeholder="Buscar Ordenes"
//           onChange={(e) => setSearchText(e.target.value)}
//           style={{
//             width: 400,
//             marginBottom: "0px",
//             textAlign: "center",
//             alignItems: "center",
//           }}
//         />
//       </h1>
//       <p className="p">
//         Puede ordenar ascendente o descendentemente con las flechas en Datos de
//         la tabla
//       </p>

//       <div
//         style={{
//           margin: "0px",
//           marginLeft: "0px",
//           marginTop: "0px",
//           padding: "0px",
//           // width: '100%', height: '1000px', overflowY: "auto", overflowX: 'auto'
//         }}
//       >
//         <Table
//           style={{ backgroundColor: "rgb(245, 245, 235)" }}
//           columns={columns}
//           dataSource={filteredOrdenes}
//           expandable={{
//             expandedRowRender: (record) => (
//               <ProductExpanded
//                 key={record._id}
//                 _id={record._id}
//                 cliente_email={record.cliente_email}
//                 cliente_nombre={record.cliente_nombre}
//                 cliente_apellido={record.cliente_apellido}
//                 cliente_cedula={record.cliente_cedula}
//                 cliente_telefono={record.cliente_telefono}
//                 profesional_email={record.profesional_email}
//                 profesional_nombre={record.profesional_nombre}
//                 profesional_apellido={record.profesional_apellido}
//                 direccion_Servicio={record.direccion_Servicio}
//                 adicional_direccion_Servicio={
//                   record.adicional_direccion_Servicio
//                 }
//                 localidad_Servicio={record.localidad_Servicio}
//                 telefono_Servicio={record.telefono_Servicio}
//                 estadoServicio={record?.estadoServicio}
//                 estadoFacturacion={record?.estadoFacturacion}
//                 numeroFacturacion={record?.numeroFacturacion}
//                 estadoLiquidacion={record?.estadoLiquidacion}
//                 numeroLiquidacion={record?.numeroLiquidacion}
//                 editProduct={editProduct}
//                 setEditProduct={setEditProduct}
//               />
//             ),
//           }}
//         />
//       </div>

//       {/* <div style={{ marginTop: "80px", padding: "20px" }}>
//         <Table
//           style={{ backgroundColor: "rgb(245, 245, 235)" }}
//           columns={columns}
//           dataSource={orders}
//         />
//       </div> */}
//     </div>
//   );
// };

// export default OrdenesAntDesing;
