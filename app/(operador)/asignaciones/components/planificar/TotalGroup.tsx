"use client";

import React from "react";
import CardCode from "@/components/ui/CardCode";

interface Code {
  label: string;
  cajas: number;
  unidades: number;
}

interface ClientCode {
  label: string;
  solicitado: number;
  cajas: number;
  unidades: number;
  restante: number;
}

interface Cliente {
  name: string;
  estado: string;
  codes: ClientCode[];
  totalCajas: number;
  totalUnid: number;
}

interface TotalGroupProps {
  name: string;
  status: "guardado" | "pendiente";
  codes: Code[];
  totalCajas: number;
  totalUnid: number;
  clientes: Cliente[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onSaveGroup?: () => void;
}

export default function TotalGroup({
  name,
  status,
  codes,
  totalCajas,
  totalUnid,
  clientes,
  isExpanded,
  onToggleExpand,
  onSaveGroup,
}: TotalGroupProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm transition-all">
      {/* Accordion Header (Group Total) */}
      <div
        className="flex flex-col lg:flex-row items-center p-3 gap-4 cursor-pointer hover:bg-gray-50/50"
        onClick={onToggleExpand}
      >
        {/* Left group name */}
        <div className="w-[100px] shrink-0 text-center lg:text-center">
          <span className="font-bold text-[#e11d48] text-xs">{name}</span>
        </div>

        {/* Center Code Cards */}
        <div className="flex flex-wrap gap-1.5 flex-1 items-stretch">
          {codes.map((code, codeIdx) => (
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
                    {totalCajas}
                  </div>
                </div>
                <div>
                  <label className="block text-[7px] font-bold text-white/90 uppercase leading-none mb-0.5">
                    UNID.
                  </label>
                  <div className="w-full px-1 py-0.5 bg-white rounded text-[10px] font-bold text-gray-900 text-center h-5 flex items-center justify-center shadow-inner">
                    {totalUnid}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Action Button & Chevron */}
        <div className="flex items-center gap-2 shrink-0 ml-1">
          {status === "guardado" ? (
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
              onClick={(e) => {
                e.stopPropagation();
                onSaveGroup?.();
              }}
              className="bg-[#e11d48] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm hover:bg-rose-700 transition-colors cursor-pointer"
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
      {isExpanded && clientes && clientes.length > 0 && (
        <div className="bg-slate-50 border-t border-gray-200 p-3">
          <h4 className="text-[11px] font-bold text-gray-500 mb-3 px-1">
            Pedidos de Clientes:
          </h4>

          <div className="flex flex-col gap-3">
            {clientes.map((cliente, clienteIdx) => (
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
                    <span className="text-[9px] text-gray-500">Estado:</span>
                    <span className="text-[8px] font-bold bg-[#d1fae5] text-[#047857] px-1.5 py-0.5 rounded">
                      {cliente.estado}
                    </span>
                  </div>
                </div>

                {/* Client Code Cards */}
                <div className="flex flex-wrap gap-1.5 flex-1 items-stretch">
                  {cliente.codes.map((code, clientCodeIdx) => (
                    <div key={clientCodeIdx} className="w-[80px] shrink-0">
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
}
