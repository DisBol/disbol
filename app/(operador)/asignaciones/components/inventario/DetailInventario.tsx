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
  containerOptions: SelectOption[];
  selectedProveedor: string;
  selectedGrupo: string;
  selectedContenedor: string;
  isLoadingProviders?: boolean;
  isLoadingContainers?: boolean;
  onProviderChange: (value: string) => void;
  onGrupoChange: (value: string) => void;
  onContenedorChange: (value: string) => void;
  containerInfo?: { Container_name: string; Total_container: number } | null;
  onCancel?: () => void;
}

export default function DetailInventario({
  detalles,
  providerOptions,
  groupOptions,
  containerOptions,
  selectedProveedor,
  selectedGrupo,
  selectedContenedor,
  isLoadingProviders,
  isLoadingContainers,
  onProviderChange,
  onGrupoChange,
  onContenedorChange,
  containerInfo,
  onCancel,
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
              placeholder={
                !selectedProveedor ? "Seleccione un proveedor" : "Categoría"
              }
              disabled={!selectedProveedor}
            />

            <Select
              size="sm"
              options={containerOptions}
              selectedValues={selectedContenedor ? [selectedContenedor] : []}
              onSelect={(option) => onContenedorChange(option.value)}
              placeholder={isLoadingContainers ? "Cargando..." : "Contenedor"}
            />
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={onCancel}
              className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-[11px] font-bold shadow-sm bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors shrink-0"
            >
              Volver
            </button>
          </div>
        </div>

        {/* Right: comparison cards */}
        <div className="flex-1">
          {containerInfo && (
            <div className="w-full mb-4 rounded-xl bg-linear-to-r from-[#e11d48] to-[#9f1239] px-4 py-2 shadow-md text-white flex items-center justify-between gap-4">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-white/70 mb-0.5">
                  Contenedor
                </p>
                <p className="text-[12px] font-extrabold leading-tight">
                  {containerInfo.Container_name}
                </p>
              </div>
              <div className="bg-white/20 rounded-xl px-5 py-2 text-center shrink-0">
                <p className="text-[9px] font-bold text-white/80 uppercase tracking-wide">
                  Total
                </p>
                <p className="text-[20px] font-extrabold leading-none">
                  {containerInfo.Total_container}
                </p>
              </div>
            </div>
          )}
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
