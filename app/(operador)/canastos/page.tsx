"use client";
import React from "react";
import { RouteProtection } from "@/components/shared/RouteProtection";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { BoxIcon } from "@/components/icons/BoxIcon";
import { Box1Icon } from "@/components/icons/Box1Icon";

// ── Types ──────────────────────────────────────────────────────────────────
interface Cliente {
  nombre: string;
  ruta: string;
  canastos: number;
  ultimoMovimiento: string;
  moraDias: number;
}

interface Movimiento {
  fecha: string;
  cliente: string;
  tipo: string;
  canastos: number;
  almacen: string;
  saldoCliente: number;
  saldoAlmacen: number;
}

interface RutaItem {
  nombre: string;
  canastos: number;
}

// ── Data ───────────────────────────────────────────────────────────────────
const clientes: Cliente[] = [
  {
    nombre: "Distribuidor Sucre",
    ruta: "Sucre Centro",
    canastos: 160,
    ultimoMovimiento: "2025-12-18",
    moraDias: 7,
  },
  {
    nombre: "Hotel Continental",
    ruta: "La Paz Centro",
    canastos: 130,
    ultimoMovimiento: "2025-12-11",
    moraDias: 16,
  },
  {
    nombre: "Supermercado Andino",
    ruta: "La Paz Centro",
    canastos: 110,
    ultimoMovimiento: "2025-12-14",
    moraDias: 12,
  },
  {
    nombre: "Restaurante La Cumbre",
    ruta: "La Paz Centro",
    canastos: 95,
    ultimoMovimiento: "2025-12-15",
    moraDias: 10,
  },
  {
    nombre: "Minimarket Plaza",
    ruta: "Sucre Centro",
    canastos: 90,
    ultimoMovimiento: "2025-12-12",
    moraDias: 15,
  },
  {
    nombre: "Carnicería Los Andes",
    ruta: "El Alto Sur",
    canastos: 85,
    ultimoMovimiento: "2025-12-13",
    moraDias: 14,
  },
  {
    nombre: "Doña Juana",
    ruta: "El Alto Sur",
    canastos: 80,
    ultimoMovimiento: "2025-12-21",
    moraDias: 3,
  },
  {
    nombre: "Mercado Central – Puesto 4",
    ruta: "La Paz Centro",
    canastos: 75,
    ultimoMovimiento: "2025-12-20",
    moraDias: 4,
  },
  {
    nombre: "Pollería El Rey",
    ruta: "El Alto Norte",
    canastos: 60,
    ultimoMovimiento: "2025-12-19",
    moraDias: 5,
  },
  {
    nombre: "Feria 16 de Julio – Sector A",
    ruta: "El Alto Norte",
    canastos: 55,
    ultimoMovimiento: "2025-12-17",
    moraDias: 7,
  },
];

const movimientos: Movimiento[] = [
  {
    fecha: "2025-12-23",
    cliente: "Feria 16 de Julio – Sector A",
    tipo: "Salida a cliente",
    canastos: -40,
    almacen: "Depósito El Alto",
    saldoCliente: 95,
    saldoAlmacen: 390,
  },
  {
    fecha: "2025-12-23",
    cliente: "Pollería El Rey",
    tipo: "Devolución de canastos",
    canastos: 30,
    almacen: "Almacén Central La Paz",
    saldoCliente: 120,
    saldoAlmacen: 650,
  },
  {
    fecha: "2025-12-22",
    cliente: "Doña Juana",
    tipo: "Salida a cliente",
    canastos: -20,
    almacen: "Depósito El Alto",
    saldoCliente: 80,
    saldoAlmacen: 430,
  },
  {
    fecha: "2025-12-21",
    cliente: "Distribuidor Sucre",
    tipo: "Salida a cliente",
    canastos: -50,
    almacen: "Depósito Viacha",
    saldoCliente: 160,
    saldoAlmacen: 300,
  },
  {
    fecha: "2025-12-20",
    cliente: "Mercado Central – Puesto 4",
    tipo: "Devolución parcial",
    canastos: 10,
    almacen: "Almacén Central La Paz",
    saldoCliente: 45,
    saldoAlmacen: 620,
  },
];

const rutas: RutaItem[] = [
  { nombre: "La Paz Centro", canastos: 475 },
  { nombre: "El Alto Norte", canastos: 340 },
  { nombre: "Sucre Centro", canastos: 250 },
  { nombre: "El Alto Sur", canastos: 230 },
];

const MAX_RUTA = 475;

// ── Icons (inline SVG) ─────────────────────────────────────────────────────

const IconUsers = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    className="w-8 h-8"
  >
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </svg>
);
const IconAlert = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    className="w-8 h-8"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
const IconSearch = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    className="w-4 h-4"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

// ── Sub-components ─────────────────────────────────────────────────────────
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
        <p className={`text-4xl font-black tracking-tight ${accent}`}>
          {value}
        </p>
        <p className="text-xs text-gray-400 mt-1">{sub}</p>
      </div>
      <div className={`${accent} opacity-80`}>{icon}</div>
    </Card>
  );
}

