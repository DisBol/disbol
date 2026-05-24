"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import {
  TableWrapper,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/Table";
import { Planilla } from "../interfaces";

interface VistaPreviewPlanillaProps {
  planilla: Planilla | null;
}

export default function VistaPreviewPlanilla({
  planilla,
}: VistaPreviewPlanillaProps) {
  if (!planilla) {
    return null;
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-ES", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold text-gray-900">Vista previa</h2>
      </CardHeader>
      <CardContent>
        <TableWrapper>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empleado</TableHead>
                <TableHead className="text-right">Bruto</TableHead>
                <TableHead className="text-right">Descuentos</TableHead>
                <TableHead className="text-right">A favor</TableHead>
                <TableHead className="text-right">Neto</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {planilla.empleados.map((empleado) => (
                <TableRow key={empleado.id}>
                  <TableCell className="font-medium">
                    {empleado.nombre}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(empleado.bruto)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(empleado.descuentos)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(empleado.aFavor)}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(empleado.neto)}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex gap-2 justify-center">
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => {
                          console.log("Extracto:", empleado.id);
                          alert(`Extracto de ${empleado.nombre}`);
                        }}
                      >
                        Extracto
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          console.log("Imprimir:", empleado.id);
                          alert(`Imprimiendo ${empleado.nombre}`);
                        }}
                      >
                        Imprimir
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableWrapper>
      </CardContent>
    </Card>
  );
}
