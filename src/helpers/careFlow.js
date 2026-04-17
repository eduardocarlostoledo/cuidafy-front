export const CARE_REQUEST_STORAGE_KEY = "calyaan_care_request";
export const CARE_SHORTLIST_STORAGE_KEY = "calyaan_care_shortlist";
export const CARE_SELECTION_STORAGE_KEY = "calyaan_care_selection";
export const CARE_CONTRACT_DRAFT_STORAGE_KEY = "calyaan_care_contract_draft";

export const CARE_NEED_OPTIONS = [
  {
    id: "guardia_247",
    label: "Cuidado 24/7",
    description: "Para acompanamiento continuo, guardias o coberturas extendidas.",
    tags: ["guardia", "24", "cuidad", "enfer", "geri", "acompan"],
  },
  {
    id: "higiene_movilidad",
    label: "Higiene y movilidad",
    description: "Para banos, cambios posturales, traslados y apoyo fisico diario.",
    tags: ["higiene", "movilidad", "traslado", "bano", "geri", "cuidad"],
  },
  {
    id: "post_operatorio",
    label: "Post operatorio",
    description: "Para recuperacion reciente y seguimiento cercano en domicilio.",
    tags: ["post", "operator", "enfer", "curacion", "herida", "respir"],
  },
  {
    id: "acompanamiento_integral",
    label: "Acompanamiento integral",
    description: "Para compania, hogar, tramites y soporte cotidiano.",
    tags: ["acompan", "compan", "hogar", "tram", "vigil", "basic"],
  },
  {
    id: "enfermeria_especializada",
    label: "Enfermeria especializada",
    description: "Para casos cronicos, paliativos, neurologicos o de alta complejidad.",
    tags: ["enfer", "cron", "pali", "neurol", "acv", "oncolog", "alzheimer"],
  },
];

export const CARE_URGENCY_OPTIONS = [
  { id: "hoy", label: "Lo necesito hoy" },
  { id: "semana", label: "Esta semana" },
  { id: "planificado", label: "Lo estoy organizando" },
];

export const CARE_FREQUENCY_OPTIONS = [
  { id: "unica", label: "Una visita puntual" },
  { id: "varias", label: "Varias veces por semana" },
  { id: "diaria", label: "Todos los dias" },
  { id: "guardia", label: "Cobertura extendida o por turnos" },
];

export const CARE_SHIFT_OPTIONS = [
  { id: "manana", label: "Manana" },
  { id: "tarde", label: "Tarde" },
  { id: "noche", label: "Noche" },
  { id: "flexible", label: "Flexible" },
];

export const CARE_MODALITY_OPTIONS = [
  { id: "horas", label: "Por horas" },
  { id: "media_jornada", label: "Media jornada" },
  { id: "jornada_completa", label: "Jornada completa" },
  { id: "turnos", label: "Turnos prolongados" },
  { id: "continuo", label: "Cuidado continuo" },
];

export const CARE_RELATION_OPTIONS = [
  { id: "paciente", label: "Soy el paciente" },
  { id: "familiar", label: "Soy familiar o referente" },
  { id: "otro", label: "Estoy coordinando para otra persona" },
];

export const CARE_PATIENT_AGE_OPTIONS = [
  { id: "infancia", label: "Infancia" },
  { id: "adulto", label: "Adulto" },
  { id: "adulto_mayor", label: "Adulto mayor" },
];

export const CARE_AUTONOMY_OPTIONS = [
  { id: "autonomo", label: "Bastante autonomo" },
  { id: "asistencia_parcial", label: "Necesita asistencia parcial" },
  { id: "asistencia_constante", label: "Necesita asistencia constante" },
];

export const CARE_LIVING_OPTIONS = [
  { id: "solo", label: "Vive solo" },
  { id: "acompanado", label: "Vive acompanado" },
  { id: "rotativo", label: "La familia se turna" },
];

export const CARE_FAMILY_SUPPORT_OPTIONS = [
  { id: "presente", label: "Hay familiar presente" },
  { id: "remoto", label: "Coordina un familiar remoto" },
  { id: "limitado", label: "Hay poca red de apoyo" },
];

export const CARE_START_WINDOW_OPTIONS = [
  { id: "hoy", label: "Hoy o urgente" },
  { id: "semana", label: "Esta semana" },
  { id: "quincena", label: "En los proximos 15 dias" },
  { id: "explorando", label: "Solo estoy explorando" },
];

