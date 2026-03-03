"use client";

import { useState } from "react";
import CardCode, { PesajeData } from "@/components/ui/CardCode";
import { InputField } from "@/components/ui/InputField";

interface Code {
  label: string;
  cajas: number;
  unidades: number;
  pesajes?: PesajeData[];
  precio?: string;
}

interface DistributeGroupProps {
  name: string;
  clientesCount: number;
  codes: Code[];
  totalCajas: number;
  totalUnid: number;
  onCajasChange?: (codeIndex: number, value: number) => void;
  onUnidadesChange?: (codeIndex: number, value: number) => void;
  onEmpezar?: () => void;
}

export default function DistributeGroup({
  name,
  clientesCount,
  codes: initialCodes,
  totalCajas,
  totalUnid,
  onCajasChange,
  onUnidadesChange,
  onEmpezar,
}: DistributeGroupProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [precioDiferido, setPrecioDiferido] = useState(false);
  const [codes, setCodes] = useState<Code[]>(
    initialCodes.map((code) => ({
      ...code,
      pesajes: code.pesajes || [],
      precio: code.precio || "",
    })),
  );

  const handleAgregarPesaje = (codeIdx: number) => {
    const newPesaje: PesajeData = {
      id: `pesaje-${Date.now()}-${Math.random()}`,
      cajas: 0,
      unidades: 0,
      kg: 0,
      contenedor: "1",
    };

    const newCodes = [...codes];
    if (!newCodes[codeIdx].pesajes) {
      newCodes[codeIdx].pesajes = [];
    }
    newCodes[codeIdx].pesajes!.push(newPesaje);
    setCodes(newCodes);
  };

  const handleUpdatePesaje = (
    codeIdx: number,
    pesajeId: string,
    field: "cajas" | "unidades" | "kg" | "contenedor",
    value: number | string,
  ) => {
    const newCodes = [...codes];
    if (newCodes[codeIdx].pesajes) {
      const pesajeIdx = newCodes[codeIdx].pesajes!.findIndex(
        (p) => p.id === pesajeId,
      );
      if (pesajeIdx !== -1) {
        newCodes[codeIdx].pesajes![pesajeIdx] = {
          ...newCodes[codeIdx].pesajes![pesajeIdx],
          [field]: value,
        };
        setCodes(newCodes);
      }
    }
  };

  const handleRemovePesaje = (codeIdx: number, pesajeId: string) => {
    const newCodes = [...codes];
    if (newCodes[codeIdx].pesajes) {
      newCodes[codeIdx].pesajes = newCodes[codeIdx].pesajes!.filter(
        (p) => p.id !== pesajeId,
      );
      setCodes(newCodes);
    }
  };

  const handleUpdatePrecio = (codeIdx: number, precio: string) => {
    const newCodes = [...codes];
    newCodes[codeIdx] = {
      ...newCodes[codeIdx],
      precio,
    };
    setCodes(newCodes);
  };
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="flex flex-col xl:flex-row items-center p-3 gap-4">
        {/* Left group name */}
        <div className="w-30 shrink-0 text-center xl:text-left xl:pl-4">
          <span className="font-bold text-[#e11d48] text-[13px]">{name}</span>
        </div>

        {/* Center Code Cards */}
        <div className="flex flex-nowrap overflow-x-auto gap-2 flex-1 items-stretch py-1">
          {codes.map((code, codeIdx) => (
            <div key={codeIdx} className="w-20 shrink-0">
              <CardCode
                label={code.label}
                cajas={code.cajas}
                unidades={code.unidades}
                onCajasChange={(val) => {
                  onCajasChange?.(codeIdx, val === "" ? 0 : Number(val));
                }}
                onUnidadesChange={(val) => {
                  onUnidadesChange?.(codeIdx, val === "" ? 0 : Number(val));
                }}
              />
            </div>
          ))}

          {/* TOTAL Card */}
          <div className="w-20 shrink-0">
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
                    {totalCajas}
                  </div>
                </div>
                <div>
                  <label className="block text-[8px] font-bold text-white/90 uppercase leading-none mb-0.5">
                    UNID.
                  </label>
                  <div className="w-full px-1.5 py-0.5 bg-white rounded text-[11px] font-bold text-gray-900 text-center h-6 flex items-center justify-center shadow-inner">
                    {totalUnid}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Action Button & Chevron */}
        <div className="flex items-center gap-2 shrink-0 pr-4">
          <button
            onClick={onEmpezar}
            className="bg-[#e11d48] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm hover:bg-rose-700 transition-colors"
          >
            Empezar
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors"
          >
            <span className="text-[11px] font-medium whitespace-nowrap">
              {clientesCount} {clientesCount === 1 ? "cliente" : "clientes"}
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
              className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Acordeón - Clientes Section */}
      {isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50 px-4 py-4 space-y-4">
          {/* Cliente 1 */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#e11d48]">
                Pollería El Rey
              </h3>
              <div className="flex gap-2">
                <button className="text-xs font-bold text-white bg-[#e11d48] hover:bg-rose-700 px-3 py-2 rounded-lg transition-colors">
                  Guardar
                </button>
                <button className="text-xs font-bold text-[#e11d48] hover:text-rose-700 transition-colors">
                  Imprimir
                </button>
              </div>
            </div>

            <div className="mb-4">
              <span className="text-xs font-bold text-gray-500 block mb-2">
                PRECIO VENTA (Bs/Kg):
              </span>
              <div className="flex items-center gap-3 flex-wrap">
                {!precioDiferido && (
                  <InputField placeholder="0.00" className="w-32 text-xs" />
                )}
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={precioDiferido}
                    onChange={(e) => setPrecioDiferido(e.target.checked)}
                  />
                  <span className="text-xs text-gray-600">Precio diferido</span>
                </label>
              </div>
            </div>

            {/* Códigos del cliente - Grid como ReceptionTickets */}
            <div className="mb-4">
              <h4 className="text-xs font-bold text-gray-600 uppercase mb-3">
                Códigos en esta Distribución
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {codes.map((code, idx) => (
                  <div key={idx} className="relative h-full">
                    <div className="h-full">
                      <CardCode
                        label={
                          <div className="flex items-center justify-center gap-2">
                            <input
                              type="checkbox"
                              className="w-3 h-3"
                              defaultChecked
                            />
                            <span className="text-[10px] font-bold">
                              {code.label}
                            </span>
                          </div>
                        }
                        cajas={code.cajas}
                        unidades={code.unidades}
                        readOnly={false}
                        onCajasChange={(val) => {
                          onCajasChange?.(idx, val === "" ? 0 : Number(val));
                        }}
                        onUnidadesChange={(val) => {
                          onUnidadesChange?.(idx, val === "" ? 0 : Number(val));
                        }}
                        showPrecio={precioDiferido}
                        precio={code.precio || ""}
                        onPrecioChange={(val) => handleUpdatePrecio(idx, val)}
                        productName={code.label}
                        variant="active"
                        weightInfo={{
                          bruto: "100.00",
                          neto: "95.50",
                        }}
                        className="pointer-events-auto h-full"
                        pesajes={code.pesajes || []}
                        onAgregarPesaje={() => handleAgregarPesaje(idx)}
                        onUpdatePesaje={(pesajeId, field, value) =>
                          handleUpdatePesaje(idx, pesajeId, field, value)
                        }
                        onRemovePesaje={(pesajeId) =>
                          handleRemovePesaje(idx, pesajeId)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
