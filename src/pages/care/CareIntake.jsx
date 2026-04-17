import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import CareFlowFrame from "../../components/care/CareFlowFrame";
import CareMatchList from "./CareMatchList";
import { localidadesLaborales } from "../../data";
import { useDisponibilidades } from "../../hooks/useDisponibilidades";
import {
  CARE_NEED_OPTIONS,
  CARE_URGENCY_OPTIONS,
  buildCareMatches,
  buildCareRequestFromSearch,
  getNeedOptionById,
  getStoredShortlist,
  localityMatchesRequest,
  mergeCareRequest,
  normalizeText,
  saveCareRequest,
  saveCareSelection,
  toggleShortlistItem,
} from "../../helpers/careFlow";

const QUICK_PRESETS = [
  { id: "cuidado_247", needType: "guardia_247" },
  { id: "higiene_personal", needType: "higiene_movilidad" },
  { id: "acompanamiento_hogar", needType: "acompanamiento_integral" },
];

const cardClassName = "rounded-[1.75rem] border border-[#dccfbf] bg-white p-6";

const LOCATION_STORAGE_KEY = "preferred_localidad";
const PRESET_STORAGE_KEY = "preferred_care_preset";

const getAvailableSlots = (disponibilidad) =>
  (disponibilidad?.horarios || disponibilidad?.disponibilidad || []).filter(
    (slot) => slot?.stock !== false
  );

const specialtyMatchesNeed = (specialty = "", needType = "") => {
  const needConfig = CARE_NEED_OPTIONS.find((option) => option.id === needType);
  if (!needConfig) return false;

  const normalizedSpecialty = normalizeText(specialty);
  return needConfig.tags.some((tag) => normalizedSpecialty.includes(tag));
};

