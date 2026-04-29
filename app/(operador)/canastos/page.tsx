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
  canastilla: string;
  cliente: string;
  grupo: string;
  cantidad: number;
}

interface MovimientoProveedor {
  fecha: string;
  canastilla: string;
  proveedor: string;
  cantidad: number;
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
    fecha: "2026-01-29 16:17:23",
    canastilla: "Canastilla Roja",
    cliente: "cliente ceja 1",
    grupo: "operation",
    cantidad: -1000,
  },
  {
    fecha: "2026-01-28 10:30:15",
    canastilla: "Canastilla Roja",
    cliente: "Pollería El Rey",
    grupo: "operation",
    cantidad: 500,
  },
  {
    fecha: "2026-01-27 14:45:22",
    canastilla: "Canastilla Azul",
    cliente: "Doña Juana",
    grupo: "retail",
    cantidad: -800,
  },
  {
    fecha: "2026-01-26 09:15:33",
    canastilla: "Canastilla Verde",
    cliente: "cliente ceja 1",
    grupo: "operation",
    cantidad: 300,
  },
  {
    fecha: "2026-01-25 11:22:44",
    canastilla: "Canastilla Roja",
    cliente: "Distribuidor Sucre",
    grupo: "retail",
    cantidad: -600,
  },
  {
    fecha: "2026-01-24 15:30:12",
    canastilla: "Canastilla Azul",
    cliente: "Pollería El Rey",
    grupo: "operation",
    cantidad: 400,
  },
  {
    fecha: "2026-01-23 13:18:56",
    canastilla: "Canastilla Verde",
    cliente: "Doña Juana",
    grupo: "retail",
    cantidad: -450,
  },
  {
    fecha: "2026-01-22 08:45:22",
    canastilla: "Canastilla Roja",
    cliente: "Mercado Central",
    grupo: "wholesale",
    cantidad: -700,
  },
  {
    fecha: "2026-01-21 12:00:00",
    canastilla: "Canastilla Azul",
    cliente: "cliente ceja 1",
    grupo: "operation",
    cantidad: 250,
  },
];

const rutas: RutaItem[] = [
  { nombre: "La Paz Centro", canastos: 475 },
  { nombre: "El Alto Norte", canastos: 340 },
  { nombre: "Sucre Centro", canastos: 250 },
  { nombre: "El Alto Sur", canastos: 230 },
];

