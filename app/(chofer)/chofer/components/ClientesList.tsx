"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Input } from "@/components/ui/Input";
import { Select, SelectOption } from "@/components/ui/SelecMultipe";
import { ArrowDownBoldIcon } from "@/components/icons/ArrowDownBold";
import { User16Icon } from "@/components/icons/User16Icon";

/* ─────────────── Tipos ─────────────── */

interface Producto {
  codigo: string;
  cajas: number;
  unidades: number;
  kgBruto: number;
  kgNeto: number;
}

interface Solicitud {
  id: string;
  cliente: string;
  totalACobrar: number;
  estado: "pendiente" | "entregado" | "pagado";
  productos: Producto[];
}

interface ClientesListProps {
  solicitudes: Solicitud[];
}

interface SolicitudAcciones {
  entregado: boolean;
  metodoCobro: string | null;
  canastosCount: number;
  canastosConfirmados: boolean;
}

/* ─────────────── Constantes ─────────────── */

const metodosCobroOptions: SelectOption[] = [
  { value: "efectivo", label: "Efectivo" },
  { value: "qr", label: "QR" },
  { value: "transferencia", label: "Transferencia" },
];

const estadoChip: Record<
  Solicitud["estado"],
  { label: string; color: "warning" | "info" | "success"; variant: "flat" }
> = {
  pendiente: { label: "Pendiente", color: "warning", variant: "flat" },
  entregado: { label: "Entregado", color: "info", variant: "flat" },
  pagado: { label: "Pagado", color: "success", variant: "flat" },
};

/* ─────────────── Sub-componentes ─────────────── */

