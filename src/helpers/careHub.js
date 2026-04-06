import {
  CARE_FREQUENCY_OPTIONS,
  CARE_SHIFT_OPTIONS,
  CARE_URGENCY_OPTIONS,
  getNeedOptionById,
  getOptionLabel,
} from "./careFlow";

export const HUB_ROLE_CONFIG = {
  cliente: {
    label: "Cliente",
    inboxPath: "/casos",
    summaryPrefix: "/resumen",
    inboxTitle: "Inbox de casos",
    inboxDescription:
      "Aqui ves tus casos activos, mensajes pendientes y proximos pasos sin volver al checkout legacy.",
  },
  profesional: {
    label: "Profesional",
    inboxPath: "/casos/profesional",
    summaryPrefix: "/resumen-profesional",
    inboxTitle: "Inbox profesional",
    inboxDescription:
      "Aqui ves tus asignaciones, conversaciones activas y lo que necesita confirmacion operativa.",
  },
  admin: {
    label: "Coordinacion",
    inboxPath: "/dashboard/casos",
    summaryPrefix: "/resumen-admin",
    inboxTitle: "Inbox de coordinacion",
    inboxDescription:
      "Aqui centralizamos casos, pagos y conversaciones para operar sin depender del recorrido legacy.",
  },
};

const paymentStatusMap = {
  approved: {
    label: "Pago aprobado",
    tone: "green",
  },
  pagada: {
    label: "Pago aprobado",
    tone: "green",
  },
  pending: {
    label: "Pendiente de pago",
    tone: "amber",
  },
  pendiente: {
    label: "Pendiente de pago",
    tone: "amber",
  },
  rejected: {
    label: "Pago rechazado",
    tone: "red",
  },
  cancelada: {
    label: "Pago cancelado",
    tone: "red",
  },
};

const serviceStatusMap = {
  Pendiente: {
    label: "Pendiente de coordinacion",
    tone: "amber",
  },
  Confirmado: {
    label: "Caso confirmado",
    tone: "blue",
  },
  Completado: {
    label: "Servicio completado",
    tone: "green",
  },
  Cancelado: {
    label: "Caso cancelado",
    tone: "red",
  },
  Cancelada: {
    label: "Caso cancelado",
    tone: "red",
  },
};

const toneClassMap = {
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  blue: "bg-sky-50 text-sky-700 border-sky-200",
  green: "bg-emerald-50 text-emerald-700 border-emerald-200",
  red: "bg-rose-50 text-rose-700 border-rose-200",
  slate: "bg-slate-100 text-slate-700 border-slate-200",
};

const formatDate = (value, options = {}) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("es-AR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    ...options,
  });
};

export const getHubRoleConfig = (role) =>
  HUB_ROLE_CONFIG[role] || HUB_ROLE_CONFIG.cliente;

export const isCareFlowOrder = (order) =>
  order?.source_channel === "care_flow" || Boolean(order?.care_request);

export const getToneClasses = (tone = "slate") =>
  toneClassMap[tone] || toneClassMap.slate;

export const getPaymentStatusMeta = (status) =>
  paymentStatusMap[status] || {
    label: status || "Pendiente de pago",
    tone: "amber",
  };

export const getServiceStatusMeta = (status) =>
  serviceStatusMap[status] || {
    label: status || "Pendiente de coordinacion",
    tone: "slate",
  };

export const getCaseNeedLabel = (order) => {
  const careNeed = getNeedOptionById(order?.care_request?.needType)?.label;
  if (careNeed) return careNeed;

  const firstService = order?.servicios?.[0]?.nombre;
  return firstService || "Solicitud de cuidado";
};

export const getCaseCompanionLabel = (order, role) => {
  if (role === "cliente") {
    return order?.profesional_id?.nombre || "Coordinacion pendiente";
  }

  if (role === "profesional") {
    const fullName = [order?.cliente_id?.nombre, order?.cliente_id?.apellido]
      .filter(Boolean)
      .join(" ")
      .trim();
    return fullName || "Cliente pendiente";
  }

  return order?.profesional_id?.nombre || "Sin asignar";
};

export const getCaseSummaryRoute = (role, id = "") => {
  const prefix = getHubRoleConfig(role).summaryPrefix;
  return id ? `${prefix}/${id}` : prefix;
};

export const getCaseTimelineRoute = (role, id) =>
  `${getCaseSummaryRoute(role, id)}/timeline`;

export const getCaseMoment = (order) =>
  order?.cita_servicio && order?.hora_servicio
    ? `${order.cita_servicio} ${order.hora_servicio}`
    : order?.cita_servicio || order?.hora_servicio || "Pendiente de agenda";

