"use client";

import React from "react";
import dynamic from "next/dynamic";
import { RouteProtection } from "@/components/shared/RouteProtection";
import ClientesList from "./components/ClientesList";
import {
  useGetSolicitudesChofer,
  SolicitudChofer,
} from "./hooks/useGetSolicitudesChofer";
import { useClients } from "@/app/(operador)/configuraciones/hooks/clientes/useClients";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";

const MapaChofer = dynamic(() => import("./components/MapaChofer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-50">
      <span className="text-sm text-gray-400">Cargando mapa...</span>
    </div>
  ),
});

const NewRequest = dynamic(
  () => import("../solicitud-chofer/components/NewRequest"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full flex items-center justify-center py-8">
        <span className="text-sm text-gray-400">Cargando formulario...</span>
      </div>
    ),
  },
);

const TableResquest = dynamic(
  () => import("../solicitud-chofer/components/TableResquest"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full flex items-center justify-center py-8">
        <span className="text-sm text-gray-400">Cargando tabla...</span>
      </div>
    ),
  },
);

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
  },
  totalGastos: 150,
};

function toDateInputValue(datetime: string) {
  return datetime.split(" ")[0];
}

function fromDateInputValue(date: string, isEnd = false) {
  return `${date} ${isEnd ? "23:59:59" : "00:00:00"}`;
}

function mapToSolicitudes(grouped: SolicitudChofer[]) {
  return grouped.map((req) => ({
    id: String(req.Request_id),
    clientId: req.Client_id,
    providerId: req.Provider_id,
    cliente: req.Client_name,
    proveedor: req.Provider_name,
    ruta: req.ClientGroup_name,
    requestStateName: req.RequestState_name,
    paymentTypeName: req.PaymentType_name,
    totalACobrar: req.RequestStage_payment,
    estado: "pendiente" as const,
    productos: req.items.map((item) => ({
      nombre: item.nombre,
      categoria: item.categoria,
      cajas: item.cajas,
      unidades: item.unidades,
      menudencia: item.menudencia,
    })),
  }));
}

