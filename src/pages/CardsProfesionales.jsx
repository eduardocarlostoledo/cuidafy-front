import { Card, Input, Pagination } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { disponibilidadesTotalesGet } from "../redux/features/professionalSlice"; // Importa la acción correspondiente desde tu archivo de acciones
import { useEffect, useMemo, useState } from "react";

const CardsProfessionalAntDesing = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);

  useEffect(() => {
    dispatch(disponibilidadesTotalesGet())
      .then(() => setLoading(false))
      .catch((error) => setError(error.message));
  }, [dispatch]);

  let orders = useSelector((state) => state.professional.disponibilidad || []);
  if (!Array.isArray(orders)) {
    orders = [];
  }

  const newProducts = orders?.map((product) => ({
    ...product,
    key: product._id,
  }));

  const filteredOrdenes = useMemo(() => {
    return newProducts?.filter((orden) => {
      const { creador, fecha, disponibilidad } = orden;
      const {
        telefono,
        email,
        nombre,
        apellido,
        localidadesLaborales,
        especialidad,
      } = creador?.creador;

      const nombreCompleto = `${nombre} ${apellido}`.toLowerCase();

      const matchLocalidad = creador.localidadesLaborales?.some((localidad) =>
        localidad.toLowerCase().includes(searchText.toLowerCase())
      );

      const matchEspecialidad = creador.especialidad?.some((especialidades) =>
        especialidades.toLowerCase().includes(searchText.toLowerCase())
      );

      const matchHoraServicio = disponibilidad?.some((hora) =>
        hora.hora.toLowerCase().includes(searchText.toLowerCase())
      );

      return (
        telefono?.includes(searchText) ||
        email?.includes(searchText) ||
        nombreCompleto.includes(searchText.toLowerCase()) ||
        (nombre?.toLowerCase().includes(searchText.toLowerCase()) &&
          apellido?.toLowerCase().includes(searchText.toLowerCase())) ||
        moment(fecha, "YYYY-MM-DD").format("YYYY-MM-DD").includes(searchText) ||
        matchHoraServicio ||
        matchLocalidad ||
        matchEspecialidad
      );
    });
  }, [newProducts, searchText]);

  const paginatedData = filteredOrdenes.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const renderCards = () => {
    return paginatedData.map((orden) => {
      const { creador, fecha, disponibilidad } = orden;
      const { telefono, email, nombre, apellido, localidadesLaborales } =
        creador?.creador;

      const nombreCompleto = `${nombre} ${apellido}`;

      return (
        <Card
          key={orden.key}
          style={{
            marginBottom: 20,
            display: "flex",
            width: "30%",
            height: "45rem",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
            boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#ffffff",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                // margin: "auto",
                width: "10rem",
                height: "10rem",
                marginRight: 16,
                borderRadius: "50%",
                overflow: "hidden",
              }}
            >
              <img
                src={orden.creador.creador.img}
                alt={`Foto de perfil de ${nombreCompleto} `}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div style={{ width: "80%", margin: "auto" }}>
              <p
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  letterSpacing: ".5rem",
                  marginBottom: 16,
                }}
              >
                {nombreCompleto}
              </p>
              {/* <div>
                <p style={{ marginBottom: 8 }}>
                  <b>Teléfono:</b> {telefono}
                </p>
                <p style={{ marginBottom: 8 }}>
                  <b>Email:</b> {email}
                </p>
              </div> */}
              <div
                style={{ maxHeight: 100, overflowY: "auto", marginBottom: 16 }}
              >
                <p style={{ overflowX: "none" }}>
                  <b>Especialidad:</b>
                  <br />
                  <select>
                    {orden.creador.especialidad?.map((e, index) => (
                      <option key={index} value={e}>
                        {e}
                      </option>
                    ))}
                  </select>
                  {/* {creador.especialidad?.map((especialidad) => (
                    <span key={especialidad} style={{ display: "block" }}>
                      {especialidad}
                    </span>
                  ))} */}
                </p>
              </div>
              <div
                style={{ maxHeight: 100, overflowY: "auto", marginBottom: 16 }}
              >
                <p>
                  <b>Localidad:</b>
                  <br />
                  {creador.localidadesLaborales?.map((localidad) => (
                    <span key={localidad} style={{ display: "block" }}>
                      {localidad}
                    </span>
                  ))}
                </p>
              </div>
              <p style={{ marginBottom: 8 }}>Fecha: {fecha}</p>
              <div
                style={{ maxHeight: 100, overflowY: "auto", marginBottom: 16 }}
              >
                <p>
                  <b>Hora:</b>
                  <br />
                  {disponibilidad?.map((hora) => (
                    <span key={hora.hora} style={{ display: "block" }}>
                      {hora.hora}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>
        </Card>

        // <Card
        //   key={orden.key}
        //   style={{
        //     marginBottom: 20,
        //     display: "flex",
        //     width: "30%",
        //     height: "35rem",
        //     alignItems: "center",
        //     justifyContent: "center",
        //   }}
        // >
        //   <div
        //     style={{
        //       margin: "auto",
        //       width: "10rem",
        //       height: "10rem",
        //       marginRight: 16,
        //     }}
        //   >
        //     <img
        //       src={orden.creador.creador.img}
        //       alt={`Foto de perfil de ${nombreCompleto} `}
        //       style={{ width: "100%", height: "100%", objectFit: "cover" }}
        //     />
        //   </div>
        //   <div style={{ Width: "80%", margin: "auto" }}>
        //     <p className="">
        //       <b style={{ fontSize: "1.2rem", letterSpacing: ".5rem" }}>
        //         {nombreCompleto}
        //       </b>
        //     </p>
        //     <div>
        //       <p>Teléfono: {telefono}</p>
        //       <p>Email: {email}</p>
        //     </div>
        //     <div style={{ maxHeight: 100, overflowY: "auto" }}>
        //       <p>
        //         <b>Especialidad:</b>
        //         <br />
        //         {creador.especialidad?.map((especialidad) => (
        //           <p key={especialidad}>{especialidad}</p>
        //         ))}
        //       </p>
        //     </div>
        //     <div style={{ maxHeight: 100, overflowY: "auto" }}>
        //       <p>
        //         <b>Localidad:</b>
        //         <br />
        //         {creador.localidadesLaborales?.map((localidad) => (
        //           <p key={localidad}>{localidad}</p>
        //         ))}
        //       </p>
        //     </div>
        //     <p>Fecha: {fecha}</p>
        //     <div style={{ maxHeight: 100, overflowY: "auto" }}>
        //       <p>
        //         <b>Hora:</b>
        //         <br />
        //         {disponibilidad?.map((hora) => (
        //           <p key={hora.hora}>{hora.hora}</p>
        //         ))}
        //       </p>
        //     </div>

        //     {/* <div> */}

        //     {/* <p>
        //         <b>Especialidad:</b>
        //         <br />{" "}
        //         {creador.especialidad?.map((especialidad) => (
        //           <p>{especialidad}</p>
        //         ))}
        //       </p>
        //     </div>
        //     <p>
        //       <b>Localidad:</b> <br />
        //       {creador.localidadesLaborales?.map((localidad) => (
        //         <p>{localidad}</p>
        //       ))}
        //     </p>
        //     <p>Fecha: {fecha}</p>
        //     <p>
        //       Hora:{" "}
        //       {disponibilidad?.map((hora) => (
        //         <p>{hora.hora}</p>
        //       ))}
        //     </p> */}
        //   </div>
        // </Card>
      );
    });
  };

  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);

    const selectedRows = filteredOrdenes.filter((orden) =>
      selectedRowKeys.includes(orden.key)
    );
  };

  const onPageChange = (page, pageSize) => {
    setCurrentPage(page);
  };

  return (
    <div
      style={{ textAlign: "center", alignItems: "center", overflow: "auto" }}
    >
      <p className="p">DISPONIBILIDAD PROFESIONAL</p>
      <p className="p">
        BUSQUEDA POR NOMBRE, APELLIDO, ESPECIALIDAD, TELEFONO, EMAIL, LOCALIDAD
        LABORAL, FECHA DE DISPONIBILIDAD, HORA DISPONIBLE.
      </p>

      <h1 style={{ textAlign: "center", alignItems: "center" }}>
        <Input.Search
          placeholder="Buscar"
          onChange={(e) => setSearchText(e.target.value)}
          style={{
            width: 400,
            marginBottom: "0px",
            textAlign: "center",
            alignItems: "center",
          }}
        />
      </h1>

      <div
        style={{
          margin: "0px",
          marginLeft: "0px",
          marginTop: "0px",
          padding: "0px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        {renderCards()}
      </div>
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={filteredOrdenes.length}
        onChange={onPageChange}
        style={{ marginTop: 16, marginBottom: 16, textAlign: "center" }}
      />
    </div>
  );
};

export default CardsProfessionalAntDesing;
