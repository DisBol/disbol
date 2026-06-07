"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import {
  TableWrapper,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/Table";
import { type Datum as AccountingPeriodDatum } from "../../cierre-periodo/interfaces/getaccountingperiod.interface";
import { GetAsientoByPeriod } from "../service/getAsientoByPeriod";

interface ComparativosTabProps {
  accountingPeriods: AccountingPeriodDatum[];
}

interface ComparativoMensual {
  mes: string;
  ingresos: number;
  gastos: number;
  resultado: number;
}

export default function ComparativosTab({
  accountingPeriods,
}: ComparativosTabProps) {
  const [comparativosMensuales, setComparativosMensuales] = useState<
    ComparativoMensual[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const latestPeriods = useMemo(() => {
    return [...accountingPeriods]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .slice(0, 6)
      .reverse();
  }, [accountingPeriods]);

  useEffect(() => {
    const fetchComparativos = async () => {
      if (latestPeriods.length === 0) {
        setComparativosMensuales([]);
        setError(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const periodResults = await Promise.all(
          latestPeriods.map(async (periodo) => {
            const response = await GetAsientoByPeriod(periodo.id);
            const ingresos = response.data.reduce(
              (sum, asiento) => sum + asiento.amount_credit,
              0,
            );
            const gastos = response.data.reduce(
              (sum, asiento) => sum + asiento.amount_debit,
              0,
            );

            return {
              mes: periodo.name,
              ingresos,
              gastos,
              resultado: ingresos - gastos,
            };
          }),
        );

        setComparativosMensuales(periodResults);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Error al cargar comparativos por período",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchComparativos();
  }, [latestPeriods]);

  const formatAmount = (value: number) => {
    return new Intl.NumberFormat("es-ES", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Obtener máximo resultado para escalar el gráfico
  const maxResultado =
    Math.max(...comparativosMensuales.map((d) => Math.abs(d.resultado)), 0) ||
    1;

  const handleExportPDF = () => {
    console.log("Exportando comparativos PDF...");
    alert("Comparativos exportados en PDF");
  };

  return (
    <div className="space-y-8">
      {/* Comparativos Mensuales - Tabla */}
      <div>
        <h2 className="text-xl font-bold text-primary mb-2">
          Comparativos Mensuales
        </h2>

        <Card>
          <CardContent className="pt-6">
            <TableWrapper>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mes</TableHead>
                    <TableHead className="text-right">Ingresos</TableHead>
                    <TableHead className="text-right">Gastos</TableHead>
                    <TableHead className="text-right">Resultado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-gray-500"
                      >
                        Cargando comparativos...
                      </TableCell>
                    </TableRow>
                  )}

                  {!loading && error && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-danger"
                      >
                        {error}
                      </TableCell>
                    </TableRow>
                  )}

                  {!loading && !error && comparativosMensuales.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-gray-500"
                      >
                        No hay períodos disponibles para comparar.
                      </TableCell>
                    </TableRow>
                  )}

                  {comparativosMensuales.map((fila, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{fila.mes}</TableCell>
                      <TableCell className="text-right">
                        {formatAmount(fila.ingresos)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatAmount(fila.gastos)}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-success">
                        {formatAmount(fila.resultado)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableWrapper>
          </CardContent>
        </Card>
      </div>

      {/* Tendencia de Resultados - Gráfico */}
      <div>
        <h2 className="text-xl font-bold text-primary mb-2">
          Tendencia de Resultados
        </h2>

        <Card>
          <CardContent className="pt-8 pb-8">
            <div className="flex items-end justify-center gap-8 h-80">
              {comparativosMensuales.map((data, idx) => {
                const heightPercent =
                  (Math.abs(data.resultado) / maxResultado) * 100;
                return (
                  <div key={idx} className="flex flex-col items-center gap-2">
                    {/* Barra */}
                    <div className="flex items-end justify-center h-64">
                      <div
                        className={`w-16 rounded-t-lg transition-all duration-300 ${
                          data.resultado < 0
                            ? "bg-danger hover:bg-danger/80"
                            : "bg-success hover:bg-success/80"
                        }`}
                        style={{
                          height: `${heightPercent}%`,
                        }}
                      />
                    </div>

                    {/* Etiqueta de mes */}
                    <div className="text-center text-sm font-semibold text-gray-700">
                      {data.mes}
                    </div>

                    {/* Valor del resultado */}
                    <div className="text-center text-xs text-gray-600">
                      {formatAmount(data.resultado)}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Botón Exportar */}
      <div className="flex justify-center">
        <Button
          onClick={handleExportPDF}
          variant="danger"
          size="md"
          className="px-8"
        >
          Exportar Comparativos PDF
        </Button>
      </div>
    </div>
  );
}
