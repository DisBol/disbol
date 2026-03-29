"use client";

import CardCode from "@/components/ui/CardCode";
import { Select } from "@/components/ui/SelecMultipe";
import { useGetProductInventory } from "../../hooks/inventario/useGetProductInventory";

interface DetailInventarioProps {
  onCancel?: () => void;
}

export default function DetailInventario({ onCancel }: DetailInventarioProps) {
  const { data, loading, error } = useGetProductInventory();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 shadow-sm">
      <div className="flex flex-col xl:flex-row items-start gap-4">
        {/* Left info & buttons */}
        <div className="flex flex-col gap-3 xl:w-45 shrink-0 pb-3 xl:pb-0">
          <div className="flex flex-col gap-2 mt-1">
            <Select
              size="sm"
              options={[]}
              onSelect={() => {}}
              placeholder="Proveedor"
            />
            <Select
              size="sm"
              options={[]}
              onSelect={() => {}}
              placeholder="Categoría"
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

        {/* Right Details */}
        <div className="flex-1">
          <h3 className="text-[11px] font-bold text-gray-800 mb-2 xl:ml-2">
            Inventario de Productos
          </h3>
          <div className="xl:ml-2 rounded-xl border border-gray-200 bg-gray-50 p-2">
            {loading ? (
              <p className="text-[11px] text-gray-500 text-center py-4">
                Cargando inventario...
              </p>
            ) : error ? (
              <p className="text-[11px] text-red-500 text-center py-4">
                Error: {error}
              </p>
            ) : !data?.data || data.data.length === 0 ? (
              <p className="text-[11px] text-gray-500 text-center py-4">
                Sin productos en inventario
              </p>
            ) : (
              <div
                className="grid gap-2 grid-cols-4 sm:grid-cols-8 lg:grid-cols-8 xl:grid-cols-[repeat(var(--detalle-cols),minmax(0,1fr))]"
                style={{
                  ["--detalle-cols" as string]: Math.max(data.data.length, 1),
                }}
              >
                {data.data.map((item) => (
                  <div key={item.id} className="min-w-0">
                    <CardCode
                      label={`Prod. #${item.Product_id}`}
                      cajas={item.container}
                      unidades={item.units}
                      menudencia={item.menudencia === "true"}
                      readOnly={true}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
