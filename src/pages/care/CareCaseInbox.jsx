import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Spinner from "../../components/Spinner";
import CareInboxList from "../../components/care/CareInboxList";
import CareWorkspaceShell from "../../components/care/CareWorkspaceShell";
import { getHubRoleConfig } from "../../helpers/careHub";
import { useCareInbox } from "../../hooks/useCareCases";

const CareCaseInbox = ({ role = "cliente" }) => {
  const { user } = useSelector((state) => ({ ...state.auth }));
  const roleConfig = getHubRoleConfig(role);
  const { items, unreadCounts, loading } = useCareInbox({ role, user });

  const sidebar = (
    <>
      <div className="rounded-[1.75rem] border border-[#dccfbf] bg-white p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7d5a21]">
          Como usar este inbox
        </p>
        <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
          <p>Abre cada caso para ver contexto, proximas acciones y conversacion en un mismo lugar.</p>
          <p>Usa el timeline cuando necesites reconstruir que paso y que sigue.</p>
          <p>La idea es sacar coordinacion del checkout legacy y dejarla visible aca.</p>
        </div>
      </div>

      {role === "cliente" ? (
        <div className="rounded-[1.75rem] border border-[#dccfbf] bg-[#fff8ed] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7d5a21]">
            Nuevo caso
          </p>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Si todavia no encuentras lo que necesitas, puedes abrir una nueva solicitud desde el flujo de cuidado.
          </p>
          <Link
            to="/encontrar-cuidado"
            className="mt-5 inline-flex rounded-full bg-[#7c5a23] px-4 py-2 text-sm font-semibold text-white hover:bg-[#5f4219]"
          >
            Abrir solicitud
          </Link>
        </div>
      ) : null}
    </>
  );

  return (
    <CareWorkspaceShell
      eyebrow={roleConfig.label}
      title={roleConfig.inboxTitle}
      description={roleConfig.inboxDescription}
      backTo="/"
      backLabel="Volver al inicio"
      sidebar={sidebar}
    >
      {loading ? (
        <div className="flex min-h-[320px] items-center justify-center rounded-[1.75rem] border border-[#dccfbf] bg-white">
          <Spinner />
        </div>
      ) : (
        <CareInboxList items={items} role={role} unreadCounts={unreadCounts} />
      )}
    </CareWorkspaceShell>
  );
};

export default CareCaseInbox;
