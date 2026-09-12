"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { RoundPlusIcon } from "@/components/icons/RoundPlus";
import { useGetAccountingPeriod } from "../hooks/useGetAccountingPeriod";
import AgregarPeriodoModal from "./AgregarPeriodoModal";

interface SelectorPeriodoProps {
  onPeriodAdded?: () => void;
}

export default function SelectorPeriodo({
  onPeriodAdded,
}: SelectorPeriodoProps) {
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const {
    data: accountingPeriods,
    loading: loadingPeriods,
    error: periodsError,
    refetch,
  } = useGetAccountingPeriod();
  const displayedError = error || periodsError || "";

  return (
    <>
      <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Administración
            </p>
            <h2 className="mt-1 text-lg font-bold text-gray-900">
              Períodos contables
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Crea un nuevo período para registrar y revisar movimientos.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              leftIcon={<RoundPlusIcon size={18} />}
              onClick={() => {
                setError("");
                setSuccessMessage("");
                setIsAddModalOpen(true);
              }}
              className="whitespace-nowrap border-dashed border-gray-300 text-gray-700 hover:border-gray-400"
            >
              Agregar período
            </Button>
          </div>
        </div>

        {successMessage && (
          <div
            role="status"
            className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700"
          >
            {successMessage}
          </div>
        )}

        {displayedError && (
          <div
            role="alert"
            className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-danger"
          >
            {displayedError}
          </div>
        )}

        {!displayedError &&
          !loadingPeriods &&
          accountingPeriods.length === 0 && (
            <div className="mt-4 flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 sm:flex-row sm:items-center sm:justify-between">
              <span>No hay períodos contables disponibles.</span>
              <Button
                size="md"
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
      </section>

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
    </>
  );
}
