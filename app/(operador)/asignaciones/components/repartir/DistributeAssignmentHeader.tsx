"use client";

import React from "react";
import CardCode from "@/components/ui/CardCode";

interface DistributeAssignmentHeaderProps {
  proveedor?: string;
  costoPorKg?: string;
  precioDiferido?: boolean;
  detalles: Array<{
    label: string;
    cajas: string;
    unidades: string;
  }>;
  onCancel?: () => void;
  onSave?: () => void;
}

export default function DistributeAssignmentHeader({
  proveedor = "SOFIA",
  costoPorKg = "10.00",
  precioDiferido = false,
  detalles,
  onCancel,
  onSave,
}: DistributeAssignmentHeaderProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-5 p-5">
      <h2 className="text-[17px] font-bold text-[#1e293b] mb-5">
        Repartir Asignación
      </h2>

      <div className="flex flex-col xl:flex-row items-start gap-6">
        {/* Left info & buttons */}
        <div className="flex flex-col gap-4 xl:w-[250px] shrink-0 pb-4 xl:pb-0">
          <div className="flex flex-col space-y-2 mt-1">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
              PROVEEDOR: <span className="text-gray-900 ml-1">{proveedor}</span>
            </p>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
              COSTO POR KG:{" "}
              <span className="text-gray-900 ml-1">Bs {costoPorKg}</span>
            </p>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
              PRECIO DIFERIDO:{" "}
              <span className="text-gray-900 ml-1">
                {precioDiferido ? "Sí" : "No"}
              </span>
            </p>
          </div>
          <div className="flex gap-2.5 mt-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-200 rounded-lg text-[12px] font-bold shadow-sm bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors shrink-0 flex-1"
            >
              Cancelar
            </button>
            <button
              onClick={onSave}
              className="px-4 py-2 rounded-lg text-[12px] font-bold shadow-sm bg-[#10b981] hover:bg-emerald-600 text-white transition-colors text-center flex-1"
            >
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
                    adicional: [
                      { label: "Costo:", value: `Bs ${costoPorKg}/kg` },
                    ],
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
