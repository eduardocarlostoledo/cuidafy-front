import React from "react";
import Spinner from "../../components/Spinner";
import CareTimelinePanel from "../../components/care/CareTimelinePanel";
import CareWorkspaceShell from "../../components/care/CareWorkspaceShell";
import {
  buildCaseTimeline,
  buildNextActions,
  getCaseNeedLabel,
  getCaseSummaryRoute,
  getCaseTimelineRoute,
  getHubRoleConfig,
  getToneClasses,
} from "../../helpers/careHub";
import { useCareCase } from "../../hooks/useCareCases";
import { useParams } from "react-router-dom";

const CareCaseTimeline = ({ role = "cliente" }) => {
  const { id } = useParams();
  const roleConfig = getHubRoleConfig(role);
  const { item, loading } = useCareCase(id);

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
        description="El timeline no esta disponible porque la orden no pudo cargarse."
        backTo={roleConfig.inboxPath}
        backLabel="Volver al inbox"
      >
        <div className="rounded-[1.75rem] border border-dashed border-[#d8c5ad] bg-[#fffaf2] p-8 text-sm text-slate-600">
          Intenta volver a abrir el caso desde el inbox principal.
        </div>
      </CareWorkspaceShell>
    );
  }

  const timeline = buildCaseTimeline(item);
  const nextActions = buildNextActions(item, role);

  const sidebar = (
    <div className="rounded-[1.75rem] border border-[#dccfbf] bg-white p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7d5a21]">
        Proximas acciones
      </p>
      <div className="mt-4 space-y-3">
        {nextActions.map((action) => (
          <div
            key={action.key}
            className={`rounded-[1.25rem] border p-4 text-sm ${getToneClasses(action.tone)}`}
          >
            <p className="font-semibold">{action.title}</p>
            <p className="mt-2 leading-6">{action.description}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <CareWorkspaceShell
      eyebrow={`${roleConfig.label} · Caso ${id}`}
      title={`Timeline de ${getCaseNeedLabel(item)}`}
      description="Linea de tiempo pensada para reconstruir decisiones, estado y proximos pasos del caso."
      backTo={roleConfig.inboxPath}
      backLabel="Volver al inbox"
      tabs={[
        {
          to: getCaseSummaryRoute(role, id),
          label: "Centro del caso",
        },
        {
          to: getCaseTimelineRoute(role, id),
          label: "Timeline",
          end: true,
        },
      ]}
      sidebar={sidebar}
    >
      <CareTimelinePanel items={timeline} />
    </CareWorkspaceShell>
  );
};

export default CareCaseTimeline;