export const CARE_VISIT_DURATION_OPTIONS = [
  { id: "2h", label: "Hasta 2 horas" },
  { id: "4h", label: "Entre 3 y 4 horas" },
  { id: "8h", label: "Media jornada" },
  { id: "12h", label: "Turno extendido" },
  { id: "24h", label: "Cobertura continua" },
];

export const CARE_EXPERIENCE_OPTIONS = [
  { id: "indiferente", label: "Me sirve una opcion general" },
  { id: "similar", label: "Prefiero experiencia en casos similares" },
  { id: "alta", label: "Necesito experiencia comprobable" },
];

export const CARE_GENDER_PREFERENCE_OPTIONS = [
  { id: "indiferente", label: "Sin preferencia" },
  { id: "femenino", label: "Preferencia femenina" },
  { id: "masculino", label: "Preferencia masculina" },
];

export const CARE_PAYMENT_OPTIONS = [
  { id: "definir", label: "Lo definiremos luego" },
  { id: "online", label: "Pago online" },
  { id: "transferencia", label: "Transferencia" },
  { id: "coordinacion", label: "Quiero coordinarlo con soporte" },
];

export const CARE_CONTACT_WINDOW_OPTIONS = [
  { id: "manana", label: "Por la manana" },
  { id: "tarde", label: "Por la tarde" },
  { id: "noche", label: "Por la noche" },
  { id: "indistinto", label: "Es indistinto" },
];

export const DEFAULT_CARE_REQUEST = {
  intakeMode: "short",
  completionStatus: "draft",
  draftUpdatedAt: "",
  relation: "familiar",
  needType: "",
  localidad: "",
  urgency: "semana",
  frequency: "varias",
  shift: "flexible",
  modality: "horas",
  startWindow: "semana",
  preferredSpecialty: "",
  notes: "",
  patientAgeRange: "",
  autonomyLevel: "",
  mobilityContext: "",
  clinicalNotes: "",
  cognitiveContext: "",
  livingSituation: "",
  familySupport: "",
  careEnvironment: "domicilio",
  startDate: "",
  visitDuration: "",
  replacementType: "",
  caregiverExperience: "indiferente",
  caregiverGenderPreference: "indiferente",
  softSkills: "",
  budgetRange: "",
  paymentPreference: "definir",
  contactName: "",
  contactPhone: "",
  contactEmail: "",
  contactWindow: "indistinto",
};

const PRESET_TO_NEED_TYPE = {
  cuidado_247: "guardia_247",
  higiene_personal: "higiene_movilidad",
  acompanamiento_hogar: "acompanamiento_integral",
};

const safeParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    return fallback;
  }
};

export const normalizeText = (value = "") =>
  String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const normalizeLocalityPath = (value = "") =>
  normalizeText(value)
    .split(">")
    .map((segment) => segment.trim())
    .filter(Boolean);

export const localityMatchesRequest = (
  profileLocalities = [],
  requestedLocality = ""
) => {
  if (!requestedLocality) return true;

  const requestedPath = normalizeLocalityPath(requestedLocality);
  if (requestedPath.length === 0) return true;

  return profileLocalities.some((locality) => {
    const localityPath = normalizeLocalityPath(locality);
    if (localityPath.length === 0) return false;

    const sharedLength = Math.min(requestedPath.length, localityPath.length);
    const sharesPathPrefix = requestedPath
      .slice(0, sharedLength)
      .every((segment, index) => segment === localityPath[index]);

    if (sharesPathPrefix) return true;

    const normalizedRequested = requestedPath.join(" > ");
    const normalizedLocality = localityPath.join(" > ");

    return (
      normalizedLocality.includes(normalizedRequested) ||
      normalizedRequested.includes(normalizedLocality)
    );
  });
};

export const mergeCareRequest = (...sources) =>
  sources.reduce(
    (accumulator, source) => ({
      ...accumulator,
      ...(source || {}),
    }),
    { ...DEFAULT_CARE_REQUEST }
  );

export const getStoredCareRequest = () =>
  safeParse(localStorage.getItem(CARE_REQUEST_STORAGE_KEY), {
    ...DEFAULT_CARE_REQUEST,
  });

