"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Select, SelectOption } from "@/components/ui/SelecMultipe";
import { ArrowDownBoldIcon } from "@/components/icons/ArrowDownBold";
import { User16Icon } from "@/components/icons/User16Icon";
import { entregarSolicitud } from "@/app/(chofer)/chofer/service/entregarSolicitud";
import { useGetPaymentType } from "@/app/(chofer)/chofer/hooks/useGetPaymentType";
import { useUpdateRequestPaymentType } from "@/app/(chofer)/chofer/hooks/useUpdateRequestPaymentType";
import { useAddContainerMovements } from "@/app/(operador)/asignaciones/hooks/repartir/useAddContainerMovements";
import { useContainer } from "@/app/(operador)/configuraciones/hooks/contenedores/useContainer";
import CardCode from "@/components/ui/CardCode";
import ModalCanastos from "./ModalCanastos";

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
  clientId: number;
  providerId: number;
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
  canastosConfirmados: boolean;
  canastosDevueltos: Record<string, number>;
}

/* ─────────────── Constantes ─────────────── */

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

function ProductoCard({ producto }: { producto: Producto }) {
  const tieneMenudencia =
    producto.menudencia === "true" || producto.menudencia === "1";
  return (
    <div className="shrink-0 w-20 snap-start">
      <CardCode
        label={producto.nombre}
        cajas={producto.cajas}
        unidades={producto.unidades}
        menudencia={tieneMenudencia}
        readOnly
      />
    </div>
  );
}

/* ─────────────── Componente principal ─────────────── */

