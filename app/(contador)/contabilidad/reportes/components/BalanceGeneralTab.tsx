"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { BalanceGeneral } from "../interfaces";

interface BalanceGeneralTabProps {
  balance: BalanceGeneral;
}

export default function BalanceGeneralTab({ balance }: BalanceGeneralTabProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const handleExportPDF = () => {
    console.log("Exportando PDF del balance...");
    alert(`Balance General ${balance.periodo} exportado`);
  };

  return (
    <div className="space-y-8">
      {/* Título */}
      <h2 className="text-2xl font-bold text-red-600">
        Balance General - {balance.periodo}
      </h2>

      {/* Contenedor principal con 3 columnas */}
      <div className="grid grid-cols-3 gap-6">
        {/* COLUMNA 1: ACTIVOS */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-bold text-success mb-6">ACTIVOS</h3>

            {/* Activos Corrientes */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                Corriente
              </p>
              <div className="space-y-2">
                {balance.activos.corriente.map((cuenta, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-700">{cuenta.nombre}</span>
                    <span className="text-gray-900 font-medium">
                      {formatCurrency(cuenta.valor)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-300 pt-3 mt-3">
                <div className="flex justify-between font-bold text-gray-900 text-sm">
                  <span>Subtotal Corriente:</span>
                  <span>
                    {formatCurrency(balance.activos.subtotalCorriente)}
                  </span>
                </div>
              </div>
            </div>

            {/* Activos No Corrientes */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                No Corriente
              </p>
              <div className="space-y-2">
                {balance.activos.noCorriente.map((cuenta, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-700">{cuenta.nombre}</span>
                    <span
                      className={`font-medium ${
                        cuenta.valor < 0 ? "text-danger" : "text-gray-900"
                      }`}
                    >
                      {formatCurrency(cuenta.valor)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-300 pt-3 mt-3">
                <div className="flex justify-between font-bold text-gray-900 text-sm">
                  <span>Subtotal No Corriente:</span>
                  <span>
                    {formatCurrency(balance.activos.subtotalNoCorriente)}
                  </span>
                </div>
              </div>
            </div>

            {/* Total Activos */}
            <div className="border-t-2 border-success pt-4">
              <div className="flex justify-between font-bold text-lg text-success">
                <span>TOTAL ACTIVOS:</span>
                <span>{formatCurrency(balance.activos.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* COLUMNA 2: PASIVOS */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-bold text-danger mb-6">PASIVOS</h3>

            {/* Pasivos Corrientes */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                Corriente
              </p>
              <div className="space-y-2">
                {balance.pasivos.corriente.map((cuenta, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-700">{cuenta.nombre}</span>
                    <span className="text-gray-900 font-medium">
                      {formatCurrency(cuenta.valor)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-300 pt-3 mt-3">
                <div className="flex justify-between font-bold text-gray-900 text-sm">
                  <span>Subtotal Corriente:</span>
                  <span>
                    {formatCurrency(balance.pasivos.subtotalCorriente)}
                  </span>
                </div>
              </div>
            </div>

            {/* Pasivos No Corrientes */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                No Corriente
              </p>
              <div className="space-y-2">
                {balance.pasivos.noCorriente.map((cuenta, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-700">{cuenta.nombre}</span>
                    <span className="text-gray-900 font-medium">
                      {formatCurrency(cuenta.valor)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-300 pt-3 mt-3">
                <div className="flex justify-between font-bold text-gray-900 text-sm">
                  <span>Subtotal No Corriente:</span>
                  <span>
                    {formatCurrency(balance.pasivos.subtotalNoCorriente)}
                  </span>
                </div>
              </div>
            </div>

            {/* Total Pasivos */}
            <div className="border-t-2 border-danger pt-4">
              <div className="flex justify-between font-bold text-lg text-danger">
                <span>TOTAL PASIVOS:</span>
                <span>{formatCurrency(balance.pasivos.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* COLUMNA 3: PATRIMONIO */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-bold text-primary mb-6">PATRIMONIO</h3>

            {/* Cuentas de Patrimonio */}
            <div className="space-y-2 mb-6">
              {balance.patrimonio.map((cuenta, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-gray-700">{cuenta.nombre}</span>
                  <span
                    className={`font-medium ${
                      cuenta.valor < 0 ? "text-danger" : "text-gray-900"
                    }`}
                  >
                    {formatCurrency(cuenta.valor)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total Patrimonio */}
            <div className="border-t-2 border-primary pt-4 mb-6">
              <div className="flex justify-between font-bold text-lg text-primary">
                <span>TOTAL PATRIMONIO:</span>
                <span>{formatCurrency(balance.totalPatrimonio)}</span>
              </div>
            </div>

            {/* Verificación */}
            <div className="border-t-2 border-danger pt-4">
              <div className="flex justify-between font-bold text-lg text-danger">
                <span>VERIFICACIÓN:</span>
                <span>{formatCurrency(balance.verificacion)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Botón Exportar */}
      <div className="flex justify-center pt-4">
        <Button onClick={handleExportPDF} variant="danger" size="md">
          Exportar Balance General PDF
        </Button>
      </div>
    </div>
  );
}
