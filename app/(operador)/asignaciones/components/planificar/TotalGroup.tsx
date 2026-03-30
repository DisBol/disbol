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
  readOnly?: boolean;
  onToggleExpand: () => void;
  onSaveGroup?: () => void | Promise<void>;
  onUpdateClientCode?: (
    clientIndex: number,
    codeIndex: number,
    field: "cajas" | "unidades",
    value: number,
  ) => void;
}

export default function TotalGroup({
  name,
  status,
  codes,
  totalCajas,
  totalUnid,
  clientes,
  isExpanded,
  readOnly = false,
  onToggleExpand,
  onSaveGroup,
  onUpdateClientCode,
}: TotalGroupProps) {
  const [isSaving, setIsSaving] = React.useState(false);

  // Helper para calcular el multiplicador según código de producto
  const getMultiplier = (productCode: string) => {
    if (productCode.includes("104") || productCode.includes("105")) return 15;
    if (
      productCode.includes("106") ||
      productCode.includes("107") ||
      productCode.includes("108") ||
      productCode.includes("109")
    )
      return 12;
    return 0;
  };

  const handleCajasChange = (
    clienteIdx: number,
    clientCodeIdx: number,
    value: number,
    productCode: string,
  ) => {
    // Actualizar cajas
    onUpdateClientCode?.(clienteIdx, clientCodeIdx, "cajas", value);

    // Calcular unidades automáticamente si hay multiplicador
    const multiplier = getMultiplier(productCode);
    if (multiplier > 0) {
      const unidadesCalculadas = value * multiplier;
      onUpdateClientCode?.(
        clienteIdx,
        clientCodeIdx,
        "unidades",
        unidadesCalculadas,
      );
    }
  };

  const handleUnidadesChange = (
    clienteIdx: number,
    clientCodeIdx: number,
    value: number,
    productCode: string,
  ) => {
    // Actualizar unidades
    onUpdateClientCode?.(clienteIdx, clientCodeIdx, "unidades", value);

    // Calcular cajas automáticamente si hay multiplicador
    const multiplier = getMultiplier(productCode);
    if (multiplier > 0) {
      const cajasCalculadas = value / multiplier;
      const cajasRedondeadas = Number.isInteger(cajasCalculadas)
        ? cajasCalculadas
        : Number(cajasCalculadas.toFixed(2));
      onUpdateClientCode?.(
        clienteIdx,
        clientCodeIdx,
        "cajas",
        cajasRedondeadas,
      );
    }
  };
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm transition-all">
      {/* Accordion Header (Group Total) */}
      <div
        className="flex flex-col lg:flex-row items-center p-3 gap-4 cursor-pointer hover:bg-gray-50/50"
        onClick={onToggleExpand}
      >
        {/* Left group name */}
        <div className="w-25 shrink-0 text-center lg:text-center">
          <span className="font-bold text-[#e11d48] text-xs">{name}</span>
        </div>

        {/* Center Code Cards */}
        <div className="flex flex-wrap gap-1.5 flex-1 items-stretch">
          {codes.map((code, codeIdx) => (
            <div key={codeIdx} className="w-20 shrink-0 pointer-events-none">
              <CardCode
                label={code.label}
                cajas={code.cajas}
                unidades={code.unidades}
                readOnly={true}
              />
            </div>
          ))}

          {/* TOTAL Card */}
          <div className="w-20 shrink-0">
            <div className="bg-[#f59e0b] rounded-lg p-1.5 shadow-sm flex flex-col h-full border border-[#f59e0b]">
              <h3 className="font-bold text-white text-[9px] mb-1.5 text-center uppercase tracking-wide">
                TOTAL
              </h3>
              <div className="space-y-1 flex-1 flex flex-col justify-start pt-1">
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
          {readOnly ? null : status === "guardado" ? (
            <button
              disabled
              className="bg-[#10b981] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm transition-colors cursor-not-allowed opacity-90 flex items-center gap-1"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              Guardado
            </button>
          ) : (
            <button
              disabled={isSaving}
              onClick={async (e) => {
                e.stopPropagation();
                if (isSaving) return;
                setIsSaving(true);
                try {
                  await onSaveGroup?.();
                } finally {
                  setIsSaving(false);
                }
              }}
              className={`text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm transition-colors flex items-center gap-1 ${
                isSaving
                  ? "bg-rose-400 cursor-not-allowed"
                  : "bg-[#e11d48] hover:bg-rose-700 cursor-pointer"
              }`}
            >
              {isSaving ? (
                <>
                  <svg
                    className="animate-spin h-3 w-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Guardando...</span>
                </>
              ) : (
                "Guardar Grupo"
              )}
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
                <div className="w-25 shrink-0">
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
                    <div key={clientCodeIdx} className="w-20 shrink-0">
                      <div className="bg-white rounded-lg p-1.5 shadow-sm flex flex-col h-full border border-gray-200">
                        <div className="flex flex-col items-center mb-1.5">
                          <h3 className="font-bold text-gray-900 text-[9px] text-center uppercase tracking-wide">
                            {code.label}
                          </h3>
                          <span className="text-[7px] font-normal text-gray-500 mt-0.5 text-center">
                            Solicitado: {code.solicitado}
                          </span>
                        </div>
                        <div className="space-y-1 flex-1 flex flex-col justify-end">
                          <div>
                            <label className="block text-[7px] font-bold text-gray-700 uppercase leading-none mb-0.5">
                              CAJAS
                            </label>
                            {status === "guardado" || readOnly ? (
                              <div className="w-full px-1 py-0.5 bg-gray-200 rounded text-[10px] font-bold text-gray-600 text-center h-5 flex items-center justify-center shadow-inner border border-gray-300">
                                {code.cajas}
                              </div>
                            ) : (
                              <input
                                type="number"
                                min="0"
                                value={code.cajas}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value) || 0;
                                  handleCajasChange(
                                    clienteIdx,
                                    clientCodeIdx,
                                    value,
                                    code.label,
                                  );
                                }}
                                className="w-full px-1 py-0.5 bg-gray-50 rounded text-[10px] font-bold text-gray-900 text-center h-5 flex items-center justify-center shadow-inner border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-300"
                              />
                            )}
                          </div>
                          <div>
                            <label className="block text-[7px] font-bold text-gray-700 uppercase leading-none mb-0.5">
                              UNID.
                            </label>
                            {status === "guardado" || readOnly ? (
                              <div className="w-full px-1 py-0.5 bg-gray-200 rounded text-[10px] font-bold text-gray-600 text-center h-5 flex items-center justify-center shadow-inner border border-gray-300">
                                {code.unidades}
                              </div>
                            ) : (
                              <input
                                type="number"
                                min="0"
                                value={code.unidades}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value) || 0;
                                  handleUnidadesChange(
                                    clienteIdx,
                                    clientCodeIdx,
                                    value,
                                    code.label,
                                  );
                                }}
                                className="w-full px-1 py-0.5 bg-gray-50 rounded text-[10px] font-bold text-gray-900 text-center h-5 flex items-center justify-center shadow-inner border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-300"
                              />
                            )}
                          </div>
                          <div>
                            <label className="block text-[7px] font-bold text-gray-700 uppercase leading-none mb-0.5">
                              RESTANTE
                            </label>
                            <div
                              className={`w-full px-1 py-0.5 rounded text-[9px] font-bold text-center h-5 flex items-center justify-center shadow-inner ${
                                code.restante < 0
                                  ? "bg-red-100 text-red-700"
                                  : code.restante > 0
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-50 text-gray-900"
                              }`}
                            >
                              {code.restante}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Client TOTAL Card */}
                  <div className="w-20 shrink-0">
                    <div className="bg-[#f59e0b] rounded-lg p-1.5 shadow-sm flex flex-col h-full border border-[#f59e0b]">
                      <h3 className="font-bold text-white text-[9px] mb-1.5 text-center uppercase tracking-wide">
                        TOTAL
                      </h3>
                      <div className="space-y-1 flex-1 flex flex-col justify-start pt-3">
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
