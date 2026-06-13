"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Select, type SelectOption } from "@/components/ui/SelecMultipe";
import { useGetAccountingPeriod } from "@/app/(contador)/contabilidad/cierre-periodo/hooks/useGetAccountingPeriod";

interface SelectorPeriodoPlanillaProps {
  onCalcular?: (periodo: string) => Promise<void>;
  loading?: boolean;
}

export default function SelectorPeriodoPlanilla({
  onCalcular,
  loading = false,
}: SelectorPeriodoPlanillaProps) {
  const [periodo, setPeriodo] = useState("");
  const [error, setError] = useState("");

  const {
    data: accountingPeriods,
    loading: loadingPeriods,
    error: periodsError,
  } = useGetAccountingPeriod();

  const options = useMemo<SelectOption[]>(
    () =>
      accountingPeriods.map((item) => ({
        value: String(item.id),
        label: item.name,
      })),
    [accountingPeriods],
  );

  useEffect(() => {
    if (!periodo && options.length > 0) {
      setPeriodo(options[0].value);
    }
  }, [options, periodo]);

  useEffect(() => {
    if (periodsError) {
      setError(periodsError);
    }
  }, [periodsError]);

  const handleCalcular = async () => {
    if (!periodo) {
      setError("Selecciona un período");
      return;
    }

    try {
      setError("");
      if (onCalcular) {
        await onCalcular(periodo);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al calcular");
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex items-end gap-4">
          <div className="flex-1 max-w-xs">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Período
            </label>
            <Select
              options={options}
              selectedValues={periodo ? [periodo] : []}
              onSelect={(option) => setPeriodo(option.value)}
              placeholder={
                loadingPeriods ? "Cargando períodos..." : "Selecciona período"
              }
              disabled={loading || loadingPeriods || options.length === 0}
              emptyMessage="No hay períodos disponibles"
              closeOnSelect
              size="md"
              radius="md"
            />
          </div>

          <Button
            onClick={handleCalcular}
            disabled={loading || loadingPeriods || !periodo}
            variant="danger"
            loading={loading}
          >
            Calcular
          </Button>
        </div>

        {error && <div className="text-danger text-sm mt-3">{error}</div>}
      </CardContent>
    </Card>
  );
}