const movimientosProveedor: MovimientoProveedor[] = [
  {
    fecha: "2026-01-28 20:26:40",
    canastilla: "Canastilla Roja",
    proveedor: "SOFIA",
    cantidad: 15,
  },
  {
    fecha: "2026-01-27 18:15:22",
    canastilla: "Canastilla Azul",
    proveedor: "TRANSPORTES BOLIVIA",
    cantidad: 20,
  },
  {
    fecha: "2026-01-26 14:30:00",
    canastilla: "Canastilla Verde",
    proveedor: "SOFIA",
    cantidad: 10,
  },
  {
    fecha: "2026-01-25 10:45:33",
    canastilla: "Canastilla Roja",
    proveedor: "LOGISTICA ANDINA",
    cantidad: 25,
  },
  {
    fecha: "2026-01-24 16:20:15",
    canastilla: "Canastilla Azul",
    proveedor: "SOFIA",
    cantidad: 18,
  },
  {
    fecha: "2026-01-23 12:00:00",
    canastilla: "Canastilla Verde",
    proveedor: "TRANSPORTES BOLIVIA",
    cantidad: 12,
  },
  {
    fecha: "2026-01-22 09:30:45",
    canastilla: "Canastilla Roja",
    proveedor: "LOGISTICA ANDINA",
    cantidad: 22,
  },
  {
    fecha: "2026-01-21 15:15:30",
    canastilla: "Canastilla Azul",
    proveedor: "SOFIA",
    cantidad: 16,
  },
  {
    fecha: "2026-01-20 11:45:00",
    canastilla: "Canastilla Verde",
    proveedor: "TRANSPORTES BOLIVIA",
    cantidad: 14,
  },
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
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [cliente, setCliente] = useState("Todos los clientes");
  const [grupoCliente, setGrupoCliente] = useState("Todos los grupos");
  const [contenedor, setContenedor] = useState("Bolsa");
  const [fechaInicioProv, setFechaInicioProv] = useState("");
  const [fechaFinProv, setFechaFinProv] = useState("");
  const [proveedor, setProveedor] = useState("Todos los proveedores");

  const filteredClientes = clientes.filter(
    (c) =>
      c.nombre.toLowerCase().includes(search.toLowerCase()) ||
      c.ruta.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredMovimientos = movimientos.filter((m) => {
    const movFecha = new Date(m.fecha.split(" ")[0]);
    const inicio = fechaInicio ? new Date(fechaInicio) : null;
    const fin = fechaFin ? new Date(fechaFin) : null;

    const fechaValida =
      (!inicio || movFecha >= inicio) && (!fin || movFecha <= fin);
    const clienteValido =
      cliente === "Todos los clientes" || m.cliente === cliente;
    const grupoValido =
      grupoCliente === "Todos los grupos" || m.grupo === grupoCliente;

    return fechaValida && clienteValido && grupoValido;
  });

  const filteredMovimientosProveedor = movimientosProveedor.filter((m) => {
    const movFecha = new Date(m.fecha.split(" ")[0]);
    const inicio = fechaInicioProv ? new Date(fechaInicioProv) : null;
    const fin = fechaFinProv ? new Date(fechaFinProv) : null;

    const fechaValida =
      (!inicio || movFecha >= inicio) && (!fin || movFecha <= fin);
    const proveedorValido =
      proveedor === "Todos los proveedores" || m.proveedor === proveedor;

    return fechaValida && proveedorValido;
  });

  const limpiarFiltros = () => {
    setFechaInicio("");
    setFechaFin("");
    setCliente("Todos los clientes");
    setGrupoCliente("Todos los grupos");
  };

  const limpiarFiltrosProveedor = () => {
    setFechaInicioProv("");
    setFechaFinProv("");
    setProveedor("Todos los proveedores");
  };
  return (
    <RouteProtection requiredTransaction="Canastos">
      <div className="min-h-screen bg-gray-50 font-sans text-gray-800 text-[15px] p-4 sm:p-6">
        {/* Top section with header and buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
              Gestión de Canastos
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Inventario y control de distribución
            </p>
          </div>
        </div>

        {/* KPI Cards + Filter + Button */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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
          {/* Filtrar por contenedor + Agregar canastos */}
          <Card className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col">
            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase">
              Filtrar por contenedor
            </label>
            <select
              value={contenedor}
              onChange={(e) => setContenedor(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 mb-3"
            >
              <option>Bolsa</option>
              <option>Caja</option>
              <option>Palé</option>
            </select>
            <Button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-xl transition-colors">
              Agregar canastos
            </Button>
          </Card>
        </div>

        {/* Middle row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Clientes en Mora */}
          <Card className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 pt-5 pb-3 flex flex-col gap-3">
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  Clientes en Mora
                </h2>
                <p className="text-xs text-gray-400">
                  Canastos pendientes – Ordenado por cantidad (mayor a menor)
                </p>
              </div>
              <div className="relative w-full">
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
                    {["Cliente", "Ruta", "Canastos", "Acciones"].map((h) => (
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

        {/* Histórico de Movimientos por Cliente */}
        <Card className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          <div className="px-5 pt-5 pb-4 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900 mb-1">
              Histórico de Movimientos por Cliente
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              Movimientos de canastillas por cliente
            </p>

            {/* Filters Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Fecha Inicio
                </label>
                <Input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  inputSize="sm"
                  placeholder="dd/mm/aaaa"
                  className="rounded-xl border-gray-200 bg-gray-50 text-[13px] focus-visible:ring-sky-200 focus-visible:border-sky-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Fecha Fin
                </label>
                <Input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  inputSize="sm"
                  placeholder="dd/mm/aaaa"
                  className="rounded-xl border-gray-200 bg-gray-50 text-[13px] focus-visible:ring-sky-200 focus-visible:border-sky-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Cliente
                </label>
                <select
                  value={cliente}
                  onChange={(e) => setCliente(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
                >
                  <option>Todos los clientes</option>
                  {clientes.map((c) => (
                    <option key={c.nombre} value={c.nombre}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Grupo de Cliente
                </label>
                <select
                  value={grupoCliente}
                  onChange={(e) => setGrupoCliente(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
                >
                  <option>Todos los grupos</option>
                  <option value="operation">operation</option>
                  <option value="retail">retail</option>
                  <option value="wholesale">wholesale</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={limpiarFiltros}
                  variant="ghost"
                  className="w-full h-auto px-4 py-2 text-red-500 font-semibold text-sm hover:text-red-600"
                >
                  Limpiar Filtros
                </Button>
              </div>
            </div>
          </div>

          <div className="overflow-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {[
                    "Fecha / Hora",
                    "Canastilla",
                    "Cliente",
                    "Grupo",
                    "Cantidad (+/-)",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-[11px] font-bold tracking-wider text-gray-600 uppercase"
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
                    <td className="px-5 py-3 text-gray-600 whitespace-nowrap">
                      {m.fecha}
                    </td>
                    <td className="px-5 py-3 font-semibold text-gray-800 whitespace-nowrap">
                      {m.canastilla}
                    </td>
                    <td className="px-5 py-3 text-gray-700 whitespace-nowrap">
                      {m.cliente}
                    </td>
                    <td className="px-5 py-3 text-gray-600 whitespace-nowrap">
                      {m.grupo}
                    </td>
                    <td
                      className={`px-5 py-3 font-black whitespace-nowrap ${m.cantidad < 0 ? "text-red-500" : "text-emerald-500"}`}
                    >
                      {m.cantidad > 0 ? `+${m.cantidad}` : m.cantidad}
                    </td>
                  </tr>
                ))}
                {filteredMovimientos.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-10 text-center text-sm text-gray-400"
                    >
                      No hay movimientos para los filtros seleccionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Histórico de Movimientos por Proveedor */}
        <Card className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          <div className="px-5 pt-5 pb-4 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900 mb-1">
              Histórico de Movimientos por Proveedor
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              Movimientos de canastillas recibidas de proveedores
            </p>

            {/* Filters Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Fecha Inicio
                </label>
                <Input
                  type="date"
                  value={fechaInicioProv}
                  onChange={(e) => setFechaInicioProv(e.target.value)}
                  inputSize="sm"
                  placeholder="dd/mm/aaaa"
                  className="rounded-xl border-gray-200 bg-gray-50 text-[13px] focus-visible:ring-sky-200 focus-visible:border-sky-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Fecha Fin
                </label>
                <Input
                  type="date"
                  value={fechaFinProv}
                  onChange={(e) => setFechaFinProv(e.target.value)}
                  inputSize="sm"
                  placeholder="dd/mm/aaaa"
                  className="rounded-xl border-gray-200 bg-gray-50 text-[13px] focus-visible:ring-sky-200 focus-visible:border-sky-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Proveedor
                </label>
                <select
                  value={proveedor}
                  onChange={(e) => setProveedor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
                >
                  <option>Todos los proveedores</option>
                  <option value="SOFIA">SOFIA</option>
                  <option value="TRANSPORTES BOLIVIA">
                    TRANSPORTES BOLIVIA
                  </option>
                  <option value="LOGISTICA ANDINA">LOGISTICA ANDINA</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={limpiarFiltrosProveedor}
                  variant="ghost"
                  className="w-full h-auto px-4 py-2 text-red-500 font-semibold text-sm hover:text-red-600"
                >
                  Limpiar Filtros
                </Button>
              </div>
            </div>
          </div>

          <div className="overflow-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {[
                    "Fecha / Hora",
                    "Canastilla",
                    "Proveedor",
                    "Cantidad (+/-)",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-[11px] font-bold tracking-wider text-gray-600 uppercase"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredMovimientosProveedor.map((m, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-5 py-3 text-gray-600 whitespace-nowrap">
                      {m.fecha}
                    </td>
                    <td className="px-5 py-3 font-semibold text-gray-800 whitespace-nowrap">
                      {m.canastilla}
                    </td>
                    <td className="px-5 py-3 text-gray-700 whitespace-nowrap">
                      {m.proveedor}
                    </td>
                    <td className="px-5 py-3 font-black whitespace-nowrap text-emerald-500">
                      +{m.cantidad}
                    </td>
                  </tr>
                ))}
                {filteredMovimientosProveedor.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-10 text-center text-sm text-gray-400"
                    >
                      No hay movimientos para los filtros seleccionados.
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
