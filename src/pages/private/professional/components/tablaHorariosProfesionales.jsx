import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import clienteAxios from '../../../../config/axios';

const HorariosTabla = ({ _id }) => {
  const [disponibilidades, setDisponibilidades] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const obtenerDisponibilidades = async () => {
      try {
        setLoading(true);
        const response = await clienteAxios.post(
          '/api/profesional/disponibilidad-por-id',
          { _id }
        );
        setDisponibilidades(response.data || []);
      } catch (error) {
        console.error('Error al obtener las disponibilidades:', error);
      } finally {
        setLoading(false);
      }
    };

    obtenerDisponibilidades();
  }, [_id]);

  const columns = [
    {
      title: 'Fecha',
      dataIndex: 'fecha',
      key: 'fecha',
    },
    {
      title: 'Horarios',
      dataIndex: 'horarios',
      key: 'horarios',
      render: (horarios = []) => (
        <ul>
          {horarios.map((horario) => (
            <li key={horario._id || horario.hora}>{horario.hora}</li>
          ))}
        </ul>
      ),
    },
    {
      title: 'Creador',
      dataIndex: 'creador',
      key: 'creador',
    },
  ];

  return (
    <div>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <Table
          dataSource={disponibilidades}
          columns={columns}
          pagination={false}
          rowKey={(record) => record._id || `${record.fecha}-${record.creador}`}
        />
      )}
    </div>
  );
};

export default HorariosTabla;
