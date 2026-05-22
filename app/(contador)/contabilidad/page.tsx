"use client";

import { DashboardContableData } from "./interfaces";

export default function ContabilidadPage() {
  // Datos de ejemplo basados en la imagen
  const dashboardData: DashboardContableData = {
    metricas: {
      ingresos: 1250000,
      gastos: 820000,
      resultado: 430000,
    },
    comparativo: {
      ingresos: 1250000,
      gastos: 820000,
    },
    evolucion: [
      { mes: "Ene", ingresos: 1200000, gastos: 800000 },
      { mes: "Feb", ingresos: 1250000, gastos: 820000 },
      { mes: "Mar", ingresos: 1300000, gastos: 850000 },
      { mes: "Abr", ingresos: 1250000, gastos: 800000 },
    ],
    accesosRapidos: [
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
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 lg:px-6">
        <h1 className="text-2xl font-bold text-red-600">Dashboard Contable</h1>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Ingresos */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Ingresos del mes
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              Bs {dashboardData.metricas.ingresos.toLocaleString()}
            </p>
          </div>

          {/* Gastos */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Gastos del mes
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              Bs {dashboardData.metricas.gastos.toLocaleString()}
            </p>
          </div>

          {/* Resultado */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Resultado
            </h3>
            <p className="text-3xl font-bold text-green-600">
              Bs {dashboardData.metricas.resultado.toLocaleString()}
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
                <div className="bg-teal-500 w-20 h-32 rounded"></div>
                <p className="text-xs font-medium mt-2">Ingresos</p>
                <p className="text-xs text-gray-600">
                  Bs {dashboardData.comparativo.ingresos.toLocaleString()}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-red-500 w-20 h-24 rounded"></div>
                <p className="text-xs font-medium mt-2">Gastos</p>
                <p className="text-xs text-gray-600">
                  Bs {dashboardData.comparativo.gastos.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Evolución mensual */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              Evolución Mensual
            </h3>
            <div className="flex justify-center items-end gap-6 h-48">
              {dashboardData.evolucion.map((dato) => (
                <div key={dato.mes} className="flex flex-col items-center">
                  <div className="flex gap-1">
                    <div
                      className="bg-teal-500 w-6 h-32 rounded"
                      style={{
                        height: `${(dato.ingresos / 1300000) * 128}px`,
                      }}
                    ></div>
                    <div
                      className="bg-red-500 w-6 rounded"
                      style={{
                        height: `${(dato.gastos / 1300000) * 128}px`,
                      }}
                    ></div>
                  </div>
                  <p className="text-xs font-medium mt-2">{dato.mes}</p>
                </div>
              ))}
            </div>
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
            {dashboardData.accesosRapidos.map((acceso) => (
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
