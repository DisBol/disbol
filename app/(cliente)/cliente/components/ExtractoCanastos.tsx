import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { BoxOutlineIcon } from "@/components/icons/BoxOutlineIcon";
import { extractoData, type MovimientoCanasto } from "./types";

const saldoActual = extractoData[0]?.saldo ?? 0;

function MovimientoRow({ mov, last }: { mov: MovimientoCanasto; last?: boolean }) {
  const esEntregado = mov.tipo === "entregado";
  return (
    <div className={`grid grid-cols-4 items-center px-4 py-2.5 ${!last ? "border-b border-gray-100" : ""}`}>
      <span className="text-xs text-gray-500">{mov.fecha.slice(5)}</span>
      <div>
        <Chip
          variant="flat"
          color={esEntregado ? "success" : "danger"}
          size="sm"
          radius="full"
        >
          {esEntregado ? "Entregados" : "Devueltos"}
        </Chip>
      </div>
      <span className={`text-sm font-bold tabular-nums text-right ${esEntregado ? "text-green-600" : "text-red-600"}`}>
        {esEntregado ? "+" : "-"}{mov.cantidad}
      </span>
      <span className="text-sm font-semibold text-gray-800 tabular-nums text-right">
        {mov.saldo}
      </span>
    </div>
  );
}

export function ExtractoCanastos() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="py-3 flex-row items-center justify-between">
        <h2 className="text-sm font-bold text-red-600">Extracto de Canastos</h2>
        <div className="flex items-center gap-1.5">
          <BoxOutlineIcon size={14} className="text-red-500" />
          <span className="text-sm font-extrabold text-red-600">{saldoActual}</span>
          <span className="text-xs text-red-400 font-medium">canastos</span>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="w-full">
          {/* Header tabla */}
          <div className="grid grid-cols-4 border-b border-gray-100 bg-gray-50/50 px-4 py-2">
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Fecha</span>
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Movimiento</span>
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider text-right">Cant.</span>
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider text-right">Saldo</span>
          </div>
          {/* Filas */}
          {extractoData.map((mov, i) => (
            <MovimientoRow key={i} mov={mov} last={i === extractoData.length - 1} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
