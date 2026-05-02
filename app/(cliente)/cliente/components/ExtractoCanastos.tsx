import { useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { BoxOutlineIcon } from "@/components/icons/BoxOutlineIcon";
import { useSession } from "next-auth/react";
import { useGetContainerMovementsClientExtract } from "@/app/(operador)/canastos/hooks/useGetContainerMovementsClientExtract";
import type { Datum } from "@/app/(operador)/canastos/interfaces/getcontainermovementsclientextract.interface";

function MovimientoRow({
  mov,
  last,
  saldo,
}: {
  mov: Datum;
  last?: boolean;
  saldo: number;
}) {
  const op = String(mov.Tipo_Operacion || "").toLowerCase();
  const esEntregado =
    op.includes("entreg") ||
    op.includes("entregado") ||
    op.includes("delivered");
  const dateStr = new Date(
    mov.ContainerMovements_created_at,
  ).toLocaleDateString();
  return (
    <div
      className={`grid grid-cols-4 items-center px-4 py-2.5 ${!last ? "border-b border-gray-100" : ""}`}
    >
      <span className="text-xs text-gray-500">{dateStr}</span>
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
      <span
        className={`text-sm font-bold tabular-nums text-right ${esEntregado ? "text-green-600" : "text-red-600"}`}
      >
        {esEntregado ? "+" : "-"}
        {mov.ContainerMovements_quantity}
      </span>
      <span className="text-sm font-semibold text-gray-800 tabular-nums text-right">
        {saldo}
      </span>
    </div>
  );
}

export function ExtractoCanastos() {
  const { data: session } = useSession();
  const clientId = Number(
    session?.user?.client_id ?? session?.user?.clientId ?? 0,
  );

  const { data, loading } = useGetContainerMovementsClientExtract(clientId, 0);

  // calcular saldos acumulados
  const rowsWithSaldo = useMemo(() => {
    let acc = 0;
    return data.map((d) => {
      const op = String(d.Tipo_Operacion || "").toLowerCase();
      const factor =
        op.includes("entreg") ||
        op.includes("entregado") ||
        op.includes("delivered")
          ? 1
          : -1;
      acc += (d.ContainerMovements_quantity || 0) * factor;
      return { ...d, saldo: acc } as Datum & { saldo: number };
    });
  }, [data]);

  const saldoActual =
    rowsWithSaldo.length > 0
      ? rowsWithSaldo[rowsWithSaldo.length - 1].saldo
      : 0;

  return (
    <Card className="shadow-sm">
      <CardHeader className="py-3 flex-row items-center justify-between">
        <h2 className="text-sm font-bold text-red-600">Extracto de Canastos</h2>
        <div className="flex items-center gap-1.5">
          <BoxOutlineIcon size={14} className="text-red-500" />
          <span className="text-sm font-extrabold text-red-600">
            {saldoActual}
          </span>
          <span className="text-xs text-red-400 font-medium">canastos</span>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="w-full">
          {/* Header tabla */}
          <div className="grid grid-cols-4 border-b border-gray-100 bg-gray-50/50 px-4 py-2">
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
              Fecha
            </span>
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
              Movimiento
            </span>
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider text-right">
              Cant.
            </span>
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider text-right">
              Saldo
            </span>
          </div>
          {/* Filas */}
          {loading && (
            <div className="px-4 py-6 text-sm text-gray-500">
              Cargando extracto...
            </div>
          )}

          {!loading && rowsWithSaldo.length === 0 && (
            <div className="px-4 py-6 text-sm text-gray-500">
              Sin movimientos registrados.
            </div>
          )}

          {rowsWithSaldo.map((mov, i) => (
            <MovimientoRow
              key={i}
              mov={mov}
              last={i === rowsWithSaldo.length - 1}
              saldo={(mov as any).saldo}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
