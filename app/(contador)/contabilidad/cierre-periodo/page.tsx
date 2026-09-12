"use client";

import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import {
  SelectorPeriodo,
  HistorialCierres,
  DetallesCierreModal,
} from "./components";
import { ValidacionResponse, CierrePeriodo } from "./interfaces";
import { useGetAccountingPeriod } from "./hooks/useGetAccountingPeriod";

export default function CierrePeriodoPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [validationStatus, setValidationStatus] =
    useState<ValidacionResponse | null>(null);
  const [cierreSeleccionado, setCierreSeleccionado] =
    useState<CierrePeriodo | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const { data: accountingPeriods } = useGetAccountingPeriod();

  const handleValidar = useCallback(
    async (periodo: string) => {
      try {
        // Simulación de validación exitosa
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const periodoNombre =
          accountingPeriods.find((item) => String(item.id) === periodo)?.name ??
          periodo;
        const mensaje = `Validaciones completadas exitosamente para el período ${periodoNombre}`;

        setValidationStatus({
          exito: true,
          mensaje,
        });
        alert(mensaje);

        setRefreshKey((prev) => prev + 1);
      } catch (error) {
        console.error("Error validating period:", error);
        const mensaje =
          error instanceof Error ? error.message : "Error al validar período";
        setValidationStatus({
          exito: false,
          mensaje: "Error al validar período",
          errores: [mensaje],
        });
        alert(mensaje);
      }
    },
    [accountingPeriods],
  );

  const handleSelectCierre = (cierre: CierrePeriodo) => {
    setCierreSeleccionado(cierre);
    setModalAbierto(true);
  };

  return (
    <main className="bg-gray-50/80 px-2 py-4 sm:px-4 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 border-b border-gray-200 pb-6 sm:mb-8">
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-red-600 sm:text-3xl">
                Cierre contable
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                Gestiona el cierre de los períodos contables.
              </p>
            </div>
          </div>
        </header>

        {/* Alert de validación */}
        {validationStatus && (
          <Card
            role="alert"
            className={`mb-6 overflow-hidden border-l-4 ${
              validationStatus.exito
                ? "border-l-emerald-500 bg-emerald-50/70"
                : "border-l-red-500 bg-red-50/70"
            }`}
          >
            <CardContent className="flex gap-3 p-4 sm:p-5">
              <div
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  validationStatus.exito
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {validationStatus.exito ? "✓" : "!"}
              </div>
              <div>
                <p
                  className={`font-semibold ${
                    validationStatus.exito ? "text-emerald-800" : "text-red-800"
                  }`}
                >
                  {validationStatus.mensaje}
                </p>
                {validationStatus.errores &&
                  validationStatus.errores.length > 0 && (
                    <ul
                      className={`mt-2 list-inside list-disc text-sm ${
                        validationStatus.exito
                          ? "text-emerald-700"
                          : "text-red-700"
                      }`}
                    >
                      {validationStatus.errores.map((error, index) => (
                        <li key={index} className="text-sm">
                          {error}
                        </li>
                      ))}
                    </ul>
                  )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Selector de período */}
        <SelectorPeriodo
          onPeriodAdded={() => setRefreshKey((prev) => prev + 1)}
        />

        {/* Historial de cierres */}
        <HistorialCierres
          key={refreshKey}
          onSelectCierre={handleSelectCierre}
          onValidar={handleValidar}
          onPeriodChanged={() => setRefreshKey((prev) => prev + 1)}
        />

        {/* Modal de detalles */}
        <DetallesCierreModal
          cierre={cierreSeleccionado}
          isOpen={modalAbierto}
          onClose={() => setModalAbierto(false)}
        />
      </div>
    </main>
  );
}
