import React from "react";
import { Link } from "react-router-dom";
import {
  buildNextActions,
  getCaseCompanionLabel,
  getCaseMoment,
  getCaseNeedLabel,
  getCaseSummaryRoute,
  getCaseTimelineRoute,
  getPaymentStatusMeta,
  getServiceStatusMeta,
  getToneClasses,
  isCareFlowOrder,
} from "../../helpers/careHub";

const CareInboxList = ({ items, role, unreadCounts }) => {
  if (!items.length) {
    return (
      <div className="rounded-[1.75rem] border border-dashed border-[#d8c5ad] bg-[#fffaf2] p-8 text-center">
        <p className="text-lg font-semibold text-slate-900">Todavia no hay casos en este inbox.</p>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Cuando aparezcan solicitudes, asignaciones o seguimientos activos los veras ordenados aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const serviceStatus = getServiceStatusMeta(item?.estado_servicio);
        const paymentStatus = getPaymentStatusMeta(item?.factura?.estadoPago);
        const unreadCount = unreadCounts[item._id] || 0;
        const nextActions = buildNextActions(item, role);

        return (
          <article
            key={item._id}
            className="rounded-[1.75rem] border border-[#dccfbf] bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#f7efe2] px-3 py-1 text-xs font-semibold text-[#7d5a21]">
                    {isCareFlowOrder(item) ? "Care flow" : "Caso migrado"}
                  </span>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${getToneClasses(
                      serviceStatus.tone
                    )}`}
                  >
                    {serviceStatus.label}
                  </span>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${getToneClasses(
                      paymentStatus.tone
                    )}`}
                  >
                    {paymentStatus.label}
                  </span>
                  {unreadCount ? (
                    <span className="rounded-full bg-[#1d4ed8] px-3 py-1 text-xs font-semibold text-white">
                      {unreadCount} mensajes pendientes
                    </span>
                  ) : null}
                </div>

                <div>
                  <p className="text-xl font-semibold text-slate-900">{getCaseNeedLabel(item)}</p>
                  <p className="mt-2 text-sm text-slate-600">
                    Caso {item._id} · {getCaseCompanionLabel(item, role)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  to={getCaseSummaryRoute(role, item._id)}
                  className="rounded-full bg-[#7c5a23] px-4 py-2 text-sm font-semibold text-white hover:bg-[#5f4219]"
                >
                  Abrir centro
                </Link>
                <Link
                  to={getCaseTimelineRoute(role, item._id)}
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Ver timeline
                </Link>
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <div className="rounded-[1.25rem] bg-[#fcfaf7] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Proxima visita
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">{getCaseMoment(item)}</p>
              </div>
              <div className="rounded-[1.25rem] bg-[#fcfaf7] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Direccion
                </p>
                <p className="mt-2 text-sm text-slate-900">
                  {item?.direccion_servicio || "Pendiente de definicion"}
                </p>
              </div>
              <div className="rounded-[1.25rem] bg-[#fcfaf7] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Siguiente accion
                </p>
                <p className="mt-2 text-sm text-slate-900">
                  {nextActions[0]?.title || "Seguir conversacion y registrar decisiones"}
                </p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default CareInboxList;
