import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, List, Spin, Alert, Tag, Input } from "antd";
import { FaWhatsapp } from "react-icons/fa";
import { obtenerUsuarios } from "../../../../redux/features/usuariosSlice";
import ModalUserInfo from "../components/ModalUserInfo";
import fileDownload from "js-file-download";
import Spinner from "../../../../components/Spinner";
import { AiOutlineCloudDownload } from "react-icons/ai";
import { MdKeyboardArrowDown } from "react-icons/md";
import { BsPersonCircle } from "react-icons/bs";
import { Link } from "react-router-dom";
import clienteAxios from "../../../../config/axios";

const LinksPerfiles = {
  CLIENTE: "/dashboard/perfil-cliente",
  ADMIN: "/dashboard/perfil-admin",
  PROFESIONAL: "/dashboard/perfil-profesional",
};

const Customers = () => {
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const [userState, setUserState] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [editProduct, setEditProduct] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const handleDownload = (url, filename) => {
    clienteAxios
      .get(url, {
        responseType: "blob",
      })
      .then((res) => {
        fileDownload(res.data, filename);
      })
      .catch((error) => {
        // Manejo de error de la solicitud
        console.error("Error en la solicitud:", error);
      });
  };

  useEffect(() => {
    dispatch(obtenerUsuarios())
      .then(() => setLoading(false))
      .catch((error) => setError(error.message));
  }, [dispatch]);

  let orders = useSelector((state) => state.usuarios.users || []);
  if (!Array.isArray(orders)) {
    orders = [];
  }

  const newProducts = orders?.map((product) => ({
    ...product,
    key: product._id,
  }));

  const filteredOrdenes = useMemo(() => {
    return newProducts?.filter((orden) => {
      const { nombre, apellido, email, rol, telefono, ultimaConexion } = orden;

      const nombreCompleto = `${nombre} ${apellido}`.toLowerCase();

      return (
        rol?.includes(searchText) ||
        telefono?.includes(searchText) ||
        email?.includes(searchText) ||
        nombreCompleto.includes(searchText.toLowerCase()) ||
        (nombre?.toLowerCase().includes(searchText.toLowerCase()) &&
          apellido?.toLowerCase().includes(searchText.toLowerCase()))
      );
    });
  }, [newProducts, searchText]);

  const columns = [
    {
      title: "Nombre",
      dataIndex: "nombre",
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "descend",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Apellido",
      dataIndex: "apellido",
      defaultSortOrder: "descend",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Rol",
      dataIndex: "rol",
      defaultSortOrder: "descend",
      render: (text) => <p>{text}</p>,
      filters: [
        { text: "CLIENTE", value: "CLIENTE" },
        { text: "PROFESIONAL", value: "PROFESIONAL" },
        { text: "ADMIN", value: "ADMIN" },
      ],
      onFilter: (value, record) => record.rol.includes(value),
      filteredValue: ["CLIENTE"],
    },
    {
      title: "Email",
      dataIndex: "email",
      defaultSortOrder: "descend",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Telefono",
      dataIndex: "telefono",
      defaultSortOrder: "descend",
      render: (text) => {
        // Eliminar el carácter "+" de la variable "telefono"
        const phoneNumber = text?.replace(/\+/g, "");

        return (
          <div>
            <p>{text}</p>
            <a
              href={`https://web.whatsapp.com/send/?phone=${phoneNumber}&text&type=phone_number&app_absent=0`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp size={25} />
            </a>
          </div>
        );
      },
    },

    {
      title: "Ultimo Acceso",
      dataIndex: "ultimaConexion",
      defaultSortOrder: "descend",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Perfil",
      dataIndex: "_id",
      defaultSortOrder: "descend",
      render: (text, record) => (
        <>
          {modal && (
            <ModalUserInfo
              userState={record}
              handleModalView={handleModalView}
              key={text}
            />
          )}
          <Link
            to={`${LinksPerfiles[record.rol]}/${text}`}
            type="button"
            className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200  "
          >
            Ver perfil
          </Link>
        </>
      ),
    },
  ];

  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
    // setModal(!modal);

    const selectedRows = filteredOrdenes.filter((orden) =>
      selectedRowKeys.includes(orden.key)
    );
  };

  return (
    <div
      style={{ textAlign: "center", alignItems: "center", overflow: "auto" }}
    >
      <p className="p">USUARIOS</p>
      <p className="p">BUSQUEDA POR NOMBRE, APELLIDO, TELEFONO, EMAIL, ROL</p>

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
        }}
      >
        <Table
          style={{ backgroundColor: "rgb(245, 245, 235)" }}
          columns={columns}
          dataSource={filteredOrdenes}
          rowSelection={{
            selectedRowKeys,
            onChange: onSelectChange,
          }}
        />
      </div>
      <div>
        <button
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center mr-2 "
          onClick={() => {
            if ([rol].includes("")) {
              handleDownload(`api/usuarios/excel-usuarios`, `usuarios.xlsx`);
            } else {
              handleDownload(
                `api/usuarios/excel-${rol.toLocaleLowerCase()}`,
                `${rol.toLocaleLowerCase() + ".xlsx"}`
              );
            }
          }}
        >
          <AiOutlineCloudDownload />
          <span className="sr-only">Exportar Excel</span>
        </button>
      </div>
    </div>
  );
};

export default Customers;
