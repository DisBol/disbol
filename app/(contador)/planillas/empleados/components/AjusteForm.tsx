"use client";

import { useState, useEffect, useMemo } from "react";
import { AddAsiento } from "@/app/(contador)/contabilidad/nuevo-asiento/services/addasiento";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { InputField } from "@/components/ui/InputField";
import { Select, type SelectOption } from "@/components/ui/SelecMultipe";
import { useGetAccountingPeriod } from "@/app/(contador)/contabilidad/cierre-periodo/hooks/useGetAccountingPeriod";

interface AjusteFormProps {
  empleadoNombre: string;
  empleadoId: number;
  tipoAjuste: "favor" | "contra";
  accountId?: number;
  onGuardar?: (response: unknown) => void;
  onCancelar?: () => void;
}

export default function AjusteForm({
  empleadoNombre,
  empleadoId,
  tipoAjuste,
  accountId = 1,
  onGuardar,
  onCancelar,
}: AjusteFormProps) {
  const [monto, setMonto] = useState("");
  const [detalle, setDetalle] = useState("");
  const [periodo, setPeriodo] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

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

  useEffect(() => {
    if (periodsError) {
      setApiError(periodsError);
    }
  }, [periodsError]);

  const titulo = tipoAjuste === "favor" ? "Ajuste a Favor" : "Ajuste en Contra";

  const handleGuardar = async () => {
    const newErrors: Record<string, string> = {};

    if (!monto.trim()) newErrors.monto = "El monto es requerido";
    if (isNaN(parseFloat(monto)))
      newErrors.monto = "El monto debe ser un número";
    if (!periodo) newErrors.periodo = "El período es requerido";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      setApiError(null);

      const amount = parseFloat(monto);
      const description = detalle.trim() || `${titulo} - ${empleadoNombre}`;

      const response = await AddAsiento({
        description,
        active: "true",
        amount_credit: tipoAjuste === "favor" ? amount : 0,
        amount_debit: tipoAjuste === "contra" ? amount : 0,
        Account_id: accountId,
        AccountingPeriod_id: Number(periodo),
        state: "aprovado",
        employee: empleadoId,
      });

      if (onGuardar) {
        onGuardar(response);
      }

      handleCancel();
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : "No se pudo guardar el ajuste",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setMonto("");
    setDetalle("");
    setErrors({});
    if (periodos.length > 0) {
      setPeriodo(periodos[0].value);
    } else {
      setPeriodo("");
    }
    if (onCancelar) {
      onCancelar();
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">
          {titulo} - {empleadoNombre}
        </h2>

        <div className="space-y-4">
          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {apiError}
            </div>
          )}

          <InputField
            label="Monto"
            type="number"
            placeholder="0"
            value={monto}
            onChange={(e) => {
              setMonto(e.target.value);
              if (errors.monto) {
                setErrors({ ...errors, monto: "" });
              }
            }}
            error={errors.monto}
            required
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 pl-0.5">
              Período Contable
            </label>
            <Select
              options={periodos}
              selectedValues={periodo ? [periodo] : []}
              onSelect={(option) => {
                setPeriodo(option.value);
                if (errors.periodo) {
                  setErrors({ ...errors, periodo: "" });
                }
              }}
              placeholder={
                loadingPeriods ? "Cargando períodos..." : "Seleccionar período"
              }
              disabled={loading || loadingPeriods || periodos.length === 0}
              emptyMessage="No hay períodos disponibles"
              closeOnSelect
              size="md"
              radius="md"
            />
            {errors.periodo && (
              <span className="text-[11px] font-medium text-red-500 pl-0.5">
                {errors.periodo}
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detalle del ajuste
            </label>
            <textarea
              placeholder="Detalle del ajuste"
              value={detalle}
              onChange={(e) => setDetalle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              rows={4}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            onClick={handleGuardar}
            variant={tipoAjuste === "favor" ? "success" : "danger"}
            disabled={loading}
            loading={loading}
          >
            Guardar Ajuste
          </Button>
          <Button onClick={handleCancel} variant="secondary" disabled={loading}>
            Cancelar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
