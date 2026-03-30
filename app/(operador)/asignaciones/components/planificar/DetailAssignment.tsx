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
  isPlanificar?: string;
  isFinalizando?: boolean;
  onCancel?: () => void;
  onAutomaticPlanning?: () => void;
  onSavePlanning?: () => void;
  onFinalizarPlanificacion?: () => void;
}

export default function DetailAssignment({
  proveedor = "SOFIA",
  clienteOrigen = "Pollería El Rey",
  detalles,
  isPlanificar,
  isFinalizando,
  onCancel,
  onAutomaticPlanning,
  onFinalizarPlanificacion,
}: DetailAssignmentProps) {
  const parseComparativo = (valor: string) => {
    const [recibidoRaw, asignadoRaw] = valor.split("/");
    return {
      recibido: Number(recibidoRaw ?? 0) || 0,
      asignado: Number(asignadoRaw ?? 0) || 0,
    };
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 shadow-sm">
      <div className="flex flex-col xl:flex-row items-start gap-4">
        {/* Left info & buttons */}
        <div className="flex flex-col gap-3 xl:w-45 shrink-0 pb-3 xl:pb-0">
          <div className="flex flex-col space-y-2 mt-1">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
              PROVEEDOR: <span className="text-gray-900 ml-1">{proveedor}</span>
            </p>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
              CLIENTE ORIGEN:{" "}
              <span className="text-gray-900 ml-1">{clienteOrigen}</span>
            </p>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            <button
              onClick={onCancel}
              className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-[11px] font-bold shadow-sm bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors shrink-0"
            >
              Volver
            </button>
            {isPlanificar !== "true" && (
              <button
                onClick={onAutomaticPlanning}
                className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold shadow-sm bg-[#e11d48] hover:bg-rose-700 text-white transition-colors leading-tight text-center"
              >
                Planificación
                <br />
                Automática
              </button>
            )}
            <button
              onClick={onFinalizarPlanificacion}
              disabled={isFinalizando || isPlanificar === "true"}
              className={`px-4 py-2 rounded-lg text-sm font-bold shadow-sm text-white transition-colors ${
                isPlanificar === "true"
                  ? "bg-gray-400 cursor-not-allowed opacity-80"
                  : isFinalizando
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 cursor-pointer"
              }`}
            >
              {isPlanificar === "true"
                ? "Planif. Finalizada"
                : isFinalizando
                  ? "Finalizando..."
                  : "Finalizar Planificación"}
            </button>
          </div>
        </div>

        {/* Right Details */}
        <div className="flex-1">
          <h3 className="text-[11px] font-bold text-gray-800 mb-2 xl:ml-2">
            Detalles de la Asignación
          </h3>
          <div className="xl:ml-2 rounded-xl border border-gray-200 bg-gray-50 p-2">
            <div
              className="grid gap-2 grid-cols-4 sm:grid-cols-8 lg:grid-cols-8 xl:grid-cols-[repeat(var(--detalle-cols),minmax(0,1fr))]"
              style={{
                ["--detalle-cols" as string]: Math.max(detalles.length, 1),
              }}
            >
              {detalles.map((d, i) =>
                (() => {
                  const cajas = parseComparativo(d.cajas);
                  const unidades = parseComparativo(d.unidades);
                  const sobradoCajas = cajas.asignado - cajas.recibido;
                  const sobradoUnidades = unidades.asignado - unidades.recibido;

                  return (
                    <div key={i} className="min-w-0 flex flex-col gap-1">
                      <CardCode
                        label={d.label}
                        cajas={cajas.recibido}
                        unidades={unidades.recibido}
                        cajasExcedidas={d.cajasExcedidas}
                        unidadesExcedidas={d.unidadesExcedidas}
                        readOnly={true}
                        compareReadOnly={{
                          leftLabel: "Asig.",
                          rightLabel: "Recib.",
                          rightCajas: cajas.asignado,
                          rightUnidades: unidades.asignado,
                        }}
                      />
                      <div className={`rounded-lg px-2 py-1.5 text-center border ${
                        sobradoUnidades < 0 || sobradoCajas < 0
                          ? "bg-red-50 border-red-100"
                          : sobradoUnidades === 0 && sobradoCajas === 0
                            ? "bg-gray-50 border-gray-100"
                            : "bg-emerald-50 border-emerald-100"
                      }`}>
                        <p className="text-[7px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                          Sobrado
                        </p>
                        <div className="flex items-center justify-center gap-2">
                          <div className="flex flex-col items-center">
                            <span className="text-[7px] font-medium text-gray-400 uppercase leading-none mb-0.5">Caj.</span>
                            <span className={`text-[13px] font-black leading-none tabular-nums ${
                              sobradoCajas > 0 ? "text-emerald-500" : sobradoCajas < 0 ? "text-red-500" : "text-gray-300"
                            }`}>
                              {sobradoCajas > 0 ? `+${sobradoCajas}` : sobradoCajas}
                            </span>
                          </div>
                          <div className="w-px h-5 bg-gray-200" />
                          <div className="flex flex-col items-center">
                            <span className="text-[7px] font-medium text-gray-400 uppercase leading-none mb-0.5">Unid.</span>
                            <span className={`text-[13px] font-black leading-none tabular-nums ${
                              sobradoUnidades > 0 ? "text-emerald-500" : sobradoUnidades < 0 ? "text-red-500" : "text-gray-300"
                            }`}>
                              {sobradoUnidades > 0 ? `+${sobradoUnidades}` : sobradoUnidades}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })(),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
