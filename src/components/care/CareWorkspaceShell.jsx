import React from "react";
import { Link, NavLink } from "react-router-dom";

const tabClassName = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-semibold transition ${
    isActive
      ? "bg-[#7c5a23] text-white"
      : "border border-[#dccfbf] bg-white text-slate-700 hover:bg-[#fcf6ee]"
  }`;

const CareWorkspaceShell = ({
  eyebrow,
  title,
  description,
  backTo,
  backLabel,
  actions,
  tabs,
  children,
  sidebar,
}) => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff9ef,_#f7f4ee_42%,_#edf2f7)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-[#e7dac8] bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
          <div className="flex flex-col gap-6 border-b border-[#eee3d5] pb-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-3xl">
                {eyebrow ? (
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8a6426]">
                    {eyebrow}
                  </p>
                ) : null}
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                  {title}
                </h1>
                {description ? (
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                    {description}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-3">
                {backTo ? (
                  <Link
                    to={backTo}
                    className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    {backLabel || "Volver"}
                  </Link>
                ) : null}
                {actions}
              </div>
            </div>

            {tabs?.length ? (
              <div className="flex flex-wrap gap-3">
                {tabs.map((tab) => (
                  <NavLink key={tab.to} to={tab.to} end={tab.end} className={tabClassName}>
                    {tab.label}
                  </NavLink>
                ))}
              </div>
            ) : null}
          </div>

          <div className={`mt-8 grid gap-6 ${sidebar ? "xl:grid-cols-[minmax(0,2fr)_360px]" : ""}`}>
            <div>{children}</div>
            {sidebar ? <aside className="space-y-6">{sidebar}</aside> : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareWorkspaceShell;