export default function ChoferPage() {
  const { data, loading, error, filters, updateFilter } =
    useGetSolicitudesChofer();
  const { rawData: clientesRaw } = useClients();

  const solicitudes = mapToSolicitudes(data);
  const totalACobrar = data.reduce((sum, r) => sum + r.RequestStage_payment, 0);

  const clientesEnMapa = data.reduce<
    Array<{
      id: string;
      nombre: string;
      lat: number;
      lng: number;
      totalMonto: number;
      solicitudes: Array<{
        solicitud: string;
        monto: number;
        estado: "pendiente" | "entregado" | "pagado";
      }>;
    }>
  >((acc, sol) => {
    const clienteInfo = clientesRaw?.find((c) => c.id === sol.Client_id);
    if (!clienteInfo || !clienteInfo.lat || !clienteInfo.long) return acc;

    const clientId = String(sol.Client_id);
    const estadoSolicitud =
      sol.PaymentType_name && sol.PaymentType_name !== "No Pagado"
        ? "pagado"
        : sol.RequestState_name === "ENTREGADO"
          ? "entregado"
          : "pendiente";

    const existing = acc.find((c) => c.id === clientId);
    if (existing) {
      existing.solicitudes.push({
        solicitud: String(sol.Request_id),
        monto: sol.RequestStage_payment,
        estado: estadoSolicitud,
      });
      existing.totalMonto += sol.RequestStage_payment;
      return acc;
    }

    acc.push({
      id: clientId,
      nombre: sol.Client_name,
      lat: clienteInfo.lat,
      lng: clienteInfo.long,
      totalMonto: sol.RequestStage_payment,
      solicitudes: [
        {
          solicitud: String(sol.Request_id),
          monto: sol.RequestStage_payment,
          estado: estadoSolicitud,
        },
      ],
    });
    return acc;
  }, []);

  const totalEntregados = data.filter(
    (r) => r.RequestState_name === "ENTREGADO",
  ).length;

  const totalPagados = data.filter(
    (r) => r.PaymentType_name && r.PaymentType_name !== "No Pagado",
  ).length;

  const totalQR = data
    .filter((r) => r.PaymentType_name?.toLowerCase().includes("qr"))
    .reduce((sum, r) => sum + r.RequestStage_payment, 0);

  const totalEfectivo = data
    .filter((r) => r.PaymentType_name?.toLowerCase().includes("efectivo"))
    .reduce((sum, r) => sum + r.RequestStage_payment, 0);

  const totalCobrado = totalQR + totalEfectivo;
  const totalRendir = totalCobrado - chofertData.totalGastos;

  return (
    <RouteProtection requiredTransaction="App Chofer">
      <div className="min-h-screen pb-12">
        <Tabs defaultValue="seguimiento" className="w-full">
          <TabsList variant="solid" className="mb-4">
            <TabsTrigger value="seguimiento" variant="solid">
              App Chofer
            </TabsTrigger>
            <TabsTrigger value="solicitudes" variant="solid">
              Registrar Solicitud
            </TabsTrigger>
          </TabsList>

          <TabsContent value="seguimiento" className="mt-0">
            {/* Filtro de fechas */}
            <div className="flex items-center gap-3 mb-4 bg-white rounded-xl border border-gray-200 px-4 py-3 shadow-sm">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                Filtrar por fecha
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                <input
                  type="date"
                  className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                  value={toDateInputValue(filters.start_date)}
                  onChange={(e) =>
                    updateFilter(
                      "start_date",
                      fromDateInputValue(e.target.value, false),
                    )
                  }
                />
                <span className="text-gray-400 text-sm">—</span>
                <input
                  type="date"
                  className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                  value={toDateInputValue(filters.end_date)}
                  onChange={(e) =>
                    updateFilter(
                      "end_date",
                      fromDateInputValue(e.target.value, true),
                    )
                  }
                />
              </div>
              {loading && (
                <span className="text-xs text-gray-400 ml-auto">
                  Cargando...
                </span>
              )}
              {error && (
                <span className="text-xs text-red-500 ml-auto">{error}</span>
              )}
            </div>

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
                      Bs {totalACobrar.toFixed(2)}
                    </span>
                  </div>

                  {/* Mapa */}
                  <div className="relative w-full h-120">
                    <MapaChofer
                      vehiculoLat={chofertData.vehiculo.lat}
                      vehiculoLng={chofertData.vehiculo.lng}
                      vehiculoNombre={chofertData.vehiculo.nombre}
                      clientes={clientesEnMapa}
                    />
                  </div>
                </div>

                {/* Lista de Clientes */}
                {solicitudes.length === 0 && !loading ? (
                  <p className="text-sm text-gray-400 text-center py-8">
                    No hay solicitudes con estado ENVIADO para las fechas
                    seleccionadas.
                  </p>
                ) : (
                  <ClientesList solicitudes={solicitudes} />
                )}
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
                      Bs {totalACobrar.toFixed(2)}
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
                            {data.length}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Clientes
                          </p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-2 text-center">
                          <p className="text-2xl font-bold text-blue-700">
                            {totalEntregados}
                          </p>
                          <p className="text-xs text-blue-500 mt-0.5">
                            Entregados
                          </p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-2 text-center">
                          <p className="text-2xl font-bold text-green-700">
                            {totalPagados}
                          </p>
                          <p className="text-xs text-green-500 mt-0.5">
                            Pagados
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center py-2 border-t">
                        <span className="text-sm text-gray-600">
                          Total a Cobrar
                        </span>
                        <span className="font-bold text-red-600 text-sm">
                          Bs {totalACobrar.toFixed(2)}
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
                          <span className="text-sm text-gray-600">
                            Total QR
                          </span>
                          <span className="text-sm font-semibold text-green-600">
                            Bs {totalQR.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            Total Efectivo
                          </span>
                          <span className="text-sm font-semibold text-green-600">
                            Bs {totalEfectivo.toFixed(2)}
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
                          <span className="text-sm text-gray-600">
                            Total Gastos
                          </span>
                          <span className="text-sm font-semibold text-orange-500">
                            Bs {chofertData.totalGastos.toFixed(2)}
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
          </TabsContent>

          <TabsContent value="solicitudes" className="mt-0">
            <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
              <NewRequest />
              <TableResquest />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </RouteProtection>
  );
}
