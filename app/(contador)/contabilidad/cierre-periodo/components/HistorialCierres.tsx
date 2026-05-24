"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  TableWrapper,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/Table";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { CierrePeriodo } from "../interfaces";

interface HistorialCierresProps {
  onRefresh?: () => void;
  onSelectCierre?: (cierre: CierrePeriodo) => void;
}

export default function HistorialCierres({
  onRefresh,
  onSelectCierre,
}: HistorialCierresProps) {
  // Datos estáticos
  const cierresEstaticos: CierrePeriodo[] = [
    {
      id: "1",
      periodo: "2025-11",
      fechaCierre: new Date("2025-12-01T04:00:00"),
      cerradoPor: "contador",
      asientos: 2,
      resultado: 8300.0,
      estado: "cerrado",
      totalIngresos: 12500.0,
      totalGastos: 4200.0,
      asientosDetalle: [
        {
          id: "1000",
          fecha: "2025-11-15",
          tipo: "Factura",
          glosa: "Venta noviembre",
          total: 8000.0,
        },
        {
          id: "1001",
          fecha: "2025-11-20",
          tipo: "Recibo",
          glosa: "Cobro venta",
          total: 4500.0,
        },
      ],
    },
    {
      id: "2",
      periodo: "2025-12",
      fechaCierre: new Date("2026-01-02T06:30:00"),
      cerradoPor: "auditor",
      asientos: 4,
      resultado: 10800.0,
      estado: "cerrado",
      totalIngresos: 15000.0,
      totalGastos: 4200.0,
      asientosDetalle: [
        {
          id: "2000",
          fecha: "2025-12-05",
          tipo: "Factura",
          glosa: "Venta diciembre",
          total: 9500.0,
        },
        {
          id: "2001",
          fecha: "2025-12-10",
          tipo: "Recibo",
          glosa: "Cobro venta",
          total: 5500.0,
        },
        {
          id: "2002",
          fecha: "2025-12-15",
          tipo: "Nota Débito",
          glosa: "Ajuste inventario",
          total: 1200.0,
        },
        {
          id: "2003",
          fecha: "2025-12-20",
          tipo: "Egreso",
          glosa: "Gastos operacionales",
          total: 3000.0,
        },
      ],
    },
  ];

  const [cierres, setCierres] = useState<CierrePeriodo[]>(cierresEstaticos);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCierres(cierresEstaticos);
  }, []);

  const formatDate = (date: string | Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date(date));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center text-muted-foreground">Cargando...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold text-gray-900">
          Historial de Cierres
        </h2>
      </CardHeader>
      <CardContent>
        {cierres.length > 0 ? (
          <TableWrapper>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Período</TableHead>
                  <TableHead>Fecha de Cierre</TableHead>
                  <TableHead>Cerrado por</TableHead>
                  <TableHead className="text-center">Asientos</TableHead>
                  <TableHead className="text-right">Resultado</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cierres.map((cierre) => (
                  <TableRow key={cierre.id}>
                    <TableCell className="font-medium">
                      {cierre.periodo}
                    </TableCell>
                    <TableCell>{formatDate(cierre.fechaCierre)}</TableCell>
                    <TableCell>{cierre.cerradoPor}</TableCell>
                    <TableCell className="text-center">
                      {cierre.asientos}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-success">
                      {formatCurrency(cierre.resultado)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        onClick={() => {
                          if (onSelectCierre) {
                            onSelectCierre(cierre);
                          }
                        }}
                        variant="danger"
                        size="sm"
                      >
                        Ver Detalles
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableWrapper>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No hay cierres registrados
          </div>
        )}
      </CardContent>
    </Card>
  );
}