function MoraBadge({ dias }: { dias: number }) {
  let bg = "bg-red-50 text-red-600 border-red-200";
  if (dias <= 5) bg = "bg-orange-50 text-orange-500 border-orange-200";
  return (
    <span
      className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-full border ${bg}`}
    >
      Mora {dias} día{dias !== 1 ? "s" : ""}
    </span>
  );
}

export default function CanastosPage() {
  const [search, setSearch] = useState("");
  const [fecha, setFecha] = useState("");

  const filteredClientes = clientes.filter(
    (c) =>
      c.nombre.toLowerCase().includes(search.toLowerCase()) ||
      c.ruta.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredMovimientos = movimientos.filter(
    (m) => !fecha || m.fecha === fecha,
  );
  return (
    <RouteProtection requiredTransaction="Canastos">
      <div className="min-h-screen bg-gray-50 font-sans text-gray-800 text-[15px] p-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            label="Total Canastos"
            value="2.200"
            sub="Inventario teórico"
            icon={<BoxIcon />}
            accent="text-gray-700"
          />
          <StatCard
            label="En Almacén"
            value="1.350"
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
          <StatCard
            label="Perdidos / Dañados"
            value="30"
            sub="Pendiente regularización"
            icon={<IconAlert />}
            accent="text-red-500"
          />
        </div>

        {/* Middle row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Clientes en Mora */}
          <Card className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 pt-5 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  Clientes en Mora
                </h2>
                <p className="text-xs text-gray-400">
                  Canastos pendientes – Ordenado por cantidad (mayor a menor)
                </p>
              </div>
              <div className="relative w-full sm:w-56">
                <Input
                  type="text"
                  placeholder="Buscar cliente o ruta…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  inputSize="sm"
                  leftIcon={<IconSearch />}
                  className="rounded-xl border-gray-200 bg-gray-50 text-[13px] focus-visible:ring-sky-200 focus-visible:border-sky-400 placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="overflow-auto max-h-72">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-gray-100">
                    {[
                      "Cliente",
                      "Ruta",
                      "Canastos",
                      "Últ. movimiento",
                      "Estado",
                      "Acciones",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-2.5 text-left text-[11px] font-bold tracking-wider text-red-500 uppercase whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredClientes.map((c, i) => (
                    <tr
                      key={i}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-5 py-3 font-medium text-gray-800 whitespace-nowrap">
                        {c.nombre}
                      </td>
                      <td className="px-5 py-3 text-gray-500 whitespace-nowrap">
                        {c.ruta}
                      </td>
                      <td className="px-5 py-3 font-black text-red-500">
                        {c.canastos}
                      </td>
                      <td className="px-5 py-3 text-gray-400 whitespace-nowrap">
                        {c.ultimoMovimiento}
                      </td>
                      <td className="px-5 py-3">
                        <MoraBadge dias={c.moraDias} />
                      </td>
                      <td className="px-5 py-3">
                        <Button
                          variant="outline"
                          size="sm"
                          radius="lg"
                          className="h-auto px-3 py-1.5 text-xs font-semibold border-gray-300 text-gray-600 hover:bg-gray-900 hover:text-white hover:border-gray-900"
                        >
                          Extracto
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Canastos por Ruta */}
          <Card className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-base font-bold text-gray-900 mb-0.5">
              Canastos por Ruta
            </h2>
            <p className="text-xs text-gray-400 mb-5">
              Total de canastos en cada ruta
            </p>
            <div className="space-y-5">
              {rutas.map((r) => {
                const pct = Math.round((r.canastos / MAX_RUTA) * 100);
                return (
                  <div key={r.nombre}>
                    <div className="flex justify-between items-baseline mb-1.5">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {r.nombre}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          Ruta de distribución
                        </p>
                      </div>
                      <span className="text-sm font-black text-red-500">
                        {r.canastos.toLocaleString("es-BO")} canastos
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-red-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Histórico de Movimientos */}
        <Card className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 pt-5 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Histórico de Movimientos por Día
              </h2>
              <p className="text-xs text-gray-400">
                Entradas y salidas de canastos por fecha
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500">Fecha</span>
              <Input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                inputSize="sm"
                className="w-auto min-w-40 rounded-xl border-gray-200 bg-gray-50 text-[13px] focus-visible:ring-sky-200 focus-visible:border-sky-400"
              />
              {fecha && (
                <Button
                  onClick={() => setFecha("")}
                  variant="ghost"
                  size="sm"
                  radius="lg"
                  className="h-auto px-1.5 py-1 text-xs text-gray-400 hover:text-gray-700"
                >
                  ✕ Limpiar
                </Button>
              )}
            </div>
          </div>

          <div className="overflow-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-gray-100">
                  {[
                    "Fecha",
                    "Cliente",
                    "Tipo Movimiento",
                    "Canastos (+/−)",
                    "Almacén",
                    "Saldo Cliente",
                    "Saldo Almacén",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-2.5 text-left text-[11px] font-bold tracking-wider text-red-500 uppercase whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredMovimientos.map((m, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-5 py-3 text-gray-500 whitespace-nowrap">
                      {m.fecha}
                    </td>
                    <td className="px-5 py-3 font-medium text-gray-800 whitespace-nowrap">
                      {m.cliente}
                    </td>
                    <td className="px-5 py-3 text-gray-500 whitespace-nowrap">
                      {m.tipo}
                    </td>
                    <td
                      className={`px-5 py-3 font-black whitespace-nowrap ${m.canastos < 0 ? "text-red-500" : "text-emerald-500"}`}
                    >
                      {m.canastos > 0 ? `+${m.canastos}` : m.canastos}
                    </td>
                    <td className="px-5 py-3 text-gray-500 whitespace-nowrap">
                      {m.almacen}
                    </td>
                    <td className="px-5 py-3 text-gray-700 whitespace-nowrap">
                      {m.saldoCliente} can.
                    </td>
                    <td className="px-5 py-3 text-gray-700 whitespace-nowrap">
                      {m.saldoAlmacen} can.
                    </td>
                  </tr>
                ))}
                {filteredMovimientos.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-10 text-center text-sm text-gray-400"
                    >
                      No hay movimientos para la fecha seleccionada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </RouteProtection>
  );
}
