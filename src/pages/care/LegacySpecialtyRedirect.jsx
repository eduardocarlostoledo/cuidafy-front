import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const LegacySpecialtyRedirect = () => {
  const navigate = useNavigate();
  const { especialidad, localidad } = useParams();

  useEffect(() => {
    const params = new URLSearchParams();

    if (localidad) {
      params.set("localidad", decodeURIComponent(localidad));
    }

    if (especialidad) {
      params.set("especialidad", decodeURIComponent(especialidad));
    }

    navigate(`/cuidado/matches?${params.toString()}`, { replace: true });
  }, [especialidad, localidad, navigate]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center bg-[#f7f1e8] px-6 text-center">
      <div className="max-w-xl rounded-[2rem] border border-[#dccfbf] bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7c5a23]">
          Ruta actualizada
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">
          Te estamos llevando al matching de cuidado
        </h1>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          Esta entrada ya no usa el flujo legacy. Conservamos la URL para que aterrice dentro
          del recorrido nuevo.
        </p>
      </div>
    </div>
  );
};

export default LegacySpecialtyRedirect;
