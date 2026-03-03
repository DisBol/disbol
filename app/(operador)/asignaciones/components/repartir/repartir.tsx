"use client";

import React, { useState } from "react";
import CardCode from "@/components/ui/CardCode";

export default function Repartir() {
  const detalles = [
    { label: "Código 104", cajas: "10/10", unidades: "5/5" },
    { label: "Código 105", cajas: "0/0", unidades: "0/0" },
    { label: "Código 106", cajas: "0/0", unidades: "0/0" },
    { label: "Código 107", cajas: "5/5", unidades: "2/2" },
    { label: "Código 108", cajas: "0/0", unidades: "0/0" },
    { label: "Código 109", cajas: "0/0", unidades: "0/0" },
    { label: "Código 110", cajas: "0/0", unidades: "0/0" },
  ];

  const initialGroups = [
    {
      name: "El Alto Norte",
      clientesCount: 2,
      codes: [
        { label: "Código 104", cajas: 0, unidades: 0 },
        { label: "Código 105", cajas: 0, unidades: 0 },
        { label: "Código 106", cajas: 0, unidades: 0 },
        { label: "Código 107", cajas: 0, unidades: 0 },
        { label: "Código 108", cajas: 0, unidades: 0 },
        { label: "Código 109", cajas: 0, unidades: 0 },
        { label: "Código 110", cajas: 0, unidades: 0 },
      ],
      totalCajas: 0,
      totalUnid: 0,
    },
    {
      name: "El Alto Sur",
      clientesCount: 1,
      codes: [
        { label: "Código 104", cajas: 0, unidades: 0 },
        { label: "Código 105", cajas: 0, unidades: 0 },
        { label: "Código 106", cajas: 0, unidades: 0 },
        { label: "Código 107", cajas: 0, unidades: 0 },
        { label: "Código 108", cajas: 0, unidades: 0 },
        { label: "Código 109", cajas: 0, unidades: 0 },
        { label: "Código 110", cajas: 0, unidades: 0 },
      ],
      totalCajas: 0,
      totalUnid: 0,
    },
  ];

  const [groups, setGroups] = useState(initialGroups);

  return (
    <div className="w-full h-full p-4 lg:p-6 bg-[#f8fafc] min-h-screen">
      {/* Top Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-5 p-5">
        <h2 className="text-[17px] font-bold text-[#1e293b] mb-5">
          Repartir Asignación
        </h2>

        <div className="flex flex-col xl:flex-row items-start gap-6">
          {/* Left info & buttons */}
          <div className="flex flex-col gap-4 xl:w-[250px] shrink-0 pb-4 xl:pb-0">
            <div className="flex flex-col space-y-2 mt-1">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                PROVEEDOR: <span className="text-gray-900 ml-1">SOFIA</span>
              </p>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                COSTO POR KG:{" "}
                <span className="text-gray-900 ml-1">Bs 10.00</span>
              </p>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                PRECIO DIFERIDO: <span className="text-gray-900 ml-1">No</span>
              </p>
            </div>
            <div className="flex gap-2.5 mt-2">
              <button className="px-4 py-2 border border-gray-200 rounded-lg text-[12px] font-bold shadow-sm bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors shrink-0 flex-1">
                Cancelar
              </button>
              <button className="px-4 py-2 rounded-lg text-[12px] font-bold shadow-sm bg-[#10b981] hover:bg-emerald-600 text-white transition-colors text-center flex-1">
                Guardar
              </button>
            </div>
          </div>

          {/* Right Details */}
          <div className="flex-1 overflow-x-auto pb-2">
            <h3 className="text-[11px] font-bold text-gray-800 mb-3 xl:ml-2">
              Detalles de la Asignación
            </h3>
            <div className="flex flex-nowrap gap-2 xl:ml-2">
              {detalles.map((d, i) => (
                <div key={i} className="w-[85px] shrink-0">
                  <CardCode
                    label={d.label}
                    cajas={d.cajas}
                    unidades={d.unidades}
                    readOnly={true}
                    weightInfo={{
                      adicional: [{ label: "Costo:", value: "Bs 10.00/kg" }],
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="space-y-4">
          {groups.map((group, groupIdx) => (
            <div
              key={groupIdx}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
            >
              <div className="flex flex-col xl:flex-row items-center p-3 gap-4">
                {/* Left group name */}
                <div className="w-[120px] shrink-0 text-center xl:text-left xl:pl-4">
                  <span className="font-bold text-[#e11d48] text-[13px]">
                    {group.name}
                  </span>
                </div>

                {/* Center Code Cards */}
                <div className="flex flex-nowrap overflow-x-auto gap-2 flex-1 items-stretch py-1">
                  {group.codes.map((code, codeIdx) => (
                    <div key={codeIdx} className="w-[80px] shrink-0">
                      <CardCode
                        label={code.label}
                        cajas={code.cajas}
                        unidades={code.unidades}
                        onCajasChange={(val) => {
                          const newGroups = [...groups];
                          newGroups[groupIdx].codes[codeIdx].cajas =
                            val === "" ? 0 : Number(val);
                          setGroups(newGroups);
                        }}
                        onUnidadesChange={(val) => {
                          const newGroups = [...groups];
                          newGroups[groupIdx].codes[codeIdx].unidades =
                            val === "" ? 0 : Number(val);
                          setGroups(newGroups);
                        }}
                      />
                    </div>
                  ))}

                  {/* TOTAL Card */}
                  <div className="w-[80px] shrink-0">
                    <div className="bg-[#e11d48] rounded-lg p-2 shadow-sm flex flex-col h-full border border-[#e11d48]">
                      <h3 className="font-bold text-white text-[10px] mb-2 text-center uppercase tracking-wide">
                        TOTAL
                      </h3>
                      <div className="space-y-1.5 flex-1 flex flex-col justify-end">
                        <div>
                          <label className="block text-[8px] font-bold text-white/90 uppercase leading-none mb-0.5">
                            CAJAS
                          </label>
                          <div className="w-full px-1.5 py-0.5 bg-white rounded text-[11px] font-bold text-gray-900 text-center h-6 flex items-center justify-center shadow-inner">
                            {group.totalCajas}
                          </div>
                        </div>
                        <div>
                          <label className="block text-[8px] font-bold text-white/90 uppercase leading-none mb-0.5">
                            UNID.
                          </label>
                          <div className="w-full px-1.5 py-0.5 bg-white rounded text-[11px] font-bold text-gray-900 text-center h-6 flex items-center justify-center shadow-inner">
                            {group.totalUnid}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Action Button & Chevron */}
                <div className="flex items-center gap-2 shrink-0 pr-4">
                  <button className="bg-[#e11d48] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm hover:bg-rose-700 transition-colors">
                    Empezar
                  </button>

                  <div className="flex items-center gap-1 cursor-pointer text-gray-500 hover:text-gray-700">
                    <span className="text-[11px] font-medium whitespace-nowrap">
                      {group.clientesCount}{" "}
                      {group.clientesCount === 1 ? "cliente" : "clientes"}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Global Footer Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <button className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-bold shadow-sm bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors sm:w-[300px] shrink-0 text-center">
            Cancelar
          </button>
          <button className="px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm bg-[#e11d48] hover:bg-rose-700 text-white transition-colors flex-1 flex items-center justify-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            Guardar Distribución
          </button>
        </div>
      </div>
    </div>
  );
}
