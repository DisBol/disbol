"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { Select, type SelectOption } from "@/components/ui/SelecMultipe";
import { Card, CardContent } from "@/components/ui/Card";
import { RoundPlusIcon } from "@/components/icons/RoundPlus";
import { useGetAccountingPeriod } from "../hooks/useGetAccountingPeriod";
import AgregarPeriodoModal from "./AgregarPeriodoModal";
import CerrarPeriodoModal from "./CerrarPeriodoModal";

interface SelectorPeriodoProps {
  onValidar?: (periodo: string) => Promise<void>;
  onPeriodAdded?: () => void;
}

export default function SelectorPeriodo({
  onValidar,
  onPeriodAdded,
}: SelectorPeriodoProps) {
  const [periodo, setPeriodo] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const {
    data: accountingPeriods,
    loading: loadingPeriods,
    error: periodsError,
    refetch,
  } = useGetAccountingPeriod();

  const periodos = useMemo(
    (): SelectOption[] =>
      accountingPeriods.map((periodoItem) => ({
        value: String(periodoItem.id),
        label: periodoItem.name,
      })),
    [accountingPeriods],
  );

  const selectedPeriodObj = useMemo(
    () => accountingPeriods.find((p) => String(p.id) === periodo) || null,
    [accountingPeriods, periodo],
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
      setSuccessMessage("");

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
    <>
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <div className="flex-1">
              <Select
                label="PERÍODO"
                options={periodos}
                selectedValues={periodo ? [periodo] : []}
                onSelect={(option) => {
                  setPeriodo(option.value);
                  setSuccessMessage("");
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
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setError("");
                  setSuccessMessage("");
                  setIsAddModalOpen(true);
                }}
                className="flex items-center gap-1.5 border-dashed border-gray-300 hover:border-gray-400 text-gray-700"
              >
                <RoundPlusIcon size={18} />
                <span>Agregar período</span>
              </Button>

              <Button
                onClick={handleValidar}
                disabled={loading || !periodo}
                variant="warning"
                loading={loading}
              >
                Iniciar validaciones
              </Button>

              <Button
                type="button"
                onClick={() => {
                  setError("");
                  setSuccessMessage("");
                  setIsCloseModalOpen(true);
                }}
                disabled={loading || !selectedPeriodObj}
                variant="danger"
              >
                Cerrar período
              </Button>
            </div>
          </div>

          {successMessage && (
            <div className="text-emerald-700 text-sm mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-md">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="text-danger text-sm mt-3 p-3 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          {!error && !loadingPeriods && periodos.length === 0 && (
            <div className="text-sm mt-3 p-3 bg-yellow-50 rounded-md text-yellow-700 flex items-center justify-between">
              <span>No hay períodos contables activos disponibles.</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setError("");
                  setSuccessMessage("");
                  setIsAddModalOpen(true);
                }}
                className="text-xs"
              >
                + Crear período
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AgregarPeriodoModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={async () => {
          await refetch();
          if (onPeriodAdded) {
            onPeriodAdded();
          }
        }}
      />

      <CerrarPeriodoModal
        periodo={selectedPeriodObj}
        isOpen={isCloseModalOpen}
        onClose={() => setIsCloseModalOpen(false)}
        onSuccess={async () => {
          const closedName = selectedPeriodObj?.name || "";
          setSuccessMessage(`El período "${closedName}" fue cerrado exitosamente.`);
          setPeriodo("");
          await refetch();
          if (onPeriodAdded) {
            onPeriodAdded();
          }
        }}
      />
    </>
  );
}
