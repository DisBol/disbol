"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Input } from "@/components/ui/Input";
import { Select, SelectOption } from "@/components/ui/SelecMultipe";
import { ArrowDownBoldIcon } from "@/components/icons/ArrowDownBold";
import { User16Icon } from "@/components/icons/User16Icon";
import { entregarSolicitud } from "@/app/(chofer)/chofer/service/entregarSolicitud";

/* ─────────────── Tipos ─────────────── */

interface Producto {
  nombre: string;
  categoria?: string;
  cajas: number;
  unidades: number;
  menudencia?: string;
}

interface Solicitud {
  id: string;
  cliente: string;
  proveedor?: string;
  ruta?: string;
  requestStateName?: string;
  paymentTypeName?: string;
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
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
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

function IconBox() {
  return (
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"
      />
    </svg>
  );
}

function IconUnits() {
  return (
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6h16M4 10h16M4 14h16M4 18h16"
      />
    </svg>
  );
}

function IconLeaf() {
  return (
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
      />
    </svg>
  );
}

function ProductoCard({ producto }: { producto: Producto }) {
  const tieneMenudencia =
    producto.menudencia === "true" || producto.menudencia === "1";
  return (
    <div className="shrink-0 w-32 snap-start bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-br from-red-50 to-orange-50 px-2 pt-2 pb-1.5 border-b border-red-100">
        <p className="text-[10px] font-bold text-red-700 text-center leading-tight line-clamp-2">
          {producto.nombre}
        </p>
      </div>

      {/* Stats */}
      <div className="px-2 py-1.5 space-y-1">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-[10px] text-gray-400">
            <span className="text-blue-400">
              <IconBox />
            </span>
            Cajas
          </span>
          <span className="text-xs font-bold text-gray-800">
            {producto.cajas}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-[10px] text-gray-400">
            <span className="text-purple-400">
              <IconUnits />
            </span>
            Unid.
          </span>
          <span className="text-xs font-bold text-gray-800">
            {producto.unidades}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-gray-100 pt-1">
          <span className="flex items-center gap-1 text-[10px] text-gray-400">
            <span className="text-green-400">
              <IconLeaf />
            </span>
            Men.
          </span>
          {tieneMenudencia ? (
            <span className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                className="w-2.5 h-2.5 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </span>
          ) : (
            <span className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg
                className="w-2.5 h-2.5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </span>
          )}
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

  const defaultAccion: SolicitudAcciones = {
    entregado: false,
    metodoCobro: null,
    canastosCount: 0,
    canastosConfirmados: false,
  };

  const toggle = (id: string) =>
    setExpandedClients((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const update = (id: string, patch: Partial<SolicitudAcciones>) =>
    setAcciones((prev) => ({
      ...prev,
      [id]: { ...defaultAccion, ...prev[id], ...patch },
    }));

  const handleEntregar = async (id: string) => {
    try {
      await entregarSolicitud(Number(id));
      update(id, { entregado: true });
    } catch {
      // error manejado en el servicio
    }
  };

  return (
    <div className="space-y-3">
      {solicitudes.map((sol) => {
        const isExpanded = expandedClients.includes(sol.id);
        const acc = acciones[sol.id] ?? {
          entregado: false,
          metodoCobro: null,
          canastosCount: 0,
          canastosConfirmados: false,
        };

        const metodoLabel =
          metodosCobroOptions.find((o) => o.value === acc.metodoCobro)?.label ??
          null;
        const productosConDatos = sol.productos.filter(
          (p) => p.cajas > 0 || p.unidades > 0,
        );

        return (
          <Card key={sol.id} className="shadow-sm">
            {/* ── Header ── */}
            <CardHeader className="p-0">
              <button
                onClick={() => toggle(sol.id)}
                className="w-full px-2 py-2 flex items-center gap-3 hover:bg-gray-50 active:bg-gray-100 transition-colors rounded-t-xl text-left"
              >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <User16Icon size={20} className="text-gray-500" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-md leading-tight truncate">
                    {sol.cliente}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-xs text-gray-400">#{sol.id}</span>
                    {sol.proveedor && (
                      <span className="text-[12px] font-medium text-blue-600 bg-blue-50 rounded-full px-1.5 py-0.5 leading-tight">
                        {sol.proveedor}
                      </span>
                    )}
                    {sol.ruta && (
                      <span className="text-[12px] font-medium text-purple-600 bg-purple-50 rounded-full px-1.5 py-0.5 leading-tight truncate max-w-30">
                        {sol.ruta}
                      </span>
                    )}
                    {sol.requestStateName && (
                      <Chip
                        variant="flat"
                        color={sol.requestStateName === "ENTREGADO" ? "success" : "warning"}
                        size="sm"
                        radius="full"
                      >
                        {sol.requestStateName}
                      </Chip>
                    )}
                  </div>
                </div>

                {/* Monto + estado + chevron */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="font-bold text-gray-900 text-sm">
                    Bs {sol.totalACobrar.toFixed(2)}
                  </span>
                  <div className="flex items-center gap-2">
                    {sol.paymentTypeName && (
                      <Chip
                        variant="flat"
                        color={sol.paymentTypeName === "No Pagado" ? "warning" : "success"}
                        size="sm"
                        radius="full"
                      >
                        {sol.paymentTypeName}
                      </Chip>
                    )}
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
                      <ProductoCard key={p.nombre} producto={p} />
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
                        onClick={() => handleEntregar(sol.id)}
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
                          selectedValues={
                            acc.metodoCobro ? [acc.metodoCobro] : []
                          }
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
                        onClick={() =>
                          update(sol.id, { canastosConfirmados: false })
                        }
                        className="flex-1 h-11 bg-green-500 text-white rounded-xl font-semibold text-sm flex items-center justify-between px-4 hover:bg-green-600 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <CheckIcon />
                          Canastos devueltos: {acc.canastosCount}
                        </span>
                        <span className="text-xs text-green-100 underline">
                          editar
                        </span>
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
                              canastosCount: Math.max(
                                0,
                                Number(e.target.value),
                              ),
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
                          onClick={() =>
                            update(sol.id, { canastosConfirmados: true })
                          }
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
