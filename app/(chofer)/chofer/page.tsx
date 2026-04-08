import React from "react";
import { RouteProtection } from "@/components/shared/RouteProtection";
import MapaChofer from "./components/MapaChofer";
import ClientesList from "./components/ClientesList";

// Datos estáticos de ejemplo
const chofertData = {
  vehiculo: {
    id: "VH-01",
    nombre: "Vehículo VH-01",
    chofer: "Juan Pérez",
    lat: -16.505,
    lng: -68.135,
  },
  ruta: {
    nombre: "Ruta: El Alto Norte - R-001",
    totalAcobrar: 1355.0,
  },
  clientes: [
    {
      id: "CLI-001",
      nombre: "Cliente 1",
      lat: -16.51,
      lng: -68.14,
      monto: 450,
      estado: "pendiente" as const,
      solicitud: "SOL-001",
    },
    {
      id: "CLI-002",
      nombre: "Cliente 2",
      lat: -16.5,
      lng: -68.13,
      monto: 650,
      estado: "pendiente" as const,
      solicitud: "SOL-002",
    },
    {
      id: "CLI-003",
      nombre: "Cliente 3",
      lat: -16.49,
      lng: -68.14,
      monto: 255,
      estado: "pendiente" as const,
      solicitud: "SOL-003",
    },
  ],
  resumenRuta: {
    clientes: 3,
    entregados: 0,
    pagados: 0,
  },
  resumenCobranza: {
    totalQR: 0,
    totalEfectivo: 0,
    totalGastos: 150,
  },
};

const solicitudes = [
  {
    id: "SOL-001",
    cliente: "Pollería El Rey",
    totalACobrar: 450.0,
    estado: "pendiente" as const,
    productos: [
      { codigo: "104", cajas: 10, unidades: 5, kgBruto: 100.0, kgNeto: 95.0 },
      { codigo: "105", cajas: 0, unidades: 0, kgBruto: 0.0, kgNeto: 0.0 },
      { codigo: "106", cajas: 0, unidades: 0, kgBruto: 0.0, kgNeto: 0.0 },
      { codigo: "107", cajas: 0, unidades: 0, kgBruto: 0.0, kgNeto: 0.0 },
      { codigo: "108", cajas: 0, unidades: 0, kgBruto: 0.0, kgNeto: 0.0 },
      { codigo: "109", cajas: 0, unidades: 0, kgBruto: 0.0, kgNeto: 0.0 },
      { codigo: "110", cajas: 0, unidades: 0, kgBruto: 0.0, kgNeto: 0.0 },
    ],
  },
  {
    id: "SOL-002",
    cliente: "Feria Sector A",
    totalACobrar: 620.0,
    estado: "pendiente" as const,
    productos: [
      { codigo: "104", cajas: 8, unidades: 12, kgBruto: 100.0, kgNeto: 80.0 },
      { codigo: "105", cajas: 0, unidades: 0, kgBruto: 0.0, kgNeto: 0.0 },
      { codigo: "106", cajas: 0, unidades: 0, kgBruto: 0.0, kgNeto: 0.0 },
      { codigo: "107", cajas: 0, unidades: 0, kgBruto: 0.0, kgNeto: 0.0 },
      { codigo: "108", cajas: 0, unidades: 0, kgBruto: 0.0, kgNeto: 0.0 },
      { codigo: "109", cajas: 5, unidades: 10, kgBruto: 0.0, kgNeto: 75.0 },
      { codigo: "110", cajas: 0, unidades: 0, kgBruto: 0.0, kgNeto: 0.0 },
    ],
  },
  {
    id: "SOL-003",
    cliente: "Mercado Central",
    totalACobrar: 285.0,
    estado: "pendiente" as const,
    productos: [
      { codigo: "104", cajas: 6, unidades: 8, kgBruto: 80.0, kgNeto: 70.0 },
      { codigo: "105", cajas: 0, unidades: 0, kgBruto: 0.0, kgNeto: 0.0 },
      { codigo: "106", cajas: 0, unidades: 0, kgBruto: 0.0, kgNeto: 0.0 },
      { codigo: "107", cajas: 0, unidades: 0, kgBruto: 0.0, kgNeto: 0.0 },
      { codigo: "108", cajas: 0, unidades: 0, kgBruto: 0.0, kgNeto: 0.0 },
      { codigo: "109", cajas: 0, unidades: 0, kgBruto: 0.0, kgNeto: 0.0 },
      { codigo: "110", cajas: 0, unidades: 0, kgBruto: 0.0, kgNeto: 0.0 },
    ],
  },
];

