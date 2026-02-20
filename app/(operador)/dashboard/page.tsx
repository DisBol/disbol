"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// ── Icon helpers ──────────────────────────────────────────────────────────────
const CheckCircleIcon = () => (
  <svg
    className="w-5 h-5 text-emerald-500"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const CartIcon = () => (
  <svg
    className="w-5 h-5 text-sky-400"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <path
      d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
);
const ArchiveIcon = () => (
  <svg
    className="w-5 h-5 text-amber-400"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <polyline points="21 8 21 21 3 21 3 8" />
    <rect x="1" y="3" width="22" height="5" rx="1" />
    <line x1="10" y1="12" x2="14" y2="12" />
  </svg>
);
const AlertIcon = () => (
  <svg
    className="w-5 h-5 text-rose-500"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
const TrendDownIcon = () => (
  <svg
    className="w-5 h-5 text-rose-400"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
    <polyline points="17 18 23 18 23 12" />
  </svg>
);
const TargetIcon = () => (
  <svg
    className="w-5 h-5 text-emerald-500"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);
const ClockIcon = () => (
  <svg
    className="w-5 h-5 text-slate-400"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const ActivityIcon = () => (
  <svg
    className="w-5 h-5 text-amber-400"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

// ── KPI Card ──────────────────────────────────────────────────────────────────
function KpiCard({ label, value, delta, icon, bgIcon }) {
  const isPositiveDelta = delta && delta.startsWith("+");
  const isNegativeDelta = delta && delta.startsWith("-");

  return (
    <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 flex flex-col gap-2 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
          {label}
        </span>
        <div className={`p-1.5 rounded-lg ${bgIcon}`}>{icon}</div>
      </div>
      <div className="flex items-end gap-3">
        <span className="text-xl md:text-2xl font-bold text-slate-800 leading-none">
          {value}
        </span>
        {delta && (
          <span
            className={`text-sm font-bold mb-1 ${isPositiveDelta ? "text-emerald-500" : isNegativeDelta ? "text-rose-500" : "text-slate-400"}`}
          >
            {delta}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Bar Row ───────────────────────────────────────────────────────────────────
function BarRow({ label, value, maxValue, displayValue, accent = "#E11D48" }) {
  const pct = Math.min((value / maxValue) * 100, 100);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="text-sm font-bold" style={{ color: accent }}>
          {displayValue}
        </span>
      </div>
      <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${accent}cc, ${accent})`,
          }}
        />
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
// Dynamically import the map component to avoid SSR issues with Leaflet
const VehicleTrackingMap = dynamic(
  () => import("./components/VehicleTrackingMap"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[400px] w-full bg-slate-100 animate-pulse rounded-xl mt-4"></div>
    ),
  },
);

export default function Dashboard() {
  const kpis = [
    {
      label: "Entregas Hoy",
      value: "42",
      delta: "+5%",
      icon: <CheckCircleIcon />,
      bgIcon: "bg-emerald-50",
    },
    {
      label: "Total Solicitudes",
      value: "158",
      delta: "+12%",
      icon: <CartIcon />,
      bgIcon: "bg-sky-50",
    },
    {
      label: "Canastos en Clientes",
      value: "842",
      delta: "-18%",
      icon: <ArchiveIcon />,
      bgIcon: "bg-amber-50",
    },
    {
      label: "Stock Crítico",
      value: "3 Categorías",
      delta: null,
      icon: <AlertIcon />,
      bgIcon: "bg-rose-50",
    },
    {
      label: "Fuga de Canastos",
      value: "18",
      delta: "-3%",
      icon: <TrendDownIcon />,
      bgIcon: "bg-rose-50",
    },
    {
      label: "Efectividad de Entregas",
      value: "94.2%",
      delta: "+2.1%",
      icon: <TargetIcon />,
      bgIcon: "bg-emerald-50",
    },
    {
      label: "Tiempo Promedio Entrega",
      value: "2.4h",
      delta: "-0.3%",
      icon: <ClockIcon />,
      bgIcon: "bg-slate-50",
    },
    {
      label: "Utilización Vehículos",
      value: "78%",
      delta: "+5%",
      icon: <ActivityIcon />,
      bgIcon: "bg-amber-50",
    },
  ];

  const ventas = [
    { label: "Pollería El Rey", value: 12500, displayValue: "Bs 12.500" },
    { label: "Doña Juana", value: 8900, displayValue: "Bs 8.900" },
    { label: "Feria Sector A", value: 11200, displayValue: "Bs 11.200" },
    { label: "Mercado Central", value: 7500, displayValue: "Bs 7.500" },
    { label: "Distribuidor Sucre", value: 9800, displayValue: "Bs 9.800" },
  ];

  const pedidos = [
    { label: "Código 104", value: 80, displayValue: "80 Unid." },
    { label: "Código 105", value: 70, displayValue: "70 Unid." },
    { label: "Código 106", value: 60, displayValue: "60 Unid." },
    { label: "Código 107", value: 50, displayValue: "50 Unid." },
    { label: "Código 108", value: 40, displayValue: "40 Unid." },
    { label: "Código 109", value: 30, displayValue: "30 Unid." },
    { label: "Código 110", value: 20, displayValue: "20 Unid." },
  ];

  const maxVenta = Math.max(...ventas.map((v) => v.value));
  const maxPedido = Math.max(...pedidos.map((p) => p.value));

  return (
    <div className="min-h-screen bg-slate-50 p-3 md:p-6 font-sans">
      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {kpis.map((kpi, i) => (
          <KpiCard key={i} {...kpi} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Ventas por Cliente */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <h2 className="text-sm font-bold text-slate-800 mb-3">
            Ventas por Cliente
          </h2>
          <div className="flex flex-col gap-5">
            {ventas.map((v, i) => (
              <BarRow
                key={i}
                label={v.label}
                value={v.value}
                maxValue={maxVenta}
                displayValue={v.displayValue}
              />
            ))}
          </div>
        </div>

        {/* Pedidos por Categoría */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <h2 className="text-sm font-bold text-slate-800 mb-3">
            Pedidos por Categoría (Hoy)
          </h2>
          <div className="flex flex-col gap-4">
            {pedidos.map((p, i) => (
              <BarRow
                key={i}
                label={p.label}
                value={p.value}
                maxValue={maxPedido}
                displayValue={p.displayValue}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Vehicle Tracking Map */}
      <div className="mt-4">
        <VehicleTrackingMap />
      </div>
    </div>
  );
}
