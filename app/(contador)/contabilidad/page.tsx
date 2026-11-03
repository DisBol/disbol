"use client";

import { AccesoRapido } from "./interfaces";
import { useDashboardContable } from "./hooks/useDashboardContable";

const accesosRapidos: AccesoRapido[] = [
  {
    id: "1",
    titulo: "Plan de Cuentas",
    color: "bg-purple-500",
    ruta: "/contabilidad/plan-cuentas",
  },
  {
    id: "2",
    titulo: "Nuevo asiento",
    color: "bg-red-500",
    ruta: "/contabilidad/nuevo-asiento",
  },
  {
    id: "3",
    titulo: "Cierre de periodo",
    color: "bg-orange-500",
    ruta: "/contabilidad/cierre-periodo",
  },
  {
    id: "4",
    titulo: "Reportes financieros",
    color: "bg-teal-500",
    ruta: "/contabilidad/reportes",
  },
];

// Altura máxima (px) de las barras de los gráficos
const BAR_HEIGHT = 128;

const formatBs = (value: number) =>
  `Bs ${value.toLocaleString("es-BO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const barHeight = (value: number, max: number) =>
  `${max > 0 ? Math.max((Math.max(value, 0) / max) * BAR_HEIGHT, 2) : 2}px`;

export default function ContabilidadPage() {
  const { periodoActual, metricas, evolucion, loading, error } =
    useDashboardContable();

  const maxComparativo = Math.max(metricas.ingresos, metricas.gastos, 0);
  const maxEvolucion = Math.max(
    ...evolucion.flatMap((dato) => [dato.ingresos, dato.gastos]),
    0,
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 lg:px-6">
        <h1 className="text-2xl font-bold text-red-600">Dashboard Contable</h1>
        <p className="text-sm text-gray-500 mt-1">
          {loading
            ? "Cargando datos del periodo..."
            : periodoActual
              ? `Periodo: ${periodoActual.name}${periodoActual.active === "true" ? " (activo)" : ""}`
              : "No hay periodos contables registrados"}
        </p>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Ingresos */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Ingresos del periodo
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {formatBs(metricas.ingresos)}
            </p>
          </div>

          {/* Gastos */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Gastos del periodo
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {formatBs(metricas.gastos)}
            </p>
          </div>

          {/* Resultado */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Resultado
            </h3>
            <p
              className={`text-3xl font-bold ${
                metricas.resultado < 0 ? "text-red-600" : "text-green-600"
              }`}
            >
              {formatBs(metricas.resultado)}
            </p>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Comparativo */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              Ingresos vs Gastos
            </h3>
            <div className="flex justify-center items-end gap-8 h-48">
              <div className="flex flex-col items-center">
                <div
                  className="bg-teal-500 w-20 rounded"
                  style={{ height: barHeight(metricas.ingresos, maxComparativo) }}
                ></div>
                <p className="text-xs font-medium mt-2">Ingresos</p>
                <p className="text-xs text-gray-600">
                  {formatBs(metricas.ingresos)}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className="bg-red-500 w-20 rounded"
                  style={{ height: barHeight(metricas.gastos, maxComparativo) }}
                ></div>
                <p className="text-xs font-medium mt-2">Gastos</p>
                <p className="text-xs text-gray-600">
                  {formatBs(metricas.gastos)}
                </p>
              </div>
            </div>
          </div>

          {/* Evolución por periodo */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              Evolución por Periodo
            </h3>
            {evolucion.length > 0 ? (
              <div className="flex justify-center items-end gap-6 h-48 overflow-x-auto">
                {evolucion.map((dato) => (
                  <div key={dato.mes} className="flex flex-col items-center">
                    <div className="flex items-end gap-1">
                      <div
                        className="bg-teal-500 w-6 rounded"
                        title={`Ingresos ${formatBs(dato.ingresos)}`}
                        style={{ height: barHeight(dato.ingresos, maxEvolucion) }}
                      ></div>
                      <div
                        className="bg-red-500 w-6 rounded"
                        title={`Gastos ${formatBs(dato.gastos)}`}
                        style={{ height: barHeight(dato.gastos, maxEvolucion) }}
                      ></div>
                    </div>
                    <p className="text-xs font-medium mt-2 max-w-20 truncate">
                      {dato.mes}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="flex h-48 items-center justify-center text-sm text-gray-400">
                {loading ? "Cargando..." : "Sin periodos para comparar"}
              </p>
            )}
            <div className="flex justify-center gap-6 mt-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-teal-500 rounded"></div>
                <span>Ingresos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span>Gastos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Accesos rápidos */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            Accesos rápidos
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {accesosRapidos.map((acceso) => (
              <a
                key={acceso.id}
                href={acceso.ruta}
                className={`${acceso.color} text-white font-semibold py-3 px-4 rounded text-center hover:opacity-90 transition`}
              >
                {acceso.titulo}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
