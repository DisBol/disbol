"use client";

import CardCode from "@/components/ui/CardCode";
import { Select, SelectOption } from "@/components/ui/SelecMultipe";

interface DetailInventarioProps {
  detalles: Array<{
    label: string;
    cajas: string;
    unidades: string;
    cajasExcedidas?: boolean;
    unidadesExcedidas?: boolean;
  }>;
  providerOptions: SelectOption[];
  groupOptions: SelectOption[];
  selectedProveedor: string;
  selectedGrupo: string;
  isLoadingProviders?: boolean;
  onProviderChange: (value: string) => void;
  onGrupoChange: (value: string) => void;
  onCancel?: () => void;
  onAutomaticPlanning?: () => void;
}

export default function DetailInventario({
  detalles,
  providerOptions,
  groupOptions,
  selectedProveedor,
  selectedGrupo,
  isLoadingProviders,
  onProviderChange,
  onGrupoChange,
  onCancel,
  onAutomaticPlanning,
}: DetailInventarioProps) {
  const parseComparativo = (valor: string) => {
    const [planificadoRaw, inventarioRaw] = valor.split("/");
    return {
      planificado: Number(planificadoRaw ?? 0) || 0,
      inventario: Number(inventarioRaw ?? 0) || 0,
    };
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 shadow-sm">
      <div className="flex flex-col xl:flex-row items-start gap-4">
        {/* Left: selects & buttons */}
        <div className="flex flex-col gap-3 xl:w-45 shrink-0 pb-3 xl:pb-0">
          <div className="flex flex-col gap-2 mt-1">
            <Select
              size="sm"
              options={providerOptions}
              selectedValues={selectedProveedor ? [selectedProveedor] : []}
              onSelect={(option) => onProviderChange(option.value)}
              placeholder={isLoadingProviders ? "Cargando..." : "Proveedor"}
            />
            <Select
              size="sm"
              options={groupOptions}
              selectedValues={selectedGrupo ? [selectedGrupo] : []}
              onSelect={(option) => onGrupoChange(option.value)}
              placeholder={!selectedProveedor ? "Seleccione un proveedor" : "Categoría"}
              disabled={!selectedProveedor}
            />
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={onCancel}
              className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-[11px] font-bold shadow-sm bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors shrink-0"
            >
              Volver
            </button>
            <button
              onClick={onAutomaticPlanning}
              className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold shadow-sm bg-[#e11d48] hover:bg-rose-700 text-white transition-colors leading-tight text-center"
            >
              Planificación
              <br />
              Automática
            </button>
          </div>
        </div>

        {/* Right: comparison cards */}
        <div className="flex-1">
          <h3 className="text-[11px] font-bold text-gray-800 mb-2 xl:ml-2">
            Inventario de Productos
          </h3>
          <div className="xl:ml-2 rounded-xl border border-gray-200 bg-gray-50 p-2">
            {detalles.length === 0 ? (
              <p className="text-[11px] text-gray-500 text-center py-4">
                {!selectedGrupo
                  ? "Seleccione un proveedor y categoría"
                  : "Sin productos en inventario"}
              </p>
            ) : (
              <div
                className="grid gap-2 grid-cols-4 sm:grid-cols-8 lg:grid-cols-8 xl:grid-cols-[repeat(var(--detalle-cols),minmax(0,1fr))]"
                style={{
                  ["--detalle-cols" as string]: Math.max(detalles.length, 1),
                }}
              >
                {detalles.map((d, i) => {
                  const cajas = parseComparativo(d.cajas);
                  const unidades = parseComparativo(d.unidades);
                  return (
                    <div key={i} className="min-w-0">
                      <CardCode
                        label={d.label}
                        cajas={cajas.planificado}
                        unidades={unidades.planificado}
                        cajasExcedidas={d.cajasExcedidas}
                        unidadesExcedidas={d.unidadesExcedidas}
                        readOnly={true}
                        compareReadOnly={{
                          leftLabel: "Plan.",
                          rightLabel: "Inv.",
                          rightCajas: cajas.inventario,
                          rightUnidades: unidades.inventario,
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
