import React from "react";

import { coloresBG } from "../../../../data";

const CardInfo = ({ title, icon, count, color }) => {
  return (
    <div className="col-span-12 sm:col-span-6 md:col-span-3">
      <div className="flex flex-row bg-white shadow-sm rounded p-4">
        <div
          className={`flex items-center justify-center flex-shrink-0 h-12 w-12 rounded-xl ${coloresBG[color]}`}
        >
          {icon}
        </div>
        <div className="flex flex-col flex-grow ml-4">
          <div className="text-sm text-gray-500">{title}</div>
          <div className="font-bold text-lg">{count}</div>
        </div>
      </div>
    </div>
  );
};

export default CardInfo;
