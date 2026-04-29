"use client";
import { Card } from "@/components/ui/Card";
import { useGetContainerByClientGroup } from "../hooks/useGetContainerByClientGroup";

interface Props {
  containerId: number;
}

export function CanastosPorRuta({ containerId }: Props) {
  const { data, loading } = useGetContainerByClientGroup(containerId);

  const max = data.length > 0 ? Math.max(...data.map((r) => r.Total_Containers)) : 1;

  return (
    <Card className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h2 className="text-base font-bold text-gray-900 mb-0.5">Canastos por Ruta</h2>
      <p className="text-xs text-gray-400 mb-5">Total de canastos en cada ruta</p>

      {loading && (
        <p className="text-sm text-gray-400 text-center py-6">Cargando...</p>
      )}

      {!loading && (
        <div className="space-y-5">
          {data.map((r) => {
            const pct = Math.round((r.Total_Containers / max) * 100);
            return (
              <div key={r.Group_id}>
                <div className="flex justify-between items-baseline mb-1.5">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{r.Group_name}</p>
                    <p className="text-[11px] text-gray-400">Ruta de distribución</p>
                  </div>
                  <span className="text-sm font-black text-red-500">
                    {r.Total_Containers.toLocaleString("es-BO")} canastos
                  </span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full rounded-full bg-red-500" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
          {data.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">Sin datos disponibles.</p>
          )}
        </div>
      )}
    </Card>
  );
}