export const saveCareRequest = (request) => {
  const normalizedRequest = mergeCareRequest({
    draftUpdatedAt: new Date().toISOString(),
    ...request,
  });
  localStorage.setItem(CARE_REQUEST_STORAGE_KEY, JSON.stringify(normalizedRequest));
  return normalizedRequest;
};

export const getStoredShortlist = () =>
  safeParse(localStorage.getItem(CARE_SHORTLIST_STORAGE_KEY), []);

export const saveShortlist = (shortlist) => {
  localStorage.setItem(CARE_SHORTLIST_STORAGE_KEY, JSON.stringify(shortlist));
  return shortlist;
};

export const toggleShortlistItem = (profileId) => {
  const shortlist = getStoredShortlist();
  const updatedShortlist = shortlist.includes(profileId)
    ? shortlist.filter((id) => id !== profileId)
    : [...shortlist, profileId];

  saveShortlist(updatedShortlist);
  return updatedShortlist;
};

export const getStoredCareSelection = () =>
  safeParse(localStorage.getItem(CARE_SELECTION_STORAGE_KEY), null);

export const saveCareSelection = (selection) => {
  localStorage.setItem(CARE_SELECTION_STORAGE_KEY, JSON.stringify(selection));
  return selection;
};

export const getStoredCareContractDraft = () =>
  safeParse(localStorage.getItem(CARE_CONTRACT_DRAFT_STORAGE_KEY), null);

export const saveCareContractDraft = (draft) => {
  localStorage.setItem(CARE_CONTRACT_DRAFT_STORAGE_KEY, JSON.stringify(draft));
  return draft;
};

export const getNeedOptionById = (needType) =>
  CARE_NEED_OPTIONS.find((option) => option.id === needType) || null;

export const getOptionLabel = (options, id) =>
  options.find((option) => option.id === id)?.label || id || "";

export const getCareIntensity = (request = DEFAULT_CARE_REQUEST) => {
  if (
    request.needType === "enfermeria_especializada" ||
    request.frequency === "guardia" ||
    request.modality === "continuo"
  ) {
    return "alta";
  }

  if (
    request.needType === "higiene_movilidad" ||
    request.frequency === "diaria" ||
    request.modality === "jornada_completa"
  ) {
    return "media";
  }

  return "baja";
};

export const getCareSegmentation = (request = DEFAULT_CARE_REQUEST) => {
  const intensity = getCareIntensity(request);
  const urgency =
    request.urgency === "hoy"
      ? "urgente"
      : request.startWindow === "explorando" || request.urgency === "planificado"
      ? "exploracion"
      : "proximos_dias";
  const familyContext =
    request.familySupport === "limitado"
      ? "red_limitada"
      : request.familySupport === "remoto"
      ? "coordinacion_remota"
      : "familia_presente";
  const shouldPromptCoordination =
    urgency === "urgente" || intensity === "alta" || familyContext === "red_limitada";
  const shouldSuggestLongIntake =
    intensity !== "baja" ||
    shouldPromptCoordination ||
    Boolean(request.mobilityContext) ||
    Boolean(request.clinicalNotes);

  return {
    urgency,
    intensity,
    familyContext,
    shouldPromptCoordination,
    shouldSuggestLongIntake,
  };
};

export const inferNeedTypeFromSpecialties = (specialties = []) => {
  const normalizedSpecialties = specialties.map((item) => normalizeText(item));

  const rankedOptions = CARE_NEED_OPTIONS.map((option) => ({
    id: option.id,
    score: option.tags.reduce(
      (total, tag) =>
        total +
        normalizedSpecialties.reduce(
          (matches, specialty) => (specialty.includes(tag) ? matches + 1 : matches),
          0
        ),
      0
    ),
  })).sort((left, right) => right.score - left.score);

  return rankedOptions[0]?.score > 0 ? rankedOptions[0].id : "";
};

export const buildCareRequestFromDisponibilidad = (disponibilidad) => {
  const profile = disponibilidad?.creador;
  const specialties = profile?.especialidad || [];
  const localities = profile?.localidadesLaborales || [];

  return mergeCareRequest({
    needType: inferNeedTypeFromSpecialties(specialties),
    localidad: localities[0] || "",
    preferredSpecialty: specialties[0] || "",
  });
};