function StepCircle({ done, step }: { done: boolean; step: number }) {
  return (
    <div
      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-bold text-sm transition-all ${
        done
          ? "bg-green-500 text-white shadow-sm shadow-green-200"
          : "bg-gray-100 text-gray-400 border border-gray-200"
      }`}
    >
      {done ? (
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        step
      )}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={3}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ProductoCard({ producto }: { producto: Producto }) {
  return (
    <div className="shrink-0 w-36 snap-start bg-white rounded-xl border border-gray-200 p-3">
      <p className="text-[11px] font-bold text-red-600 text-center bg-red-50 rounded-md py-1 mb-2">
        Cód. {producto.codigo}
      </p>
      <div className="space-y-1.5 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-400">Cajas</span>
          <span className="font-semibold text-gray-700">{producto.cajas}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Unidades</span>
          <span className="font-semibold text-gray-700">{producto.unidades}</span>
        </div>
        <div className="border-t border-gray-100 pt-1.5 flex justify-between">
          <span className="text-gray-400">Kg Bruto</span>
          <span className="font-semibold text-gray-700">{producto.kgBruto.toFixed(1)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Kg Neto</span>
          <span className="font-semibold text-green-600">{producto.kgNeto.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Componente principal ─────────────── */

export default function ClientesList({ solicitudes }: ClientesListProps) {
  const [expandedClients, setExpandedClients] = useState<string[]>([
    solicitudes[0]?.id,
  ]);

  const [acciones, setAcciones] = useState<Record<string, SolicitudAcciones>>(
    Object.fromEntries(
      solicitudes.map((s) => [
        s.id,
        {
          entregado: false,
          metodoCobro: null,
          canastosCount: 0,
          canastosConfirmados: false,
        },
      ]),
    ),
  );

  const toggle = (id: string) =>
    setExpandedClients((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const update = (id: string, patch: Partial<SolicitudAcciones>) =>
    setAcciones((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));

  return (
    <div className="space-y-3">
      {solicitudes.map((sol) => {
        const isExpanded = expandedClients.includes(sol.id);
        const acc = acciones[sol.id];
        const chip = estadoChip[sol.estado];
        const metodoLabel =
          metodosCobroOptions.find((o) => o.value === acc.metodoCobro)?.label ?? null;
        const productosConDatos = sol.productos.filter(
          (p) => p.cajas > 0 || p.unidades > 0 || p.kgBruto > 0 || p.kgNeto > 0,
        );

        return (
          <Card key={sol.id} className="shadow-sm">
            {/* ── Header ── */}
            <CardHeader className="p-0">
              <button
                onClick={() => toggle(sol.id)}
                className="w-full px-4 py-3.5 flex items-center gap-3 hover:bg-gray-50 active:bg-gray-100 transition-colors rounded-t-xl text-left"
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <User16Icon size={20} className="text-gray-500" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm leading-tight truncate">
                    {sol.cliente}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {sol.id}
                  </p>
                </div>

                {/* Monto + estado + chevron */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="font-bold text-gray-900 text-sm">
                    Bs {sol.totalACobrar.toFixed(2)}
                  </span>
                  <div className="flex items-center gap-2">
                    <Chip
                      variant={chip.variant}
                      color={chip.color}
                      size="sm"
                      radius="full"
                    >
                      {chip.label}
                    </Chip>
                    <ArrowDownBoldIcon
                      size={14}
                      className={`text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </div>
                </div>
              </button>
            </CardHeader>

            {/* ── Cuerpo expandible ── */}
            {isExpanded && (
              <CardContent className="pt-3 px-4 pb-4 bg-gray-50 rounded-b-xl">
                {/* Productos */}
                {productosConDatos.length > 0 ? (
                  <div className="flex gap-2 overflow-x-auto pb-2 mb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
                    {productosConDatos.map((p) => (
                      <ProductoCard key={p.codigo} producto={p} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 text-center py-4 mb-4">
                    Sin productos registrados
                  </p>
                )}

                {/* ── Pasos de acción ── */}
                <div className="space-y-2.5">

                  {/* Paso 1 – Entregar */}
                  <div className="flex items-center gap-3">
                    <StepCircle done={acc.entregado} step={1} />
                    {acc.entregado ? (
                      <div className="flex-1 h-11 bg-green-500 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
                        <CheckIcon />
                        Entregado
                      </div>
                    ) : (
                      <Button
                        variant="danger"
                        size="md"
                        radius="lg"
                        fullWidth
                        className="h-11 text-sm"
                        onClick={() => update(sol.id, { entregado: true })}
                      >
                        Entregar Solicitud
                      </Button>
                    )}
                  </div>

                  {/* Paso 2 – Cobrar */}
                  <div className="flex items-center gap-3">
                    <StepCircle done={!!acc.metodoCobro} step={2} />
                    {acc.metodoCobro ? (
                      <button
                        onClick={() => update(sol.id, { metodoCobro: null })}
                        className="flex-1 h-11 bg-green-500 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-green-600 transition-colors"
                      >
                        <CheckIcon />
                        Pagado ({metodoLabel})
                      </button>
                    ) : (
                      <div className="flex-1">
                        <Select
                          options={metodosCobroOptions}
                          selectedValues={acc.metodoCobro ? [acc.metodoCobro] : []}
                          onSelect={(opt) =>
                            update(sol.id, { metodoCobro: opt.value })
                          }
                          placeholder="Seleccionar método de cobro..."
                          size="md"
                          radius="lg"
                          closeOnSelect
                        />
                      </div>
                    )}
                  </div>

                  {/* Paso 3 – Canastos devueltos */}
                  <div className="flex items-center gap-3">
                    <StepCircle done={acc.canastosConfirmados} step={3} />
                    {acc.canastosConfirmados ? (
                      <button
                        onClick={() => update(sol.id, { canastosConfirmados: false })}
                        className="flex-1 h-11 bg-green-500 text-white rounded-xl font-semibold text-sm flex items-center justify-between px-4 hover:bg-green-600 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <CheckIcon />
                          Canastos devueltos: {acc.canastosCount}
                        </span>
                        <span className="text-xs text-green-100 underline">editar</span>
                      </button>
                    ) : (
                      <div className="flex-1 flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">
                          Canastos devueltos
                        </span>
                        <Input
                          type="number"
                          inputSize="md"
                          value={acc.canastosCount}
                          min={0}
                          onChange={(e) =>
                            update(sol.id, {
                              canastosCount: Math.max(0, Number(e.target.value)),
                              canastosConfirmados: false,
                            })
                          }
                          className="w-16 text-center"
                        />
                        <Button
                          variant="success"
                          size="md"
                          radius="lg"
                          className="shrink-0 px-3"
                          onClick={() => update(sol.id, { canastosConfirmados: true })}
                        >
                          <CheckIcon />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}
