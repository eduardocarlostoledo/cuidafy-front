import react, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Input, Pagination } from "antd";
import { disponibilidadesTotalesGet } from "../redux/features/professionalSlice";

function separarNombre(nombre) {
  if (nombre.includes(" ")) {
    return nombre.split(" ")[0];
  } else {
    return nombre;
  }
}

const RecomendationCards = ({
  profesional,
  setProfesional,
  setProfesionalesRequest,
  profesionalesRequest,
  setHoursSelect,
  limpiarHorarios,
  handleProfesional,
  setInputValue,
  inputValue,
  setSelectCard,
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [localidad, setLocalidad] = useState("");
  const [services, setServices] = useState("");

  useEffect(() => {
    dispatch(disponibilidadesTotalesGet())
      .then(() => setLoading(false))
      .catch((error) => setError(error.message));
    const valorLocalidad = localStorage.getItem("localidad");
    const valorServices = JSON.parse(localStorage.getItem("services") || []);
    valorLocalidad && setLocalidad(valorLocalidad);
    valorServices && setServices(valorServices);
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
      const { creador } = orden;

      const horas = separarHoras(orden.disponibilidad);
      if (horas === null) {
        return;
      }
      const matchLocalidad = creador.localidadesLaborales?.some((loca) =>
        loca?.toLowerCase().includes(localidad?.toLowerCase())
      );

      const matchEspecialidad = creador.especialidad?.some((especialidades) =>
        especialidades
          ?.toLowerCase()
          .includes(services[0]?.nombre?.toLowerCase())
      );
      return matchLocalidad && matchEspecialidad;
    });
  }, [newProducts, searchText]);

  const limit = filteredOrdenes.slice(0, 20);

  const paginatedData = limit.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  function separarHoras(array) {
    if (array?.length > 0) {
      const primerObjeto = array[0];
      const ultimoObjeto = array[array?.length - 1];
      const primeraHora = primerObjeto.hora.split("-")[0];
      const ultimaHora = ultimoObjeto.hora.split("-")[1];
      return { primeraHora, ultimaHora };
    }
    return null;
  }
  function limitarTexto(texto, limite) {
    if (texto?.length > limite) {
      return texto.substring(0, limite) + "...";
    }
    return texto;
  }

  const renderCards = () => {
    return paginatedData.map((orden) => {
      const { creador, fecha, disponibilidad } = orden;
      const { telefono, email, nombre, apellido, localidadesLaborales } =
        creador?.creador;
      const horas = separarHoras(disponibilidad);
      if (horas === null) {
        return [];
      }
      const nombreCompleto = `${separarNombre(nombre)} ${separarNombre(
        apellido
      )}`;

      return (
        <Card
          key={orden.key}
          style={{
            marginBottom: 20,
            display: "flex",
            width: "100%",
            maxWidth: "18rem",
            height: "auto",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
            boxShadow: "0px 1px 10px rgba(0, 0, 0, 0.3)",
            backgroundColor: "#ffffff",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "1rem",
            }}
          >
            <div
              style={{
                width: "100%",
                aspectRatio: "4/3",
                borderRadius: "5%",
                overflow: "hidden",
              }}
            >
              <img
                src={
                  orden.creador.creador.img ||
                  "https://t3.ftcdn.net/jpg/03/58/90/78/360_F_358907879_Vdu96gF4XVhjCZxN2kCG0THTsSQi8IhT.jpg"
                }
                alt={`Foto de perfil de ${nombreCompleto} `}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div style={{ width: "100%", margin: "auto", marginTop: "1rem" }}>
              <p
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  letterSpacing: ".1rem",
                  marginBottom: 16,
                }}
              >
                {nombreCompleto}
              </p>
              {creador?.descripcion && (
                <p style={{ marginBottom: 16 }}>
                  {limitarTexto(creador.descripcion, 50)}
                </p>
              )}
              <div
                style={{ maxHeight: 100, overflowY: "auto", marginBottom: 16 }}
              ></div>
              <p style={{ marginBottom: 8 }}>
                Fecha: <b>{fecha}</b>
              </p>
              <div
                style={{ maxHeight: 100, overflowY: "auto", marginBottom: 16 }}
              >
                {horas && (
                  <p>
                    Disponible entre <b>{horas?.primeraHora}</b> y{" "}
                    <b>{horas?.ultimaHora}</b>
                  </p>
                )}
              </div>
            </div>
          </div>
          {!inputValue.date && (
            <button
              onClick={() => handlesubmit(fecha, orden)}
              style={{
                padding: 5,
                border: "2px solid grey",
                borderRadius: 5,
                backgroundColor: "#EDA598",
                color: "#fff",
                width: "100%",
              }}
            >
              Seleccionar hora
            </button>
          )}
        </Card>
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

  const handlesubmit = (fecha, profesional) => {
    setInputValue({ ...inputValue, date: fecha });
    setSelectCard(true);
    handleProfesional(profesional);
  };

  if (!filteredOrdenes?.length > 0) {
    return [];
  }

  return (
    <div
      style={{
        width: "80%",
        textAlign: "center",
        alignItems: "center",
        overflow: "auto",
        margin: "auto",
      }}
    >
      <h2 style={{ fontSize: "1.7rem", marginBottom: "2rem" }}>
        Profesionales Disponibles
      </h2>
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
        size="small"
        current={currentPage}
        pageSize={pageSize}
        showSizeChanger={false}
        total={limit?.length}
        onChange={onPageChange}
        style={{ marginTop: 16, marginBottom: 16, textAlign: "center" }}
      />
    </div>
  );
};

export default RecomendationCards;
