"use client";
import React from "react";
import { RouteProtection } from "@/components/shared/RouteProtection";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Box1Icon } from "@/components/icons/Box1Icon";
import { clientes, movimientos, movimientosProveedor } from "./components/data";
import { useGetInventoryByContainer } from "./hooks/useGetInventoryByContainer";
import { useContainer } from "@/app/(operador)/configuraciones/hooks/contenedores/useContainer";
import { Select, SelectOption } from "@/components/ui/SelecMultipe";
import { ClientesEnMora } from "./components/ClientesEnMora";
import { CanastosPorRuta } from "./components/CanastosPorRuta";
import { HistoricoMovimientosCliente } from "./components/HistoricoMovimientosCliente";
import { HistoricoMovimientosProveedor } from "./components/HistoricoMovimientosProveedor";

const IconUsers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-8 h-8">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </svg>
);

function StatCard({
  label,
  value,
  sub,
  icon,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <Card className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between gap-4 hover:shadow-md transition-shadow">
      <div>
        <p className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase mb-1">
          {label}
        </p>
        <p className={`text-4xl font-black tracking-tight ${accent}`}>{value}</p>
        <p className="text-xs text-gray-400 mt-1">{sub}</p>
      </div>
      <div className={`${accent} opacity-80`}>{icon}</div>
    </Card>
  );
}

export default function CanastosPage() {
  const { containers, containersData } = useContainer();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const contenedorId = selectedId ?? containersData?.[0]?.id ?? 0;
  const { total, loading } = useGetInventoryByContainer(contenedorId);

  return (
    <RouteProtection requiredTransaction="Canastos">
      <div className="min-h-screen bg-gray-50 font-sans text-gray-800 text-[15px] p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Gestión de Canastos</h1>
            <p className="text-sm text-gray-400 mt-1">Inventario y control de distribución</p>
          </div>
        </div>

        {/* KPI Cards + Filtro + Botón */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <StatCard
            label="En Almacén"
            value={loading ? "..." : (total?.toLocaleString("es-BO") ?? "—")}
            sub="Entre todos los depósitos"
            icon={<Box1Icon />}
            accent="text-sky-500"
          />
          <StatCard
            label="En Clientes"
            value="820"
            sub="Deuda de canastos"
            icon={<IconUsers />}
            accent="text-red-500"
          />
          <Card className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col">
            <Select
              label="Filtrar por contenedor"
              options={containers as SelectOption[]}
              selectedValues={contenedorId ? [contenedorId.toString()] : []}
              onSelect={(option) => setSelectedId(Number(option.value))}
              placeholder="Seleccionar contenedor..."
              className="mb-3"
            />
            <Button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-xl transition-colors">
              Agregar canastos
            </Button>
          </Card>
        </div>

        {/* Clientes en Mora + Canastos por Ruta */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <ClientesEnMora containerId={contenedorId} />
          <CanastosPorRuta containerId={contenedorId} />
        </div>

        {/* Histórico de Movimientos por Cliente */}
        <HistoricoMovimientosCliente movimientos={movimientos} clientes={clientes} />

        {/* Histórico de Movimientos por Proveedor */}
        <HistoricoMovimientosProveedor movimientosProveedor={movimientosProveedor} />
      </div>
    </RouteProtection>
  );
}
