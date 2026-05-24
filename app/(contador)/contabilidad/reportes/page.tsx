"use client";

import { useState, useCallback } from "react";
import { SelectInput } from "@/components/ui/SelectInput";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { BalanceGeneralTab, ComparativosTab } from "./components";
import { BalanceGeneral } from "./interfaces";

// Datos estáticos de Balance General
const balanceEstatico: BalanceGeneral = {
  periodo: "2025-12",
  activos: {
    corriente: [
      { nombre: "caja", valor: 25000.0 },
      { nombre: "bancos", valor: 150000.0 },
      { nombre: "cuentas por cobrar", valor: 45000.0 },
      { nombre: "inventario", valor: 80000.0 },
    ],
    subtotalCorriente: 300000.0,
    noCorriente: [
      { nombre: "propiedades", valor: 200000.0 },
      { nombre: "equipos", valor: 120000.0 },
      { nombre: "depreciacion acumulada", valor: -30000.0, color: "danger" },
    ],
    subtotalNoCorriente: 290000.0,
    total: 590000.0,
  },
  pasivos: {
    corriente: [
      { nombre: "proveedores", valor: 35000.0 },
      { nombre: "prestamos bancarios", valor: 50000.0 },
      { nombre: "impuestos por pagar", valor: 12000.0 },
    ],
    subtotalCorriente: 97000.0,
    noCorriente: [{ nombre: "prestamos largo plazo", valor: 80000.0 }],
    subtotalNoCorriente: 80000.0,
    total: 177000.0,
  },
  patrimonio: [
    { nombre: "capital social", valor: 150000.0 },
    { nombre: "reservas", valor: 25000.0 },
    { nombre: "resultado acumulado", valor: -500.0, color: "danger" },
  ],
  totalPatrimonio: 174500.0,
  verificacion: 351500.0,
};

const periodos = [
  { value: "2025-12", label: "Diciembre 2025" },
  { value: "2025-11", label: "Noviembre 2025" },
  { value: "2025-10", label: "Octubre 2025" },
  { value: "2025-09", label: "Septiembre 2025" },
];

export default function ReportesPage() {
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("2025-12");
  const [tabActivo, setTabActivo] = useState("balance-general");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-red-600">
              Reportes Financieros
            </h1>
          </div>
        </div>

        {/* Selector de Período */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Seleccionar Período:
          </label>
          <SelectInput
            value={periodoSeleccionado}
            onChange={(e) => setPeriodoSeleccionado(e.target.value)}
            options={periodos}
            inputSize="md"
          />
        </div>

        {/* Tabs */}
        <Tabs value={tabActivo} onValueChange={setTabActivo}>
          <TabsList variant="underlined" fullWidth>
            <TabsTrigger value="balance-general">Balance General</TabsTrigger>
            <TabsTrigger value="comparativos">Comparativos</TabsTrigger>
          </TabsList>

          <TabsContent value="balance-general" className="mt-6">
            <BalanceGeneralTab balance={balanceEstatico} />
          </TabsContent>

          <TabsContent value="comparativos" className="mt-6">
            <ComparativosTab periodo1="2025-11" periodo2="2025-12" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
