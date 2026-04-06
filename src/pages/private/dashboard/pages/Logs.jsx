import React, { useState, useEffect } from 'react';
import clienteAxios from '../../../../config/axios';

const Logs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await clienteAxios.get('/api/auth/logs');

        setLogs(response.data);
      } catch (error) {
        console.error('Error al obtener los logs', error);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Logs de Inicio de Sesión</h2>
      <table className="table-auto w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Rol</th>
            <th className="px-4 py-2">Tipo</th>
            <th className="px-4 py-2">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log._id} className="text-center">
              <td className="border px-4 py-2">{log.nombre}</td>
              <td className="border px-4 py-2">{log.email}</td>
              <td className="border px-4 py-2">{log.rol}</td>
              <td className="border px-4 py-2">{log.tipo}</td>
              <td className="border px-4 py-2">{new Date(log.fecha).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Logs;
