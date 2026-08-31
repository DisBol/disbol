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
import { useGetRequestPaymentTypeByRequestId } from "@/app/(chofer)/chofer/hooks/useGetRequestPaymentTypeByRequestId";
import { useAddContainerMovements } from "@/app/(operador)/asignaciones/hooks/repartir/useAddContainerMovements";
import { useUpdateRequestStage } from "@/app/(operador)/asignaciones/hooks/repartir/useUpdateRequeststage";
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
  requestStageId: number;
  requestStagePosition: number;
  requestStateOutContainer: number;
  requestStateInContainer: number;
  productRequestActive: string;
  productRequestUnits: number;
  productRequestContainers: number;
  productos: Producto[];
}

interface ClientesListProps {
  solicitudes: Solicitud[];
}

interface SolicitudAcciones {
  entregado: boolean;
  metodoCobro: string | null;
  montoCobro: string;
  pagoConfirmado: boolean;
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

function SolicitudCard({
  sol,
  acc,
  metodosCobroOptions,
  toggle,
  update,
  handleEntregar,
  handleAbrirModalCanastos,
  savingCanastos,
  savingPaymentId,
  isExpanded,
  onConfirmarPago,
}: {
  sol: Solicitud;
  acc: SolicitudAcciones;
  metodosCobroOptions: SelectOption[];
  toggle: (id: string) => void;
  update: (id: string, patch: Partial<SolicitudAcciones>) => void;
  handleEntregar: (id: string) => Promise<void>;
  handleAbrirModalCanastos: (id: string) => void;
  savingCanastos: string | null;
  savingPaymentId: string | null;
  isExpanded: boolean;
  onConfirmarPago: (
    solicitudId: string,
    metodoCobro: string,
    monto: string,
  ) => Promise<void>;
}) {
  const { data: requestPayments = [], refetch: refetchPayments } =
    useGetRequestPaymentTypeByRequestId(Number(sol.id));
  const [showAddPaymentForm, setShowAddPaymentForm] = useState(false);

  const paymentRecordsActivos = requestPayments.filter(
    (payment) => payment.RequestPaymentType_active === "true",
  );
  const paymentReal = paymentRecordsActivos.filter(
    (payment) =>
      payment.PaymentType_name !== "No Pagado" &&
      payment.PaymentType_name !== "Deuda",
  );
  const paymentDeuda = paymentRecordsActivos.filter(
    (payment) => payment.PaymentType_name === "Deuda",
  );
  const totalPagado = paymentReal.reduce(
    (sum, payment) => sum + Number(payment.RequestPaymentType_amount ?? 0),
    0,
  );
  const totalDeuda = paymentDeuda.reduce(
    (sum, payment) => sum + Number(payment.RequestPaymentType_amount ?? 0),
    0,
  );

  const totalSolicitado = Number(sol.totalACobrar ?? 0);
  const montoCubierto = totalPagado >= totalSolicitado;
  const tienePago = totalPagado > 0;
  const tieneDeuda = totalDeuda > 0 || paymentDeuda.length > 0;

  const metodoLabel =
    paymentReal.length > 0 || paymentDeuda.length > 0
      ? [
          ...paymentReal.map((payment) => payment.PaymentType_name),
          ...(paymentDeuda.length > 0 ? ["Deuda"] : []),
        ].join(", ")
      : (metodosCobroOptions.find((o) => o.value === acc.metodoCobro)?.label ??
        sol.paymentTypeName ??
        null);

  const pagoConfirmado =
    montoCubierto ||
    paymentRecordsActivos.length > 0 ||
    acc.pagoConfirmado ||
    sol.paymentTypeName === "Efectivo" ||
    sol.paymentTypeName === "Qr";

  const paymentStatusLabel = montoCubierto
    ? "Pagado"
    : tieneDeuda
      ? tienePago
        ? "Pago parcial / Deuda"
        : "Deuda"
      : tienePago
        ? "Pagado"
        : null;

  const handleConfirmarPago = async (solicitudId: string) => {
    if (!acc.metodoCobro) return;

    const monto = Number(acc.montoCobro);
    if (!Number.isFinite(monto) || monto <= 0) {
      alert("Ingrese un monto válido mayor a 0");
      return;
    }

    await onConfirmarPago(solicitudId, acc.metodoCobro, acc.montoCobro);
    await refetchPayments();
    setShowAddPaymentForm(false);
  };

  const displayStateName =
    acc.entregado || sol.requestStateName === "ENTREGADO"
      ? "ENTREGADO"
      : sol.requestStateName;

  const productosConDatos = sol.productos.filter(
    (p) => p.cajas > 0 || p.unidades > 0,
  );

  return (
    <Card key={sol.id} className="shadow-sm">
      <CardHeader className="p-0">
        <button
          onClick={() => toggle(sol.id)}
          className="w-full px-2 py-2 flex items-center gap-3 hover:bg-gray-50 active:bg-gray-100 transition-colors rounded-t-xl text-left"
        >
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
            <User16Icon size={20} className="text-gray-500" />
          </div>

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
                    displayStateName === "ENTREGADO" ? "success" : "warning"
                  }
                  size="sm"
                  radius="full"
                >
                  {displayStateName}
                </Chip>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className="font-bold text-gray-900 text-sm">
              Bs {sol.totalACobrar.toFixed(2)}
            </span>
            <div className="flex items-center gap-2">
              {(metodoLabel ?? sol.paymentTypeName) && (
                <Chip
                  variant="flat"
                  color={
                    paymentStatusLabel === "Deuda" ||
                    paymentStatusLabel === "Pago parcial / Deuda"
                      ? "warning"
                      : "success"
                  }
                  size="sm"
                  radius="full"
                >
                  {paymentStatusLabel ?? metodoLabel ?? sol.paymentTypeName}
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

      {isExpanded && (
        <CardContent className="pt-3 px-4 pb-4 bg-gray-50 rounded-b-xl">
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

          <div className="space-y-2.5">
            <div className="flex items-center gap-3">
              <StepCircle
                done={acc.entregado || sol.requestStateName === "ENTREGADO"}
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

            <div className="flex items-center gap-3">
              <StepCircle done={pagoConfirmado} step={2} />
              {pagoConfirmado && !showAddPaymentForm ? (
                <div className="flex-1 space-y-2">
                  <div
                    className={`h-10 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 ${
                      paymentStatusLabel === "Deuda" ||
                      paymentStatusLabel === "Pago parcial / Deuda"
                        ? "bg-amber-500 text-white"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    <CheckIcon />
                    {paymentStatusLabel ?? "Pagado"}
                  </div>

                  {(paymentReal.length > 0 || paymentDeuda.length > 0) && (
                    <div className="flex flex-wrap gap-2">
                      {paymentReal.map((payment) => (
                        <span
                          key={`${payment.PaymentType_id}-${payment.RequestPaymentType_amount}`}
                          className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-[10px] font-medium text-gray-700 border border-gray-200"
                        >
                          {payment.PaymentType_name}
                          {Number(payment.RequestPaymentType_amount) > 0
                            ? ` · Bs ${Number(payment.RequestPaymentType_amount).toFixed(2)}`
                            : ""}
                        </span>
                      ))}
                      {paymentDeuda.map((payment) => (
                        <span
                          key={`${payment.PaymentType_id}-${payment.RequestPaymentType_amount}`}
                          className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-medium text-amber-700 border border-amber-200"
                        >
                          Deuda
                          {Number(payment.RequestPaymentType_amount) > 0
                            ? ` · Bs ${Number(payment.RequestPaymentType_amount).toFixed(2)}`
                            : ""}
                        </span>
                      ))}
                    </div>
                  )}

                  <Button
                    variant={tieneDeuda ? "warning" : "primary"}
                    size="sm"
                    radius="lg"
                    fullWidth
                    className="h-9 text-xs"
                    onClick={() => setShowAddPaymentForm(true)}
                  >
                    {tieneDeuda
                      ? "Agregar pago / cubrir deuda"
                      : "Agregar otro pago"}
                  </Button>
                </div>
              ) : (
                <div className="flex-1 space-y-2">
                  <Select
                    options={metodosCobroOptions}
                    selectedValues={acc.metodoCobro ? [acc.metodoCobro] : []}
                    onSelect={async (opt) => {
                      update(sol.id, {
                        metodoCobro: opt.value,
                        montoCobro: sol.totalACobrar.toFixed(2),
                        pagoConfirmado: false,
                      });
                    }}
                    placeholder="Seleccionar método de cobro..."
                    size="md"
                    radius="lg"
                    closeOnSelect
                  />

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      inputMode="decimal"
                      value={acc.montoCobro}
                      onChange={(event) =>
                        update(sol.id, { montoCobro: event.target.value })
                      }
                      placeholder="Monto"
                      className="flex-1 h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                    <Button
                      variant="primary"
                      size="sm"
                      radius="lg"
                      className="h-10 px-3 text-xs shrink-0"
                      disabled={
                        !acc.metodoCobro ||
                        !acc.montoCobro ||
                        savingPaymentId === sol.id
                      }
                      onClick={() => handleConfirmarPago(sol.id)}
                    >
                      {savingPaymentId === sol.id ? "Guardando..." : "Cobrar"}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <StepCircle done={acc.canastosConfirmados} step={3} />
              {acc.canastosConfirmados ? (
                <button className="flex-1 h-11 bg-green-500 text-white rounded-xl font-semibold text-sm flex items-center justify-between px-4 hover:bg-green-600 transition-colors">
                  <span className="flex items-center gap-2">
                    <CheckIcon />
                    Canastos devueltos
                  </span>
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
}

/* ─────────────── Componente principal ─────────────── */

export default function ClientesList({ solicitudes }: ClientesListProps) {
  const { data: paymentTypes } = useGetPaymentType();
  const { addPaymentType } = useUpdateRequestPaymentType();
  const { addContainerMovements } = useAddContainerMovements();
  const { updateRequestStage } = useUpdateRequestStage();
  const { containers } = useContainer();
  const [savingCanastos, setSavingCanastos] = useState<string | null>(null);
  const [savingPaymentId, setSavingPaymentId] = useState<string | null>(null);
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
          montoCobro: "",
          pagoConfirmado: false,
          canastosConfirmados: s.requestStateInContainer > 0,
          canastosDevueltos: {},
        },
      ]),
    ),
  );

  const defaultAccion: SolicitudAcciones = {
    entregado: false,
    metodoCobro: null,
    montoCobro: "",
    pagoConfirmado: false,
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

  const handleConfirmarPago = async (
    solicitudId: string,
    metodoCobro: string,
    montoCobro: string,
  ) => {
    const monto = Number(montoCobro);
    if (!Number.isFinite(monto) || monto <= 0) {
      alert("Ingrese un monto válido mayor a 0");
      return;
    }

    setSavingPaymentId(solicitudId);
    try {
      await addPaymentType(Number(solicitudId), Number(metodoCobro), monto);
      update(solicitudId, {
        metodoCobro: null,
        montoCobro: "",
        pagoConfirmado: true,
      });
    } catch {
      alert("No se pudo registrar el tipo de pago");
    } finally {
      setSavingPaymentId(null);
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

      // Registrar movimiento de contenedores (uno por uno)
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

      // Calcular el total consolidado de contenedores devueltos
      const totalContainersReturned = Object.values(
        modalContainerQuantities,
      ).reduce((sum, qty) => sum + qty, 0);

      // Actualizar el RequestStage con el total consolidado de contenedores
      await updateRequestStage(
        solicitud.requestStageId,
        solicitud.requestStagePosition,
        totalContainersReturned, // in_container: total consolidado
        solicitud.requestStateOutContainer,
        solicitud.productRequestUnits, // units
        solicitud.productRequestContainers, // container
        solicitud.totalACobrar,
        solicitud.productRequestActive,
        Number(modalOpenSolicitudId),
      );

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
          montoCobro: "",
          pagoConfirmado: false,
          canastosConfirmados: sol.requestStateInContainer > 0,
          canastosDevueltos: {},
        };

        return (
          <SolicitudCard
            key={sol.id}
            sol={sol}
            acc={acc}
            metodosCobroOptions={metodosCobroOptions}
            toggle={toggle}
            update={update}
            handleEntregar={handleEntregar}
            handleAbrirModalCanastos={handleAbrirModalCanastos}
            savingCanastos={savingCanastos}
            savingPaymentId={savingPaymentId}
            isExpanded={isExpanded}
            onConfirmarPago={handleConfirmarPago}
          />
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
