"use client";

import React from "react";

interface ProductData {
  codigo: string;
  cajas: number;
  unidades: number;
  kgBruto?: number;
  kgNeto?: number;
}

interface ReceivedData {
  cajas: number;
  unidades: number;
  kgBruto: number;
  kgNeto: number;
}

interface ProductCardProps {
  producto: ProductData;
  recibidos: ReceivedData;
  showWeights?: boolean;
  className?: string;
}

export default function ProductCard({
  producto,
  recibidos,
  showWeights = true,
  className = "",
}: ProductCardProps) {
  const diferencias = {
    cajas: recibidos.cajas - producto.cajas,
    unidades: recibidos.unidades - producto.unidades,
    kgBruto: recibidos.kgBruto - (producto.kgBruto || 0),
    kgNeto: recibidos.kgNeto - (producto.kgNeto || 0),
  };

  const getDifferenceColor = (value: number) => {
    if (value === 0) return "text-emerald-600";
    return value > 0 ? "text-emerald-600" : "text-red-600";
  };

  const formatDifference = (value: number, unit: string = "") => {
    const sign = value > 0 ? "+" : "";
    const formattedValue =
      typeof value === "number" && unit.includes("kg")
        ? value.toFixed(2)
        : value;
    return `${sign}${formattedValue}${unit ? " " + unit : ""}`;
  };

  return (
    <div
      className={`bg-gray-50 rounded-lg p-2 border border-gray-200 min-w-0 ${className}`}
    >
      <h4 className="font-bold text-gray-900 text-xs mb-2 text-center">
        Código {producto.codigo}
      </h4>

      {/* Asignación */}
      <div className="mb-2">
        <h5 className="text-[9px] font-bold text-gray-500 uppercase mb-1 text-center">
          ASIGNACIÓN
        </h5>
        <div className="grid grid-cols-1 gap-1">
          <div className="text-left">
            <span className="text-[8px] text-gray-400 uppercase block">
              CAJAS
            </span>
            <div className="bg-white border rounded px-1 py-0.5 text-[10px] text-center">
              {producto.cajas}
            </div>
          </div>
          <div className="text-left">
            <span className="text-[8px] text-gray-400 uppercase block">
              UNID.
            </span>
            <div className="bg-white border rounded px-1 py-0.5 text-[10px] text-center">
              {producto.unidades}
            </div>
          </div>
        </div>
      </div>

      {/* Recibido */}
      <div className="mb-2 border border-emerald-300 rounded p-1.5 bg-emerald-50">
        <h5 className="text-[9px] font-bold text-emerald-700 uppercase mb-1 text-center">
          RECIBIDO
        </h5>
        <div className="grid grid-cols-1 gap-1 mb-1">
          <div className="text-left">
            <span className="text-[8px] text-emerald-600 uppercase block">
              CAJAS
            </span>
            <div className="bg-white border rounded px-1 py-0.5 text-[10px] text-center">
              {recibidos.cajas}
            </div>
          </div>
          <div className="text-left">
            <span className="text-[8px] text-emerald-600 uppercase block">
              UNID.
            </span>
            <div className="bg-white border rounded px-1 py-0.5 text-[10px] text-center">
              {recibidos.unidades}
            </div>
          </div>
        </div>
        {showWeights && (
          <div className="space-y-0.5 text-center">
            <div className="text-[8px] text-emerald-600 font-medium">
              {recibidos.kgBruto.toFixed(2)} kg Bruto
            </div>
            <div className="text-[8px] text-emerald-600 font-medium">
              {recibidos.kgNeto.toFixed(2)} kg Neto
            </div>
          </div>
        )}
      </div>

      {/* Diferencia */}
      <div>
        <h5 className="text-[9px] font-bold text-gray-500 uppercase mb-1 text-center">
          DIFERENCIA
        </h5>
        <div className="space-y-0.5 text-center">
          <div
            className={`text-[10px] font-medium ${getDifferenceColor(diferencias.cajas)}`}
          >
            {formatDifference(diferencias.cajas, "cajas")}
          </div>
          <div
            className={`text-[10px] font-medium ${getDifferenceColor(diferencias.unidades)}`}
          >
            {formatDifference(diferencias.unidades, "unid.")}
          </div>
          {/* {showWeights && (
            <div
              className={`text-[10px] font-medium ${getDifferenceColor(diferencias.kgBruto)}`}
            >
              {formatDifference(diferencias.kgBruto, "kg")}
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}
