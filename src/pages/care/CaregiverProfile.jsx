import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CareFlowFrame from "../../components/care/CareFlowFrame";
import { useDisponibilidades } from "../../hooks/useDisponibilidades";
import {
  buildCareMatches,
  getNeedOptionById,
  getStoredCareRequest,
  getStoredShortlist,
  saveCareSelection,
  toggleShortlistItem,
} from "../../helpers/careFlow";

const CaregiverProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { disponibilidades, loading } = useDisponibilidades();
  const [shortlistIds, setShortlistIds] = useState(() => getStoredShortlist());
  const request = getStoredCareRequest();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const matches = useMemo(
    () => buildCareMatches(disponibilidades, request),
    [disponibilidades, request]
  );

  const caregiver = matches.find((match) => match.id === id);
  const [selectedSlotId, setSelectedSlotId] = useState("");

  useEffect(() => {
    if (caregiver?.compatibleSlots?.length) {
      setSelectedSlotId(caregiver.compatibleSlots[0].horarioId);
      return;
    }

    if (caregiver?.nextSlot?.horarioId) {
      setSelectedSlotId(caregiver.nextSlot.horarioId);
    }
  }, [caregiver]);

  const selectedSlot =
    caregiver?.slots.find((slot) => slot.horarioId === selectedSlotId) || caregiver?.nextSlot;

  const handleContinue = () => {
    if (!caregiver || !selectedSlot) return;

    saveCareSelection({
      profileId: caregiver.id,
      userId: caregiver.userId,
      nombreCompleto: caregiver.nombreCompleto,
      selectedSlot,
    });

    navigate("/cuidado/confirmar");
  };

  const shortlisted = caregiver ? shortlistIds.includes(caregiver.id) : false;
  const selectedNeed = getNeedOptionById(request.needType);

  const sidebar = caregiver ? (
    <>
      <div className="rounded-[1.75rem] border border-[#dccfbf] bg-white p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7d5a21]">
          Solicitud activa
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
            <p className="font-semibold text-slate-900">Horario sugerido</p>
            <p>
              {selectedSlot
                ? `${selectedSlot.fecha} a las ${selectedSlot.hora}`
                : "Elige un horario para continuar"}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-[#dccfbf] bg-[#fff8ed] p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7d5a21]">
          Senales de confianza
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {caregiver.trustBadges.map((badge) => (
            <span
              key={`${caregiver.id}-${badge}`}
              className="rounded-full border border-[#dbc8a9] bg-white px-3 py-1 text-xs font-semibold text-[#7c5a23]"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
    </>
  ) : null;

  return (
    <CareFlowFrame
      currentStep="profile"
      title="Ficha del cuidador recomendado"
      description="Aqui ya no estas viendo solo horarios: ves senales de confianza, zonas de trabajo y el espacio para elegir como seguir."
      backHref="/cuidado/matches"
      backLabel="Volver al matching"
      aside={sidebar}
    >
      {loading ? (
        <div className="rounded-[1.75rem] border border-[#dccfbf] bg-white p-8 text-center text-slate-600">
          Cargando perfil...
        </div>
      ) : !caregiver ? (
        <div className="rounded-[1.75rem] border border-[#dccfbf] bg-white p-8">
          <p className="text-lg font-semibold text-slate-900">
            No encontramos esta ficha dentro del matching actual.
          </p>
          <Link
            to="/cuidado/matches"
            className="mt-4 inline-flex rounded-full bg-[#7c5a23] px-5 py-3 text-sm font-semibold text-white hover:bg-[#604318]"
          >
            Volver a las opciones
          </Link>
        </div>
      ) : (
        <>
          <section className="rounded-[1.75rem] border border-[#dccfbf] bg-white p-6 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex gap-5">
                <div className="h-28 w-28 overflow-hidden rounded-[2rem] bg-[#eadcc8]">
                  {caregiver.img ? (
                    <img
                      src={caregiver.img}
                      alt={caregiver.nombreCompleto}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-3xl font-semibold text-[#7c5a23]">
                      {caregiver.nombreCompleto.charAt(0)}
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7d5a21]">
                    {caregiver.scoreLabel}
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold text-slate-900">
                    {caregiver.nombreCompleto}
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    {caregiver.localidades.join(" · ")}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {caregiver.especialidades.map((especialidad) => (
                      <span
                        key={`${caregiver.id}-${especialidad}`}
                        className="rounded-full bg-[#f7efe2] px-3 py-1 text-xs font-semibold text-slate-700"
                      >
                        {especialidad}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShortlistIds(toggleShortlistItem(caregiver.id))}
                className={`rounded-full px-5 py-3 text-sm font-semibold ${
                  shortlisted
                    ? "bg-[#efe1c3] text-[#6b4b18]"
                    : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {shortlisted ? "Guardado en shortlist" : "Guardar para comparar"}
              </button>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="rounded-[1.5rem] bg-[#fcfaf7] p-5">
                <p className="text-sm font-semibold text-slate-900">Por que puede encajar</p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                  {caregiver.matchReasons.map((reason) => (
                    <li key={`${caregiver.id}-${reason}`}>{reason}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[1.5rem] bg-[#fcfaf7] p-5">
                <p className="text-sm font-semibold text-slate-900">Contexto visible del perfil</p>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {caregiver.descripcion ||
                    "Todavia no hay una descripcion larga cargada para este perfil. Igual mostramos disponibilidad real, zonas de trabajo y especialidades para ayudarte a decidir mejor."}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-[#dccfbf] bg-white p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7d5a21]">
                  Paso siguiente
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-900">
                  Elige el horario con el que quieres continuar
                </h3>
              </div>
              <div className="rounded-full bg-[#f7efe2] px-4 py-2 text-sm font-semibold text-slate-700">
                {caregiver.slots.length} horario(s) visibles
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              {caregiver.slots.map((slot) => {
                const selected = selectedSlotId === slot.horarioId;

                return (
                  <button
                    key={`${slot.disponibilidadId}-${slot.horarioId}`}
                    type="button"
                    onClick={() => setSelectedSlotId(slot.horarioId)}
                    className={`flex items-center justify-between rounded-[1.25rem] border px-5 py-4 text-left transition ${
                      selected
                        ? "border-[#a6782b] bg-[#fff4df]"
                        : "border-slate-200 bg-[#fcfaf7] hover:border-[#d8c3a0]"
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-slate-900">{slot.fecha}</p>
                      <p className="mt-1 text-sm text-slate-600">{slot.hora}</p>
                    </div>
                    <span className="text-sm font-semibold text-[#7c5a23]">
                      {selected ? "Seleccionado" : "Elegir"}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleContinue}
                disabled={!selectedSlot}
                className="rounded-full bg-[#7c5a23] px-6 py-3 text-sm font-semibold text-white hover:bg-[#604318] disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Continuar a contratacion
              </button>
              <Link
                to="/cuidado/matches"
                className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Ver mas perfiles
              </Link>
            </div>
          </section>
        </>
      )}
    </CareFlowFrame>
  );
};

export default CaregiverProfile;
