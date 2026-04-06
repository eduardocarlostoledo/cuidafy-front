import React, { useEffect, useState } from 'react'
import clienteAxios from '../../../../config/axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const HistoryTableProfessional = ({ id }) => {



  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    const getHistorial = async () => {
      try {
        if (id) {
          let { data } = await clienteAxios.get(
            `api/profesional/historial/${id}`
          );
          setHistorial(data);
  
        }


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
    <div className=" w-full bg-white rounded-lg shadow">
      <div className="border rounded-lg border-gray-100">
        <div className="py-4 md:py-6 pl-8">
          <p className="text-base md:text-lg lg:text-xl font-bold leading-tight text-gray-800">
            Reservas
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 h-16 w-full text-sm leading-none text-gray-800">
                <th className="font-normal text-left pl-8">Fecha</th>
                <th className="font-normal text-left px-10 lg:px-6 xl:px-0">
                  Servicio
                </th>
                <th className="font-normal text-left px-10 lg:px-6 xl:px-0">
                  Costo
                </th>
                <th className="font-normal text-left px-10 lg:px-6 xl:px-0">
                  Profesional
                </th>
                <th className="font-normal text-left px-10 lg:px-6 xl:px-0">
                  Reserva #
                </th>
                <th className="font-normal text-left px-10 lg:px-6 xl:px-0">
                  Status
                </th>
                <th className="font-normal text-left">Confirmación </th>
              </tr>
            </thead>
            <tbody className="w-full">

              {historial?.map((reserva) => (
                <tr key={reserva._id} className="bg-white border-b">
                  <td className="pl-8">{reserva.dia_servicio} - {reserva.hora_servicio}</td>
                  <td className=" py-4">{reserva.servicio}</td>
                  <td className=" py-4">{reserva.precio}</td>
                  <td className=" py-4">{reserva.profesional_nombre}</td>
                  <td className=" py-4">{reserva._id}</td>
                  <td className=" py-4">{reserva.estado_servicio}</td>
                  <td className=" py-4"> <Link to={`/resumen/${reserva._id}`}> Ver </Link>
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default HistoryTableProfessional