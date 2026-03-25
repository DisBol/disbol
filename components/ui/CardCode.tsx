"use client";

import React from "react";
import * as Checkbox from "@radix-ui/react-checkbox";
import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import { BoxOutlineIcon } from "../icons/BoxOutlineIcon";
import { BalanceIcon } from "../icons/Balance";
import { Dropdown } from "./Dropdown";
import { useBalanza } from "@/hooks/useBalanza";

const cardCodeVariants = cva(
  "bg-white rounded-lg p-2 border border-gray-100 shadow-sm flex flex-col h-full transition-all hover:shadow-md",
  {
    variants: {
      variant: {
        default: "border-gray-100",
        active: "border-blue-200 ring-1 ring-blue-100",
        error: "border-red-200 bg-red-50/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface PesajeData {
  id: string;
  cajas: number;
  unidades: number;
  kg: number;
  contenedor?: string;
  guardado?: boolean;
}

export interface CardCodeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardCodeVariants> {
  label: React.ReactNode;
  cajas: string | number;
  unidades: string | number;
  onCajasChange?: (val: string) => void;
  onUnidadesChange?: (val: string) => void;
  // Optional productName for autocomplete rules
  productName?: string;
  // Optional Menudencia Checkbox
  menudencia?: boolean;
  onMenudenciaChange?: (checked: boolean) => void;
  // Optional Precio Field
  showPrecio?: boolean;
  precio?: string;
  onPrecioChange?: (val: string) => void;
  // Optional Weight Info Text
  weightInfo?: {
    bruto?: string;
    neto?: string;
    recibidos?: string;
    adicional?: Array<{
      label: string;
      value: string;
      color?: "default" | "success" | "danger" | "warning";
    }>;
  };
  // Optional containers config
  containers?: Array<{ value: string; label: string }>;
  // Optional differences info
  differences?: {
    cajas?: number;
    unidades?: number;
    kgBruto?: number;
    kgNeto?: number;
  };
  readOnly?: boolean;
  onRemove?: () => void;
  pesajes?: PesajeData[];
  onAgregarPesaje?: () => void;
  onUpdatePesaje?: (
    id: string,
    field: "cajas" | "unidades" | "kg" | "contenedor",
    value: number | string,
  ) => void;
  onRemovePesaje?: (id: string) => void;
  onGuardarPesaje?: (id: string) => void;
  isSavingPesaje?: (id: string) => boolean;
  // Visual indicators for exceeded values
  cajasExcedidas?: boolean;
  unidadesExcedidas?: boolean;
  // Disable the "Agregar Pesaje" button
  disableAgregarPesaje?: boolean;
  // Optional read-only comparison mode (e.g., Asignado vs Recibido)
  compareReadOnly?: {
    leftLabel?: string;
    rightLabel: string;
    rightCajas: string | number;
    rightUnidades: string | number;
  };
}

const CardCode = React.forwardRef<HTMLDivElement, CardCodeProps>(
  (
    {
      className,
      variant,
      label,
      cajas,
      unidades,
      onCajasChange,
      onUnidadesChange,
      productName,
      menudencia,
      onMenudenciaChange,
      showPrecio = false,
      precio = "0.00",
      onPrecioChange,
      weightInfo,
      differences,
      containers,
      readOnly = false,
      onRemove,
      pesajes,
      onAgregarPesaje,
      onUpdatePesaje,
      onRemovePesaje,
      onGuardarPesaje,
      isSavingPesaje,
      cajasExcedidas = false,
      unidadesExcedidas = false,
      disableAgregarPesaje = false,
      compareReadOnly,
      ...props
    },
    ref,
  ) => {
    const { connected: balanzaConnected, weight: balanzaWeight } = useBalanza();
    // ── Estado local para evitar que el re-render del padre pise lo que se escribe ──
    const toStr = (v: string | number) =>
      v === 0 || v === "" || v === "0" ? "" : String(v);

    const [inputCajas, setInputCajas] = React.useState<string>(() =>
      toStr(cajas),
    );
    const [inputUnidades, setInputUnidades] = React.useState<string>(() =>
      toStr(unidades),
    );

    // Sincroniza desde el padre SOLO cuando el valor cambia externamente
    // (ej: autocomplete desde el otro campo), sin crear bucles.
    React.useEffect(() => {
      const fromParent = parseFloat(String(cajas)) || 0;
      const fromLocal = parseFloat(inputCajas) || 0;
      if (fromParent !== fromLocal) {
        setInputCajas(fromParent === 0 ? "" : String(fromParent));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cajas]);

    React.useEffect(() => {
      const fromParent = parseFloat(String(unidades)) || 0;
      const fromLocal = parseFloat(inputUnidades) || 0;
      if (fromParent !== fromLocal) {
        setInputUnidades(fromParent === 0 ? "" : String(fromParent));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [unidades]);

    // ── Helpers para calcular el multiplicador según código de producto ──
    const getMultiplier = () => {
      const name = productName || (typeof label === "string" ? label : "");
      if (!name) return 0;
      if (name.includes("104") || name.includes("105")) return 15;
      if (
        name.includes("106") ||
        name.includes("107") ||
        name.includes("108") ||
        name.includes("109")
      )
        return 12;
      return 0;
    };

    const handleCajasInput = (val: string) => {
      setInputCajas(val); // muestra inmediatamente
      onCajasChange?.(val); // notifica al padre
      const multiplier = getMultiplier();
      if (multiplier > 0) {
        const valNum = val === "" ? 0 : parseFloat(val);
        const resultado = (valNum * multiplier).toString();
        setInputUnidades(valNum === 0 ? "" : resultado);
        onUnidadesChange?.(resultado);
      }
    };

    const handleUnidadesInput = (val: string) => {
      setInputUnidades(val); // muestra inmediatamente
      onUnidadesChange?.(val); // notifica al padre
      const multiplier = getMultiplier();
      if (multiplier > 0) {
        const valNum = val === "" ? 0 : parseFloat(val);
        const result = valNum / multiplier;
        const cajasCalc = Number.isInteger(result)
          ? result.toString()
          : Number(result.toFixed(2)).toString();
        setInputCajas(valNum === 0 ? "" : cajasCalc);
        onCajasChange?.(cajasCalc);
      }
    };

    return (
      <div
        ref={ref}
        className={clsx(cardCodeVariants({ variant }), className, "relative")}
        {...props}
      >
        {onRemove && !readOnly && (
          <button
            onClick={onRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 shadow-sm z-10"
            title="Eliminar producto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
        <h3 className="font-bold text-gray-900 text-[10px] mb-1 text-left tracking-tight">
          {label}
        </h3>

        <div className="space-y-1.5 flex-1">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase leading-none mb-0.5">
              CAJAS
            </label>
            {readOnly ? (
              compareReadOnly ? (
                <div className="grid grid-cols-2 gap-1">
                  <div>
                    <span className="block text-[8px] font-bold text-gray-400 uppercase text-center mb-0.5">
                      {compareReadOnly.leftLabel || "Asig."}
                    </span>
                    <div
                      className={`w-full px-1.5 py-0.5 border rounded text-xs font-medium text-center h-6 flex items-center justify-center ${
                        cajasExcedidas
                          ? "bg-red-50 border-red-300 text-red-700"
                          : "bg-white border-gray-200 text-gray-700"
                      }`}
                    >
                      {cajas}
                    </div>
                  </div>
                  <div>
                    <span className="block text-[8px] font-bold text-emerald-600 uppercase text-center mb-0.5">
                      {compareReadOnly.rightLabel}
                    </span>
                    <div className="w-full px-1.5 py-0.5 border rounded text-xs font-medium text-center h-6 flex items-center justify-center bg-emerald-50 border-emerald-200 text-emerald-700">
                      {compareReadOnly.rightCajas}
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className={`w-full px-1.5 py-0.5 border rounded text-xs font-medium text-center h-6 flex items-center justify-center ${
                    cajasExcedidas
                      ? "bg-red-50 border-red-300 text-red-700"
                      : "bg-white border-gray-200 text-gray-700"
                  }`}
                >
                  {cajas}
                </div>
              )
            ) : (
              <input
                type="number"
                min="0"
                value={inputCajas}
                onChange={(e) => handleCajasInput(e.target.value)}
                className="w-full px-1.5 py-0.5 bg-white border border-gray-300 rounded focus:border-blue-400 focus:outline-none text-xs text-gray-900 h-6 text-left transition-colors"
                placeholder="0"
              />
            )}
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase leading-none mb-0.5">
              UNID.
            </label>
            {readOnly ? (
              compareReadOnly ? (
                <div className="grid grid-cols-2 gap-1">
                  <div>
                    <span className="block text-[8px] font-bold text-gray-400 uppercase text-center mb-0.5">
                      {compareReadOnly.leftLabel || "Asig."}
                    </span>
                    <div
                      className={`w-full px-1.5 py-0.5 border rounded text-xs font-medium text-center h-6 flex items-center justify-center ${
                        unidadesExcedidas
                          ? "bg-red-50 border-red-300 text-red-700"
                          : "bg-white border-gray-200 text-gray-700"
                      }`}
                    >
                      {unidades}
                    </div>
                  </div>
                  <div>
                    <span className="block text-[8px] font-bold text-emerald-600 uppercase text-center mb-0.5">
                      {compareReadOnly.rightLabel}
                    </span>
                    <div className="w-full px-1.5 py-0.5 border rounded text-xs font-medium text-center h-6 flex items-center justify-center bg-emerald-50 border-emerald-200 text-emerald-700">
                      {compareReadOnly.rightUnidades}
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className={`w-full px-1.5 py-0.5 border rounded text-xs font-medium text-center h-6 flex items-center justify-center ${
                    unidadesExcedidas
                      ? "bg-red-50 border-red-300 text-red-700"
                      : "bg-white border-gray-200 text-gray-700"
                  }`}
                >
                  {unidades}
                </div>
              )
            ) : (
              <input
                type="number"
                min="0"
                value={inputUnidades}
                onChange={(e) => handleUnidadesInput(e.target.value)}
                className="w-full px-1.5 py-0.5 bg-white border border-gray-300 rounded focus:border-blue-400 focus:outline-none text-xs text-gray-900 h-6 text-left transition-colors"
                placeholder="0"
              />
            )}
          </div>

          {/* Campo Precio - Solo se muestra cuando showPrecio es true */}
          {showPrecio && (
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase leading-none mb-0.5">
                PRECIO
              </label>
              <input
                type="text"
                value={precio}
                onChange={(e) => onPrecioChange?.(e.target.value)}
                className="w-full px-1.5 py-0.5 bg-white border border-gray-300 rounded focus:border-blue-400 focus:outline-none text-xs text-gray-900 h-6 text-left transition-colors"
                placeholder="0.00"
              />
            </div>
          )}

          <div className="pt-1 mt-auto">
            {/* Menudencia Checkbox */}
            {onMenudenciaChange && !readOnly && (
              <div className="flex justify-center mb-1">
                <label className="flex items-center gap-1 cursor-pointer select-none group/checkbox justify-center">
                  <Checkbox.Root
                    checked={menudencia}
                    onCheckedChange={(checked) =>
                      onMenudenciaChange(checked === true)
                    }
                    className="w-3 h-3 rounded flex items-center justify-center bg-blue-500 border border-blue-500 data-[state=unchecked]:bg-white data-[state=unchecked]:border-gray-300 transition-colors"
                  >
                    <Checkbox.Indicator>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-2 h-2 text-white"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                  <span className="text-[10px] font-bold text-gray-400 uppercase group-hover/checkbox:text-gray-600 transition-colors">
                    MENUDENCIA
                  </span>
                </label>
              </div>
            )}

            {/* Menudencia Read Only */}
            {readOnly && menudencia !== undefined && (
              <div className="flex items-center justify-center gap-1 mb-1">
                <div
                  className={`w-2.5 h-2.5 rounded border flex items-center justify-center ${
                    menudencia
                      ? "bg-emerald-500 border-emerald-500"
                      : "border-red-500 bg-white"
                  }`}
                >
                  {menudencia && (
                    <svg
                      className="w-1.5 h-1.5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={4}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-[7px] font-bold text-gray-400 uppercase">
                  MENUDENCIA
                </span>
              </div>
            )}

            {/* Weight Info */}
            {weightInfo && (
              <div className="border-t border-gray-200 pt-1 text-center space-y-0.5">
                {weightInfo.bruto && (
                  <div className="text-[10px] text-gray-600 font-medium">
                    {weightInfo.bruto} kg Bruto
                  </div>
                )}
                {weightInfo.neto && (
                  <div className="text-[10px] text-gray-600 font-medium">
                    {weightInfo.neto} kg Neto
                  </div>
                )}
                {weightInfo.recibidos && (
                  <div className="text-[10px] text-emerald-600 font-bold">
                    {weightInfo.recibidos} kg Recibidos
                  </div>
                )}
                {weightInfo.adicional && (
                  <div className="space-y-0.5">
                    {weightInfo.adicional.map((info, index) => (
                      <div
                        key={index}
                        className={`text-[10px] font-medium ${
                          info.color === "success"
                            ? "text-emerald-600"
                            : info.color === "danger"
                              ? "text-red-600"
                              : info.color === "warning"
                                ? "text-yellow-600"
                                : "text-gray-600"
                        }`}
                      >
                        {info.label} {info.value}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Agregar Pesaje Button */}
            {onAgregarPesaje && (
              <div className="mt-2 w-full px-1">
                <button
                  type="button"
                  disabled={disableAgregarPesaje}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onAgregarPesaje();
                  }}
                  className={`w-full text-[9px] font-bold rounded py-1 px-2 transition-colors pointer-events-auto flex items-center justify-center gap-1 uppercase ${
                    disableAgregarPesaje
                      ? "text-gray-400 bg-gray-50 border border-gray-200 cursor-not-allowed opacity-50"
                      : "text-red-600 bg-white border border-red-200 hover:bg-red-50 hover:border-red-300"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                  </svg>
                  AGREGAR PESAJE
                </button>
              </div>
            )}

            {/* Pesajes List */}
            {pesajes && pesajes.length > 0 && (
              <div className="mt-2 space-y-2 px-1">
                {pesajes.map((pesaje, idx) => {
                  const pesajePersistido = /^\d+$/.test(String(pesaje.id));
                  const isSaving = Boolean(isSavingPesaje?.(pesaje.id));
                  const canSubmit = !pesaje.guardado && !isSaving;
                  const submitLabel = isSaving
                    ? "GUARDANDO..."
                    : pesaje.guardado
                      ? "GUARDADO"
                      : pesajePersistido
                        ? "EDITAR"
                        : "GUARDAR";

                  const limiteCajas = Number(cajas) || 0;
                  const limiteUnidades = Number(unidades) || 0;
                  const acumuladoHastaAqui = pesajes.slice(0, idx + 1).reduce(
                    (acc, p) => ({
                      cajas: acc.cajas + (Number(p.cajas) || 0),
                      unidades: acc.unidades + (Number(p.unidades) || 0),
                    }),
                    { cajas: 0, unidades: 0 },
                  );

                  const excesoCajas = Math.max(
                    0,
                    acumuladoHastaAqui.cajas - limiteCajas,
                  );
                  const excesoUnidades = Math.max(
                    0,
                    acumuladoHastaAqui.unidades - limiteUnidades,
                  );
                  const pesajeExcedido = excesoCajas > 0 || excesoUnidades > 0;

                  return (
                    <div
                      key={pesaje.id}
                      className={`border rounded p-1.5 relative bg-white shadow-sm pointer-events-auto ${
                        pesajeExcedido
                          ? "border-red-300 bg-red-50/30"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="mb-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-1 min-w-0">
                          <span className="text-[10px] font-bold text-gray-800">
                            Pesaje {idx + 1}:
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row w-full sm:w-auto sm:justify-end items-stretch sm:items-center gap-1">
                          {onGuardarPesaje && (
                            <button
                              type="button"
                              disabled={!canSubmit}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onGuardarPesaje(pesaje.id);
                              }}
                              className={`w-full sm:w-auto text-[9px] font-bold px-2 py-1 rounded border ${
                                isSaving
                                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                  : pesaje.guardado
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 cursor-not-allowed"
                                    : pesajePersistido
                                      ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                                      : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                              }`}
                            >
                              {submitLabel}
                            </button>
                          )}
                          {onRemovePesaje && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onRemovePesaje(pesaje.id);
                              }}
                              className="w-full sm:w-4 h-6 sm:h-4 rounded bg-red-500 hover:bg-red-600 flex justify-center items-center text-white"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-2 w-2"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>

                      {pesajeExcedido && (
                        <div className="mb-1 text-[10px] font-bold text-red-600">
                          Excedente: +{excesoCajas} cajas, +{excesoUnidades}{" "}
                          unid.
                        </div>
                      )}

                      <div className="space-y-1">
                        <div className="flex gap-1 items-end">
                          <div className="flex-1">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase leading-none mb-0.5">
                              CAJAS
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={pesaje.cajas || ""}
                              onChange={(e) =>
                                onUpdatePesaje?.(
                                  pesaje.id,
                                  "cajas",
                                  e.target.value === ""
                                    ? 0
                                    : Number(e.target.value),
                                )
                              }
                              className="w-full px-1 py-0.5 bg-white border border-gray-300 rounded focus:border-blue-400 focus:outline-none text-[10px] text-gray-900 h-5"
                            />
                          </div>
                        </div>
                        <div className="flex gap-1 items-end">
                          <div className="flex-1">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase leading-none mb-0.5">
                              UNID.
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={pesaje.unidades || ""}
                              onChange={(e) =>
                                onUpdatePesaje?.(
                                  pesaje.id,
                                  "unidades",
                                  e.target.value === ""
                                    ? 0
                                    : Number(e.target.value),
                                )
                              }
                              className="w-full px-1 py-0.5 bg-white border border-gray-300 rounded focus:border-blue-400 focus:outline-none text-[10px] text-gray-900 h-5"
                            />
                          </div>
                          <div className="flex items-center justify-center">
                            <Dropdown
                              value={pesaje.contenedor || "cajas"}
                              onChange={(e) =>
                                onUpdatePesaje?.(
                                  pesaje.id,
                                  "contenedor",
                                  e.target.value,
                                )
                              }
                              iconOnly={true}
                              icon={
                                <div className="flex items-center justify-center w-5 h-5 text-red-500 bg-white border border-gray-300 rounded hover:bg-red-50 transition-colors">
                                  <BoxOutlineIcon size={12} />
                                </div>
                              }
                            >
                              {containers && containers.length > 0 ? (
                                containers.map((c) => (
                                  <option key={c.value} value={c.value}>
                                    {c.label}
                                  </option>
                                ))
                              ) : (
                                <>
                                  <option value="cajas">Cajas</option>
                                  <option value="bolsas">Bolsas</option>
                                  <option value="jabitas">Jabitas</option>
                                  <option value="gavetas">Gavetas</option>
                                  <option value="unidades">Unidades</option>
                                </>
                              )}
                            </Dropdown>
                          </div>
                        </div>
                        <div className="flex gap-1 items-end">
                          <div className="flex-1">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase leading-none mb-0.5">
                              KG
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={pesaje.kg || ""}
                              onChange={(e) =>
                                onUpdatePesaje?.(
                                  pesaje.id,
                                  "kg",
                                  e.target.value === ""
                                    ? 0
                                    : Number(e.target.value),
                                )
                              }
                              className="w-full px-1 py-0.5 bg-white border border-gray-300 rounded focus:border-blue-400 focus:outline-none text-[10px] text-gray-900 h-5"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (balanzaConnected) {
                                onUpdatePesaje?.(
                                  pesaje.id,
                                  "kg",
                                  Number(balanzaWeight),
                                );
                              }
                            }}
                            disabled={!balanzaConnected}
                            className={`w-5 h-5 flex items-center justify-center border border-gray-300 rounded transition-all ${
                              balanzaConnected
                                ? "bg-white text-red-500 hover:bg-red-50 cursor-pointer"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                            title={
                              balanzaConnected
                                ? `Tomar peso: ${balanzaWeight} kg`
                                : "Balanza no conectada"
                            }
                          >
                            <BalanceIcon />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Differences Section */}
            {differences && (
              <div className="border-t border-gray-200 pt-1">
                <h5 className="text-[9px] font-bold text-gray-500 uppercase mb-1 text-center">
                  DIFERENCIA
                </h5>
                <div className="space-y-0.5 text-center">
                  {differences.cajas !== undefined && (
                    <div
                      className={`text-[10px] font-medium ${
                        differences.cajas === 0
                          ? "text-emerald-600"
                          : differences.cajas > 0
                            ? "text-emerald-600"
                            : "text-red-600"
                      }`}
                    >
                      {differences.cajas > 0 ? "+" : ""}
                      {differences.cajas} cajas
                    </div>
                  )}
                  {differences.unidades !== undefined && (
                    <div
                      className={`text-[10px] font-medium ${
                        differences.unidades === 0
                          ? "text-emerald-600"
                          : differences.unidades > 0
                            ? "text-emerald-600"
                            : "text-red-600"
                      }`}
                    >
                      {differences.unidades > 0 ? "+" : ""}
                      {differences.unidades} unid.
                    </div>
                  )}
                  {differences.kgBruto !== undefined && (
                    <div
                      className={`text-[10px] font-medium ${
                        differences.kgBruto === 0
                          ? "text-emerald-600"
                          : differences.kgBruto > 0
                            ? "text-emerald-600"
                            : "text-red-600"
                      }`}
                    >
                      {differences.kgBruto > 0 ? "+" : ""}
                      {differences.kgBruto.toFixed(2)} kg
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);

CardCode.displayName = "CardCode";

export default CardCode;
