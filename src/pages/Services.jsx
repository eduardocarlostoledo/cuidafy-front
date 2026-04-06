import React, { lazy, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDisponibilidadesPorEspecialidad } from "../hooks/useDisponibilidadesPorEspecialidad";
import { getImagenEspecialidad } from "../data/especialidadImagenes";

const Card = lazy(() => import("../components/Card"));
const Spinner = lazy(() => import("../components/Spinner"));

const Services = () => {
  const { por_especialidad, especialidades_unicas, loading, error } =
    useDisponibilidadesPorEspecialidad();
  const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState(null);

  const tiposDeCuidado = useMemo(() => {
    const especialidadesVisibles =
      especialidadSeleccionada && especialidadSeleccionada !== "todas"
        ? [especialidadSeleccionada]
        : especialidades_unicas;

    return especialidadesVisibles
      .map((especialidad) => {
        const disponibilidades = por_especialidad[especialidad] || [];
        const profesionales = new Set(
          disponibilidades.map((item) => item?.creador?._id).filter(Boolean)
        );

        return {
          id: especialidad,
          image: getImagenEspecialidad(especialidad),
          text: especialidad,
          count: profesionales.size || disponibilidades.length,
          link: `/cuidado/matches?especialidad=${encodeURIComponent(especialidad)}`,
        };
      })
      .filter((item) => item.count > 0);
  }, [especialidadSeleccionada, especialidades_unicas, por_especialidad]);

  if (loading) return <Spinner />;

  if (error) {
    return (
      <div className="mx-auto max-w-6xl p-8 text-center">
        <p className="text-red-600">No pudimos cargar los tipos de cuidado: {error}</p>
      </div>
    );
  }

  if (!especialidades_unicas.length) {
    return (
      <div className="mx-auto max-w-6xl p-8 text-center">
        <p className="text-gray-600">Todavía no hay tipos de cuidado visibles en este momento.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#f7f1e8]">
      <section className="mx-auto max-w-6xl px-6 py-10 md:px-8">
        <div className="rounded-[2rem] border border-[#dccfbf] bg-[linear-gradient(140deg,#fff8ed_0%,#f7f1e8_60%,#eadcc8_100%)] p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7c5a23]">
            Mapa de cuidado
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-900">
            Explora los tipos de cuidado activos
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            Esta vista ya no funciona como catálogo de tienda. Te muestra las necesidades que
            hoy tienen agenda activa para que entres al matching correcto desde el principio.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <Link
              to="/encontrar-cuidado"
              className="rounded-full bg-[#7c5a23] px-5 py-3 font-semibold text-white hover:bg-[#604318]"
            >
              Iniciar solicitud guiada
            </Link>
            <Link
              to="/cuidado/matches"
              className="rounded-full border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-white/70"
            >
              Ver matching general
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-8 md:px-8">
        <div className="rounded-[2rem] border border-[#dccfbf] bg-white p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-slate-900">Filtrar por tipo de cuidado</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Puedes entrar directo a una especialidad o abrir el matching completo y dejar que
            el sistema priorice por zona, necesidad y horarios.
          </p>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setEspecialidadSeleccionada(null)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                especialidadSeleccionada === null
                  ? "bg-[#7c5a23] text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
              }`}
            >
              Todos ({especialidades_unicas.length})
            </button>
            {especialidades_unicas.map((esp) => (
              <button
                key={esp}
                onClick={() => setEspecialidadSeleccionada(esp)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  especialidadSeleccionada === esp
                    ? "bg-[#7c5a23] text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                }`}
              >
                {esp} ({por_especialidad[esp]?.length || 0})
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12 md:px-8">
        <div className="flex gap-4 flex-wrap items-center justify-center rounded-[2rem] border border-[#dccfbf] bg-white p-6 md:p-8">
          {tiposDeCuidado.length > 0 ? (
            tiposDeCuidado.map((service) => (
              <Card
                key={service.id}
                image={service.image}
                text={service.text}
                count={service.count}
                countLabel="cuidadores con agenda"
                link={service.link}
              />
            ))
          ) : (
            <div className="w-full text-center py-12">
              <p className="text-gray-600">
                No hay coincidencias visibles en este filtro. Prueba con otro tipo o usa la
                solicitud guiada.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Services;
