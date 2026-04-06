import React, { useEffect, useState, useMemo } from "react";
import {
  getLiquidacion,
  updateLiquidacion,
} from "../../../../redux/features/liquidacionesSlice";
import { useDispatch, useSelector } from "react-redux";
import { Table, Tag, Input, Button, Select, DatePicker } from "antd";
import { AiOutlineClose } from "react-icons/ai";
import { BiEditAlt, BiRefresh } from "react-icons/bi";
import moment from "moment";
import swal from "sweetalert";
import { getOrders } from "../../../../redux/features/ordenesSlice";

const { RangePicker } = DatePicker;

const ProductExpanded = ({
  _id,
  createdAt,
  estadoLiquidacion,
  fechaFin,
  fechaInicio,
  numeroLiquidacion,
  ordenes,
  profesional,
  totalLiquidacion,
  porcentajeCaalyan,
  porcentajeProfesional,
  editProduct,
  setEditProduct,
}) => {
  const dispatch = useDispatch();
  const [input, setInput] = useState({
    _id,
    createdAt,
    estadoLiquidacion,
    fechaFin,
    fechaInicio,
    numeroLiquidacion,
    ordenes,
    profesional,
    totalLiquidacion,
    porcentajeCaalyan,
    porcentajeProfesional,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const change = useSelector((state) => state.ordenes.update);
  let orders = useSelector((state) => state.ordenes.order || []);
  if (!Array.isArray(orders)) {
    orders = [];
  }
  //separo los useEffect para que no se renderize todo junto
  useEffect(() => {
    dispatch(getLiquidacion())
      .then(() => setLoading(false))
      .catch((error) => setError(error.message));
  }, [dispatch, change]);
  // }, [orders, change]);

  // useEffect(() => {
  //   setLoading(true); // updateinprogress
  //   dispatch(updateLiquidacion(false))
  //     // dispatch(getOrders())

  //     .then(() => setLoading(false))
  //     .catch((error) => setError(error.message));
  // }, [dispatch, change, orders]);

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  function handleSubmit(e) {
    e.preventDefault();
    // console.log("INPUT",input);
    const data = new FormData();
    Object.keys(input).forEach((key) => data.append(key, input[key]));
    dispatch(updateLiquidacion(input));
    setEditProduct(0);
    swal("success", "ORDEN MODIFICADA", "success");
  }

  return (
    <div>
      {!(editProduct === _id) && (
        <div className="productExpandedDiv">
          <BiEditAlt
            className="ButtonsActions"
            onClick={() => setEditProduct(input._id)}
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
              <p
                className="PDivInfo"
                style={{
                  border: "1px solid gray",
                  padding: "12px",
                  borderRadius: "5px",
                  fontSize: "17px",
                }}
              >
                Número de facturación: {input.numeroLiquidacion}
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
                Total liquidado: {input.totalLiquidacion}
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
                Porcentaje Calyaan: {input.porcentajeCaalyan}
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
                Porcentaje del profesional: {input.porcentajeProfesional}
              </p>
            </div>
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
                Fecha inicio: {input.fechaInicio?.split("T")[0]?.slice(0, 10)}
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
                Fecha fin: {input.fechaFin?.split("T")[0]?.slice(0, 10)}
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
                Fecha de creacion:{" "}
                {input.createdAt?.split("T")[0]?.slice(0, 10)}
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
                Cédula: {input.profesional.creador.cedula}
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
                Teléfono: {input.profesional.creador.telefono}
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
                Estado del servicio: {input.estadoLiquidacion}
              </p>
            </div>
          </div>
          <div
            style={{
              display: "flex",
            }}
          >
            <b style={{ margin: "auto" }}> Ordenes: </b>
          </div>
          <div
          // style={{
          //   display: "flex",
          //   flexDirection: "row",
          //   flexWrap: "wrap",
          // }}
          >
            {input?.ordenes?.map((order) => (
              <div style={{ padding: "1rem" }}>
                <p>
                  <b>Orden id: </b>
                  {order._id}
                </p>
                <hr />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "nowrap",
                  }}
                >
                  <div
                    style={{
                      width: "50%",
                      display: "flex",
                      flexDirection: "column",
                      gap: ".2rem",
                    }}
                  >
                    {order.ciudad_servicio && (
                      <p>
                        <b>ciudad:</b>
                        {order.ciudad_servicio}
                      </p>
                    )}
                    {order.localidad_servicio && (
                      <p>
                        <b>Estado:</b>
                        {order.localidad_servicio}
                      </p>
                    )}
                    {order.hora_servicio && (
                      <p>
                        <b>hora:</b>
                        {order.hora_servicio}
                      </p>
                    )}
                  </div>
                  <div
                    style={{
                      width: "50%",
                      display: "flex",
                      flexDirection: "column",
                      gap: ".2rem",
                    }}
                  >
                    {order.cita_servicio && (
                      <p>
                        <b>fecha</b>:{order.cita_servicio}
                      </p>
                    )}
                    {order.estado_servicio && (
                      <p>
                        <b>Estado:</b>
                        {order.estado_servicio}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {editProduct === _id && (
        <div className="productExpandedDiv">
          <AiOutlineClose
            onClick={() => setEditProduct(0)}
            color="red"
            size={40}
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
                  <strong>Fecha de inicio </strong>
                </label>
                <input
                  className="InputsEdits"
                  value={input.fechaInicio}
                  onChange={(e) => handleChange(e)}
                  name="fechaInicio"
                  placeholder="Fecha de inicio"
                ></input>
              </div>

              <div>
                <label className="LabelNameImg">
                  <strong>Fecha fin </strong>
                </label>
                <input
                  className="InputsEdits"
                  value={input.fechaFin}
                  onChange={(e) => handleChange(e)}
                  name="fechaFin"
                  placeholder="Fecha fin"
                ></input>
              </div>

              <div>
                <label className="LabelNameImg">
                  <strong>Fecha de creacion </strong>
                </label>
                <input
                  className="InputsEdits"
                  value={input.createdAt}
                  onChange={(e) => handleChange(e)}
                  name="createdAt"
                  placeholder="Fecha de creacion"
                ></input>
              </div>
            </div>
            <div style={{ width: "50%" }}>
              <div>
                <label className="LabelNameImg">
                  <strong>Liquidación</strong>
                </label>
                <select
                  className="InputsEdits"
                  value={input.estadoLiquidacion}
                  onChange={(e) => handleChange(e)}
                  name="estadoLiquidacion"
                  placeholder="Estado de liquidación"
                >
                  <option value="Liquidado">Liquidado</option>
                  <option value="NoLiquidado">No liquidado</option>
                  <option value="Error">Error</option>
                </select>
              </div>

              <div>
                <label className="LabelNameImg">
                  <strong>NºLiquidación</strong>
                </label>
                <input
                  className="InputsEdits"
                  value={input.numeroLiquidacion}
                  onChange={(e) => handleChange(e)}
                  name="numeroLiquidacion"
                  placeholder="Número de liquidación"
                ></input>
              </div>
              <div>
                <label className="LabelNameImg">
                  <strong>Total liquidado</strong>
                </label>
                <input
                  className="InputsEdits"
                  value={input.totalLiquidado}
                  onChange={(e) => handleChange(e)}
                  name="numeroLiquidacion"
                  placeholder="Total liquidado"
                ></input>
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

const { Option } = Select;

const LiquidacionAllAntDesing = () => {
  const dispatch = useDispatch();

  const [selectedRows, setSelectedRows] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedEstadoLiquidacion, setSelectedEstadoLiquidacion] =
    useState("");
  const [selectedRowsTotal, setSelectedRowsTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [editProduct, setEditProduct] = useState(0);
  const change = useSelector((state) => state.liquidaciones.update);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleDateChange = (dates) => {
    const dateNow = dates ? moment(dates[0].$d).format("YYYY/MM/DD") : null;
    const dateNow2 = dates ? moment(dates[1].$d).format("YYYY/MM/DD") : null;

    dates ? setStartDate(dateNow) : setStartDate("");
    dates ? setEndDate(dateNow2) : setEndDate("");
  };

  //separo los useEffect para que no se renderize todo junto
  useEffect(() => {
    dispatch(getLiquidacion())
      .then(() => setLoading(false))
      .catch((error) => setError(error.message));
  }, [dispatch]);

  // useEffect(() => {
  //   dispatch(updateLiquidacion(false))
  //     .then(() => setLoading(false))
  //     .catch((error) => setError(error.message));
  // }, [change]);

  useEffect(() => {
    const total = selectedRows.reduce((acc, row) => acc + row.precio, 0);
    const percentage = total * 0.65;
    setSelectedRowsTotal(percentage);
  }, [selectedRows]);

  let orders = useSelector((state) => state.liquidaciones.liquidacion || []);
  // console.log(orders, "ordenes");
  if (!Array.isArray(orders)) {
    orders = [];
  }
  const handleEditModalOpen = () => {
    setEditModalVisible(true);
  };

  const handleEditModalClose = () => {
    setEditModalVisible(false);
    setSelectedEstadoLiquidacion("");
  };

  const handleEstadoLiquidacionChange = (value) => {
    setSelectedEstadoLiquidacion(value);
  };

  const handleEstadoLiquidacionSave = () => {
    selectedRows.forEach((row) => {
      dispatch(
        updateLiquidacion({
          ...row,
          _id: row._id,
          estadoLiquidacion: selectedEstadoLiquidacion,
        })
      );
    });
    handleEditModalClose();
    setSelectedRows([]);
  };

  const handleRowSelect = (selectedRowKeys, selectedRows) => {
    setSelectedRows(selectedRows);
  };

  const rowSelection = {
    onChange: handleRowSelect,
  };

  const refreshData = () => {
    dispatch(getOrders())
      .then(() => setLoading(false))
      .catch((error) => setError(error.message));
  };

  const newProducts = orders?.map((product) => ({
    ...product,
    key: product._id,
  }));

  const filteredOrdenes = useMemo(() => {
    if (!newProducts || newProducts.length === 0) {
      return [];
    }

    const searchTextLower = searchText.toLowerCase();
    return newProducts.filter((orden) => {
      const fullNameProfesional =
        `${orden.profesional?.creador?.nombre} ${orden.profesional?.creador?.apellido}`.toLowerCase();
      const fullNameProfesionalInverso =
        ` ${orden.profesional?.creador?.apellido} ${orden.profesional?.creador?.nombre}`.toLowerCase();

      const orderDate = moment(orden.createdAt, "YYYY/MM/DD");

      if (startDate && endDate) {
        return (
          (fullNameProfesional?.includes(searchTextLower) ||
            fullNameProfesionalInverso?.includes(searchTextLower) ||
            orden?.factura?.nro_factura?.includes(searchTextLower) ||
            orden?.factura?.payment_id?.includes(searchTextLower) ||
            orden?._id?.includes(searchTextLower) ||
            orden?.cliente_id?.cedula.includes(searchTextLower) ||
            orden?.cliente_id?.telefono?.includes(searchTextLower) ||
            orden?.cliente_id?.email?.includes(searchTextLower) ||
            orden?.direccion_Servicio
              ?.toLowerCase()
              .includes(searchTextLower)) &&
          orderDate.isBetween(startDate, endDate, null, "[]")
        );
      }

      return (
        fullNameProfesional?.includes(searchTextLower) ||
        fullNameProfesionalInverso?.includes(searchTextLower) ||
        orden?.factura?.nro_factura?.includes(searchTextLower) ||
        orden?.factura?.payment_id?.includes(searchTextLower) ||
        orden?._id?.includes(searchTextLower) ||
        orden?.cliente_id?.cedula.toString().includes(searchTextLower) ||
        orden?.cliente_id?.telefono?.includes(searchTextLower) ||
        orden?.cliente_id?.email?.includes(searchTextLower) ||
        orden?.direccion_Servicio?.toLowerCase()?.includes(searchTextLower)
      );
    });
  }, [newProducts, searchText, startDate, endDate]);
  console.log(filteredOrdenes, "filt");
  const columns = [
    Table.EXPAND_COLUMN,
    {
      title: "Profesional",
      dataIndex: "profesional",
      render: ({ creador }) =>
        creador ? (
          <div>
            <div>
              <b>Nombre y apellido</b>
              <p>
                {creador?.apellido} {creador?.nombre}
              </p>
            </div>
            <hr />
            <div>
              <b>Cedula</b>
              <p>{creador?.cedula}</p>
            </div>
            <hr />
            <div>
              <b>Telefono</b>
              <p>{creador?.telefono}</p>
            </div>
            <hr />
            <div>
              <b>Email</b>
              <p>{creador?.email}</p>
            </div>
          </div>
        ) : (
          <div>
            <b>Profesional no seleccionado</b>
          </div>
        ),
    },
    {
      title: "Fechas liquidadas",
      dataIndex: "fechaInicio",
      render: (text, record) =>
        text ? (
          <p>
            {text?.split("T")[0]?.slice(0, 10)}
            <hr />
            {record.fechaFin?.split("T")[0]?.slice(0, 10)}
          </p>
        ) : (
          <b>Sin horario</b>
        ),
    },
    {
      title: "Nro.Liquidacion",
      dataIndex: "numeroLiquidacion",
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "descend",
      render: (text) => <p>{text} </p>,
    },
    // {
    //   title: "Ordenes",
    //   dataIndex: "ordenes",
    //   render: (text) =>
    //     text.map((order, index) => (
    //       <div>
    //         <p>Orden N°{index + 1}</p>
    //         <hr />
    //         {order.ciudad_servicio && (
    //           <p>
    //             <b>ciudad:</b>
    //             {order.ciudad_servicio}
    //           </p>
    //         )}
    //         {order.hora_servicio && (
    //           <p>
    //             <b>hora:</b>
    //             {order.hora_servicio}
    //           </p>
    //         )}
    //         {order.cita_servicio && (
    //           <p>
    //             <b>fecha</b>:{order.cita_servicio}
    //           </p>
    //         )}
    //         {order.estado_servicio && (
    //           <p>
    //             <b>Estado:</b>
    //             {order.estado_servicio}
    //           </p>
    //         )}
    //       </div>
    //     )),
    // },
    {
      title: "COTIZACION",
      dataIndex: "totalLiquidacion",
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "descend",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "estado de Liquidacion",
      dataIndex: "estadoLiquidacion",
      render: (estadoLiquidacion) => (
        <>
          {estadoLiquidacion === "Liquidado" ? (
            <Tag color="green">Liquidado</Tag>
          ) : estadoLiquidacion === "Error" ? (
            <Tag color="red">Error</Tag>
          ) : (
            <Tag color="yellow">NoLiquidado</Tag>
          )}
        </>
      ),
    },
  ];

  return (
    <div style={{ textAlign: "center", alignItems: "center" }}>
      <p className="p">
        <b>LIQUIDACIONES TOTALES</b>
      </p>
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
            <b>Fecha</b>
          </p>
          <RangePicker onChange={handleDateChange} format={"YYYY/MM/DD"} />
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
                key={record._id}
                _id={record._id}
                createdAt={record.createdAt}
                estadoLiquidacion={record.estadoLiquidacion}
                fechaFin={record.fechaFin}
                fechaInicio={record.fechaInicio}
                numeroLiquidacion={record.numeroLiquidacion}
                ordenes={record.ordenes}
                profesional={record.profesional}
                totalLiquidacion={record.totalLiquidacion}
                porcentajeCaalyan={record.porcentajeCaalyan}
                porcentajeProfesional={record.porcentajeProfesional}
                editProduct={editProduct}
                setEditProduct={setEditProduct}
              />
            ),
          }}
          // rowSelection={rowSelection}
        />
        {selectedRows.length > 0 && (
          <Button onClick={handleEditModalOpen}>
            Editar Filas Seleccionadas
          </Button>
        )}

        {selectedRows.length > 0 && (
          <div>
            <p>Total de filas seleccionadas: {selectedRows.length}</p>
            <p>Sumatoria de precios: {selectedRowsTotal}</p>
            <p>65% de la sumatoria: {selectedRowsTotal * 0.65}</p>
            <Button onClick={handleEditModalOpen}>
              Editar Filas Seleccionadas
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiquidacionAllAntDesing;
