"use client";

import { DashboardPlanillasData } from "./interfaces";
import { MetricasCard, AccionesRapidas } from "./components";

export default function PlanillasPage() {
  // Datos de ejemplo basados en la imagen
  const dashboardData: DashboardPlanillasData = {
    metricas: {
      totalEmpleados: 128,
      costoMensualPlanilla: 420000,
    },
    costosPorCC: [
      { centrocosto_id: "1", centrocosto_nombre: "Operaciones", costo: 250000 },
      {
        centrocosto_id: "2",
        centrocosto_nombre: "Administración",
        costo: 100000,
      },
      { centrocosto_id: "3", centrocosto_nombre: "Ventas", costo: 70000 },
    ],
    alertas: [
      {
        id: "1",
        tipo: "contrato_vencido",
        descripcion: "contratos vencidos",
        cantidad: 3,
        prioridad: "alta",
      },
    ],
    acciones: [
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
    ],
  };

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
        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total empleados */}
          <MetricasCard
            titulo="Total empleados"
            contenido={
              <p className="text-3xl font-bold text-gray-900">
                {dashboardData.metricas.totalEmpleados}
              </p>
            }
          />

          {/* Costo mensual planilla */}
          <MetricasCard
            titulo="Costo mensual planilla"
            contenido={
              <p className="text-3xl font-bold text-gray-900">
                Bs{" "}
                {dashboardData.metricas.costoMensualPlanilla.toLocaleString()}
              </p>
            }
          />

          {/* Costo por CC */}
          <MetricasCard
            titulo="Costo por CC"
            contenido={
              <a
                href="/planillas/costo-cc"
                className="inline-block text-blue-600 hover:text-blue-700 font-semibold text-lg"
              >
                Ver detalle
              </a>
            }
          />

          {/* Alertas */}
          <MetricasCard
            titulo="Alertas"
            contenido={
              <p className="text-gray-700">
                {dashboardData.alertas[0]?.cantidad}{" "}
                <span className="text-gray-500">
                  {dashboardData.alertas[0]?.descripcion}
                </span>
              </p>
            }
          />
        </div>

        {/* Acciones rápidas */}
        <AccionesRapidas acciones={dashboardData.acciones} />
      </div>
    </div>
  );
}
