"use client";

import React from "react";
import * as Checkbox from "@radix-ui/react-checkbox";
import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";

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

export interface CardCodeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardCodeVariants> {
  label: string;
  cajas: string | number;
  unidades: string | number;
  onCajasChange?: (val: string) => void;
  onUnidadesChange?: (val: string) => void;
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
  // Optional differences info
  differences?: {
    cajas?: number;
    unidades?: number;
    kgBruto?: number;
    kgNeto?: number;
  };
  readOnly?: boolean;
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
      menudencia,
      onMenudenciaChange,
      showPrecio = false,
      precio = "0.00",
      onPrecioChange,
      weightInfo,
      differences,
      readOnly = false,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={clsx(cardCodeVariants({ variant }), className)}
        {...props}
      >
        <h3 className="font-bold text-gray-900 text-xs mb-1 text-center">
          {label}
        </h3>

        <div className="space-y-1.5 flex-1">
          <div>
            <label className="block text-[9px] font-bold text-gray-400 uppercase leading-none mb-0.5">
              CAJAS
            </label>
            {readOnly ? (
              <div className="w-full px-1.5 py-0.5 bg-white border border-gray-200 rounded text-xs font-medium text-gray-700 text-center h-6 flex items-center justify-center">
                {cajas}
              </div>
            ) : (
              <input
                type="number"
                min="0"
                value={cajas}
                onChange={(e) => onCajasChange?.(e.target.value)}
                className="w-full px-1.5 py-0.5 bg-white border border-gray-300 rounded focus:border-blue-400 focus:outline-none text-xs text-gray-900 h-6 text-left transition-colors"
                placeholder="0"
              />
            )}
          </div>

          <div>
            <label className="block text-[9px] font-bold text-gray-400 uppercase leading-none mb-0.5">
              UNID.
            </label>
            {readOnly ? (
              <div className="w-full px-1.5 py-0.5 bg-white border border-gray-200 rounded text-xs font-medium text-gray-700 text-center h-6 flex items-center justify-center">
                {unidades}
              </div>
            ) : (
              <input
                type="number"
                min="0"
                value={unidades}
                onChange={(e) => onUnidadesChange?.(e.target.value)}
                className="w-full px-1.5 py-0.5 bg-white border border-gray-300 rounded focus:border-blue-400 focus:outline-none text-xs text-gray-900 h-6 text-left transition-colors"
                placeholder="0"
              />
            )}
          </div>

          {/* Campo Precio - Solo se muestra cuando showPrecio es true */}
          {showPrecio && (
            <div>
              <label className="block text-[9px] font-bold text-gray-400 uppercase leading-none mb-0.5">
                PRECIO
              </label>
              {readOnly ? (
                <div className="w-full px-1.5 py-0.5 bg-white border border-gray-200 rounded text-xs font-medium text-gray-700 text-center h-6 flex items-center justify-center">
                  {precio}
                </div>
              ) : (
                <input
                  type="text"
                  value={precio}
                  onChange={(e) => onPrecioChange?.(e.target.value)}
                  className="w-full px-1.5 py-0.5 bg-white border border-gray-300 rounded focus:border-blue-400 focus:outline-none text-xs text-gray-900 h-6 text-left transition-colors"
                  placeholder="0.00"
                />
              )}
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
                  <span className="text-[8px] font-bold text-gray-400 uppercase group-hover/checkbox:text-gray-600 transition-colors">
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
                  <div className="text-[9px] text-gray-600 font-medium">
                    {weightInfo.bruto} kg Bruto
                  </div>
                )}
                {weightInfo.neto && (
                  <div className="text-[9px] text-gray-600 font-medium">
                    {weightInfo.neto} kg Neto
                  </div>
                )}
                {weightInfo.recibidos && (
                  <div className="text-[9px] text-emerald-600 font-bold">
                    {weightInfo.recibidos} kg Recibidos
                  </div>
                )}
                {weightInfo.adicional && (
                  <div className="space-y-0.5">
                    {weightInfo.adicional.map((info, index) => (
                      <div
                        key={index}
                        className={`text-[9px] font-medium ${
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

            {/* Differences Section */}
            {differences && (
              <div className="border-t border-gray-200 pt-1">
                <h5 className="text-[9px] font-bold text-gray-500 uppercase mb-1 text-center">
                  DIFERENCIA
                </h5>
                <div className="space-y-0.5 text-center">
                  {differences.cajas !== undefined && (
                    <div
                      className={`text-[9px] font-medium ${
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
                      className={`text-[9px] font-medium ${
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
                      className={`text-[9px] font-medium ${
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
