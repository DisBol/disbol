"use client";

import { Fragment, useState } from "react";
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
import { ResumenAsientoPlanilla } from "../interfaces";

interface VistaPreviewPlanillaProps {
  asientos: ResumenAsientoPlanilla[];
}

export default function VistaPreviewPlanilla({
  asientos,
}: VistaPreviewPlanillaProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (asientos.length === 0) {
    return null;
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-ES", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (value: string) => {
    const dateOnly = value.split(" ")[0] ?? value;
    const [year, month, day] = dateOnly.split("-");

    if (!year || !month || !day) return value;

    return `${day}/${month}/${year}`;
  };

  const handlePrintExtracto = (asiento: ResumenAsientoPlanilla) => {
    const printWindow = window.open("", "_blank", "width=1100,height=900");

    if (!printWindow) return;

    const movimientosHtml = asiento.detalle
      .map(
        (movimiento) => `
          <tr>
            <td>${formatDate(movimiento.created_at)}</td>
            <td>${movimiento.type}</td>
            <td>${movimiento.description}</td>
            <td class="text-right">Bs ${formatCurrency(movimiento.amount)}</td>
          </tr>
        `,
      )
      .join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>Extracto de Planilla - ${asiento.employeeName}</title>
          <style>
            * { box-sizing: border-box; }
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 28px;
              color: #111827;
              background: #f8fafc;
            }
            .page {
              background: #fff;
              border: 1px solid #e5e7eb;
              border-radius: 18px;
              padding: 28px;
            }
            .title {
              font-size: 24px;
              font-weight: 700;
              margin-bottom: 24px;
              color: #0f172a;
            }
            .grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-bottom: 24px;
            }
            .panel {
              padding: 18px 20px;
              border-radius: 16px;
              background: #f9fafb;
              border: 1px solid #e5e7eb;
            }
            .panel h3 {
              margin: 0 0 14px 0;
              font-size: 14px;
              text-transform: uppercase;
              letter-spacing: 0.04em;
              color: #374151;
            }
            .row { margin: 8px 0; font-size: 14px; }
            .label { font-weight: 700; }
            .credit { color: #059669; font-weight: 700; }
            .debit { color: #dc2626; font-weight: 700; }
            .history {
              margin-top: 18px;
              border: 1px solid #e5e7eb;
              border-radius: 16px;
              overflow: hidden;
            }
            .history h3 {
              margin: 0;
              padding: 14px 18px;
              background: #f3f4f6;
              font-size: 14px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 13px;
            }
            th, td {
              padding: 12px 18px;
              border-bottom: 1px solid #e5e7eb;
              vertical-align: top;
            }
            th {
              text-align: left;
              background: #fff;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 0.03em;
              color: #374151;
            }
            .text-right { text-align: right; }
            .footer-total {
              margin-top: 18px;
              padding: 16px 18px;
              background: #f8fafc;
              border: 1px solid #e5e7eb;
              border-radius: 14px;
              font-weight: 700;
            }
            @media print {
              body { background: #fff; padding: 0; }
              .page { border: none; border-radius: 0; }
            }
          </style>
        </head>
        <body>
          <div class="page">
            <div class="title">Extracto de Planilla - ${asiento.employeeName}</div>

            <div class="grid">
              <div class="panel">
                <h3>Información del Empleado</h3>
                <div class="row"><span class="label">Nombre:</span> ${asiento.employeeName}</div>
                <div class="row"><span class="label">Período:</span> ${asiento.accountingPeriodId}</div>
                <div class="row"><span class="label">ID Empleado:</span> ${asiento.employeeId}</div>
                <div class="row"><span class="label">Movimientos:</span> ${asiento.movimientos}</div>
              </div>

              <div class="panel">
                <h3>Resumen de Planilla</h3>
                <div class="row"><span class="label">Sueldo Bruto:</span> Bs ${asiento.employeeAmount != null ? formatCurrency(asiento.employeeAmount) : "-"}</div>
                <div class="row debit">Descuentos Totales: Bs ${formatCurrency(asiento.amount_debit)}</div>
                <div class="row credit">A Favor Totales: Bs ${formatCurrency(asiento.amount_credit)}</div>
              </div>
            </div>

            <div class="history">
              <h3>Historial de Movimientos</h3>
              <table>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Tipo</th>
                    <th>Descripción</th>
                    <th class="text-right">Monto</th>
                  </tr>
                </thead>
                <tbody>
                  ${movimientosHtml}
                </tbody>
              </table>
            </div>

            <div class="footer-total">Total Neto a Pagar: Bs ${formatCurrency(asiento.employeeAmount != null ? asiento.employeeAmount - asiento.amount_debit + asiento.amount_credit : asiento.amount_credit - asiento.amount_debit)}</div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
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
                <TableHead>Período</TableHead>
                <TableHead className="text-center">Mov.</TableHead>
                <TableHead className="text-right">Monto</TableHead>
                <TableHead className="text-right">Crédito</TableHead>
                <TableHead className="text-right">Débito</TableHead>
                <TableHead className="text-center">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {asientos.map((asiento) => (
                <Fragment key={asiento.id}>
                  <TableRow key={asiento.id}>
                    <TableCell className="font-medium">
                      {asiento.employeeName}
                    </TableCell>
                    <TableCell>{asiento.accountingPeriodId}</TableCell>
                    <TableCell className="text-center">
                      {asiento.movimientos}
                    </TableCell>
                    <TableCell className="text-right">
                      {asiento.employeeAmount != null
                        ? formatCurrency(asiento.employeeAmount)
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(asiento.amount_credit)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(asiento.amount_debit)}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="info"
                          size="sm"
                          onClick={() =>
                            setSelectedId((current) =>
                              current === asiento.id ? null : asiento.id,
                            )
                          }
                        >
                          Extracto
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handlePrintExtracto(asiento)}
                        >
                          Imprimir
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>

                  {selectedId === asiento.id && (
                    <TableRow>
                      <TableCell colSpan={7} className="bg-gray-50 p-0">
                        <div className="border-t border-gray-200 px-4 py-4">
                          <div className="mb-4">
                            <h3 className="text-lg font-bold text-gray-900">
                              Extracto de Planilla - {asiento.employeeName}
                            </h3>
                          </div>

                          <div className="mb-5 flex justify-end">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handlePrintExtracto(asiento)}
                            >
                              Imprimir Extracto
                            </Button>
                          </div>

                          <div className="grid gap-6 md:grid-cols-2">
                            <div>
                              <h4 className="text-sm font-bold text-gray-700 mb-3">
                                Información del Empleado
                              </h4>
                              <div className="space-y-2 text-sm text-gray-700">
                                <p>
                                  <span className="font-semibold">Nombre:</span>{" "}
                                  {asiento.employeeName}
                                </p>
                                <p>
                                  <span className="font-semibold">
                                    Período:
                                  </span>{" "}
                                  {asiento.accountingPeriodId}
                                </p>
                                <p>
                                  <span className="font-semibold">
                                    ID Empleado:
                                  </span>{" "}
                                  {asiento.employeeId}
                                </p>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-sm font-bold text-gray-700 mb-3">
                                Resumen de Planilla
                              </h4>
                              <div className="space-y-2 text-sm text-gray-700">
                                <p>
                                  <span className="font-semibold">
                                    Sueldo Bruto:
                                  </span>{" "}
                                  Bs{" "}
                                  {asiento.employeeAmount != null
                                    ? formatCurrency(asiento.employeeAmount)
                                    : "-"}
                                </p>
                                <p className="text-red-600 font-semibold">
                                  Descuentos Totales: Bs{" "}
                                  {formatCurrency(asiento.amount_debit)}
                                </p>
                                <p className="text-emerald-600 font-semibold">
                                  A Favor Totales: Bs{" "}
                                  {formatCurrency(asiento.amount_credit)}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="mt-6 rounded-lg bg-white p-4 border border-gray-200">
                            <h4 className="text-sm font-bold text-gray-800 mb-4">
                              Historial de Movimientos
                            </h4>

                            <div className="overflow-x-auto">
                              <table className="min-w-full text-sm">
                                <thead>
                                  <tr className="border-b border-gray-200 text-left text-gray-700">
                                    <th className="py-2 pr-4">Fecha</th>
                                    <th className="py-2 pr-4">Tipo</th>
                                    <th className="py-2 pr-4">Descripción</th>
                                    <th className="py-2 text-right">Monto</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {asiento.detalle.map((movimiento) => (
                                    <tr
                                      key={movimiento.id}
                                      className="border-b border-gray-100 last:border-b-0"
                                    >
                                      <td className="py-2 pr-4">
                                        {movimiento.created_at}
                                      </td>
                                      <td className="py-2 pr-4 capitalize">
                                        {movimiento.type}
                                      </td>
                                      <td className="py-2 pr-4">
                                        {movimiento.description}
                                      </td>
                                      <td className="py-2 text-right">
                                        Bs {formatCurrency(movimiento.amount)}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </TableWrapper>
      </CardContent>
    </Card>
  );
}
