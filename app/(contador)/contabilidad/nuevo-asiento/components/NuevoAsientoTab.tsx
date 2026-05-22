"use client";

import { Button } from "@/components/ui/Button";
import { DateField } from "@/components/ui/DateField";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableWrapper,
} from "@/components/ui/Table";

export type JournalLine = {
  id: string;
  date: string;
  account: string;
  glosa: string;
  debit: number;
  credit: number;
};

interface NuevoAsientoTabProps {
  journalLines: JournalLine[];
  debitTotal: number;
  creditTotal: number;
  balanced: boolean;
}

const formatAmount = (value: number) =>
  new Intl.NumberFormat("es-BO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export function NuevoAsientoTab({
  journalLines,
  debitTotal,
  creditTotal,
  balanced,
}: NuevoAsientoTabProps) {
  return (
    <div className="space-y-5 px-4 py-5 lg:px-6 lg:py-6">
      <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
        <DateField
          label="Fecha"
          value="2026-05-22"
          onChange={() => undefined}
          className="rounded-lg bg-white"
          size="md"
          radius="md"
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-primary">Líneas del Asiento</h2>
        <Button
          type="button"
          variant="secondary"
          className="rounded-xl bg-slate-800 text-white hover:bg-slate-700"
        >
          + Añadir Línea
        </Button>
      </div>

      <TableWrapper className="border-slate-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Cuenta</TableHead>
              <TableHead>Glosa</TableHead>
              <TableHead className="text-right">Débito (BOB)</TableHead>
              <TableHead className="text-right">Crédito (BOB)</TableHead>
              <TableHead className="text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {journalLines.map((line) => (
              <TableRow key={line.id}>
                <TableCell className="font-medium text-slate-700">
                  {line.date}
                </TableCell>
                <TableCell>{line.account}</TableCell>
                <TableCell>{line.glosa}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatAmount(line.debit)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatAmount(line.credit)}
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      className="rounded-md bg-violet-500 hover:bg-violet-600"
                    >
                      Editar
                    </Button>
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      className="rounded-md"
                    >
                      Eliminar
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableWrapper>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div
          className={`max-w-md rounded-xl border px-5 py-4 ${
            balanced
              ? "border-emerald-400 bg-emerald-50"
              : "border-amber-300 bg-amber-50"
          }`}
        >
          <p className="text-center text-sm font-medium text-emerald-700">
            {balanced ? "✓ Asiento Balanceado" : "Asiento Descuadrado"}
          </p>
          <p className="mt-2 text-lg font-bold text-primary">
            Débito: Bs {formatAmount(debitTotal)} | Crédito: Bs{" "}
            {formatAmount(creditTotal)}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            className="rounded-xl bg-slate-500 text-white hover:bg-slate-600"
          >
            Guardar como Borrador
          </Button>
          <Button
            type="button"
            className="rounded-xl bg-primary text-white hover:bg-primary/90"
          >
            Guardar y Aprobar
          </Button>
        </div>
      </div>
    </div>
  );
}
