"use client";

import { useMemo, useState } from "react";
import { Select, type SelectOption } from "@/components/ui/SelecMultipe";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { BalanceGeneralTab, ComparativosTab } from "./components";
import { useGetAccountingPeriod } from "../cierre-periodo/hooks/useGetAccountingPeriod";
import { useGetAccountingPeriodActive } from "./hooks/useGetAccountingPeriodActive";
import { useGetElements } from "../plan-cuentas/hooks/useGetElements";
import { useGetAccount } from "../plan-cuentas/hooks/useGetAccount";
import { useGetAsiento } from "../nuevo-asiento/hooks/getAsiento";

export default function ReportesPage() {
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("");
  const [tabActivo, setTabActivo] = useState("balance-general");
  const { data: accountingPeriods, loading, error } = useGetAccountingPeriod();
  const { data: activeAccountingPeriods } = useGetAccountingPeriodActive();
  const {
    data: elements,
    loading: loadingElements,
    error: elementsError,
  } = useGetElements();
  const {
    data: accounts,
    loading: loadingAccounts,
    error: accountsError,
  } = useGetAccount();
  const {
    data: asientos,
    loading: loadingAsientos,
    error: asientosError,
  } = useGetAsiento();

  const periodos = useMemo<SelectOption[]>(
    () =>
      accountingPeriods.map((periodo) => ({
        value: String(periodo.id),
        label: periodo.name,
      })),
    [accountingPeriods],
  );

  const periodoActivoDefault = activeAccountingPeriods.find(
    (periodo) => periodo.active === "true",
  )?.id;
  const periodoVisibleFinal =
    periodoSeleccionado ||
    String(periodoActivoDefault || periodos[0]?.value || "");
  const periodoActivo =
    periodos.find((periodo) => periodo.value === periodoVisibleFinal) ?? null;
  const periodoActivoLabel = periodoActivo?.label || "Sin período";
  const periodoActivoId = periodoActivo ? Number(periodoActivo.value) : null;
  const balanceError = error || elementsError || accountsError || asientosError;
  const balanceLoading =
    loading || loadingElements || loadingAccounts || loadingAsientos;

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
          <Select
            options={periodos}
            selectedValues={periodoVisibleFinal ? [periodoVisibleFinal] : []}
            onSelect={(option) => setPeriodoSeleccionado(option.value)}
            placeholder={
              balanceLoading ? "Cargando períodos..." : "Seleccionar período"
            }
            disabled={balanceLoading || periodos.length === 0}
            emptyMessage="No hay períodos contables disponibles"
            size="md"
            radius="md"
          />
          {balanceError && (
            <p className="mt-2 text-sm text-red-600">{balanceError}</p>
          )}
          {!balanceError && periodoActivoLabel !== "Sin período" && (
            <p className="mt-2 text-sm text-gray-600">
              Mostrando datos para:{" "}
              <span className="font-semibold">{periodoActivoLabel}</span>
            </p>
          )}
        </div>

        {/* Tabs */}
        <Tabs value={tabActivo} onValueChange={setTabActivo}>
          <TabsList variant="underlined" fullWidth>
            <TabsTrigger value="balance-general">Balance General</TabsTrigger>
            <TabsTrigger value="comparativos">Comparativos</TabsTrigger>
          </TabsList>

          <TabsContent value="balance-general" className="mt-6">
            <BalanceGeneralTab
              periodo={periodoActivoLabel}
              periodoId={periodoActivoId}
              elements={elements}
              accounts={accounts}
              asientos={asientos}
            />
          </TabsContent>

          <TabsContent value="comparativos" className="mt-6">
            <ComparativosTab periodo1="2025-11" periodo2="2025-12" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
