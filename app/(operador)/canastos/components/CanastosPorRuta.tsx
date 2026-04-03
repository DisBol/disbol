import { Card } from "@/components/ui/Card";
import type { RutaItem } from "./types";
import { MAX_RUTA } from "./data";

interface Props {
  rutas: RutaItem[];
}

export function CanastosPorRuta({ rutas }: Props) {
  return (
    <Card className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h2 className="text-base font-bold text-gray-900 mb-0.5">Canastos por Ruta</h2>
      <p className="text-xs text-gray-400 mb-5">Total de canastos en cada ruta</p>
      <div className="space-y-5">
        {rutas.map((r) => {
          const pct = Math.round((r.canastos / MAX_RUTA) * 100);
          return (
            <div key={r.nombre}>
              <div className="flex justify-between items-baseline mb-1.5">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{r.nombre}</p>
                  <p className="text-[11px] text-gray-400">Ruta de distribución</p>
                </div>
                <span className="text-sm font-black text-red-500">
                  {r.canastos.toLocaleString("es-BO")} canastos
                </span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full rounded-full bg-red-500" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
