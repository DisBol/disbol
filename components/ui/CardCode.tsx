"use client";

import React from "react";
import * as Checkbox from "@radix-ui/react-checkbox";
import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";

const cardCodeVariants = cva(
  "bg-white rounded-lg p-3 border border-gray-100 shadow-sm flex flex-col h-full transition-all hover:shadow-md",
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
  // Optional Weight Info Text
  weightInfo?: {
    bruto: string;
    neto: string;
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
      weightInfo,
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
        <h3 className="font-bold text-gray-900 text-sm mb-2 text-center">
          {label}
        </h3>

        <div className="space-y-2 flex-1">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase leading-none mb-1">
              CAJAS
            </label>
            {readOnly ? (
              <div className="w-full px-2 py-1 bg-white border border-gray-200 rounded text-sm font-medium text-gray-700 text-center h-8 flex items-center justify-center">
                {cajas}
              </div>
            ) : (
              <input
                type="number"
                min="0"
                value={cajas}
                onChange={(e) => onCajasChange?.(e.target.value)}
                className="w-full px-2 py-1 bg-white border border-gray-300 rounded focus:border-blue-400 focus:outline-none text-sm text-gray-900 h-8 text-center transition-colors"
              />
            )}
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase leading-none mb-1">
              UNID.
            </label>
            {readOnly ? (
              <div className="w-full px-2 py-1 bg-white border border-gray-200 rounded text-sm font-medium text-gray-700 text-center h-8 flex items-center justify-center">
                {unidades}
              </div>
            ) : (
              <input
                type="number"
                min="0"
                value={unidades}
                onChange={(e) => onUnidadesChange?.(e.target.value)}
                className="w-full px-2 py-1 bg-white border border-gray-300 rounded focus:border-blue-400 focus:outline-none text-sm text-gray-900 h-8 text-center transition-colors"
              />
            )}
          </div>

          <div className="pt-2 mt-auto flex justify-center">
            {readOnly ? (
              <div className="flex items-center justify-center gap-1">
                <div
                  className={`w-3 h-3 rounded border flex items-center justify-center ${
                    menudencia
                      ? "bg-emerald-500 border-emerald-500"
                      : "border-red-500 bg-white"
                  }`}
                >
                  {menudencia && (
                    <svg
                      className="w-2 h-2 text-white"
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
                <span className="text-[8px] font-bold text-gray-400 uppercase">
                  MENUDENCIA
                </span>
              </div>
            ) : onMenudenciaChange ? (
              <label className="flex items-center gap-2 cursor-pointer select-none group/checkbox justify-center">
                <Checkbox.Root
                  checked={menudencia}
                  onCheckedChange={(checked) =>
                    onMenudenciaChange(checked === true)
                  }
                  className="w-4 h-4 rounded flex items-center justify-center bg-blue-500 border border-blue-500 data-[state=unchecked]:bg-white data-[state=unchecked]:border-gray-300 transition-colors"
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
                      className="w-3 h-3 text-white"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <span className="text-[10px] font-bold text-gray-400 uppercase group-hover/checkbox:text-gray-600 transition-colors">
                  MENUDENCIA
                </span>
              </label>
            ) : weightInfo ? (
              <div className="text-center">
                <div className="text-xs font-bold text-emerald-500">
                  {weightInfo.bruto} kg Bruto
                </div>
                <div className="text-xs font-bold text-emerald-500">
                  {weightInfo.neto} kg Neto
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  },
);

CardCode.displayName = "CardCode";

export default CardCode;
