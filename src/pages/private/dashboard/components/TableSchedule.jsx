import fileDownload from "js-file-download";
import React from "react";
import { useState, useMemo } from "react";
import { AiOutlineCloudDownload } from "react-icons/ai";
import { BsPersonCircle } from "react-icons/bs";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useDispatch } from "react-redux";
import Spinner from "../../../../components/Spinner";
import clienteAxios from "../../../../config/axios";
import useGetDateTable from "../../../../hooks/useGetDateTable";
import { localidadesLaborales } from "../../../../data";
import ModalUser from "./ModalUser";
import { Link } from "react-router-dom";
import { Table } from 'antd';
import { useEffect } from 'react';
import axios from 'axios';
import { set } from "date-fns";
import ModalUserInfo from "./ModalUserInfo";

const LinksPerfiles = {
  CLIENTE: "/dashboard/perfil-cliente",
  ADMIN: "/dashboard/perfil-admin",
  PROFESIONAL: "/dashboard/perfil-profesional",
};

const TablaHorarios = () => {
  const [modal, setModal] = useState(false);
  const [info, setInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const getHorarios = async () => {
      setLoading(true);
      try {
        const response = await clienteAxios.get('api/buscar/get-profesionales');

          setInfo(response.data);
          setLoading(false);
      } catch (error) {
        console.error('Error al obtener los logs', error);
      }
    };
    getHorarios();
  }, []);

  const newData = info.flatMap((item) =>
  item.creador.especialidad.flatMap((esp, index) => {
    const loc = item.creador.localidadesLaborales[index] || '';
    return {      
      key: `${item.key}-esploc-${index}`,
      creador: {
        _id: item.creador.creador._id,
        nombre: item.creador.creador.nombre,
        apellido: item.creador.creador.apellido,
        email: item.creador.creador.email,
        telefono: item.creador.creador.telefono,
        especialidad: esp,
        localidad: loc,
        fecha: item.fecha,
        horarios: item.horarios,
      },      
      };
  })
);

const buscadorUsuarios = useMemo(() => {
  if (!newData || !Array.isArray(newData) || !newData.length) {
    return [];
  }
  return newData.filter(
    (user) =>
      user.creador.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.creador.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.creador.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
        user.creador.apellido.toLowerCase().includes(searchTerm.toLowerCase())) ||
      user.creador.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
}, [newData, searchTerm]);

//console.log(newData)
const columns = [
  {
    title: 'Nombre',
    dataIndex: 'creador',
    sorter: (a, b) => a.id - b.id,
    defaultSortOrder: 'ascend',
    render: (index) => <b>{`${index.nombre} ${index.apellido}`}</b>
  },
  {
    title: 'Contacto',
    dataIndex: 'creador',
    sorter: (a, b) => a.id - b.id,
    defaultSortOrder: 'ascend',
    render: (index) => <b>{`${index.email} ${index.telefono}`}</b>
  },
  {
    title: 'Especialidad',
    dataIndex: 'creador',
    sorter: (a, b) => a.id - b.id,
    defaultSortOrder: 'descend',
    render: (index) => index.especialidad
  },
  {
    title: 'Localidad Laboral',
    dataIndex: 'creador',
    sorter: (a, b) => a.id - b.id,
    defaultSortOrder: 'descend',
    render: (index) => index.localidad
  },
  {
    title: 'Fecha Disponible',
    dataIndex: 'creador',
    sorter: (a, b) => a.id - b.id,
    defaultSortOrder: 'descend',
    render: (index) => index.fecha
  },
  {
    title: 'Horarios',
    dataIndex: 'creador',    
    render: (index) => (
      <div className="text-red-500">
        {(index.horarios).map(obj => (obj.hora)).join(", ")}
      </div>
    )
  },
  
  // {
  //   title: 'Horarios',
  //   dataIndex: 'creador',    
  //   render: (index) => (index.horarios).map(obj => (obj.hora)).join(", ")
  // },
  {
    title: "Perfil",
    dataIndex: "creador",
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
          to={`/dashboard/perfil-profesional/${text._id}`}
          type="button"
          className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 w-auto md:w-full"
        >
          Perfil
        </Link>
      </>
    ),
  },
];

  return (

    <div>

      <div className="block relative">

        <input
          placeholder="Nombre, Apellido, Email"
          className="appearance-none rounded-r rounded-l sm:rounded-l-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none ml-32"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="ml-24">      
      <Table
        columns={columns}
        dataSource={buscadorUsuarios}
        loading={loading}
        rowKey={(record) => record.key}
      />
      </div>
    </div>
  );
};

const TableSchedule = () => {
  const { paginado, setLimite, limite, pagina, setPagina, loading } =
    useGetDateTable("PROFESIONAL");

  const [userState, setUserState] = useState({});
  const [modal, setModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [localidad, setLocalidad] = useState("");

  const dispatch = useDispatch();

  const handleDownload = (url, filename) => {
    clienteAxios
      .get(url, {
        responseType: "blob",
      })
      .then((res) => {
        fileDownload(res.data, filename);
      });
  };

  const handleUser = async (user) => {
    try {
      const { data } = await clienteAxios.get(
        `api/profesional/perfil-profesional-id/${user.profesional}`
      );

      setUserState({
        nombre: user.nombre,
        horarios: data.disponibilidad,
      });
    } catch (err) {
      console.log(err);
    }

    setModal(true);
  };
  // console.log("USERSTATE", userState);

  const handleModalView = () => {
    setModal(!modal);
  };

  const sortedUsers = useMemo(() => {
    if (!paginado || !paginado.resultados) {
      return [];
    }
    return [...paginado.resultados].sort((a, b) =>
      a.nombre.localeCompare(b.nombre)
    );
  }, [paginado?.resultados]);

  const filteredUsers = useMemo(() => {
    if (!sortedUsers) {
      return [];
    }
    return sortedUsers.filter(
      (user) =>
        user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
          user.apellido.toLowerCase().includes(searchTerm.toLowerCase())) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedUsers, searchTerm]);

  return (
    <>
      <div className="ml-1">     
      {loading ? (
        <p>Cargando...</p>
      ) : (
      <TablaHorarios />
      )}
      </div>
    </>
  );
};

export default TableSchedule;