export const buildCareSelectionFromDisponibilidad = (disponibilidad, slot) => {
  const profile = disponibilidad?.creador;
  const user = profile?.creador;

  if (!disponibilidad?._id || !profile?._id || !user?._id || !slot?._id) {
    return null;
  }

  return {
    profileId: profile._id,
    userId: user._id,
    nombreCompleto: [user.nombre, user.apellido].filter(Boolean).join(" ").trim(),
    selectedSlot: {
      disponibilidadId: disponibilidad._id,
      horarioId: slot._id,
      fecha: disponibilidad.fecha,
      hora: slot.hora,
      stock: slot.stock,
    },
  };
};

export const buildCareRequestFromLegacyJourney = () => {
  const legacyServices = safeParse(localStorage.getItem("services"), []);
  const legacyDate = safeParse(localStorage.getItem("DateService"), {});
  const locality =
    localStorage.getItem("localidad") || legacyDate.localidadServicio || "";
  const preferredSpecialty = legacyServices[0]?.nombre || "";
  const notes = [];

  if (legacyDate.date) {
    notes.push(`Preferencia previa de fecha: ${legacyDate.date}.`);
  }

  if (legacyDate.time) {
    notes.push(`Preferencia previa de horario: ${legacyDate.time}.`);
  }

  return mergeCareRequest({
    localidad: locality,
    preferredSpecialty,
    needType: inferNeedTypeFromSpecialties(preferredSpecialty ? [preferredSpecialty] : []),
    notes: notes.join(" "),
  });
};

export const buildCareRequestFromSearch = (searchParams) => {
  const params =
    searchParams instanceof URLSearchParams
      ? searchParams
      : new URLSearchParams(searchParams || "");

  const preset = params.get("preset") || "";
  const needType = PRESET_TO_NEED_TYPE[preset] || params.get("needType") || "";

  return {
    relation: params.get("relation") || "",
    needType,
    localidad:
      params.get("localidad") || localStorage.getItem("preferred_localidad") || "",
    urgency: params.get("urgency") || "",
    frequency: params.get("frequency") || "",
    shift: params.get("shift") || "",
    preferredSpecialty: params.get("especialidad") || "",
    notes: params.get("notes") || "",
  };
};

const getMinutesFromHour = (hour = "") => {
  const match = String(hour).match(/(\d{1,2}):(\d{2})/);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  return hours * 60 + minutes;
};

const slotMatchesShift = (slot, shift) => {
  if (!shift || shift === "flexible") return true;

  const minutes = getMinutesFromHour(slot?.hora);
  if (minutes === null) return false;

  if (shift === "manana") return minutes < 12 * 60;
  if (shift === "tarde") return minutes >= 12 * 60 && minutes < 18 * 60;
  if (shift === "noche") return minutes >= 18 * 60;
  return true;
};

const scoreSpecialties = (specialties = [], needType = "", preferredSpecialty = "") => {
  const normalizedSpecialties = specialties.map((item) => normalizeText(item));
  let score = 0;

  if (preferredSpecialty) {
    const normalizedPreferred = normalizeText(preferredSpecialty);
    if (
      normalizedSpecialties.some((specialty) => specialty.includes(normalizedPreferred))
    ) {
      score += 28;
    }
  }

  const needConfig = getNeedOptionById(needType);
  if (needConfig) {
    needConfig.tags.forEach((tag) => {
      if (normalizedSpecialties.some((specialty) => specialty.includes(tag))) {
        score += 8;
      }
    });
  }

  return score;
};

const buildMatchReasons = (match, request) => {
  const reasons = [];

  if (request.localidad) {
    reasons.push(`Trabaja en ${request.localidad}.`);
  }

  if (request.preferredSpecialty) {
    reasons.push(`Tiene disponibilidad para ${request.preferredSpecialty}.`);
  } else if (request.needType) {
    const needLabel = getNeedOptionById(request.needType)?.label;
    if (needLabel) {
      reasons.push(`Su perfil se alinea con ${needLabel.toLowerCase()}.`);
    }
  }

  if (request.shift && request.shift !== "flexible") {
    const matchingSlots = match.slots.filter((slot) =>
      slotMatchesShift(slot, request.shift)
    );
    if (matchingSlots.length > 0) {
      reasons.push(`Tiene horarios compatibles con tu franja preferida.`);
    }
  }

  if (match.uniqueDates.length > 1) {
    reasons.push(`Cuenta con varias fechas disponibles esta semana.`);
  }

  return reasons.slice(0, 3);
};

