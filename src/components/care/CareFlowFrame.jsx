import React from "react";
import { Link } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";

const STEPS = [
  { id: "intake", label: "1. Solicitud" },
  { id: "matching", label: "2. Matching" },
  { id: "profile", label: "3. Ficha" },
  { id: "contract", label: "4. Contratacion" },
];

const CareFlowFrame = ({
  currentStep,
  title,
  description,
  eyebrow = "Hub de cuidado",
  backHref = "/",
  backLabel = "Volver",
  children,
  aside,
}) => {
  return (
    <div className="min-h-screen bg-[#f5efe5] text-slate-900">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-8 md:px-8 md:py-10">
        <Link
          to={backHref}
          className="inline-flex items-center rounded-full border border-[#d8ccb8] bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-[#fbf7f1]"
        >
          {backLabel}
        </Link>

        <section className="mt-6 rounded-[2rem] border border-[#dccfbf] bg-[linear-gradient(145deg,#fff9ef_0%,#f5efe5_55%,#ebddcb_100%)] p-6 shadow-[0_18px_60px_rgba(88,67,37,0.08)] md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7d5a21]">
                {eyebrow}
              </p>
              <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-5xl">
                {title}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
                {description}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {STEPS.map((step) => {
                const isActive = step.id === currentStep;
                return (
                  <span
                    key={step.id}
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
                      isActive
                        ? "bg-[#7c5a23] text-white"
                        : "border border-[#dccfbf] bg-white text-slate-600"
                    }`}
                  >
                    {step.label}
                  </span>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.55fr,0.85fr]">
          <div className="space-y-6">{children}</div>
          <aside className="space-y-6">{aside}</aside>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CareFlowFrame;
