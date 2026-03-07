"use client";

import CardCode from "@/components/ui/CardCode";

interface DetailAssignmentProps {
  proveedor?: string;
  clienteOrigen?: string;
  detalles: Array<{
    label: string;
    cajas: string;
    unidades: string;
    cajasExcedidas?: boolean;
    unidadesExcedidas?: boolean;
  }>;
  onCancel?: () => void;
  onAutomaticPlanning?: () => void;
  onSavePlanning?: () => void;
}

export default function DetailAssignment({
  proveedor = "SOFIA",
  clienteOrigen = "Pollería El Rey",
  detalles,
  onCancel,
  onAutomaticPlanning,
  onSavePlanning,
}: DetailAssignmentProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 shadow-sm">
      <div className="flex flex-col xl:flex-row items-start gap-4">
        {/* Left info & buttons */}
        <div className="flex flex-col gap-3 xl:w-70 shrink-0 pb-3 xl:pb-0">
          <div className="flex flex-col space-y-2 mt-1">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
              PROVEEDOR: <span className="text-gray-900 ml-1">{proveedor}</span>
            </p>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
              CLIENTE ORIGEN:{" "}
              <span className="text-gray-900 ml-1">{clienteOrigen}</span>
            </p>
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={onCancel}
              className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-[11px] font-bold shadow-sm bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors shrink-0"
            >
              Cancelar
            </button>
            <button
              onClick={onAutomaticPlanning}
              className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold shadow-sm bg-[#e11d48] hover:bg-rose-700 text-white transition-colors leading-tight text-center"
            >
              Planificación
              <br />
              Automática
            </button>
            <button
              onClick={onSavePlanning}
              className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold shadow-sm bg-[#f59e0b] hover:bg-amber-600 text-white transition-colors leading-tight text-center"
            >
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
              <div key={i} className="w-20 shrink-0">
                <CardCode
                  label={d.label}
                  cajas={d.cajas}
                  unidades={d.unidades}
                  cajasExcedidas={d.cajasExcedidas}
                  unidadesExcedidas={d.unidadesExcedidas}
                  readOnly={true}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
