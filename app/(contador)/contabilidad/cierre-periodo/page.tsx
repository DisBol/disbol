"use client";

import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import {
  SelectorPeriodo,
  HistorialCierres,
  DetallesCierreModal,
} from "./components";
import { ValidacionResponse, CierrePeriodo } from "./interfaces";

export default function CierrePeriodoPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [validationStatus, setValidationStatus] =
    useState<ValidacionResponse | null>(null);
  const [cierreSeleccionado, setCierreSeleccionado] =
    useState<CierrePeriodo | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  const handleValidar = useCallback(async (periodo: string) => {
    try {
      // Simulación de validación exitosa
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setValidationStatus({
        exito: true,
        mensaje: `Validaciones completadas exitosamente para el período ${periodo}`,
      });

      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Error validating period:", error);
      setValidationStatus({
        exito: false,
        mensaje: "Error al validar período",
        errores: [error instanceof Error ? error.message : "Error desconocido"],
      });
    }
  }, []);

  const handleSelectCierre = (cierre: CierrePeriodo) => {
    setCierreSeleccionado(cierre);
    setModalAbierto(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-red-600">Cierre Contable</h1>
          <p className="text-gray-600 mt-2">
            Gestiona el cierre de períodos contables
          </p>
        </div>

        {/* Alert de validación */}
        {validationStatus && (
          <Card
            className={`mb-6 ${
              validationStatus.exito
                ? "border-success bg-success/5"
                : "border-danger bg-danger/5"
            }`}
          >
            <CardContent className="pt-6">
              <p
                className={`font-semibold ${
                  validationStatus.exito ? "text-success" : "text-danger"
                }`}
              >
                {validationStatus.mensaje}
              </p>
              {validationStatus.errores &&
                validationStatus.errores.length > 0 && (
                  <ul
                    className={`mt-2 list-disc list-inside ${
                      validationStatus.exito ? "text-success" : "text-danger"
                    }`}
                  >
                    {validationStatus.errores.map((error, index) => (
                      <li key={index} className="text-sm">
                        {error}
                      </li>
                    ))}
                  </ul>
                )}
            </CardContent>
          </Card>
        )}

        {/* Selector de período */}
        <SelectorPeriodo onValidar={handleValidar} />

        {/* Historial de cierres */}
        <HistorialCierres
          key={refreshKey}
          onSelectCierre={handleSelectCierre}
        />

        {/* Modal de detalles */}
        <DetallesCierreModal
          cierre={cierreSeleccionado}
          isOpen={modalAbierto}
          onClose={() => setModalAbierto(false)}
        />
      </div>
    </div>
  );
}
