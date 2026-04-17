import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaRegStar, FaStar } from "react-icons/fa";
import CareFlowFrame from "../../components/care/CareFlowFrame";
import { useDisponibilidades } from "../../hooks/useDisponibilidades";
import clienteAxios from "../../config/axios";
import { getAuthToken, getStoredProfile } from "../../helpers/auth/getSessionData";
import {
  buildCareMatches,
  getNeedOptionById,
  getStoredCareRequest,
  getStoredShortlist,
  saveCareSelection,
  toggleShortlistItem,
} from "../../helpers/careFlow";

const renderStars = (value = 0, size = "text-base") =>
  Array.from({ length: 5 }, (_, index) => {
    const Icon = index < value ? FaStar : FaRegStar;

    return (
      <Icon
        key={`${size}-${index}`}
        className={`${size} ${index < value ? "text-amber-400" : "text-slate-300"}`}
      />
    );
  });

const formatSlotDayLabel = (dateString) => {
  if (!dateString) return "Dia sin fecha";

  const date = new Date(`${dateString}T12:00:00`);
  return new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
};

const CaregiverProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { disponibilidades, loading } = useDisponibilidades();
  const [shortlistIds, setShortlistIds] = useState(() => getStoredShortlist());
  const [ratingsData, setRatingsData] = useState({
    averageRating: 0,
    totalRatings: 0,
    canReview: false,
    userHasContracted: false,
    userRating: null,
  });
  const [ratingsLoading, setRatingsLoading] = useState(true);
  const [ratingValue, setRatingValue] = useState(0);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [ratingError, setRatingError] = useState("");
  const request = getStoredCareRequest();
  const token = getAuthToken();
  const sessionProfile = getStoredProfile();
  const isCustomer = sessionProfile?.rol === "CLIENTE";

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

  useEffect(() => {
    let cancelled = false;

    const fetchRatings = async () => {
      if (!id) return;

      try {
        setRatingsLoading(true);

        const { data } = await clienteAxios.get(`/api/profesional/calificaciones/${id}`, {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : undefined,
        });

        if (cancelled) return;

        setRatingsData({
          averageRating: Number(data?.averageRating || 0),
          totalRatings: Number(data?.totalRatings || 0),
          canReview: Boolean(data?.canReview),
          userHasContracted: Boolean(data?.userHasContracted),
          userRating: data?.userRating || null,
        });
        setRatingValue(Number(data?.userRating?.score || 0));
        setRatingError("");
      } catch (error) {
        if (cancelled) return;
        setRatingError(
          error.response?.data?.msg || "No pudimos cargar las calificaciones del profesional"
        );
      } finally {
        if (!cancelled) {
          setRatingsLoading(false);
        }
      }
    };

    fetchRatings();

    return () => {
      cancelled = true;
    };
  }, [id, token]);

  const selectedSlot =
    caregiver?.slots.find((slot) => slot.horarioId === selectedSlotId) || caregiver?.nextSlot;

  const slotsGroupedByDay = useMemo(() => {
    if (!caregiver?.slots?.length) {
      return [];
    }

    const groupedSlots = caregiver.slots.reduce((accumulator, slot) => {
      if (!accumulator[slot.fecha]) {
        accumulator[slot.fecha] = [];
      }

      accumulator[slot.fecha].push(slot);
      return accumulator;
    }, {});

    return Object.entries(groupedSlots)
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .map(([date, slots]) => ({
        date,
        label: formatSlotDayLabel(date),
        slots: [...slots].sort((slotA, slotB) => slotA.hora.localeCompare(slotB.hora)),
      }));
  }, [caregiver?.slots]);

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

  const handleSubmitRating = async () => {
    if (!ratingsData.canReview || ratingValue < 1 || ratingValue > 5) return;

    try {
      setIsSubmittingRating(true);
      setRatingError("");

      const { data } = await clienteAxios.post(
        `/api/profesional/calificaciones/${id}`,
        { score: ratingValue },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRatingsData({
        averageRating: Number(data?.averageRating || 0),
        totalRatings: Number(data?.totalRatings || 0),
        canReview: Boolean(data?.canReview),
        userHasContracted: Boolean(data?.userHasContracted),
        userRating: data?.userRating || { score: ratingValue },
      });
      setRatingValue(Number(data?.userRating?.score || ratingValue));
    } catch (error) {
      setRatingError(
        error.response?.data?.msg || "No pudimos guardar la calificacion del profesional"
      );
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const shortlisted = caregiver ? shortlistIds.includes(caregiver.id) : false;
  const selectedNeed = getNeedOptionById(request.needType);
  const canSubmitRating = ratingsData.canReview && ratingValue >= 1 && ratingValue <= 5;

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
                    {caregiver.localidades.join(" / ")}
                  </p>
                  <div className="mt-4 rounded-[1.25rem] border border-[#eadcc8] bg-[#fffaf2] px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7d5a21]">
                      Calificaciones
                    </p>
                    {ratingsLoading ? (
                      <p className="mt-2 text-sm text-slate-500">Cargando promedio...</p>
                    ) : (
                      <div className="mt-2 flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1">
                          {renderStars(Math.round(ratingsData.averageRating), "text-lg")}
                        </div>
                        <p className="text-sm font-semibold text-slate-900">
                          {ratingsData.totalRatings > 0
                            ? `${ratingsData.averageRating.toFixed(1)} de 5`
                            : "Sin calificaciones aun"}
                        </p>
                        <p className="text-sm text-slate-500">
                          {ratingsData.totalRatings} opinion
                          {ratingsData.totalRatings === 1 ? "" : "es"}
                        </p>
                      </div>
                    )}
                  </div>
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

            <div className="mt-6 rounded-[1.5rem] bg-[#fcfaf7] p-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Tu calificacion</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Solo clientes que hayan contratado el servicio pueden dejar una nota de 1 a 5
                    estrellas.
                  </p>
                </div>
                {ratingsData.userRating ? (
                  <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#7c5a23]">
                    Tu ultima nota: {ratingsData.userRating.score}/5
                  </span>
                ) : null}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {Array.from({ length: 5 }, (_, index) => {
                  const starValue = index + 1;
                  const active = starValue <= ratingValue;

                  return (
                    <button
                      key={`rate-${starValue}`}
                      type="button"
                      onClick={() => {
                        if (ratingsData.canReview) {
                          setRatingValue(starValue);
                        }
                      }}
                      disabled={!ratingsData.canReview}
                      className={`rounded-full p-1 ${
                        ratingsData.canReview ? "cursor-pointer" : "cursor-not-allowed"
                      }`}
                    >
                      {active ? (
                        <FaStar className="text-2xl text-amber-400" />
                      ) : (
                        <FaRegStar className="text-2xl text-slate-300" />
                      )}
                    </button>
                  );
                })}
              </div>

              {!ratingsLoading && !ratingsData.canReview ? (
                <p className="mt-4 text-sm text-slate-500">
                  {!token
                    ? "Inicia sesion con tu cuenta cliente para ver si puedes calificar."
                    : isCustomer && !ratingsData.userHasContracted
                    ? "Todavia no tienes una contratacion valida con este profesional para poder calificarlo."
                    : "Solo una cuenta cliente con una contratacion valida puede dejar una calificacion."}
                </p>
              ) : null}

              {ratingError ? (
                <p className="mt-4 text-sm font-medium text-red-600">{ratingError}</p>
              ) : null}

              <div className="mt-5">
                <button
                  type="button"
                  onClick={handleSubmitRating}
                  disabled={!canSubmitRating || isSubmittingRating}
                  className="rounded-full bg-[#7c5a23] px-5 py-3 text-sm font-semibold text-white hover:bg-[#604318] disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {isSubmittingRating
                    ? "Guardando calificacion..."
                    : ratingsData.userRating
                    ? "Actualizar calificacion"
                    : "Enviar calificacion"}
                </button>
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
                {caregiver.slots.length} horario(s) en {slotsGroupedByDay.length} dia(s)
              </div>
            </div>

            <div className="mt-6 space-y-5">
              {slotsGroupedByDay.map((dayGroup) => (
                <div
                  key={dayGroup.date}
                  className="rounded-[1.5rem] border border-slate-200 bg-[#fcfaf7] p-4 md:p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold capitalize text-slate-900">
                        {dayGroup.label}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">{dayGroup.date}</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#7c5a23]">
                      {dayGroup.slots.length} horario(s)
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {dayGroup.slots.map((slot) => {
                      const selected = selectedSlotId === slot.horarioId;

                      return (
                        <button
                          key={`${slot.disponibilidadId}-${slot.horarioId}`}
                          type="button"
                          onClick={() => setSelectedSlotId(slot.horarioId)}
                          className={`flex items-center justify-between rounded-[1.25rem] border px-4 py-4 text-left transition ${
                            selected
                              ? "border-[#a6782b] bg-[#fff4df]"
                              : "border-slate-200 bg-white hover:border-[#d8c3a0]"
                          }`}
                        >
                          <div>
                            <p className="font-semibold text-slate-900">{slot.hora}</p>
                            <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">
                              {selected ? "Horario elegido" : "Disponible"}
                            </p>
                          </div>
                          <span className="text-sm font-semibold text-[#7c5a23]">
                            {selected ? "Seleccionado" : "Elegir"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
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