const CareIntake = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { disponibilidades, loading, error } = useDisponibilidades();
  const [shortlistIds, setShortlistIds] = useState(() => getStoredShortlist());

  const request = useMemo(
    () => mergeCareRequest(buildCareRequestFromSearch(searchParams)),
    [searchParams]
  );

  const currentPreset = searchParams.get("preset") || "";
  const currentLocalidad = request.localidad || "";
  const currentUrgency = request.urgency || "hoy";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    saveCareRequest(request);
    if (currentLocalidad) localStorage.setItem(LOCATION_STORAGE_KEY, currentLocalidad);
    if (currentPreset) localStorage.setItem(PRESET_STORAGE_KEY, currentPreset);
  }, [request, currentLocalidad, currentPreset]);

  const localidades = useMemo(() => {
    const availabilityLocalities = (disponibilidades || []).flatMap(
      (item) => item?.creador?.localidadesLaborales || []
    );
    return Array.from(new Set([...availabilityLocalities, ...localidadesLaborales])).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [disponibilidades]);

  const resolvedLocalidad = useMemo(() => {
    if (!currentLocalidad) return "";

    return (
      localidades.find(
        (localidad) => normalizeText(localidad) === normalizeText(currentLocalidad)
      ) ||
      localidades.find((localidad) => localityMatchesRequest([localidad], currentLocalidad)) ||
      ""
    );
  }, [currentLocalidad, localidades]);

  const displayedLocalidad = resolvedLocalidad || currentLocalidad;

  const matches = useMemo(
    () => buildCareMatches(disponibilidades, request),
    [disponibilidades, request]
  );

  const quickPresets = useMemo(() => {
    const source = (disponibilidades || []).filter((disponibilidad) => {
      const profile = disponibilidad?.creador;
      if (!profile) return false;
      if (getAvailableSlots(disponibilidad).length === 0) return false;
      return localityMatchesRequest(profile.localidadesLaborales || [], displayedLocalidad);
    });

    return QUICK_PRESETS.map((preset) => {
      const needConfig = getNeedOptionById(preset.needType);
      const professionalIds = new Set();
      let slotsCount = 0;
      const specialtyCounts = new Map();

      source.forEach((disponibilidad) => {
        const profile = disponibilidad?.creador;
        const specialties = profile?.especialidad || [];
        const alignedSpecialties = specialties.filter((specialty) =>
          specialtyMatchesNeed(specialty, preset.needType)
        );

        if (alignedSpecialties.length === 0) return;

        professionalIds.add(profile._id);
        slotsCount += getAvailableSlots(disponibilidad).length;

        alignedSpecialties.forEach((specialty) => {
          specialtyCounts.set(specialty, (specialtyCounts.get(specialty) || 0) + 1);
        });
      });

      const highlightedSpecialties = Array.from(specialtyCounts.entries())
        .sort((left, right) => {
          if (right[1] !== left[1]) return right[1] - left[1];
          return left[0].localeCompare(right[0]);
        })
        .slice(0, 2)
        .map(([specialty]) => specialty);

      let description = needConfig?.description || "";

      if (professionalIds.size > 0) {
        const summary = [
          `${professionalIds.size} perfil${professionalIds.size === 1 ? "" : "es"} activo${
            professionalIds.size === 1 ? "" : "s"
          }`,
          `${slotsCount} horario${slotsCount === 1 ? "" : "s"} visible${
            slotsCount === 1 ? "" : "s"
          }`,
        ];

        if (highlightedSpecialties.length > 0) {
          summary.push(`Ej.: ${highlightedSpecialties.join(", ")}`);
        }

        description = summary.join(" | ");
      } else if (displayedLocalidad) {
        description = `Sin oferta visible en ${displayedLocalidad} para esta categoria.`;
      }

      return {
        ...preset,
        title: needConfig?.label || preset.id,
        description,
      };
    });
  }, [disponibilidades, displayedLocalidad]);

  const shortlistedMatches = useMemo(
    () => matches.filter((match) => shortlistIds.includes(match.id)),
    [matches, shortlistIds]
  );

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next, { replace: true });
  };

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
  const detailedHref = `/cuidado/ajustar-solicitud?${searchParams.toString()}`;

  const sidebar = (
    <>
      <div className={cardClassName}>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7d5a21]">
          Busqueda actual
        </p>
        <div className="mt-5 space-y-4 text-sm text-slate-600">
          <div>
            <p className="font-semibold text-slate-900">Necesidad</p>
            <p>{selectedNeed?.label || "Cuidado general"}</p>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Zona</p>
            <p>{displayedLocalidad || "Sin definir"}</p>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Urgencia</p>
            <p>
              {CARE_URGENCY_OPTIONS.find((option) => option.id === currentUrgency)?.label ||
                "Sin definir"}
            </p>
          </div>
        </div>

        <Link
          to={detailedHref}
          className="mt-5 inline-flex rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Filtros finos
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
      title="Cuidadores compatibles con tu necesidad"
      description="Ajusta zona, tipo de cuidado y urgencia. Los resultados se actualizan al instante. Si necesitas filtros mas finos, abri la solicitud detallada."
      backHref="/"
      backLabel="Volver al inicio"
      aside={sidebar}
    >
      <div className={`${cardClassName} md:p-8`}>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7d5a21]">
          Filtros rapidos
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-semibold text-slate-800">Localidad</label>
            <select
              value={resolvedLocalidad || currentLocalidad}
              onChange={(event) => updateParam("localidad", event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#a6782b] focus:ring-2 focus:ring-[#f0debd]"
            >
              <option value="">Todas las zonas</option>
              {localidades.map((localidad) => (
                <option key={localidad} value={localidad}>
                  {localidad}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-800">Urgencia</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {CARE_URGENCY_OPTIONS.map((option) => {
                const active = option.id === currentUrgency;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => updateParam("urgency", option.id)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      active
                        ? "bg-[#7c5a23] text-white"
                        : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-semibold text-slate-800">Tipo de cuidado con oferta visible</p>
          <p className="mt-2 text-sm text-slate-600">
            Basado en perfiles y horarios disponibles {displayedLocalidad ? `en ${displayedLocalidad}` : "en la plataforma"}.
          </p>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {quickPresets.map((preset) => {
              const active = preset.id === currentPreset;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => updateParam("preset", preset.id)}
                  className={`rounded-[1.25rem] border p-4 text-left transition ${
                    active
                      ? "border-[#a6782b] bg-[#fff4df] shadow-sm"
                      : "border-slate-200 bg-[#fcfaf7] hover:border-[#d8c3a0]"
                  }`}
                >
                  <p className="font-semibold text-slate-900">{preset.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{preset.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            to={detailedHref}
            className="rounded-full border border-[#c9a468] px-5 py-2 text-sm font-semibold text-[#6b4b18] hover:bg-[#fff8ed]"
          >
            Precisar pedido con filtros finos
          </Link>
        </div>
      </div>

      <CareMatchList
        matches={matches}
        loading={loading}
        error={error}
        request={{ ...request, localidad: displayedLocalidad || request.localidad }}
        shortlistIds={shortlistIds}
        onToggleShortlist={handleToggleShortlist}
        onContinue={handleContinueWithMatch}
        adjustHref={detailedHref}
      />
    </CareFlowFrame>
  );
};

export default CareIntake;
