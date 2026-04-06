import React, { lazy, useEffect, useState, useMemo } from "react";
import Header2 from "../components/Header";
import Footer from "../components/Footer";
import { Spin, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import clienteAxios from "../config/axios";

const Productos = () => {
  const [disponibilidades, setDisponibilidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  window.scrollTo(0, 0);

  useEffect(() => {
    fetchDisponibilidades();
  }, []);

  const fetchDisponibilidades = async () => {
    setLoading(true);
    try {
      const { data } = await clienteAxios.get("/api/profesional/disponibilidades-totales");
      // El endpoint devuelve array directo o dentro de alguna propiedad
      const disponibilidadesData = Array.isArray(data) ? data : (data.resultados || data.disponibilidades || data.data || []);
      setDisponibilidades(disponibilidadesData);
      console.log("Disponibilidades obtenidas:", disponibilidadesData);
    } catch (error) {
      console.error("Error al cargar disponibilidades:", error);
      message.error("Error al cargar los servicios disponibles");
    } finally {
      setLoading(false);
    }
  };

  // Agrupar disponibilidades por especialidad y localidad
  const disponibilidadesAgrupadas = useMemo(() => {
    const grupos = {};
    
    disponibilidades.forEach((disponibilidad) => {
      // Acceder a creador que contiene especialidades y localidades
      const profesional = disponibilidad.creador;
      
      if (!profesional || !profesional.especialidad || !profesional.localidadesLaborales) {
        return; // Skip si no tiene datos del profesional
      }

      // Crear entrada para cada combinación de especialidad y localidad
      profesional.especialidad.forEach((esp) => {
        profesional.localidadesLaborales.forEach((loc) => {
          const key = `${esp}-${loc}`;
          
          if (!grupos[key]) {
            grupos[key] = {
              especialidad: esp,
              localidad: loc,
              disponibilidades: [],
            };
          }
          
          grupos[key].disponibilidades.push({
            ...disponibilidad,
            profesionalNombre: profesional.creador?.nombre || "Sin nombre",
            profesionalApellido: profesional.creador?.apellido || "",
          });
        });
      });
    });
    
    return Object.values(grupos);
  }, [disponibilidades]);

  const handleVerDisponibilidades = (especialidad, localidad) => {
    // Navegar a página que muestre disponibilidades filtradas
    navigate(`/disponibilidades/${encodeURIComponent(especialidad)}/${encodeURIComponent(localidad)}`);
  };

  return (
    <section className="container mx-auto px-4 sm:px-6 md:px-8">
      <Header2 />
      <hr />
      
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-2">Servicios Disponibles</h1>
        <p className="text-gray-600 mb-8">
          Encuentra profesionales según tu especialidad y localidad
        </p>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Spin size="large" />
          </div>
        ) : disponibilidadesAgrupadas.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">No hay servicios disponibles en este momento</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {disponibilidadesAgrupadas.map((grupo, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden cursor-pointer"
                onClick={() => handleVerDisponibilidades(grupo.especialidad, grupo.localidad)}
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-blue-600 mb-2">
                    {grupo.especialidad}
                  </h3>
                  
                  <div className="mb-4">
                    <p className="text-gray-600 text-sm">
                      <span className="font-semibold">📍 Localidad:</span> {grupo.localidad}
                    </p>
                  </div>

                  <div className="mb-4 p-3 bg-blue-50 rounded">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">{grupo.disponibilidades.length}</span> profesional(es) disponible(s)
                    </p>
                  </div>

                  <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
                    onClick={() => handleVerDisponibilidades(grupo.especialidad, grupo.localidad)}
                  >
                    Ver Disponibilidades
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </section>
  );
};

export default Productos;
