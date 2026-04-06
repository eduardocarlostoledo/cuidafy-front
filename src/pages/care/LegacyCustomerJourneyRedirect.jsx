import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDisponibilidades } from "../../hooks/useDisponibilidades";
import {
  buildCareRequestFromLegacyJourney,
  buildCareSelectionFromDisponibilidad,
  saveCareRequest,
  saveCareSelection,
} from "../../helpers/careFlow";

const getLegacyProfessionalId = () => {
  try {
    const professional = JSON.parse(localStorage.getItem("ProfessionalService") || "null");
    return professional?.profesional_id || professional?.profileId || "";
  } catch (error) {
    return "";
  }
};

const getLegacyDateSelection = () => {
  try {
    const dateService = JSON.parse(localStorage.getItem("DateService") || "null");
    return {
      date: dateService?.date || "",
      time: dateService?.time || "",
    };
  } catch (error) {
    return { date: "", time: "" };
  }
};

const recoverLegacySelection = (disponibilidades = []) => {
  const professionalId = getLegacyProfessionalId();
  const { date, time } = getLegacyDateSelection();

  if (!professionalId || !date || !time) {
    return null;
  }

  const disponibilidad = disponibilidades.find(
    (item) =>
      item?.creador?._id?.toString() === professionalId?.toString() &&
      item?.fecha === date &&
      (item?.horarios || item?.disponibilidad || []).some((slot) => slot.hora === time)
  );

  if (!disponibilidad) {
    return null;
  }

  const slot = (disponibilidad.horarios || disponibilidad.disponibilidad || []).find(
    (item) => item.hora === time && item.stock !== false
  );

  return slot ? buildCareSelectionFromDisponibilidad(disponibilidad, slot) : null;
};

const LegacyCustomerJourneyRedirect = ({ mode = "entry" }) => {
  const navigate = useNavigate();
  const { disponibilidades, loading } = useDisponibilidades();
  const request = useMemo(() => buildCareRequestFromLegacyJourney(), []);

  useEffect(() => {
    saveCareRequest(request);

    if (mode === "entry") {
      navigate("/encontrar-cuidado", { replace: true });
      return;
    }

    if (mode === "matching") {
      navigate("/cuidado/matches", { replace: true });
      return;
    }

    if (loading) {
      return;
    }

    const recoveredSelection = recoverLegacySelection(disponibilidades);

    if (recoveredSelection) {
      saveCareSelection(recoveredSelection);
      navigate("/cuidado/confirmar", { replace: true });
      return;
    }

    navigate("/cuidado/matches", { replace: true });
  }, [disponibilidades, loading, mode, navigate, request]);

  const titleByMode = {
    entry: "Te llevamos al inicio del flujo nuevo",
    matching: "Te llevamos al matching del hub de cuidado",
    contract: "Estamos recuperando tu selección anterior",
  };

  const descriptionByMode = {
    entry:
      "La antigua pantalla de reserva del cliente ya no sigue activa. Conservamos tu contexto y lo llevamos a la nueva solicitud guiada.",
    matching:
      "El paso legacy de búsqueda por profesional o fecha ahora desemboca en el matching del hub de cuidado.",
    contract:
      "Intentamos reconstruir tu preferencia previa de profesional, fecha y horario. Si no alcanza, te mostramos el matching actualizado para continuar.",
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-[#f7f1e8] px-6">
      <div className="max-w-2xl rounded-[2rem] border border-[#dccfbf] bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7c5a23]">
          Journey migrado
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">{titleByMode[mode]}</h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">{descriptionByMode[mode]}</p>
      </div>
    </div>
  );
};

export default LegacyCustomerJourneyRedirect;
