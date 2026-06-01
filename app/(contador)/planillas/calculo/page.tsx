"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { SelectorPeriodoPlanilla, VistaPreviewPlanilla } from "./components";
import { Planilla, EmpleadoPlanilla } from "./interfaces";

// Datos estáticos de ejemplo
const planillaEstatica: Planilla = {
  id: "1",
  periodo: "2026-05",
  estado: "calculada",
  empleados: [
    {
      id: "1",
      nombre: "Juan Pérez",
      bruto: 3500,
      descuentos: 420,
      aFavor: 630,
      neto: 3080,
    },
    {
      id: "2",
      nombre: "María López",
      bruto: 5000,
      descuentos: 600,
      aFavor: 900,
      neto: 4400,
    },
    {
      id: "3",
      nombre: "Carlos Ramírez",
      bruto: 4000,
      descuentos: 480,
      aFavor: 720,
      neto: 3520,
    },
  ],
  totalBruto: 12500,
  totalDescuentos: 1500,
  totalAFavor: 2250,
  totalNeto: 9000,
};

export default function CalculoPlanillasPage() {
  const [planilla, setPlanilla] = useState<Planilla | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCalcular = useCallback(async (periodo: string) => {
    try {
      setLoading(true);

      // Simular cálculo
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mostrar planilla calculada
      setPlanilla({
        ...planillaEstatica,
        periodo,
      });
    } catch (error) {
      console.error("Error al calcular planilla:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleGuardar = useCallback(async () => {
    if (!planilla) return;

    try {
      setLoading(true);

      // Simular guardado
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert("Planilla guardada exitosamente");
    } catch (error) {
      console.error("Error al guardar:", error);
    } finally {
      setLoading(false);
    }
  }, [planilla]);

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

        {/* Vista Previa */}
        {planilla && (
          <>
            <VistaPreviewPlanilla planilla={planilla} />

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
