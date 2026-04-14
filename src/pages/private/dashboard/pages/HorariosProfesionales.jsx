import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Input, Select } from "antd";
import { BiEditAlt } from "react-icons/bi";
import moment from "moment";
import "./Ordenesantd.css";
import { disponibilidadesTotalesGet } from "../../../../redux/features/professionalSlice";
import { especialidadesHabilitadas } from "../../../../data";

const { Option } = Select;

const HorarioProfessionalAntDesing = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedEspecialidad, setSelectedEspecialidad] = useState(null);
  const [selectedLocalidad, setSelectedLocalidad] = useState(null);
  const [filteredOrdenes, setFilteredOrdenes] = useState([]);

  useEffect(() => {
    dispatch(disponibilidadesTotalesGet())
      .then(() => setLoading(false))
      .catch((error) => setError(error.message));
  }, [dispatch]);

  const orders = useSelector(
    (state) => (state.professional.disponibilidad || [])
  );
  const localityOptions = Array.from(
    new Set(
      (Array.isArray(orders) ? orders : []).flatMap(
        (order) => order?.creador?.localidadesLaborales || []
      )
    )
  ).sort((a, b) => a.localeCompare(b, "es"));
  
  useEffect(() => {
    filterOrdenes();
  }, [orders, searchText, selectedEspecialidad, selectedLocalidad]);

  const columns = [
    {
      title: "Nombre",
      dataIndex: "creador",
      defaultSortOrder: "descend",
      render: (creador) => (
        <p>
          <b>
            {creador.creador.nombre} {creador.creador.apellido}
          </b>
        </p>
      ),
    },
    {
      title: "Especialidad",
      dataIndex: "creador",
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "descend",
      render: (text) => (text.especialidad).map(obj => (obj)).join(", ")
    },
    {
      title: "Telefono",
      dataIndex: "creador",
      defaultSortOrder: "descend",
      render: (creador) => <p>{creador.creador.telefono}</p>,
    },
    {
      title: "email",
      dataIndex: "creador",
      defaultSortOrder: "descend",
      render: (creador) => <p>{creador.email}</p>,
    },
    {
      title: "Localidad",
      dataIndex: "creador",
      defaultSortOrder: "descend",
      render: (text) =>
        (text.localidadesLaborales).map(localidad => (localidad)).join(", "),
    },
    {
      title: "Fecha",
      dataIndex: "fecha",
      defaultSortOrder: "descend",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Hora",
      dataIndex: "disponibilidad",
      defaultSortOrder: "descend",
      render: (text) => 
      text.map(localidad => (localidad.hora)).join(", "),
    },
  ];

  const filterOrdenes = (() => {
    // Validar que orders sea un array no vacío
    if (!Array.isArray(orders) || orders.length === 0) {
      setFilteredOrdenes([]);
      return;
    }

    const filtered = orders.filter((orden) => {
      // Validar estructura del orden
      if (!orden || !orden.creador) {
        return false;
      }

      const { creador, fecha, disponibilidad } = orden;
      const {
        telefono = "",
        email = "",
        nombre = "",
        apellido = "",
        localidadesLaborales = [],
        especialidad = [],
      } = creador?.creador || {};

      const nombreCompleto = `${nombre} ${apellido}`.toLowerCase();

      const matchLocalidad = Array.isArray(creador.localidadesLaborales) &&
        creador.localidadesLaborales.some((localidad) =>
          localidad.toLowerCase().includes(searchText.toLowerCase())
        );

      const matchEspecialidad = Array.isArray(creador.especialidad) &&
        creador.especialidad.some((especialidades) =>
          especialidades.toLowerCase().includes(searchText.toLowerCase())
        );

      const coincideConSelectLocalidadesLaborales =
        Array.isArray(creador.localidadesLaborales) &&
        creador.localidadesLaborales.some((localidad) =>
          localidad.toLowerCase().includes(selectedLocalidad?.toLowerCase() || "")
        );

      const coincideConSelectEspecialidad = Array.isArray(creador.especialidad) &&
        creador.especialidad.some(
          (especialidades) =>
            especialidades
              .toLowerCase()
              .includes(selectedEspecialidad?.toLowerCase() || "")
        );

      const matchHoraServicio = Array.isArray(disponibilidad) &&
        disponibilidad.some((hora) =>
          hora?.hora?.toLowerCase().includes(searchText.toLowerCase())
        );

      if (selectedEspecialidad || selectedLocalidad) {
        return (
          (telefono?.includes(searchText) ||
            email?.includes(searchText) ||
            nombreCompleto.includes(searchText.toLowerCase()) ||
            (nombre?.toLowerCase().includes(searchText.toLowerCase()) &&
              apellido?.toLowerCase().includes(searchText.toLowerCase())) ||
            (fecha && moment(fecha, "YYYY-MM-DD")
              .format("YYYY-MM-DD")
              .includes(searchText)) ||
            matchHoraServicio) &&
          (selectedEspecialidad && selectedLocalidad
            ? coincideConSelectEspecialidad &&
              coincideConSelectLocalidadesLaborales
            : coincideConSelectEspecialidad ||
              coincideConSelectLocalidadesLaborales)
        );
      }

      return (
        telefono?.includes(searchText) ||
        email?.includes(searchText) ||
        nombreCompleto.includes(searchText.toLowerCase()) ||
        (nombre?.toLowerCase().includes(searchText.toLowerCase()) &&
          apellido?.toLowerCase().includes(searchText.toLowerCase())) ||
        (fecha && moment(fecha, "YYYY-MM-DD").format("YYYY-MM-DD").includes(searchText)) ||
        matchHoraServicio
      );
    });

    setFilteredOrdenes(filtered);
  });

  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);

    const selectedRows = filteredOrdenes.filter((orden) =>
      selectedRowKeys.includes(orden.key)
    );
  
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

      {loading ? (
        <p style={{ fontSize: "16px", marginTop: "20px" }}>Cargando datos...</p>
      ) : error ? (
        <p style={{ fontSize: "16px", color: "red", marginTop: "20px" }}>Error: {error}</p>
      ) : !Array.isArray(orders) || orders.length === 0 ? (
        <p style={{ fontSize: "16px", marginTop: "20px" }}>No hay datos de disponibilidad disponibles</p>
      ) : (
        <>
          <h1 style={{ textAlign: "center", alignItems: "center" }}>
            <Input.Search
              placeholder="Buscar"
              onChange={(e) => setSearchText(e.target.value)}
              style={{
                width: 1000,
                marginBottom: "0px",
                textAlign: "center",
                alignItems: "center",
              }}
            />
          </h1>

          <div
            style={{
              marginBottom: "10px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div>
              <p>Especialidades</p>
              <Select
                placeholder="Filtrar por especialidad"
                style={{ width: 500, marginRight: "10px" }}
                onChange={(value) => setSelectedEspecialidad(value)}
              >
                <Option value={null}>Todos</Option>
                {especialidadesHabilitadas.map((especialidad, index) => (
                  <Option key={index} value={especialidad}>
                    {especialidad}
                  </Option>
                ))}
              </Select>
            </div>
            <div>
              <p>Localidades</p>
              <Select
                placeholder="Filtrar por localidad"
                style={{ width: 500 }}
                onChange={(value) => setSelectedLocalidad(value)}
              >
                <Option value={null}>Todos</Option>
                {localityOptions.map((localidad, index) => (
                  <Option key={index} value={localidad}>
                    {localidad}
                  </Option>
                ))}
              </Select>
            </div>
          </div>

          <div className="py-8 ml-64">
            <Table
              style={{ backgroundColor: "rgb(245, 245, 235)" }}
              columns={columns}
              dataSource={filteredOrdenes}
              rowSelection={{
                selectedRowKeys,
                onChange: onSelectChange,
              }}
              locale={{
                emptyText: "No se encontraron registros"
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default HorarioProfessionalAntDesing;
