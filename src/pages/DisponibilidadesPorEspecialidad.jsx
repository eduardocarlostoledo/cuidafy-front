import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spin, message, Button, Card, Tag, Divider, Select, Empty } from "antd";
import { ArrowLeftOutlined, ClockCircleOutlined, UserOutlined } from "@ant-design/icons";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useDisponibilidades } from "../hooks/useDisponibilidades";
import { useCarrito } from "../hooks/useCarrito";
import { useSelector } from "react-redux";

/**
 * Componente para mostrar disponibilidades filtradas por especialidad y localidad
 * Busca coincidencia entre localidad del cliente y localidad del profesional
 */
const DisponibilidadesPorEspecialidad = () => {
  const { especialidad, localidad } = useParams();
  const navigate = useNavigate();
  const [disponibilidadesFiltradas, setDisponibilidadesFiltradas] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const { disponibilidades, loading } = useDisponibilidades();
  const { agregarItem } = useCarrito();
  const { user } = useSelector((state) => state.auth);

  window.scrollTo(0, 0);

  const especialidadDecodificada = decodeURIComponent(especialidad);
  const localidadDecodificada = decodeURIComponent(localidad);

  useEffect(() => {
    filtrarDisponibilidades();
  }, [disponibilidades, especialidad, localidad]);

  const filtrarDisponibilidades = () => {
    if (!disponibilidades?.length) {
      setDisponibilidadesFiltradas([]);
      setFechaSeleccionada(null);
      return;
    }

    // Filtrar por especialidad Y localidad del profesional
    const filtradas = disponibilidades.filter((disp) => {
      if (!disp.creador?.especialidad || !disp.creador?.localidadesLaborales) {
        return false;
      }

      const coincideEspecialidad = disp.creador.especialidad.some(
        (esp) => esp.toLowerCase() === especialidadDecodificada.toLowerCase()
      );
      
      const coincideLocalidad = disp.creador.localidadesLaborales.some(
        (loc) => loc.toLowerCase() === localidadDecodificada.toLowerCase()
      );
      
      return coincideEspecialidad && coincideLocalidad;
    });

    setDisponibilidadesFiltradas(filtradas);
    
    // Establecer la primera fecha como seleccionada por defecto
    if (filtradas.length > 0 && !fechaSeleccionada) {
      setFechaSeleccionada(filtradas[0]._id);
    }

    console.log(`Disponibilidades encontradas para ${especialidadDecodificada} en ${localidadDecodificada}:`, filtradas.length);
  };

  // Agrupar horarios disponibles por profesional
  const horariosPorProfesional = useMemo(() => {
    const grupo = {};

    if (!fechaSeleccionada) return {};

    const disponibilidadSeleccionada = disponibilidadesFiltradas.find(
      (d) => d._id === fechaSeleccionada
    );

    if (!disponibilidadSeleccionada) return {};

    const profesionalNombre = `${disponibilidadSeleccionada.creador.creador?.nombre || "Sin nombre"} ${disponibilidadSeleccionada.creador.creador?.apellido || ""}`.trim();
    const profesionalId = disponibilidadSeleccionada.creador._id;

    grupo[profesionalId] = {
      nombre: profesionalNombre,
      especialidades: disponibilidadSeleccionada.creador.especialidad,
      localidades: disponibilidadSeleccionada.creador.localidadesLaborales,
      fecha: disponibilidadSeleccionada.fecha,
      disponibilidadId: disponibilidadSeleccionada._id,
      horarios: (disponibilidadSeleccionada.horarios || []).filter((h) => h.stock),
    };

    return grupo;
  }, [fechaSeleccionada, disponibilidadesFiltradas]);

  const handleAgregarAlCarrito = (horario, profesionalInfo) => {
    if (!user) {
      message.warning("Debes iniciar sesión para agregar al carrito");
      navigate("/logindashboard");
      return;
    }

    try {
      const itemDisponibilidad = {
        _id: profesionalInfo.disponibilidadId,
        nombre: `${profesionalInfo.nombre} - ${especialidadDecodificada}`,
        descripcion: `${horario.hora} | ${profesionalInfo.fecha} | ${localidadDecodificada}`,
        precio: 0,
        horario: horario.hora,
        fecha: profesionalInfo.fecha,
        tipo: "disponibilidad",
        horarioId: horario._id,
      };

      agregarItem(
        itemDisponibilidad,
        `disponibilidad-${profesionalInfo.disponibilidadId}-${horario._id}`,
        itemDisponibilidad.nombre,
        itemDisponibilidad.precio
      );

      message.success(`¡Horario ${horario.hora} agregado al carrito!`);
    } catch (error) {
      console.error("Error:", error);
      message.error("Error al agregar al carrito");
    }
  };

  const fechasDisponibles = useMemo(() => {
    return disponibilidadesFiltradas.map((d) => ({
      label: `${d.fecha} (${d.horarios?.filter((h) => h.stock).length || 0} horarios)`,
      value: d._id,
    }));
  }, [disponibilidadesFiltradas]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spin size="large" tip="Cargando disponibilidades..." />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <Header />
        <hr className="my-4" />

        {/* Header con botón volver */}
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/productos")}
          className="mb-6"
        >
          Volver a Servicios
        </Button>

        {/* Información del filtrado */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {especialidadDecodificada}
          </h1>
          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-lg">📍 {localidadDecodificada}</span>
          </div>
        </div>

        {/* Contenido */}
        {disponibilidadesFiltradas.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-lg text-gray-500 mb-4">
              No hay disponibilidades para {especialidadDecodificada} en {localidadDecodificada}
            </p>
            <Button
              type="primary"
              onClick={() => navigate("/productos")}
            >
              Ver otros servicios
            </Button>
          </Card>
        ) : (
          <>
            {/* Selector de fechas */}
            <Card className="mb-6">
              <label className="block text-sm font-semibold mb-2">Selecciona una fecha:</label>
              <Select
                value={fechaSeleccionada}
                onChange={setFechaSeleccionada}
                options={fechasDisponibles}
                size="large"
                placeholder="Selecciona una fecha"
                className="w-full"
              />
            </Card>

            {/* Horarios disponibles */}
            {fechaSeleccionada && Object.entries(horariosPorProfesional).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(horariosPorProfesional).map(([profesionalId, profesionalInfo]) => (
                  <Card
                    key={profesionalId}
                    className="hover:shadow-lg transition-shadow"
                    hoverable
                  >
                    {/* Profesional */}
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <UserOutlined />
                        <span className="font-semibold text-lg">
                          {profesionalInfo.nombre}
                        </span>
                      </div>
                    </div>

                    <Divider />

                    {/* Especialidades */}
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-600 mb-2">Especialidades:</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {profesionalInfo.especialidades.map((esp, idx) => (
                          <Tag key={idx} color="blue" className="text-xs">
                            {esp}
                          </Tag>
                        ))}
                      </div>
                    </div>

                    {/* Horarios disponibles */}
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-600 mb-2">
                        Horarios disponibles ({profesionalInfo.horarios.length}):
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {profesionalInfo.horarios.map((horario) => (
                          <Button
                            key={horario._id}
                            size="small"
                            type="dashed"
                            onClick={() => handleAgregarAlCarrito(horario, profesionalInfo)}
                            icon={<ClockCircleOutlined />}
                          >
                            {horario.hora}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Empty description="Selecciona una fecha para ver los horarios disponibles" />
            )}
          </>
        )}

        <div className="mt-12">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default DisponibilidadesPorEspecialidad;
