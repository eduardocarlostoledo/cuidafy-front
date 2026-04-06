import React, { useEffect, useState } from "react";

import CardInfo from "./components/CardInfo";
import TableUsers from "./components/TableUsers";

import {
  BsFillPeopleFill,
  BsStopwatch,
  BsFillPersonBadgeFill,
} from "react-icons/bs";
import { BiCategoryAlt, BiSpa } from "react-icons/bi";
import { SlGraph } from "react-icons/sl";
import { AiOutlineUserDelete } from "react-icons/ai";
import { TbReportMoney } from "react-icons/tb";
import { VscPerson } from "react-icons/vsc";
import { FaRunning, FaUsers } from "react-icons/fa";
import {GiShakingHands} from "react-icons/gi"
import clienteAxios from "../../../config/axios";

const Dashboard = () => {
  const [data, setData] = useState({
    AUsers: 0,
    Users: 0,
    CUsers: 0,
    PUsers: 0,
    newUsers: 0,
    UInactivos: 0,
    PInactivos: 0,
    services: 0,
    Reservas:0,
    Preservas:0,
    PagosAprobados:0,
    RProceso:0
  });

  useEffect(() => {
    const getInfo = async () => {
      try {
        const { data } = await clienteAxios.get(`api/buscar/all`);
        setData(data);
      } catch (err) {
        console.log(err);
      }
    };
    getInfo();
  }, []);

  return (
    <div className="py-8">
      <h1 className="font-bold text-2xl text-gray-700">Dashboard</h1>
      <div className="flex flex-col flex-grow mt-4">
        <div className="flex items-center text-gray-800">
          <div className="p-4 w-full">
            <div className="grid grid-cols-12 gap-4">
              <CardInfo
                title={"Usuarios"}
                icon={<FaUsers className="w-6 h-6" />}
                count={data?.Users}
                color={"cyan"}
              />

              <CardInfo
                title={"Administradores"}
                icon={<BsFillPersonBadgeFill className="w-6 h-6" />}
                count={data?.AUsers}
                color={"emerald"}
              />

              <CardInfo
                title={"Clientes"}
                icon={<BsFillPeopleFill className="w-6 h-6" />}
                count={data?.CUsers}
                color={"blue"}
              />

              <CardInfo
                title={"Profesionales"}
                icon={<VscPerson className="w-6 h-6" />}
                count={data?.PUsers}
                color={"yellow"}
              />

              <CardInfo
                title={"Nuevos clientes"}
                icon={<SlGraph className="w-6 h-6" />}
                count={data?.newUsers}
                color={"orange"}
              />

              <CardInfo
                title={"U Inactivos"}
                icon={<AiOutlineUserDelete className="w-6 h-6" />}
                count={data?.UInactivos}
                color={"red"}
              />

              <CardInfo
                title={"P Inactivos"}
                icon={<VscPerson className="w-6 h-6" />}
                count={data?.PInactivos}
                color={"red"}
              />

              <CardInfo
                title={"Servicios"}
                icon={<TbReportMoney className="w-6 h-6" />}
                count={data?.services}
                color={"green"}
              />

              <CardInfo
                title={"Reservas"}
                icon={<BiSpa className="w-6 h-6" />}
                count={data?.Reservas}
                color={"pink"}
              />

              <CardInfo
                title={"Pendientes"}
                icon={<BsStopwatch className="w-6 h-6" />}
                count={data?.Preservas}
                color={"yellow"}
              />

              <CardInfo
                title={"Aprobados"}
                icon={<GiShakingHands className="w-6 h-6" />}
                count={data?.PagosAprobados}
                color={"green"}
              />

              <CardInfo
                title={"Proceso"}
                icon={<FaRunning className="w-6 h-6" />}
                count={data?.RProceso}
                color={"red"}
              />
            </div>

            <TableUsers />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
