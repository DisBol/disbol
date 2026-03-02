"use client";

import React, { useState } from "react";
import CardCode from "@/components/ui/CardCode";

export default function Planificar() {
  const detalles = [
    { label: "Código 104", cajas: "-13/10", unidades: "-18/5" },
    { label: "Código 105", cajas: "-15/0", unidades: "-15/0" },
    { label: "Código 106", cajas: "0/0", unidades: "0/0" },
    { label: "Código 107", cajas: "-3/5", unidades: "-6/2" },
    { label: "Código 108", cajas: "-7/0", unidades: "-7/0" },
    { label: "Código 109", cajas: "-12/0", unidades: "-12/0" },
    { label: "Código 110", cajas: "0/0", unidades: "0/0" },
  ];

  const initialGroups = [
    {
      name: "El Alto Norte",
      status: "guardado",
      codes: [
        { label: "Código 104", cajas: 18, unidades: 18 },
        { label: "Código 105", cajas: 0, unidades: 0 },
        { label: "Código 106", cajas: 0, unidades: 0 },
        { label: "Código 107", cajas: 5, unidades: 5 },
        { label: "Código 108", cajas: 0, unidades: 0 },
        { label: "Código 109", cajas: 12, unidades: 12 },
        { label: "Código 110", cajas: 0, unidades: 0 },
      ],
      totalCajas: 35,
      totalUnid: 35,
      clientes: [
        {
          name: "Pollería El Rey",
          estado: "PENDIENTE",
          codes: [
            {
              label: "Código 104",
              solicitado: 10,
              cajas: 10,
              unidades: 10,
              restante: -13,
            },
            {
              label: "Código 105",
              solicitado: 0,
              cajas: 0,
              unidades: 0,
              restante: -15,
            },
            {
              label: "Código 106",
              solicitado: 0,
              cajas: 0,
              unidades: 0,
              restante: 0,
            },
            {
              label: "Código 107",
              solicitado: 5,
              cajas: 5,
              unidades: 5,
              restante: -3,
            },
            {
              label: "Código 108",
              solicitado: 0,
              cajas: 0,
              unidades: 0,
              restante: -7,
            },
            {
              label: "Código 109",
              solicitado: 0,
              cajas: 0,
              unidades: 0,
              restante: -12,
            },
            {
              label: "Código 110",
              solicitado: 0,
              cajas: 0,
              unidades: 0,
              restante: 0,
            },
          ],
          totalCajas: 15,
          totalUnid: 15,
        },
        {
          name: "Feria Sector A",
          estado: "PENDIENTE",
          codes: [
            {
              label: "Código 104",
              solicitado: 8,
              cajas: 8,
              unidades: 8,
              restante: -13,
            },
            {
              label: "Código 105",
              solicitado: 0,
              cajas: 0,
              unidades: 0,
              restante: -15,
            },
            {
              label: "Código 106",
              solicitado: 0,
              cajas: 0,
              unidades: 0,
              restante: 0,
            },
            {
              label: "Código 107",
              solicitado: 0,
              cajas: 0,
              unidades: 0,
              restante: -3,
            },
            {
              label: "Código 108",
              solicitado: 0,
              cajas: 0,
              unidades: 0,
              restante: -7,
            },
            {
              label: "Código 109",
              solicitado: 12,
              cajas: 12,
              unidades: 12,
              restante: -12,
            },
            {
              label: "Código 110",
              solicitado: 0,
              cajas: 0,
              unidades: 0,
              restante: 0,
            },
          ],
          totalCajas: 20,
          totalUnid: 20,
        },
      ],
    },
    {
      name: "El Alto Sur",
      status: "pendiente",
      codes: [
        { label: "Código 104", cajas: 5, unidades: 5 },
        { label: "Código 105", cajas: 0, unidades: 0 },
        { label: "Código 106", cajas: 0, unidades: 0 },
        { label: "Código 107", cajas: 3, unidades: 3 },
        { label: "Código 108", cajas: 0, unidades: 0 },
        { label: "Código 109", cajas: 0, unidades: 0 },
        { label: "Código 110", cajas: 0, unidades: 0 },
      ],
      totalCajas: 8,
      totalUnid: 8,
      clientes: [],
    },
    {
      name: "La Paz Centro",
      status: "pendiente",
      codes: [
        { label: "Código 104", cajas: 0, unidades: 0 },
        { label: "Código 105", cajas: 15, unidades: 15 },
        { label: "Código 106", cajas: 0, unidades: 0 },
        { label: "Código 107", cajas: 0, unidades: 0 },
        { label: "Código 108", cajas: 7, unidades: 7 },
        { label: "Código 109", cajas: 0, unidades: 0 },
        { label: "Código 110", cajas: 0, unidades: 0 },
      ],
      totalCajas: 22,
      totalUnid: 22,
      clientes: [],
    },
  ];

  // We keep an array of expanded group indices. Default open the first one.
  const [expandedGroups, setExpandedGroups] = useState<number[]>([0]);

  const toggleGroup = (index: number) => {
    if (expandedGroups.includes(index)) {
      setExpandedGroups(expandedGroups.filter((i) => i !== index));
    } else {
      setExpandedGroups([...expandedGroups, index]);
    }
  };

  return (
    <div className="w-full h-full p-3">
      {/* Top Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 shadow-sm">
        <div className="flex flex-col xl:flex-row items-start gap-4">
          {/* Left info & buttons */}
          <div className="flex flex-col gap-3 xl:w-[280px] shrink-0 pb-3 xl:pb-0">
            <div className="flex flex-col space-y-2 mt-1">
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                PROVEEDOR: <span className="text-gray-900 ml-1">SOFIA</span>
              </p>
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                CLIENTE ORIGEN:{" "}
                <span className="text-gray-900 ml-1">Pollería El Rey</span>
              </p>
            </div>
            <div className="flex gap-1.5">
              <button className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-[11px] font-bold shadow-sm bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors shrink-0">
                Cancelar
              </button>
              <button className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold shadow-sm bg-[#e11d48] hover:bg-rose-700 text-white transition-colors leading-tight text-center">
                Planificación
                <br />
                Automática
              </button>
              <button className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold shadow-sm bg-[#f59e0b] hover:bg-amber-600 text-white transition-colors leading-tight text-center">
                Guardar
                <br />
                Planificación
              </button>
            </div>
          </div>

          {/* Right Details */}
          <div className="flex-1">
            <h3 className="text-[11px] font-bold text-gray-800 mb-2 xl:ml-2">
              Detalles de la Asignación
            </h3>
            <div className="flex flex-wrap gap-1.5 xl:ml-2">
              {detalles.map((d, i) => (
                <div key={i} className="w-[80px] shrink-0">
                  <CardCode
                    label={d.label}
                    cajas={d.cajas}
                    unidades={d.unidades}
                    readOnly={true}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 pb-2">
          <h2 className="text-sm font-bold text-[#1e293b] mb-2">
            Totales por Grupo
          </h2>
        </div>

        <div className="p-4 pt-0 space-y-3">
          {initialGroups.map((group, groupIdx) => {
            const isExpanded = expandedGroups.includes(groupIdx);

            return (
              <div
                key={groupIdx}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm transition-all"
              >
                {/* Accordion Header (Group Total) */}
                <div
                  className="flex flex-col lg:flex-row items-center p-3 gap-4 cursor-pointer hover:bg-gray-50/50"
                  onClick={() => toggleGroup(groupIdx)}
                >
                  {/* Left group name */}
                  <div className="w-[100px] shrink-0 text-center lg:text-center">
                    <span className="font-bold text-[#e11d48] text-xs">
                      {group.name}
                    </span>
                  </div>

                  {/* Center Code Cards */}
                  <div className="flex flex-wrap gap-1.5 flex-1 items-stretch">
                    {group.codes.map((code, codeIdx) => (
                      <div
                        key={codeIdx}
                        className="w-[80px] shrink-0 pointer-events-none"
                      >
                        <CardCode
                          label={code.label}
                          cajas={code.cajas}
                          unidades={code.unidades}
                          readOnly={true}
                        />
                      </div>
                    ))}

                    {/* TOTAL Card */}
                    <div className="w-[80px] shrink-0">
                      <div className="bg-[#f59e0b] rounded-lg p-1.5 shadow-sm flex flex-col h-full border border-[#f59e0b]">
                        <h3 className="font-bold text-white text-[9px] mb-1.5 text-center uppercase tracking-wide">
                          TOTAL
                        </h3>
                        <div className="space-y-1 flex-1 flex flex-col justify-end">
                          <div>
                            <label className="block text-[7px] font-bold text-white/90 uppercase leading-none mb-0.5">
                              CAJAS
                            </label>
                            <div className="w-full px-1 py-0.5 bg-white rounded text-[10px] font-bold text-gray-900 text-center h-5 flex items-center justify-center shadow-inner">
                              {group.totalCajas}
                            </div>
                          </div>
                          <div>
                            <label className="block text-[7px] font-bold text-white/90 uppercase leading-none mb-0.5">
                              UNID.
                            </label>
                            <div className="w-full px-1 py-0.5 bg-white rounded text-[10px] font-bold text-gray-900 text-center h-5 flex items-center justify-center shadow-inner">
                              {group.totalUnid}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Action Button & Chevron */}
                  <div className="flex items-center gap-2 shrink-0 ml-1">
                    {group.status === "guardado" ? (
                      <button
                        className="bg-[#10b981] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        Guardado
                      </button>
                    ) : (
                      <button
                        className="bg-[#e11d48] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm hover:bg-rose-700 transition-colors cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        Guardar Grupo
                      </button>
                    )}

                    <button className="p-1 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors">
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
                        className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : "rotate-0"}`}
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Accordion Content (Nested Client Orders) */}
                {isExpanded && group.clientes && group.clientes.length > 0 && (
                  <div className="bg-slate-50 border-t border-gray-200 p-3">
                    <h4 className="text-[11px] font-bold text-gray-500 mb-3 px-1">
                      Pedidos de Clientes:
                    </h4>

                    <div className="flex flex-col gap-3">
                      {group.clientes.map((cliente, clienteIdx) => (
                        <div
                          key={clienteIdx}
                          className="flex flex-col lg:flex-row items-center bg-white border border-gray-100 rounded-xl p-3 gap-4 shadow-sm"
                        >
                          {/* Client Info */}
                          <div className="w-[100px] shrink-0">
                            <h5 className="font-bold text-[#e11d48] text-[12px]">
                              {cliente.name}
                            </h5>
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <span className="text-[9px] text-gray-500">
                                Estado:
                              </span>
                              <span className="text-[8px] font-bold bg-[#d1fae5] text-[#047857] px-1.5 py-0.5 rounded">
                                {cliente.estado}
                              </span>
                            </div>
                          </div>

                          {/* Client Code Cards */}
                          <div className="flex flex-wrap gap-1.5 flex-1 items-stretch">
                            {cliente.codes.map((code, clientCodeIdx) => (
                              <div
                                key={clientCodeIdx}
                                className="w-[80px] shrink-0"
                              >
                                <CardCode
                                  label={
                                    <div className="flex flex-col items-center">
                                      <span>{code.label}</span>
                                      <span className="text-[7px] font-normal text-gray-400 mt-0.5 break-words">
                                        Solicitado: {code.solicitado}
                                      </span>
                                    </div>
                                  }
                                  cajas={code.cajas}
                                  unidades={code.unidades}
                                  weightInfo={{
                                    adicional: [
                                      {
                                        label: "Restante:",
                                        value: String(code.restante),
                                        color:
                                          code.restante < 0
                                            ? "danger"
                                            : code.restante > 0
                                              ? "success"
                                              : "default",
                                      },
                                    ],
                                  }}
                                />
                              </div>
                            ))}

                            {/* Client TOTAL Card */}
                            <div className="w-[80px] shrink-0">
                              <div className="bg-[#f59e0b] rounded-lg p-1.5 shadow-sm flex flex-col h-full border border-[#f59e0b]">
                                <h3 className="font-bold text-white text-[9px] mb-1.5 text-center uppercase tracking-wide">
                                  TOTAL
                                </h3>
                                <div className="space-y-1 flex-1 flex flex-col justify-end">
                                  <div>
                                    <label className="block text-[7px] font-bold text-white/90 uppercase leading-none mb-0.5">
                                      CAJAS
                                    </label>
                                    <div className="w-full px-1 py-0.5 bg-white rounded text-[10px] font-bold text-gray-900 text-center h-5 flex items-center justify-center shadow-inner">
                                      {cliente.totalCajas}
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-[7px] font-bold text-white/90 uppercase leading-none mb-0.5">
                                      UNID.
                                    </label>
                                    <div className="w-full px-1 py-0.5 bg-white rounded text-[10px] font-bold text-gray-900 text-center h-5 flex items-center justify-center shadow-inner">
                                      {cliente.totalUnid}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