export const getTodayIso = () => new Date().toISOString().slice(0, 10);

export const buildCareMatches = (disponibilidades = [], request = DEFAULT_CARE_REQUEST) => {
  const normalizedLocalidad = normalizeText(request.localidad);
  const groupedMatches = new Map();
  const urgencyToday = request.urgency === "hoy";
  const todayIso = getTodayIso();

  disponibilidades.forEach((disponibilidad) => {
    const profile = disponibilidad?.creador;
    const user = profile?.creador;
    if (!profile || !user) return;

    if (urgencyToday && disponibilidad?.fecha !== todayIso) return;

    const localities = profile.localidadesLaborales || [];
    const specialties = profile.especialidad || [];
    const availableSlots = (disponibilidad?.horarios || disponibilidad?.disponibilidad || []).filter(
      (slot) => slot.stock !== false
    );

    if (availableSlots.length === 0) return;

    if (normalizedLocalidad && !localityMatchesRequest(localities, request.localidad)) {
      return;
    }

    const profileId = profile._id;
    const existingMatch =
      groupedMatches.get(profileId) || {
        id: profileId,
        userId: user._id,
        nombre: user.nombre || "",
        apellido: user.apellido || "",
        nombreCompleto: [user.nombre, user.apellido].filter(Boolean).join(" ").trim(),
        img: user.img || profile.img || "",
        descripcion: profile.descripcion || "",
        especialidades: specialties,
        localidades: localities,
        slots: [],
        uniqueDates: [],
      };

    const slots = availableSlots.map((slot) => ({
      disponibilidadId: disponibilidad._id,
      horarioId: slot._id,
      fecha: disponibilidad.fecha,
      hora: slot.hora,
      stock: slot.stock,
    }));

    existingMatch.slots.push(...slots);
    existingMatch.uniqueDates = Array.from(
      new Set([...existingMatch.uniqueDates, disponibilidad.fecha])
    );

    groupedMatches.set(profileId, existingMatch);
  });

  return Array.from(groupedMatches.values())
    .map((match) => {
      const orderedSlots = [...match.slots].sort((left, right) => {
        const leftKey = `${left.fecha}-${left.hora}`;
        const rightKey = `${right.fecha}-${right.hora}`;
        return leftKey.localeCompare(rightKey);
      });

      const specialtyScore = scoreSpecialties(
        match.especialidades,
        request.needType,
        request.preferredSpecialty
      );
      const shiftMatches = orderedSlots.filter((slot) =>
        slotMatchesShift(slot, request.shift)
      );
      const shiftScore =
        request.shift && request.shift !== "flexible"
          ? shiftMatches.length > 0
            ? 14
            : 0
          : 8;
      const urgencyScore = request.urgency === "hoy" ? 12 : request.urgency === "semana" ? 8 : 4;
      const availabilityScore = Math.min(orderedSlots.length, 4) * 6;
      const locationScore = request.localidad ? 16 : 8;
      const totalScore = specialtyScore + shiftScore + urgencyScore + availabilityScore + locationScore;

      let scoreLabel = "Coincidencia media";
      if (totalScore >= 70) scoreLabel = "Alta coincidencia";
      if (totalScore < 48) scoreLabel = "Coincidencia inicial";

      const trustBadges = [];
      if (request.localidad) trustBadges.push("Zona coincidente");
      if (specialtyScore > 0) trustBadges.push("Perfil alineado");
      if (shiftMatches.length > 0 || request.shift === "flexible") {
        trustBadges.push("Horario compatible");
      }
      if (match.uniqueDates.length > 1) trustBadges.push("Varias fechas");

      const matchWithScores = {
        ...match,
        slots: orderedSlots,
        nextSlot: orderedSlots[0] || null,
        compatibleSlots: shiftMatches,
        totalScore,
        scoreLabel,
        trustBadges,
      };

      return {
        ...matchWithScores,
        matchReasons: buildMatchReasons(matchWithScores, request),
      };
    })
    .sort((left, right) => {
      if (right.totalScore !== left.totalScore) {
        return right.totalScore - left.totalScore;
      }
      return right.slots.length - left.slots.length;
    });
};
