"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/InputField";
import { Checkbox } from "@/components/ui/Checkbox";
import { Card } from "@/components/ui/Card";
import CardCode from "@/components/ui/CardCode";
import { useContainer } from "../../configuraciones/hooks/contenedores/useContainer";

interface ProductReception {
  codigo: string;
  cajas: number;
  unidades: number;
  kgBruto: number;
  kgNeto: number;
  kgRecibidos: number;
}

export interface PesajeData {
  id: string;
  cajas: number;
  unidades: number;
  kg: number;
  contenedor?: string;
  guardado?: boolean;
}

interface BoletaDetail {
  cajas: number;
  unidades: number;
  precio?: string;
  pesajes?: PesajeData[];
  kgBruto?: number;
  kgNeto?: number;
  productAssignmentId?: string;
}

interface Boleta {
  id: string;
  ticketId?: string;
  assignmentStageId?: number;
  flujoCompletado?: boolean;
  hasPendingChanges?: boolean;
  codigo: string;
  costoPorKg: string;
  costoTotal: string;
  precioDiferido: boolean;
  codigosSeleccionados: string[];
  menudencias: string[];
  detalles: Record<string, BoletaDetail>;
}

interface ReceptionTicketsProps {
  productos: ProductReception[];
  boletas: Boleta[];
  pesoTotalGeneral: string;
  isRecibir?: string;
  onAgregarBoleta: () => void;
  onEliminarBoleta: (boletaId: string) => void;
  onUpdateBoleta: (
    boletaId: string,
    field: keyof Boleta,
    value: string | boolean | string[] | Record<string, BoletaDetail>,
  ) => void;
  onToggleCodigoEnBoleta: (boletaId: string, codigo: string) => void;
  onToggleMenudenciaEnBoleta: (boletaId: string, codigo: string) => void;
  onUpdateCantidadBoleta: (
    boletaId: string,
    codigo: string,
    field: "cajas" | "unidades" | "precio",
    value: number | string,
  ) => void;
  onUpdateTipoContenedorBoleta: (
    boletaId: string,
    codigo: string,
    tipo: "caja" | "pallet" | "contenedor",
  ) => void;
  onAgregarPesaje: (boletaId: string, codigo: string) => void;
  onUpdatePesaje: (
    boletaId: string,
    codigo: string,
    pesajeId: string,
    field: "cajas" | "unidades" | "kg" | "contenedor",
    value: number | string,
  ) => void;
  onRemovePesaje: (
    boletaId: string,
    codigo: string,
    pesajeId: string,
  ) => void | Promise<void>;
  onGuardarPesaje: (
    boletaId: string,
    codigo: string,
    pesajeId: string,
  ) => void | Promise<void>;
  onGuardarBoleta: (boletaId: string) => void;
  onCompletarFlujoBoleta: (boletaId: string) => void | Promise<void>;
}

