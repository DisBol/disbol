"use client";

import { useState, useEffect } from "react";
import { MetricasCard, AccionesRapidas } from "./components";
import { GetEmployeeDriver } from "./empleados/services/getemployeedriver";

export default function PlanillasPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalEmpleados, setTotalEmpleados] = useState(0);
  const [costoMensual, setCostoMensual] = useState(0);

  const acciones = [
    {
      id: "1",
      titulo: "Gestión de Empleados",
      color: "bg-red-500",
      ruta: "/planillas/empleados",
    },
    {
      id: "2",
      titulo: "Cálculo de Planillas",
      color: "bg-teal-500",
      ruta: "/planillas/calculo",
    },
  ];

  useEffect(() => {
    let active = true;

    const loadMetrics = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await GetEmployeeDriver("true");

        if (!active) return;

        const empleados = response.data || [];
        setTotalEmpleados(empleados.length);

        const totalCosto = empleados.reduce(
          (sum, emp) => sum + (emp.Salary_amount || 0),
          0,
        );
        setCostoMensual(totalCosto);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Error al cargar métricas");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadMetrics();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 lg:px-6">
        <h1 className="text-2xl font-bold text-red-600">
          Dashboard RRHH / Planillas
        </h1>
      </div>

      {/* Content */}
      <div className="p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Total empleados */}
          <MetricasCard
            titulo="Total empleados"
            contenido={
              loading ? (
                <p className="text-gray-500 text-sm">Cargando...</p>
              ) : (
                <p className="text-3xl font-bold text-gray-900">
                  {totalEmpleados}
                </p>
              )
            }
          />

          {/* Costo mensual planilla */}
          <MetricasCard
            titulo="Costo mensual planilla"
            contenido={
              loading ? (
                <p className="text-gray-500 text-sm">Cargando...</p>
              ) : (
                <p className="text-3xl font-bold text-gray-900">
                  Bs {costoMensual.toLocaleString("es-ES")}
                </p>
              )
            }
          />
        </div>

        {/* Acciones rápidas */}
        <AccionesRapidas acciones={acciones} />
      </div>
    </div>
  );
}
