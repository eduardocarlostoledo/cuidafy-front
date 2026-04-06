import React from "react";
import { getToneClasses } from "../../helpers/careHub";

const CareTimelinePanel = ({ items }) => {
  return (
    <div className="rounded-[1.75rem] border border-[#dccfbf] bg-white p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7d5a21]">
            Timeline del caso
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Cada cambio importante queda visible con lenguaje de caso y no de checkout.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {items.map((item, index) => (
          <div key={item.key} className="relative pl-8">
            {index < items.length - 1 ? (
              <span className="absolute left-[11px] top-7 h-[calc(100%+16px)] w-px bg-[#eadbc6]" />
            ) : null}

            <span
              className={`absolute left-0 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs font-bold ${getToneClasses(
                item.tone
              )}`}
            >
              {index + 1}
            </span>

            <div className="rounded-[1.25rem] border border-slate-200 bg-[#fcfaf7] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-semibold text-slate-900">{item.title}</p>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${getToneClasses(
                    item.tone
                  )}`}
                >
                  {item.moment || "Pendiente"}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareTimelinePanel;
