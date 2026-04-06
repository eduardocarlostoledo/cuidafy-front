import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import CareFlowFrame from "../../components/care/CareFlowFrame";
import { useDisponibilidades } from "../../hooks/useDisponibilidades";
import {
  CARE_FREQUENCY_OPTIONS,
  CARE_SHIFT_OPTIONS,
  CARE_URGENCY_OPTIONS,
  buildCareMatches,
  buildCareRequestFromSearch,
  getNeedOptionById,
  getOptionLabel,
  getStoredCareRequest,
  getStoredShortlist,
  mergeCareRequest,
  saveCareRequest,
  saveCareSelection,
  toggleShortlistItem,
} from "../../helpers/careFlow";

const CareMatches = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { disponibilidades, loading, error } = useDisponibilidades();
  const [shortlistIds, setShortlistIds] = useState(() => getStoredShortlist());

  const request = useMemo(
    () => mergeCareRequest(getStoredCareRequest(), buildCareRequestFromSearch(searchParams)),
    [searchParams]
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    saveCareRequest(request);
  }, [request]);

  const matches = useMemo(
    () => buildCareMatches(disponibilidades, request),
    [disponibilidades, request]
  );

  const shortlistedMatches = useMemo(
    () => matches.filter((match) => shortlistIds.includes(match.id)),
    [matches, shortlistIds]
  );

  const handleToggleShortlist = (profileId) => {
    setShortlistIds(toggleShortlistItem(profileId));
  };

  const handleContinueWithMatch = (match) => {
    const selectedSlot = match.compatibleSlots[0] || match.nextSlot;
    saveCareSelection({
      profileId: match.id,
      userId: match.userId,
      nombreCompleto: match.nombreCompleto,
      selectedSlot,
    });
    navigate("/cuidado/confirmar");
  };

  const selectedNeed = getNeedOptionById(request.needType);

  const sidebar = (
    <>
      <div className="rounded-[1.75rem] border border-[#dccfbf] bg-white p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7d5a21]">
          Solicitud actual
        </p>
        <div className="mt-5 space-y-4 text-sm text-slate-600">
          <div>
            <p className="font-semibold text-slate-900">Necesidad</p>
            <p>{selectedNeed?.label || "Cuidado general"}</p>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Zona</p>
            <p>{request.localidad || "Sin definir"}</p>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Urgencia</p>
            <p>{getOptionLabel(CARE_URGENCY_OPTIONS, request.urgency)}</p>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Frecuencia y franja</p>
            <p>
              {getOptionLabel(CARE_FREQUENCY_OPTIONS, request.frequency)} ·{" "}
              {getOptionLabel(CARE_SHIFT_OPTIONS, request.shift)}
            </p>
          </div>
        </div>

        <Link
          to="/encontrar-cuidado"
          className="mt-5 inline-flex rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Ajustar solicitud
        </Link>
      </div>

      <div className="rounded-[1.75rem] border border-[#dccfbf] bg-[#fff8ed] p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7d5a21]">
          Shortlist
        </p>
        {shortlistedMatches.length === 0 ? (
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Guarda perfiles para compararlos rapido antes de confirmar.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {shortlistedMatches.map((match) => (
              <button
                key={match.id}
                type="button"
                onClick={() => navigate(`/cuidado/cuidador/${match.id}`)}
                className="w-full rounded-2xl border border-[#e4d4bb] bg-white px-4 py-3 text-left hover:border-[#c9a468]"
              >
                <p className="font-semibold text-slate-900">{match.nombreCompleto}</p>
                <p className="mt-1 text-sm text-slate-600">{match.scoreLabel}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );

  return (
    <CareFlowFrame
      currentStep="matching"
      title="Estas son las mejores opciones para tu solicitud"
      description="Ordenamos perfiles segun zona, tipo de cuidado y horarios disponibles para que elijas con mas contexto y menos friccion."
      backHref="/encontrar-cuidado"
      backLabel="Volver a la solicitud"
      aside={sidebar}
    >
      <div className="rounded-[1.75rem] border border-[#dccfbf] bg-white p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7d5a21]">
              Resultado del matching
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">
              {loading ? "Buscando coincidencias..." : `${matches.length} perfiles compatibles`}
            </h2>
          </div>

          <div className="rounded-full bg-[#f7efe2] px-4 py-2 text-sm font-semibold text-slate-700">
            Zona: {request.localidad || "Sin filtro"}
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-5 text-red-700">
            No pudimos cargar las disponibilidades: {error}
          </div>
        ) : null}

        {!loading && matches.length === 0 ? (
          <div className="mt-8 rounded-[1.5rem] border border-dashed border-slate-300 bg-[#fcfaf7] p-6">
            <p className="text-lg font-semibold text-slate-900">
              No encontramos coincidencias exactas con esos filtros.
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Puedes ampliar la franja horaria, cambiar la urgencia o quitar la especialidad
              preferida para ver mas cuidadores disponibles.
            </p>
            <Link
              to="/encontrar-cuidado"
              className="mt-5 inline-flex rounded-full bg-[#7c5a23] px-5 py-3 text-sm font-semibold text-white hover:bg-[#604318]"
            >
              Ajustar solicitud
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-4">
            {matches.map((match) => {
              const shortlisted = shortlistIds.includes(match.id);

              return (
                <article
                  key={match.id}
                  className="rounded-[1.6rem] border border-slate-200 bg-[#fcfaf7] p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex gap-4">
                      <div className="h-20 w-20 overflow-hidden rounded-3xl bg-[#ece2d3]">
                        {match.img ? (
                          <img
                            src={match.img}
                            alt={match.nombreCompleto}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-2xl font-semibold text-[#7c5a23]">
                            {match.nombreCompleto.charAt(0)}
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-2xl font-semibold text-slate-900">
                            {match.nombreCompleto}
                          </h3>
                          <span className="rounded-full bg-[#f0dfbf] px-3 py-1 text-xs font-semibold text-[#6b4b18]">
                            {match.scoreLabel}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-600">
                          {match.localidades.join(" · ")}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {match.especialidades.slice(0, 4).map((especialidad) => (
                            <span
                              key={`${match.id}-${especialidad}`}
                              className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm"
                            >
                              {especialidad}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[1.25rem] border border-[#eadcc8] bg-white p-4 text-sm text-slate-600 lg:min-w-[260px]">
                      <p className="font-semibold text-slate-900">Proxima disponibilidad</p>
                      <p className="mt-2">
                        {match.nextSlot
                          ? `${match.nextSlot.fecha} a las ${match.nextSlot.hora}`
                          : "Sin horario visible"}
                      </p>
                      <p className="mt-2">
                        {match.slots.length} horario(s) detectados en {match.uniqueDates.length} fecha(s)
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {match.trustBadges.map((badge) => (
                      <span
                        key={`${match.id}-${badge}`}
                        className="rounded-full border border-[#dbc8a9] bg-[#fff6e8] px-3 py-1 text-xs font-semibold text-[#7c5a23]"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 grid gap-4 lg:grid-cols-[1.25fr,0.75fr]">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Por que aparece arriba</p>
                      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                        {match.matchReasons.map((reason) => (
                          <li key={`${match.id}-${reason}`}>{reason}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-col gap-3 lg:items-end">
                      <button
                        type="button"
                        onClick={() => handleToggleShortlist(match.id)}
                        className={`rounded-full px-5 py-3 text-sm font-semibold ${
                          shortlisted
                            ? "bg-[#efe1c3] text-[#6b4b18]"
                            : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {shortlisted ? "Quitar de shortlist" : "Guardar en shortlist"}
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate(`/cuidado/cuidador/${match.id}`)}
                        className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Ver ficha completa
                      </button>
                      <button
                        type="button"
                        onClick={() => handleContinueWithMatch(match)}
                        className="rounded-full bg-[#7c5a23] px-5 py-3 text-sm font-semibold text-white hover:bg-[#604318]"
                      >
                        Continuar con este perfil
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </CareFlowFrame>
  );
};

export default CareMatches;
