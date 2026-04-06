import React from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { ImWhatsapp } from "react-icons/im";
import Spinner from "../../components/Spinner";
import CareOperationsPanel from "../../components/care/CareOperationsPanel";
import CareTimelinePanel from "../../components/care/CareTimelinePanel";
import CareWorkspaceShell from "../../components/care/CareWorkspaceShell";
import Chat from "../private/Chat";
import ProfessionalChat from "../private/professional/Chat";
import {
  buildCaseOverview,
  buildCaseTimeline,
  buildNextActions,
  getCaseCompanionLabel,
  getCaseMoment,
  getCaseNeedLabel,
  getCaseSummaryRoute,
  getCaseTimelineRoute,
  getHubRoleConfig,
  getPaymentStatusMeta,
  getServiceStatusMeta,
  getToneClasses,
  isCareFlowOrder,
} from "../../helpers/careHub";
import { useCareCase } from "../../hooks/useCareCases";

const statCardClassName = "rounded-[1.5rem] border border-slate-200 bg-[#fcfaf7] p-4";

const CareCaseCenter = ({ role = "cliente" }) => {
  const { id } = useParams();
  const roleConfig = getHubRoleConfig(role);
  const { user } = useSelector((state) => ({ ...state.auth }));
  const { item, loading, reload } = useCareCase(id);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f4ee]">
        <Spinner />
      </div>
    );
  }

  if (!item) {
    return (
      <CareWorkspaceShell
        eyebrow={roleConfig.label}
        title="No encontramos este caso"
        description="Es posible que el enlace haya vencido o que la orden ya no este disponible."
        backTo={roleConfig.inboxPath}
        backLabel="Volver al inbox"
      >
        <div className="rounded-[1.75rem] border border-dashed border-[#d8c5ad] bg-[#fffaf2] p-8 text-sm text-slate-600">
          Intenta abrir el caso desde tu inbox para recuperar el contexto correcto.
        </div>
      </CareWorkspaceShell>
    );
  }

  const paymentStatus = getPaymentStatusMeta(item?.factura?.estadoPago);
  const serviceStatus = getServiceStatusMeta(item?.estado_servicio);
  const timeline = buildCaseTimeline(item);
  const nextActions = buildNextActions(item, role);
  const overview = buildCaseOverview(item);
  const ChatComponent = role === "cliente" ? Chat : ProfessionalChat;
  const whatsappHref = `https://web.whatsapp.com/send/?phone=543764331313&text=${encodeURIComponent(
    `Hola, necesito ayuda con el caso ${id}.`
  )}&type=phone_number&app_absent=0`;

  const sidebar = (
    <>
      {role !== "cliente" && user ? (
        <CareOperationsPanel role={role} caseItem={item} onSaved={reload} />
      ) : null}

      <div className="rounded-[1.75rem] border border-[#dccfbf] bg-white p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7d5a21]">
          Proximas acciones
        </p>
        <div className="mt-4 space-y-3">
          {nextActions.length ? (
            nextActions.map((action) => (
              <div
                key={action.key}
                className={`rounded-[1.25rem] border p-4 text-sm ${getToneClasses(action.tone)}`}
              >
                <p className="font-semibold">{action.title}</p>
                <p className="mt-2 leading-6">{action.description}</p>
              </div>
            ))
          ) : (
            <div className="rounded-[1.25rem] border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
              El caso ya tiene un estado bastante cerrado. Desde aqui solo necesitas seguimiento liviano.
            </div>
          )}
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-[#dccfbf] bg-[#fff8ed] p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7d5a21]">
          Soporte rapido
        </p>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          Si necesitas acelerar una definicion, puedes seguir por WhatsApp sin perder el hilo del caso.
        </p>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#25d366] px-4 py-2 text-sm font-semibold text-white hover:bg-[#17b856]"
        >
          <ImWhatsapp className="h-4 w-4" />
          Consultar por WhatsApp
        </a>
      </div>

      <div className="rounded-[1.75rem] border border-[#dccfbf] bg-white p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7d5a21]">
          Mini timeline
        </p>
        <div className="mt-4 space-y-3">
          {timeline.slice(0, 3).map((entry) => (
            <div key={entry.key} className="rounded-[1.25rem] bg-[#fcfaf7] p-4">
              <p className="font-semibold text-slate-900">{entry.title}</p>
              <p className="mt-2 text-sm text-slate-600">{entry.moment || "Pendiente"}</p>
            </div>
          ))}
          <Link
            to={getCaseTimelineRoute(role, id)}
            className="inline-flex rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Ver timeline completo
          </Link>
        </div>
      </div>
    </>
  );

  return (
    <CareWorkspaceShell
      eyebrow={`${roleConfig.label} · Caso ${id}`}
      title={getCaseNeedLabel(item)}
      description="Centro del caso para ver contexto, estado, siguientes pasos y conversacion en un mismo lugar."
      backTo={roleConfig.inboxPath}
      backLabel="Volver al inbox"
      tabs={[
        {
          to: getCaseSummaryRoute(role, id),
          label: "Centro del caso",
          end: true,
        },
        {
          to: getCaseTimelineRoute(role, id),
          label: "Timeline",
        },
      ]}
      sidebar={sidebar}
    >
      <div className="space-y-6">
        <section className="rounded-[1.75rem] border border-[#dccfbf] bg-white p-6">
          <div className="flex flex-wrap gap-2">
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
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className={statCardClassName}>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Estado del caso
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{serviceStatus.label}</p>
            </div>
            <div className={statCardClassName}>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Referente principal
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-900">
                {getCaseCompanionLabel(item, role)}
              </p>
            </div>
            <div className={statCardClassName}>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Proxima visita
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{getCaseMoment(item)}</p>
            </div>
            <div className={statCardClassName}>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Estado economico
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{paymentStatus.label}</p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div className="rounded-[1.75rem] border border-[#dccfbf] bg-white p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7d5a21]">
              Resumen del caso
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {overview.map((entry) => (
                <div key={entry.key} className="rounded-[1.25rem] bg-[#fcfaf7] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {entry.label}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {entry.value || "Pendiente"}
                  </p>
                </div>
              ))}
              <div className="rounded-[1.25rem] bg-[#fcfaf7] p-4 md:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Notas y direccion
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {item?.care_request?.notes || "Sin notas cargadas todavia."}
                </p>
                <p className="mt-3 text-sm font-medium text-slate-900">
                  {item?.direccion_servicio || "Direccion pendiente"}
                </p>
              </div>
            </div>
          </div>

          <CareTimelinePanel items={timeline.slice(0, 4)} />
        </section>

        <section className="rounded-[1.75rem] border border-[#dccfbf] bg-white p-2 sm:p-4">
          <div className="rounded-[1.25rem] bg-[#fcfaf7] p-4">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7d5a21]">
              Conversacion del caso
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              El chat queda dentro del centro del caso para no perder decisiones entre multiples pantallas.
            </p>
          </div>
          <ChatComponent id={id} />
        </section>
      </div>
    </CareWorkspaceShell>
  );
};

export default CareCaseCenter;