export default function ClientesList({ solicitudes }: ClientesListProps) {
  const { data: paymentTypes } = useGetPaymentType();
  const { addPaymentType } = useUpdateRequestPaymentType();
  const { addContainerMovements } = useAddContainerMovements();
  const { containers } = useContainer();
  const [savingCanastos, setSavingCanastos] = useState<string | null>(null);
  const [modalOpenSolicitudId, setModalOpenSolicitudId] = useState<
    string | null
  >(null);
  const [modalContainerQuantities, setModalContainerQuantities] = useState<
    Record<string, number>
  >({});
  const metodosCobroOptions: SelectOption[] = paymentTypes.map((pt) => ({
    value: String(pt.id),
    label: pt.name,
  }));
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
          canastosConfirmados: false,
          canastosDevueltos: {},
        },
      ]),
    ),
  );

  const defaultAccion: SolicitudAcciones = {
    entregado: false,
    metodoCobro: null,
    canastosConfirmados: false,
    canastosDevueltos: {},
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

  const handleAbrirModalCanastos = (solicitudId: string) => {
    setModalOpenSolicitudId(solicitudId);
    const acc = acciones[solicitudId];
    setModalContainerQuantities({ ...(acc?.canastosDevueltos || {}) });
  };

  const handleConfirmarDevolucionCanastos = async () => {
    if (!modalOpenSolicitudId) return;

    const containeresAEnviar = Object.entries(modalContainerQuantities).filter(
      ([, qty]) => qty > 0,
    );

    if (containeresAEnviar.length === 0) {
      alert("Ingrese una cantidad mayor a 0 para al menos un contenedor");
      return;
    }

    setSavingCanastos(modalOpenSolicitudId);
    try {
      const solicitud = solicitudes.find(
        (item) => item.id === modalOpenSolicitudId,
      );
      if (!solicitud) {
        throw new Error("No se encontró la solicitud");
      }

      for (const [containerId, cantidad] of containeresAEnviar) {
        await addContainerMovements(
          Math.abs(cantidad),
          "true",
          Number(containerId),
          Number(modalOpenSolicitudId),
          solicitud.clientId,
          null,
          solicitud.providerId,
        );
      }

      update(modalOpenSolicitudId, {
        canastosConfirmados: true,
        canastosDevueltos: modalContainerQuantities,
      });

      setModalOpenSolicitudId(null);
      setModalContainerQuantities({});
    } catch (error) {
      alert(
        "Error al registrar devolución de canastos: " +
          (error instanceof Error ? error.message : "Error desconocido"),
      );
    } finally {
      setSavingCanastos(null);
    }
  };

  return (
    <div className="space-y-3">
      {solicitudes.map((sol) => {
        const isExpanded = expandedClients.includes(sol.id);
        const acc = acciones[sol.id] ?? {
          entregado: false,
          metodoCobro: null,
          canastosConfirmados: false,
          canastosDevueltos: {},
        };

        const metodoLabel =
          metodosCobroOptions.find((o) => o.value === acc.metodoCobro)?.label ??
          null;
        const displayStateName =
          acc.entregado || sol.requestStateName === "ENTREGADO"
            ? "ENTREGADO"
            : sol.requestStateName;
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
                    {displayStateName && (
                      <Chip
                        variant="flat"
                        color={
                          displayStateName === "ENTREGADO"
                            ? "success"
                            : "warning"
                        }
                        size="sm"
                        radius="full"
                      >
                        {displayStateName}
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
                    {(metodoLabel ?? sol.paymentTypeName) && (
                      <Chip
                        variant="flat"
                        color={
                          (metodoLabel ?? sol.paymentTypeName) === "No Pagado"
                            ? "warning"
                            : "success"
                        }
                        size="sm"
                        radius="full"
                      >
                        {metodoLabel ?? sol.paymentTypeName}
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
                    <StepCircle
                      done={
                        acc.entregado || sol.requestStateName === "ENTREGADO"
                      }
                      step={1}
                    />
                    {acc.entregado || sol.requestStateName === "ENTREGADO" ? (
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
                    <StepCircle
                      done={
                        !!acc.metodoCobro ||
                        sol.paymentTypeName === "Efectivo" ||
                        sol.paymentTypeName === "Qr"
                      }
                      step={2}
                    />
                    {acc.metodoCobro ||
                    sol.paymentTypeName === "Efectivo" ||
                    sol.paymentTypeName === "Qr" ? (
                      <button
                        onClick={() => update(sol.id, { metodoCobro: null })}
                        className="flex-1 h-11 bg-green-500 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-green-600 transition-colors"
                      >
                        <CheckIcon />
                        Pagado ({metodoLabel ?? sol.paymentTypeName})
                      </button>
                    ) : (
                      <div className="flex-1">
                        <Select
                          options={metodosCobroOptions}
                          selectedValues={
                            acc.metodoCobro ? [acc.metodoCobro] : []
                          }
                          onSelect={async (opt) => {
                            update(sol.id, { metodoCobro: opt.value });
                            try {
                              await addPaymentType(
                                Number(sol.id),
                                Number(opt.value),
                              );
                            } catch {
                              // revertir si falla
                              update(sol.id, { metodoCobro: acc.metodoCobro });
                            }
                          }}
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
                        // onClick={() => {
                        //   handleAbrirModalCanastos(sol.id);
                        // }}
                        className="flex-1 h-11 bg-green-500 text-white rounded-xl font-semibold text-sm flex items-center justify-between px-4 hover:bg-green-600 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <CheckIcon />
                          Canastos devueltos
                        </span>
                        {/* <span className="text-xs text-green-100 underline">
                          editar
                        </span> */}
                      </button>
                    ) : (
                      <Button
                        variant="primary"
                        size="md"
                        radius="lg"
                        fullWidth
                        className="h-11 text-sm"
                        disabled={savingCanastos === sol.id}
                        onClick={() => handleAbrirModalCanastos(sol.id)}
                      >
                        {savingCanastos === sol.id ? (
                          <span className="inline-block animate-spin">⏳</span>
                        ) : (
                          "Devolver Canastos"
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}

      <ModalCanastos
        isOpen={!!modalOpenSolicitudId}
        onClose={() => {
          setModalOpenSolicitudId(null);
          setModalContainerQuantities({});
        }}
        containers={containers}
        quantities={modalContainerQuantities}
        setQuantities={setModalContainerQuantities}
        onConfirm={handleConfirmarDevolucionCanastos}
        saving={savingCanastos === modalOpenSolicitudId}
      />
    </div>
  );
}
