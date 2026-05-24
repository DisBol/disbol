"use client";

import { Button } from "@/components/ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableWrapper,
} from "@/components/ui/Table";

export type DraftEntry = {
  id: string;
  fecha: string;
  descripcion: string;
  total: string;
  estado: string;
};

interface BorradoresTabProps {
  entries: DraftEntry[];
}

export function BorradoresTab({ entries }: BorradoresTabProps) {
  return (
    <div className="px-4 py-5 lg:px-6 lg:py-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Asientos en Borrador
          </h2>
          <p className="text-sm text-slate-500">
            Lista rápida de registros pendientes de aprobación.
          </p>
        </div>
      </div>

      <TableWrapper className="border-slate-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.fecha}</TableCell>
                <TableCell>{entry.descripcion}</TableCell>
                <TableCell>{entry.total}</TableCell>
                <TableCell>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {entry.estado}
                  </span>
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
    </div>
  );
}
