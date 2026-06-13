"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { SelectorPeriodoPlanilla, VistaPreviewPlanilla } from "./components";
import { GetAsiento } from "../../contabilidad/nuevo-asiento/services/getasiento";
import type { AsientoPlanilla, ResumenAsientoPlanilla } from "./interfaces";
import { GetEmployeeDriver } from "../empleados/services/getemployeedriver";
import type { Employee } from "../empleados/interface";

export default function CalculoPlanillasPage() {
  const [asientos, setAsientos] = useState<AsientoPlanilla[]>([]);
  const [empleados, setEmpleados] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadEmployees = async () => {
      try {
        const response = await GetEmployeeDriver("true");

        if (!active) return;

        setEmpleados(response.data);
      } catch {
        if (!active) return;

        setEmpleados([]);
      }
    };

    void loadEmployees();

    return () => {
      active = false;
    };
  }, []);

  const handleCalcular = useCallback(async (periodo: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await GetAsiento();

      const items = response.data.filter((item) => {
        if (item.employee == null) return false;

        if (!periodo) return true;

        if (!isNaN(Number(periodo))) {
          return item.AccountingPeriod_id === Number(periodo);
        }

        return item.created_at.startsWith(periodo);
      });

      setAsientos(items);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al cargar asientos";
      setError(message);
      setAsientos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleGuardar = useCallback(async () => {
    alert("Lista ya cargada desde getasiento");
  }, []);

  const employeeById = useMemo(() => {
    return new Map(empleados.map((empleado) => [empleado.id, empleado]));
  }, [empleados]);

  const asientosAgrupados = useMemo<ResumenAsientoPlanilla[]>(() => {
    const grouped = new Map<string, ResumenAsientoPlanilla>();

    for (const asiento of asientos) {
      if (asiento.employee == null) continue;

      const employee = employeeById.get(asiento.employee);
      const employeeName = employee?.name ?? `Empleado ${asiento.employee}`;
      const employeeAmount = employee?.Salary_amount ?? null;
      const key = `${asiento.employee}-${asiento.AccountingPeriod_id}`;
      const existing = grouped.get(key);
      const amount =
        asiento.amount_debit > 0 ? asiento.amount_debit : asiento.amount_credit;
      const type =
        asiento.amount_debit > 0 && asiento.amount_credit > 0
          ? "mixto"
          : asiento.amount_debit > 0
            ? "descuento"
            : "a favor";

      if (existing) {
        existing.amount_credit += asiento.amount_credit;
        existing.amount_debit += asiento.amount_debit;
        existing.movimientos += 1;
        existing.detalle.push({
          id: asiento.id,
          created_at: asiento.created_at,
          type,
          description: asiento.description,
          amount,
          state: asiento.state,
          accountId: asiento.Account_id,
        });
        continue;
      }

      grouped.set(key, {
        id: key,
        employeeId: asiento.employee,
        employeeName,
        employeeAmount,
        accountingPeriodId: asiento.AccountingPeriod_id,
        description: asiento.description,
        active: asiento.active,
        amount_credit: asiento.amount_credit,
        amount_debit: asiento.amount_debit,
        created_at: asiento.created_at,
        updated_at: asiento.updated_at,
        Account_id: asiento.Account_id,
        state: asiento.state,
        employee: asiento.employee,
        movimientos: 1,
        detalle: [
          {
            id: asiento.id,
            created_at: asiento.created_at,
            type,
            description: asiento.description,
            amount,
            state: asiento.state,
            accountId: asiento.Account_id,
          },
        ],
      });
    }

    return Array.from(grouped.values());
  }, [asientos, employeeById]);

  const totalCredito = asientosAgrupados.reduce(
    (sum, item) => sum + item.amount_credit,
    0,
  );
  const totalDebito = asientosAgrupados.reduce(
    (sum, item) => sum + item.amount_debit,
    0,
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-red-600">
            Cálculo de Planillas
          </h1>
        </div>

        {/* Selector de Período */}
        <SelectorPeriodoPlanilla
          onCalcular={handleCalcular}
          loading={loading}
        />

        {error && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {/* Vista Previa */}
        {asientosAgrupados.length > 0 && (
          <>
            <VistaPreviewPlanilla asientos={asientosAgrupados} />

            <div className="mt-4 rounded-lg border border-gray-200 bg-white px-4 py-3 flex flex-col gap-1 md:flex-row md:justify-end md:gap-8 text-sm text-gray-700">
              <span>Total crédito: {totalCredito.toLocaleString("es-ES")}</span>
              <span>Total débito: {totalDebito.toLocaleString("es-ES")}</span>
            </div>

            {/* Botón Guardar */}
            <div className="flex justify-end mt-6">
              <Button
                onClick={handleGuardar}
                disabled={loading}
                loading={loading}
                variant="success"
                size="md"
              >
                Guardar
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
