"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { Select, type SelectOption } from "@/components/ui/SelecMultipe";
import { Card, CardContent } from "@/components/ui/Card";
import { useGetAccountingPeriod } from "../hooks/useGetAccountingPeriod";

interface SelectorPeriodoProps {
  onValidar?: (periodo: string) => Promise<void>;
}

export default function SelectorPeriodo({ onValidar }: SelectorPeriodoProps) {
  const [periodo, setPeriodo] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const {
    data: accountingPeriods,
    loading: loadingPeriods,
    error: periodsError,
  } = useGetAccountingPeriod();

  const periodos = useMemo(
    (): SelectOption[] =>
      accountingPeriods.map((periodoItem) => ({
        value: String(periodoItem.id),
        label: periodoItem.name,
      })),
    [accountingPeriods],
  );

  useEffect(() => {
    if (!periodo && periodos.length > 0) {
      setPeriodo(periodos[0].value);
    }
  }, [periodos, periodo]);

  const handleValidar = useCallback(async () => {
    if (!periodo) {
      setError("Selecciona un período");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Simular validación con datos estáticos
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Respuesta exitosa simulada
      if (onValidar) {
        await onValidar(periodo);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al validar período");
    } finally {
      setLoading(false);
    }
  }, [periodo, onValidar]);

  useEffect(() => {
    if (periodsError) {
      setError(periodsError);
    }
  }, [periodsError]);

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div className="flex-1">
            <Select
              label="PERÍODO"
              options={periodos}
              selectedValues={periodo ? [periodo] : []}
              onSelect={(option) => setPeriodo(option.value)}
              placeholder={
                loadingPeriods ? "Cargando períodos..." : "Seleccionar período"
              }
              disabled={loading || loadingPeriods || periodos.length === 0}
              emptyMessage="No hay períodos disponibles"
              closeOnSelect
              size="md"
              radius="md"
            />
          </div>

          <Button
            onClick={handleValidar}
            disabled={loading || !periodo}
            variant="warning"
            loading={loading}
          >
            Iniciar validaciones
          </Button>
        </div>

        {error && (
          <div className="text-danger text-sm mt-3 p-3 bg-red-50 rounded-md">
            {error}
          </div>
        )}

        {!error && !loadingPeriods && periodos.length === 0 && (
          <div className="text-sm mt-3 p-3 bg-yellow-50 rounded-md text-yellow-700">
            No hay períodos contables activos disponibles.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
