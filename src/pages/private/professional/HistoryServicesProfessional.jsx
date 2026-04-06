import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import clienteAxios from '../../../config/axios';
import { Link } from 'react-router-dom';
import { getEstadoPagoClass } from '../../../helpers/Logic/coloresEstadoPago.js';
import { getEstadoOrdenClass } from '../../../helpers/Logic/coloresEstadoOrden.js';
import { Badge } from 'antd';


const HistoryServicesProfessional = () => {
  const [historial, setHistorial] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});

  const { user } = useSelector((state) => ({ ...state.auth }));

  useEffect(() => {
    const getHistorial = async () => {
      try {
        let { data } = await clienteAxios.get(`api/profesional/historial/${user.profesionalId}`);
        const datosFiltrados = data.filter((item) => item !== null && item !== undefined);
        setHistorial(datosFiltrados);

        // Obtener conteo de mensajes no leídos para cada orden
        const unreadStats = {};
        for (const orden of datosFiltrados) {
          try {
            const stats = await clienteAxios.get(`api/chat/stats/${orden._id}`);
            unreadStats[orden._id] = stats.data.unreadMessages || 0;
          } catch (error) {
            console.log('Error obteniendo stats del chat:', error);
            unreadStats[orden._id] = 0;
          }
        }
        setUnreadCounts(unreadStats);
      } catch (err) {
        console.log(err);
        let error = err.response.data.msg
          ? err.response.data.msg
          : err.response && 'Estamos presentando problemas internos';
        return toast.error(error);
      }
    };
    getHistorial();
  }, [user.profesionalId]);


  return (
    <div className="flex flex-col items-center justify-center mt-5 md:ml-62 w-full">
      <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6 w-full md:w-3/4">
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
                <th scope="col" className="responsive-th text-center">
                  Cliente
                </th>
                <th scope="col" className="responsive-th hidden md:table-cell text-center">
                  Estado
                </th>
                <th scope="col" className="responsive-th hidden md:table-cell text-center">
                  Pago Servicio
                </th>
                {/* <th scope="col" className="responsive-th">
      Orden
    </th>  */}
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
                  <td className="responsive-td text-center">{reserva.nroSesion}</td>
                  <td className="responsive-td hidden md:table-cell text-center">{reserva.cita_servicio}</td>
                  <td className="responsive-td hidden md:table-cell text-center">{reserva.hora_servicio}</td>
                  <td className="responsive-td text-center">{reserva?.cliente_id?.nombre}</td>
                  <td className={`responsive-td hidden md:table-cell text-center ${getEstadoOrdenClass(reserva?.estado_servicio)}`}>{reserva?.estado_servicio}</td>
                  <td className={`responsive-td hidden md:table-cell text-center ${getEstadoPagoClass(reserva?.factura?.estadoPago)}`}>
                    {reserva?.factura?.estadoPago}
                  </td>

                  <td className="responsive-td text-center">
                    <Link to={`/resumen-profesional/${reserva._id}`}>
                      <Badge 
                        count={unreadCounts[reserva._id] || 0} 
                        style={{ backgroundColor: '#ff4d4f' }}
                      >
                        <span className="text-blue-600 font-semibold">CHAT</span>
                      </Badge>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );


};

export default HistoryServicesProfessional;