export default function ReceptionTickets({
  productos,
  boletas,
  pesoTotalGeneral,
  isRecibir,
  onAgregarBoleta,
  onEliminarBoleta,
  onUpdateBoleta,
  onToggleCodigoEnBoleta,
  // onToggleMenudenciaEnBoleta,
  onUpdateCantidadBoleta,
  // onUpdateTipoContenedorBoleta,
  onAgregarPesaje,
  onUpdatePesaje,
  onRemovePesaje,
  onGuardarPesaje,
  onGuardarBoleta,
  onCompletarFlujoBoleta,
}: ReceptionTicketsProps) {
  const { containers, containersData } = useContainer();
  const readOnly = isRecibir === "true";
  const [savingBoletas, setSavingBoletas] = useState<Set<string>>(new Set());
  const [completingBoletas, setCompletingBoletas] = useState<Set<string>>(
    new Set(),
  );
  const [savingPesajes, setSavingPesajes] = useState<Set<string>>(new Set());
  const [expandedSavedBoletas, setExpandedSavedBoletas] = useState<Set<string>>(
    new Set(),
  );

  const getPesajeSaveKey = (
    boletaId: string,
    codigo: string,
    pesajeId: string,
  ) => `${boletaId}-${codigo}-${pesajeId}`;

  const handleGuardarBoleta = async (boletaId: string) => {
    if (savingBoletas.has(boletaId)) return;

    setSavingBoletas((prev) => {
      const next = new Set(prev);
      next.add(boletaId);
      return next;
    });

    try {
      await Promise.resolve(onGuardarBoleta(boletaId));
    } finally {
      setSavingBoletas((prev) => {
        const next = new Set(prev);
        next.delete(boletaId);
        return next;
      });
    }
  };

  const toggleSavedBoleta = (boletaId: string) => {
    setExpandedSavedBoletas((prev) => {
      const next = new Set(prev);
      if (next.has(boletaId)) {
        next.delete(boletaId);
      } else {
        next.add(boletaId);
      }
      return next;
    });
  };

  const handleCompletarFlujoBoleta = async (boletaId: string) => {
    if (completingBoletas.has(boletaId)) return;

    setCompletingBoletas((prev) => {
      const next = new Set(prev);
      next.add(boletaId);
      return next;
    });

    try {
      await Promise.resolve(onCompletarFlujoBoleta(boletaId));
    } finally {
      setCompletingBoletas((prev) => {
        const next = new Set(prev);
        next.delete(boletaId);
        return next;
      });
    }
  };

  const handleGuardarPesaje = async (
    boletaId: string,
    codigo: string,
    pesajeId: string,
  ) => {
    const saveKey = getPesajeSaveKey(boletaId, codigo, pesajeId);
    if (savingPesajes.has(saveKey)) return;

    setSavingPesajes((prev) => {
      const next = new Set(prev);
      next.add(saveKey);
      return next;
    });

    try {
      await Promise.resolve(onGuardarPesaje(boletaId, codigo, pesajeId));
    } finally {
      setSavingPesajes((prev) => {
        const next = new Set(prev);
        next.delete(saveKey);
        return next;
      });
    }
  };

  // Función para calcular el total_payment en tiempo real
  const calculateTotalPayment = (boleta: Boleta): number => {
    let totalPayment = 0;

    if (!boleta.precioDiferido) {
      // Precio NO diferido: total_payment = costoPorKg * suma de net_weight
      const costoPorKg = Number(boleta.costoPorKg) || 0;
      let totalNetWeight = 0;

      for (const codigo of boleta.codigosSeleccionados) {
        const detalle = boleta.detalles[codigo];
        if (detalle?.pesajes) {
          for (const pesaje of detalle.pesajes) {
            // Calcular net_weight de cada pesaje
            const selectedContainer = containersData?.find(
              (container) => container.id.toString() === pesaje.contenedor,
            );
            const destare = selectedContainer?.destare || 0;
            const grossWeight = Number(pesaje.kg) || 0;
            const cantidadCajas = Number(pesaje.cajas) || 0;
            const netWeight = grossWeight - destare * cantidadCajas;
            totalNetWeight += netWeight;
          }
        }
      }

      totalPayment = costoPorKg * totalNetWeight;
    } else {
      // Precio diferido: total_payment = suma de (precio_producto * net_weight_producto)
      for (const codigo of boleta.codigosSeleccionados) {
        const detalle = boleta.detalles[codigo];
        if (detalle?.pesajes) {
          const precioProducto = Number(detalle.precio) || 0;
          let netWeightProducto = 0;

          for (const pesaje of detalle.pesajes) {
            // Calcular net_weight de cada pesaje
            const selectedContainer = containersData?.find(
              (container) => container.id.toString() === pesaje.contenedor,
            );
            const destare = selectedContainer?.destare || 0;
            const grossWeight = Number(pesaje.kg) || 0;
            const cantidadCajas = Number(pesaje.cajas) || 0;
            const netWeight = grossWeight - destare * cantidadCajas;
            netWeightProducto += netWeight;
          }

          totalPayment += precioProducto * netWeightProducto;
        }
      }
    }

    return Math.round(totalPayment * 100) / 100; // Redondear a 2 decimales
  };

  const calculateBoletaTotals = (boleta: Boleta) => {
    return boleta.codigosSeleccionados.reduce(
      (acc, codigo) => {
        const detalle = boleta.detalles[codigo];
        acc.totalCajas += Number(detalle?.cajas) || 0;
        acc.totalUnidades += Number(detalle?.unidades) || 0;
        return acc;
      },
      { totalCajas: 0, totalUnidades: 0 },
    );
  };

  return (
    <Card className="p-4 md:p-6 mt-4">
      {/* Boletas de Recepción */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-md font-bold text-gray-900">
            Boletas de Recepción
          </h2>
          {!readOnly && (
            <Button
              variant="primary"
              color="danger"
              leftIcon={<span>+</span>}
              onClick={onAgregarBoleta}
            >
              Agregar Boleta
            </Button>
          )}
        </div>

        <div className="space-y-6">
          {boletas.map((boleta, index) => (
            <div
              key={boleta.id}
              className="border border-gray-200 rounded-lg p-4 bg-gray-50"
            >
              {(() => {
                const isSaved = Boolean(boleta.ticketId);
                const isExpanded =
                  !isSaved || expandedSavedBoletas.has(boleta.id);
                const { totalCajas, totalUnidades } =
                  calculateBoletaTotals(boleta);

                return (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-4 py-2">
                          <h3 className="text-md font-bold tracking-tight text-red-500 uppercase">
                            Boleta{" "}
                            <span className="text-red-500 ml-1">
                              #{index + 1}
                            </span>
                          </h3>

                          <div className="flex items-center gap-3 text-red-500">
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-[12px] font-medium uppercase tracking-wider text-slate-500">
                                Cajas
                              </span>
                              <span className="text-sm font-semibold text-slate-800">
                                {totalCajas}
                              </span>
                            </div>

                            {/* Separador tipo punto (bullet) más discreto que una línea vertical */}
                            <span className="h-1 w-1 rounded-full bg-slate-300" />

                            <div className="flex items-baseline gap-1.5">
                              <span className="text-[12px] font-medium uppercase tracking-wider text-slate-500">
                                Unidades
                              </span>
                              <span className="text-sm font-semibold text-slate-800">
                                {totalUnidades}
                              </span>
                            </div>
                          </div>
                        </div>
                        {isSaved && (
                          <p className="text-xs text-gray-600">
                            Guardada - Codigo: {boleta.codigo || "Sin codigo"} -
                            Costo: Bs {calculateTotalPayment(boleta).toFixed(2)}
                          </p>
                        )}
                        {isSaved &&
                          boleta.flujoCompletado &&
                          boleta.hasPendingChanges && (
                            <p className="text-xs text-amber-700 mt-1">
                              Hay cambios pendientes en ticket o productos.
                            </p>
                          )}
                      </div>

                      {isSaved ? (
                        <div className="flex gap-2">
                          {!readOnly && (
                            <Button
                              variant={
                                boleta.flujoCompletado &&
                                boleta.hasPendingChanges
                                  ? "outline"
                                  : "success"
                              }
                              color={
                                boleta.flujoCompletado &&
                                boleta.hasPendingChanges
                                  ? "warning"
                                  : "success"
                              }
                              size="sm"
                              loading={completingBoletas.has(boleta.id)}
                              disabled={
                                completingBoletas.has(boleta.id) ||
                                Boolean(
                                  boleta.flujoCompletado &&
                                    !boleta.hasPendingChanges,
                                )
                              }
                              onClick={() =>
                                handleCompletarFlujoBoleta(boleta.id)
                              }
                            >
                              {boleta.flujoCompletado
                                ? boleta.hasPendingChanges
                                  ? "Editar"
                                  : "Flujo Completado"
                                : "Completar Flujo"}
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleSavedBoleta(boleta.id)}
                          >
                            {isExpanded ? "Ocultar detalle" : "Ver detalle"}
                          </Button>
                        </div>
                      ) : !readOnly ? (
                        <div className="flex gap-2">
                          <Button
                            variant="success"
                            color="success"
                            size="sm"
                            loading={savingBoletas.has(boleta.id)}
                            disabled={savingBoletas.has(boleta.id)}
                            onClick={() => handleGuardarBoleta(boleta.id)}
                          >
                            Guardar Boleta
                          </Button>
                          <Button
                            variant="danger"
                            color="danger"
                            size="sm"
                            onClick={() => onEliminarBoleta(boleta.id)}
                          >
                            Eliminar Boleta
                          </Button>
                        </div>
                      ) : null}
                    </div>

                    {isExpanded && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <span className="text-xs font-bold text-gray-500 uppercase block mb-1">
                              CÓDIGO DE BOLETA
                            </span>
                            <InputField
                              placeholder="Ingrese código"
                              value={boleta.codigo}
                              disabled={readOnly}
                              onChange={(e) =>
                                onUpdateBoleta(
                                  boleta.id,
                                  "codigo",
                                  e.target.value,
                                )
                              }
                            />
                          </div>

                          <div>
                            <span className="text-xs font-bold text-gray-500 uppercase block mb-1">
                              COSTO POR KG (Bs)
                            </span>
                            <InputField
                              value={boleta.costoPorKg}
                              disabled={boleta.precioDiferido || readOnly}
                              onChange={(e) =>
                                onUpdateBoleta(
                                  boleta.id,
                                  "costoPorKg",
                                  e.target.value,
                                )
                              }
                            />
                          </div>

                          <div>
                            <span className="text-xs font-bold text-gray-500 uppercase block mb-1">
                              COSTO DE ESTA BOLETA
                            </span>
                            <div className="text-2xl font-bold text-red-500">
                              Bs {calculateTotalPayment(boleta).toFixed(2)}
                            </div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <Checkbox
                            label="Precio diferido"
                            checked={boleta.precioDiferido}
                            disabled={readOnly}
                            onChange={(checked) =>
                              onUpdateBoleta(
                                boleta.id,
                                "precioDiferido",
                                checked,
                              )
                            }
                          />
                        </div>

                        {/* Códigos en esta Boleta */}
                        <div className="mb-4">
                          <h4 className="text-sm font-bold text-gray-600 uppercase mb-3">
                            Códigos en esta Boleta
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
                            {productos.map((producto) => {
                              const isSelected =
                                boleta.codigosSeleccionados.includes(
                                  producto.codigo,
                                );
                              // const isMenudencia = boleta.menudencias?.includes(
                              //   producto.codigo,
                              // );

                              const detalle = boleta.detalles?.[
                                producto.codigo
                              ] || {
                                cajas: 0,
                                unidades: 0,
                              };

                              const totalPesajeCajas = (
                                detalle.pesajes || []
                              ).reduce(
                                (sum, pesaje) =>
                                  sum + (Number(pesaje.cajas) || 0),
                                0,
                              );
                              const totalPesajeUnidades = (
                                detalle.pesajes || []
                              ).reduce(
                                (sum, pesaje) =>
                                  sum + (Number(pesaje.unidades) || 0),
                                0,
                              );

                              const totalPesajeKgBruto = (
                                detalle.pesajes || []
                              ).reduce(
                                (sum, pesaje) => sum + (Number(pesaje.kg) || 0),
                                0,
                              );

                              const totalPesajeKgNeto = (
                                detalle.pesajes || []
                              ).reduce((sum, pesaje) => {
                                const selectedContainer = containersData?.find(
                                  (container) =>
                                    container.id.toString() ===
                                    pesaje.contenedor,
                                );
                                const destare = selectedContainer?.destare || 0;
                                const grossWeight = Number(pesaje.kg) || 0;
                                const cantidadCajas = Number(pesaje.cajas) || 0;
                                const netWeight =
                                  grossWeight - destare * cantidadCajas;
                                return sum + netWeight;
                              }, 0);

                              const kgBrutoRealtime =
                                (detalle.pesajes?.length || 0) > 0
                                  ? totalPesajeKgBruto
                                  : Number(detalle.kgBruto) || 0;

                              const kgNetoRealtime =
                                (detalle.pesajes?.length || 0) > 0
                                  ? totalPesajeKgNeto
                                  : Number(detalle.kgNeto) || 0;

                              const limiteCajas = Number(detalle.cajas) || 0;
                              const limiteUnidades =
                                Number(detalle.unidades) || 0;

                              const excesoCajas = Math.max(
                                0,
                                totalPesajeCajas - limiteCajas,
                              );
                              const excesoUnidades = Math.max(
                                0,
                                totalPesajeUnidades - limiteUnidades,
                              );

                              const cajasExcedidas = excesoCajas > 0;
                              const unidadesExcedidas = excesoUnidades > 0;

                              return (
                                <div
                                  key={producto.codigo}
                                  className="relative h-full"
                                >
                                  {isSelected ? (
                                    <div className="h-full">
                                      <CardCode
                                        label={
                                          <div className="flex items-center justify-center gap-2">
                                            <Checkbox
                                              checked={true}
                                              disabled={readOnly}
                                              onChange={() =>
                                                onToggleCodigoEnBoleta(
                                                  boleta.id,
                                                  producto.codigo,
                                                )
                                              }
                                              label={`Código ${producto.codigo}`}
                                            />
                                          </div>
                                        }
                                        cajas={detalle.cajas}
                                        unidades={detalle.unidades}
                                        readOnly={readOnly}
                                        onCajasChange={(val) =>
                                          onUpdateCantidadBoleta(
                                            boleta.id,
                                            producto.codigo,
                                            "cajas",
                                            val === "" ? 0 : Number(val),
                                          )
                                        }
                                        onUnidadesChange={(val) =>
                                          onUpdateCantidadBoleta(
                                            boleta.id,
                                            producto.codigo,
                                            "unidades",
                                            val === "" ? 0 : Number(val),
                                          )
                                        }
                                        showPrecio={boleta.precioDiferido}
                                        precio={detalle.precio || ""}
                                        onPrecioChange={(val) =>
                                          onUpdateCantidadBoleta(
                                            boleta.id,
                                            producto.codigo,
                                            "precio",
                                            val,
                                          )
                                        }
                                        productName={producto.codigo}
                                        variant="active"
                                        // Don't pass menudencia props to hide the checkbox at bottom
                                        weightInfo={{
                                          bruto: `${kgBrutoRealtime.toFixed(2)}`,
                                          neto: `${kgNetoRealtime.toFixed(2)}`,
                                          adicional:
                                            cajasExcedidas || unidadesExcedidas
                                              ? [
                                                  {
                                                    label: "Exceso cajas:",
                                                    value: `${excesoCajas}`,
                                                    color: "danger",
                                                  },
                                                  {
                                                    label: "Exceso unid:",
                                                    value: `${excesoUnidades}`,
                                                    color: "danger",
                                                  },
                                                ]
                                              : undefined,
                                        }}
                                        className="pointer-events-auto h-full"
                                        cajasExcedidas={cajasExcedidas}
                                        unidadesExcedidas={unidadesExcedidas}
                                        pesajes={detalle.pesajes}
                                        onAgregarPesaje={() =>
                                          onAgregarPesaje(
                                            boleta.id,
                                            producto.codigo,
                                          )
                                        }
                                        disableAgregarPesaje={!isSaved || readOnly}
                                        onUpdatePesaje={
                                          readOnly
                                            ? undefined
                                            : (pesajeId, field, value) =>
                                                onUpdatePesaje(
                                                  boleta.id,
                                                  producto.codigo,
                                                  pesajeId,
                                                  field,
                                                  value,
                                                )
                                        }
                                        onRemovePesaje={
                                          readOnly
                                            ? undefined
                                            : (pesajeId) =>
                                                onRemovePesaje(
                                                  boleta.id,
                                                  producto.codigo,
                                                  pesajeId,
                                                )
                                        }
                                        onGuardarPesaje={
                                          readOnly
                                            ? undefined
                                            : (pesajeId) =>
                                                handleGuardarPesaje(
                                                  boleta.id,
                                                  producto.codigo,
                                                  pesajeId,
                                                )
                                        }
                                        isSavingPesaje={(pesajeId) =>
                                          savingPesajes.has(
                                            getPesajeSaveKey(
                                              boleta.id,
                                              producto.codigo,
                                              pesajeId,
                                            ),
                                          )
                                        }
                                        containers={containers}
                                      />
                                    </div>
                                  ) : (
                                    <div className="border border-gray-200 rounded-lg p-3 bg-white flex items-center gap-3 h-full">
                                      <div>
                                        <Checkbox
                                          checked={false}
                                          disabled={readOnly}
                                          onChange={() =>
                                            onToggleCodigoEnBoleta(
                                              boleta.id,
                                              producto.codigo,
                                            )
                                          }
                                          label={`Código ${producto.codigo}`}
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    )}
                  </>
                );
              })()}
            </div>
          ))}
        </div>
      </div>

      {/* Peso Total General */}
      <div className="text-left">
        <span className="text-lg font-bold text-red-500">
          Peso Total General: {pesoTotalGeneral} kg
        </span>
      </div>
    </Card>
  );
}
