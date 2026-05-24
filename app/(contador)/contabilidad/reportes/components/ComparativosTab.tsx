"use client";

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

interface ComparativosTabProps {
  periodo1: string;
  periodo2: string;
}

interface ComparativoMensual {
  mes: string;
  ingresos: number;
  gastos: number;
  resultado: number;
  margenPorcentaje: number;
}

export default function ComparativosTab({
  periodo1,
  periodo2,
}: ComparativosTabProps) {
  // Datos estáticos de comparativos mensuales
  const comparativosMensuales: ComparativoMensual[] = [
    {
      mes: "Oct-25",
      ingresos: 165000.0,
      gastos: 142000.0,
      resultado: 23000.0,
      margenPorcentaje: 13.9,
    },
    {
      mes: "Nov-25",
      ingresos: 178000.0,
      gastos: 148000.0,
      resultado: 30000.0,
      margenPorcentaje: 16.9,
    },
    {
      mes: "Dic-25",
      ingresos: 210000.0,
      gastos: 158000.0,
      resultado: 52000.0,
      margenPorcentaje: 24.8,
    },
    {
      mes: "Ene-26",
      ingresos: 195000.0,
      gastos: 152000.0,
      resultado: 43000.0,
      margenPorcentaje: 22.1,
    },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);
  };

  // Obtener máximo resultado para escalar el gráfico
  const maxResultado = Math.max(
    ...comparativosMensuales.map((d) => d.resultado),
  );

  const handleExportPDF = () => {
    console.log("Exportando comparativos PDF...");
    alert("Comparativos exportados en PDF");
  };

  return (
    <div className="space-y-8">
      {/* Comparativos Mensuales - Tabla */}
      <div>
        <h2 className="text-2xl font-bold text-red-600 mb-4">
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
                    <TableHead className="text-right">Margen (%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comparativosMensuales.map((fila, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{fila.mes}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(fila.ingresos)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(fila.gastos)}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-success">
                        {formatCurrency(fila.resultado)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {fila.margenPorcentaje.toFixed(1)}%
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
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Tendencia de Resultados
        </h2>

        <Card>
          <CardContent className="pt-8 pb-8">
            <div className="flex items-end justify-center gap-8 h-80">
              {comparativosMensuales.map((data, idx) => {
                const heightPercent = (data.resultado / maxResultado) * 100;
                return (
                  <div key={idx} className="flex flex-col items-center gap-2">
                    {/* Barra */}
                    <div className="flex items-end justify-center h-64">
                      <div
                        className="w-16 bg-success rounded-t-lg transition-all duration-300 hover:bg-success/80"
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
                      {formatCurrency(data.resultado)}
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