export default function ChoferPage() {
  const totalCobrado = 0;
  const totalRendir = totalCobrado - chofertData.resumenCobranza.totalGastos;

  return (
    <RouteProtection requiredTransaction="App Chofer">
      <div className="min-h-screen bg-gray-100 p-4 lg:p-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Mapa - 3 columnas */}
          <div className="lg:col-span-3 flex flex-col gap-4 lg:gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Header Ruta */}
              <div className="bg-white border-b px-5 py-3 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-gray-900">
                    {chofertData.ruta.nombre}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Vehículo {chofertData.vehiculo.id} · Chofer{" "}
                    {chofertData.vehiculo.chofer}
                  </p>
                </div>
                <span className="text-sm font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">
                  Bs {chofertData.ruta.totalAcobrar.toFixed(2)}
                </span>
              </div>

              {/* Mapa */}
              <div className="relative w-full h-120">
                <MapaChofer
                  vehiculoLat={chofertData.vehiculo.lat}
                  vehiculoLng={chofertData.vehiculo.lng}
                  vehiculoNombre={chofertData.vehiculo.nombre}
                  clientes={chofertData.clientes}
                />
              </div>
            </div>

            {/* Lista de Clientes */}
            <ClientesList solicitudes={solicitudes} />
          </div>

          {/* Panel Derecho - 1 columna */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-6">
              {/* Total a Cobrar */}
              <div className="bg-red-600 px-5 py-4">
                <p className="text-red-100 text-xs font-medium uppercase tracking-wide">
                  Total a Cobrar
                </p>
                <p className="text-3xl font-bold text-white mt-1">
                  Bs {chofertData.ruta.totalAcobrar.toFixed(2)}
                </p>
                <button className="w-full mt-3 bg-white text-red-600 py-2 px-4 rounded-lg font-semibold text-sm hover:bg-red-50 transition">
                  Registrar Gastos
                </button>
              </div>

              <div className="p-5 space-y-5">
                {/* Resumen de Ruta */}
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                    Resumen de Ruta
                  </h3>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <p className="text-2xl font-bold text-gray-800">
                        {chofertData.resumenRuta.clientes}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">Clientes</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-2 text-center">
                      <p className="text-2xl font-bold text-blue-700">
                        {chofertData.resumenRuta.entregados}
                      </p>
                      <p className="text-xs text-blue-500 mt-0.5">Entregados</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-2 text-center">
                      <p className="text-2xl font-bold text-green-700">
                        {chofertData.resumenRuta.pagados}
                      </p>
                      <p className="text-xs text-green-500 mt-0.5">Pagados</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2 border-t">
                    <span className="text-sm text-gray-600">Total a Cobrar</span>
                    <span className="font-bold text-red-600 text-sm">
                      Bs {chofertData.ruta.totalAcobrar.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Resumen de Cobranza */}
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                    Resumen de Cobranza
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total QR</span>
                      <span className="text-sm font-semibold text-green-600">
                        Bs {chofertData.resumenCobranza.totalQR.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Efectivo</span>
                      <span className="text-sm font-semibold text-green-600">
                        Bs {chofertData.resumenCobranza.totalEfectivo.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-t border-b">
                      <span className="text-sm font-semibold text-gray-800">
                        Total Cobrado
                      </span>
                      <span className="font-bold text-gray-900">
                        Bs {totalCobrado.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Gastos</span>
                      <span className="text-sm font-semibold text-orange-500">
                        Bs {chofertData.resumenCobranza.totalGastos.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-sm font-semibold text-gray-800">
                        Total a Rendir
                      </span>
                      <span className="font-bold text-red-600">
                        Bs {totalRendir.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="space-y-2 pt-1">
                  <button className="w-full bg-red-600 text-white py-2.5 px-4 rounded-lg font-semibold text-sm hover:bg-red-700 transition">
                    Marcar Ruta Completada
                  </button>
                  <button className="w-full bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg font-semibold text-sm hover:bg-gray-200 transition">
                    Enviar Resumen
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RouteProtection>
  );
}