export const buildCaseOverview = (order) => {
  const request = order?.care_request || {};

  return [
    {
      key: "need",
      label: "Necesidad principal",
      value: getCaseNeedLabel(order),
    },
    {
      key: "urgency",
      label: "Urgencia",
      value: getOptionLabel(CARE_URGENCY_OPTIONS, request.urgency) || "Pendiente",
    },
    {
      key: "frequency",
      label: "Frecuencia",
      value: getOptionLabel(CARE_FREQUENCY_OPTIONS, request.frequency) || "Pendiente",
    },
    {
      key: "shift",
      label: "Franja preferida",
      value: getOptionLabel(CARE_SHIFT_OPTIONS, request.shift) || "Pendiente",
    },
  ];
};

export const buildCaseTimeline = (order) => {
  const paymentStatus = getPaymentStatusMeta(order?.factura?.estadoPago);
  const serviceStatus = getServiceStatusMeta(order?.estado_servicio);
  const items = [
    {
      key: "created",
      title: "Caso creado",
      description: isCareFlowOrder(order)
        ? "La solicitud entro por el flujo nuevo de cuidado."
        : "La orden sigue viniendo de un flujo historico pero ya la mostramos como caso.",
      moment: formatDate(order?.createdAt, { year: "numeric" }),
      tone: "blue",
    },
    order?.care_request
      ? {
          key: "intake",
          title: "Solicitud estructurada",
          description: `${getCaseNeedLabel(order)} para ${order?.localidad_servicio || order?.care_request?.localidad || "zona por definir"}.`,
          moment: formatDate(order?.updatedAt || order?.createdAt, { year: "numeric" }),
          tone: "amber",
        }
      : null,
    order?.profesional_id?.nombre
      ? {
          key: "assignment",
          title: "Profesional asignado",
          description: `Se asigno a ${order.profesional_id.nombre}.`,
          moment: order?.updatedAt ? formatDate(order.updatedAt, { year: "numeric" }) : "Pendiente",
          tone: "green",
        }
      : {
          key: "assignment_pending",
          title: "Asignacion pendiente",
          description: "Todavia no hay profesional confirmado para este caso.",
          moment: "Pendiente",
          tone: "amber",
        },
    order?.cita_servicio || order?.hora_servicio
      ? {
          key: "schedule",
          title: "Visita programada",
          description: getCaseMoment(order),
          moment: order?.cita_servicio || "Pendiente",
          tone: "blue",
        }
      : null,
    {
      key: "payment",
      title: paymentStatus.label,
      description:
        paymentStatus.tone === "green"
          ? "La confirmacion economica ya no bloquea la coordinacion."
          : "Aun conviene seguir de cerca la confirmacion del pago o cupon.",
      moment: formatDate(order?.factura?.fecha_venta || order?.updatedAt, { year: "numeric" }),
      tone: paymentStatus.tone,
    },
    {
      key: "status",
      title: serviceStatus.label,
      description:
        serviceStatus.tone === "green"
          ? "El caso ya quedo marcado como resuelto."
          : serviceStatus.tone === "red"
          ? "El caso necesita cierre o reactivacion."
          : "El caso sigue en curso y requiere seguimiento.",
      moment: formatDate(order?.updatedAt, { year: "numeric" }),
      tone: serviceStatus.tone,
    },
  ];

  return items.filter(Boolean);
};

export const buildNextActions = (order, role) => {
  const actions = [];
  const paymentStatus = getPaymentStatusMeta(order?.factura?.estadoPago);

  if (!order?.profesional_id?.nombre) {
    actions.push({
      key: "assignment",
      title: "Definir profesional",
      description:
        role === "admin"
          ? "Este caso sigue necesitando asignacion o reserva asistida."
          : "Coordinacion todavia esta buscando la mejor asignacion para este caso.",
      tone: "amber",
    });
  }

  if (!order?.cita_servicio || !order?.hora_servicio) {
    actions.push({
      key: "schedule",
      title: "Cerrar fecha y horario",
      description:
        role === "profesional"
          ? "Conviene confirmar disponibilidad real antes de la primera visita."
          : "Todavia falta transformar la intencion del caso en una visita programada.",
      tone: "blue",
    });
  }

  if (paymentStatus.tone !== "green") {
    actions.push({
      key: "payment",
      title: "Resolver pago o cupon",
      description:
        role === "admin"
          ? "Este caso puede necesitar cupón, link de pago o validacion manual."
          : "Conviene seguir el estado economico para no frenar el alta del caso.",
      tone: paymentStatus.tone,
    });
  }

  if (order?.estado_servicio === "Pendiente" || !order?.estado_servicio) {
    actions.push({
      key: "message",
      title: "Mantener el hilo activo",
      description: "Usa el inbox y el chat para dejar decisiones visibles y evitar coordinacion por fuera.",
      tone: "slate",
    });
  }

  return actions.slice(0, 4);
};

export const getCaseSortDate = (order) => order?.updatedAt || order?.createdAt || "";

export const formatCaseDate = (value) => formatDate(value, { year: "numeric" });
