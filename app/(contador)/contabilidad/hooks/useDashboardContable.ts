"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useGetAccountingPeriod } from "../cierre-periodo/hooks/useGetAccountingPeriod";
import { useGetAccountingPeriodActive } from "../reportes/hooks/useGetAccountingPeriodActive";
import { useGetAccount } from "../plan-cuentas/hooks/useGetAccount";
import { useGetElements } from "../plan-cuentas/hooks/useGetElements";
import { GetAsientoByPeriod } from "../reportes/service/getAsientoByPeriod";
import { type Datum as AsientoDatum } from "../reportes/interfaces/getasientobyperiod.interface";
import { DatosEvolucion, MetricasContables } from "../interfaces";

const PERIODOS_EVOLUCION = 6;

export function useDashboardContable() {
  const {
    data: periods,
    loading: loadingPeriods,
    error: periodsError,
  } = useGetAccountingPeriod();
  const { data: activePeriods } = useGetAccountingPeriodActive();
  const {
    data: accounts,
    loading: loadingAccounts,
    error: accountsError,
  } = useGetAccount();
  const {
    data: elements,
    loading: loadingElements,
    error: elementsError,
  } = useGetElements();

  const [asientosByPeriod, setAsientosByPeriod] = useState<
    Record<number, AsientoDatum[]>
  >({});
  const [loadingAsientos, setLoadingAsientos] = useState(false);
  const [asientosError, setAsientosError] = useState<string | null>(null);

  // Últimos periodos por fecha de creación, del más antiguo al más reciente
  const latestPeriods = useMemo(
    () =>
      [...periods]
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        )
        .slice(0, PERIODOS_EVOLUCION)
        .reverse(),
    [periods],
  );

  // Periodo actual: el activo; si no hay, el último creado
  const periodoActual = useMemo(() => {
    const activeId = activePeriods.find((p) => p.active === "true")?.id;
    return (
      periods.find((p) => p.id === activeId) ??
      latestPeriods[latestPeriods.length - 1] ??
      null
    );
  }, [activePeriods, periods, latestPeriods]);

  const periodIds = useMemo(() => {
    const ids = latestPeriods.map((p) => p.id);
    if (periodoActual && !ids.includes(periodoActual.id)) {
      ids.push(periodoActual.id);
    }
    return ids;
  }, [latestPeriods, periodoActual]);

  const fetchAsientos = useCallback(async () => {
    if (periodIds.length === 0) {
      setAsientosByPeriod({});
      return;
    }

    setLoadingAsientos(true);
    setAsientosError(null);

    try {
      const results = await Promise.all(
        periodIds.map(async (id) => {
          const response = await GetAsientoByPeriod(id);
          return [id, response.data ?? []] as const;
        }),
      );
      setAsientosByPeriod(Object.fromEntries(results));
    } catch (err) {
      setAsientosError(
        err instanceof Error ? err.message : "Error al cargar asientos",
      );
    } finally {
      setLoadingAsientos(false);
    }
  }, [periodIds]);

  useEffect(() => {
    fetchAsientos();
  }, [fetchAsientos]);

  // Ingresos = haber - debe de cuentas de Ingreso; Gastos = debe - haber de cuentas de Gasto
  const calcularTotales = useMemo(() => {
    const elementIds = (match: string) =>
      new Set(
        elements
          .filter((e) => e.name.toLowerCase().includes(match))
          .map((e) => e.id),
      );
    const ingresoElements = elementIds("ingreso");
    const gastoElements = elementIds("gasto");
    const elementByAccount = new Map(
      accounts.map((a) => [a.id, a.Elements_id]),
    );

    return (asientos: AsientoDatum[]) =>
      asientos.reduce(
        (totals, asiento) => {
          if (asiento.active === "false") return totals;
          const elementId = elementByAccount.get(asiento.Account_id);
          if (elementId === undefined) return totals;
          if (ingresoElements.has(elementId)) {
            totals.ingresos += asiento.amount_credit - asiento.amount_debit;
          } else if (gastoElements.has(elementId)) {
            totals.gastos += asiento.amount_debit - asiento.amount_credit;
          }
          return totals;
        },
        { ingresos: 0, gastos: 0 },
      );
  }, [accounts, elements]);

  const metricas = useMemo<MetricasContables>(() => {
    const { ingresos, gastos } = calcularTotales(
      periodoActual ? (asientosByPeriod[periodoActual.id] ?? []) : [],
    );
    return { ingresos, gastos, resultado: ingresos - gastos };
  }, [calcularTotales, periodoActual, asientosByPeriod]);

  const evolucion = useMemo<DatosEvolucion[]>(
    () =>
      latestPeriods.map((periodo) => ({
        mes: periodo.name,
        ...calcularTotales(asientosByPeriod[periodo.id] ?? []),
      })),
    [latestPeriods, calcularTotales, asientosByPeriod],
  );

  return {
    periodoActual,
    metricas,
    evolucion,
    loading:
      loadingPeriods || loadingAccounts || loadingElements || loadingAsientos,
    error: periodsError || accountsError || elementsError || asientosError,
  };
}
