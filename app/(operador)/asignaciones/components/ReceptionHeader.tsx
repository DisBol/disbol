"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Assignment } from "../stores/assignments-store";

interface Totals {
  cajas: number;
  unidades?: number;
  pesoBruto?: number;
  pesoNeto?: number;
  destare?: number;
}

interface ComparisonTotals {
  cajas: number;
  unidades: number;
  pesoNeto: number;
}

interface EmpresaProductTotal {
  id: number | null;
  nombre: string;
  cajas: number;
  unidades: number;
  pesoNeto: number;
}

interface ReceptionHeaderProps {
  assignment: Assignment;
  totalesGlobales: {
    totalSolicitud: Totals;
    totalEmpresa: Totals;
    totalEmpresaProductos: EmpresaProductTotal[];
    totalRecibido: Totals;
    totalRecibidoProductos: EmpresaProductTotal[];
    comparativaEmpresaRecibido: ComparisonTotals;
  };
  onBack: () => void;
  onFinalizarRecepcion: () => void;
  isFinalizando?: boolean;
}

export default function ReceptionHeader({
  assignment,
  totalesGlobales,
  onBack,
  onFinalizarRecepcion,
  isFinalizando,
}: ReceptionHeaderProps) {
  const formatNumber = (value: number) =>
    value.toLocaleString("es-BO", {
      maximumFractionDigits: 0,
    });

  const formatWeight = (value: number) =>
    `${(Math.round(value * 10) / 10).toFixed(1).replace(".", ",")} kg`;

  const formatSignedNumber = (value: number) => {
    const formatted = formatNumber(Math.abs(value));
    return value >= 0 ? `+${formatted}` : `-${formatted}`;
  };

  const formatSignedWeight = (value: number) => {
    const formatted = formatWeight(Math.abs(value));
    return value >= 0 ? `+${formatted}` : `-${formatted}`;
  };

  const getDifferenceColorClass = (value: number) => {
    if (value > 0) return "text-green-600";
    if (value < 0) return "text-red-600";
    return "text-gray-900";
  };

  const solicitud = totalesGlobales.totalSolicitud;
  const isProductoEspecial = (producto: EmpresaProductTotal) =>
    ["bono", "menudencia", "embutido", "embutidos"].includes(
      producto.nombre.trim().toLowerCase(),
    );
  const empresaProductos =
    totalesGlobales.totalEmpresaProductos.filter(isProductoEspecial);
  const recibido = totalesGlobales.totalRecibido;
  const recibidoProductos =
    totalesGlobales.totalRecibidoProductos.filter(isProductoEspecial);
  const productosEspeciales = [
    ...empresaProductos,
    ...recibidoProductos,
  ].filter(
    (producto, index, productos) =>
      productos.findIndex(
        (item) =>
          (item.id !== null && item.id === producto.id) ||
          (item.id === null &&
            producto.id === null &&
            item.nombre.trim().toLowerCase() ===
              producto.nombre.trim().toLowerCase()),
      ) === index,
  );
  const getProductoTotal = (
    productos: EmpresaProductTotal[],
    producto: EmpresaProductTotal,
  ) =>
    productos.find(
      (item) =>
        (producto.id !== null && item.id === producto.id) ||
        (producto.id === null &&
          item.id === null &&
          item.nombre.trim().toLowerCase() ===
            producto.nombre.trim().toLowerCase()),
    ) || {
      id: producto.id,
      nombre: producto.nombre,
      cajas: 0,
      unidades: 0,
      pesoNeto: 0,
    };
  const diferencia = totalesGlobales.comparativaEmpresaRecibido;

  return (
    <Card className="p-4 md:p-6 mb-6">
      {/* Header con información general */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4 pb-4 border-b border-gray-100">
        <div className="min-w-0 flex flex-wrap gap-2 items-center">
          <span className="text-xs font-bold text-gray-500 uppercase block">
            PROVEEDOR:
          </span>
          <span className="text-md font-bold text-gray-900">
            {assignment.proveedor}
          </span>
        </div>

        <div className="flex gap-3 flex-wrap items-center md:justify-end">
          <Button variant="outline" color="secondary" onClick={onBack}>
            Cancelar
          </Button>
          <button
            onClick={onFinalizarRecepcion}
            disabled={isFinalizando || assignment.isRecibir === "true"}
            className={`px-4 py-2 rounded-lg text-sm font-bold shadow-sm text-white transition-colors ${
              assignment.isRecibir === "true"
                ? "bg-gray-400 cursor-not-allowed opacity-80"
                : isFinalizando
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 cursor-pointer"
            }`}
          >
            {assignment.isRecibir === "true"
              ? "Recepción Finalizada"
              : isFinalizando
                ? "Finalizando..."
                : "Finalizar Recepción"}
          </button>
        </div>
      </div>

      {/* Detalles de la Asignación (Totales) */}
      <div>
        <div className="mb-5 flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
          <h2 className="text-md font-bold text-gray-900">
            Resumen de Totales
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* TOTAL SOLICITUD */}
          <div className="flex flex-col h-full p-4 rounded-xl border border-slate-200 bg-slate-50/50 shadow-sm transition-all hover:shadow-md hover:border-slate-300">
            <div className="mb-4 flex items-center justify-between pb-3 border-b border-slate-200/60">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Solicitud
                </h3>
                <p className="text-[10px] font-medium text-slate-500 mt-0.5">
                  Base solicitada
                </p>
              </div>
              <span className="rounded-md bg-slate-200/50 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-600">
                Original
              </span>
            </div>
            <div className="space-y-3 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  Unidades
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {formatNumber(solicitud.unidades || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  Cajas
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {formatNumber(solicitud.cajas)}
                </span>
              </div>
            </div>
          </div>

          {/* TOTAL EMPRESA */}
          <div className="flex flex-col h-full p-4 rounded-xl border border-amber-200 bg-amber-50/40 shadow-sm transition-all hover:shadow-md hover:border-amber-300">
            <div className="mb-4 flex items-center justify-between pb-3 border-b border-amber-200/60">
              <div>
                <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  Empresa
                </h3>
                <p className="text-[10px] font-medium text-amber-700/70 mt-0.5">
                  Entrada de la empresa
                </p>
              </div>
            </div>

            <div className="space-y-3 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-800/80 uppercase tracking-wide">
                  Unidades
                </span>
                <span className="text-sm font-bold text-amber-950">
                  {formatNumber(totalesGlobales.totalEmpresa.unidades || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-800/80 uppercase tracking-wide">
                  Cajas
                </span>
                <span className="text-sm font-bold text-amber-950">
                  {formatNumber(totalesGlobales.totalEmpresa.cajas || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-800/80 uppercase tracking-wide">
                  Peso neto
                </span>
                <span className="text-sm font-bold text-amber-950">
                  {formatWeight(totalesGlobales.totalEmpresa.pesoNeto || 0)}
                </span>
              </div>

              {productosEspeciales.length > 0 && (
                <div className="mt-4 border-t border-amber-200/60 pt-3 space-y-3">
                  {productosEspeciales.map((producto) => {
                    const total = getProductoTotal(empresaProductos, producto);
                    return (
                      <div
                        key={`empresa-${producto.id ?? producto.nombre}`}
                        className="space-y-1.5 opacity-75"
                      >
                        <span className="text-[10px] font-semibold text-amber-800">
                          {producto.nombre}
                        </span>
                        <div className="flex items-center justify-between text-[10px] text-amber-800/80">
                          <span>{formatNumber(total.unidades)} unidades</span>
                          <span>{formatNumber(total.cajas)} cajas</span>
                          <span>{formatWeight(total.pesoNeto)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* TOTAL RECIBIDO */}
          <div className="flex flex-col h-full p-4 rounded-xl border border-violet-200 bg-violet-50/40 shadow-sm transition-all hover:shadow-md hover:border-violet-300">
            <div className="mb-4 flex items-center justify-between pb-3 border-b border-violet-200/60">
              <div>
                <h3 className="text-xs font-bold text-violet-900 uppercase tracking-wider">
                  Recibido
                </h3>
                <p className="text-[10px] font-medium text-violet-700/70 mt-0.5">
                  Lo que entra a recepción
                </p>
              </div>
            </div>
            <div className="space-y-3 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-violet-800/80 uppercase tracking-wide">
                  Unidades
                </span>
                <span className="text-sm font-bold text-violet-950">
                  {formatNumber(recibido.unidades || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-violet-800/80 uppercase tracking-wide">
                  Cajas
                </span>
                <span className="text-sm font-bold text-violet-950">
                  {formatNumber(recibido.cajas)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-violet-800/80 uppercase tracking-wide">
                  Peso neto
                </span>
                <span className="text-sm font-bold text-violet-950">
                  {formatWeight(recibido.pesoNeto || 0)}
                </span>
              </div>

              {productosEspeciales.length > 0 && (
                <div className="mt-4 border-t border-violet-200/60 pt-3 space-y-3">
                  {productosEspeciales.map((producto) => {
                    const total = getProductoTotal(recibidoProductos, producto);
                    return (
                      <div
                        key={`recibido-${producto.id ?? producto.nombre}`}
                        className="space-y-1.5 opacity-75"
                      >
                        <span className="text-[10px] font-semibold text-violet-800">
                          {producto.nombre}
                        </span>
                        <div className="flex items-center justify-between text-[10px] text-violet-800/80">
                          <span>{formatNumber(total.unidades)} unidades</span>
                          <span>{formatNumber(total.cajas)} cajas</span>
                          <span>{formatWeight(total.pesoNeto)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* DIFERENCIA */}
          <div className="flex flex-col h-full p-4 rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md hover:border-slate-300">
            <div className="mb-4 flex items-center justify-between pb-3 border-b border-slate-200/60">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Diferencia
                </h3>
                <p className="text-[10px] font-medium text-slate-500 mt-0.5">
                  Recibido - Empresa
                </p>
              </div>
            </div>
            <div className="space-y-3 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  Unidades
                </span>
                <span
                  className={`text-sm font-bold ${getDifferenceColorClass(diferencia.unidades)}`}
                >
                  {formatSignedNumber(diferencia.unidades)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  Cajas
                </span>
                <span
                  className={`text-sm font-bold ${getDifferenceColorClass(diferencia.cajas)}`}
                >
                  {formatSignedNumber(diferencia.cajas)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  Peso neto
                </span>
                <span
                  className={`text-sm font-bold ${getDifferenceColorClass(diferencia.pesoNeto)}`}
                >
                  {formatSignedWeight(diferencia.pesoNeto)}
                </span>
              </div>

              {productosEspeciales.length > 0 && (
                <div className="mt-4 border-t border-slate-200/60 pt-3 space-y-3">
                  {productosEspeciales.map((producto) => {
                    const empresa = getProductoTotal(
                      empresaProductos,
                      producto,
                    );
                    const recibido = getProductoTotal(
                      recibidoProductos,
                      producto,
                    );
                    const diferenciaProducto = {
                      cajas: recibido.cajas - empresa.cajas,
                      unidades: recibido.unidades - empresa.unidades,
                      pesoNeto: recibido.pesoNeto - empresa.pesoNeto,
                    };

                    return (
                      <div
                        key={`diferencia-${producto.id ?? producto.nombre}`}
                        className="space-y-1.5 opacity-75"
                      >
                        <span className="text-[10px] font-semibold text-slate-700">
                          {producto.nombre}
                        </span>
                        <div className="flex items-center justify-between text-[10px]">
                          <span
                            className={getDifferenceColorClass(
                              diferenciaProducto.unidades,
                            )}
                          >
                            {formatSignedNumber(diferenciaProducto.unidades)}{" "}
                            unidades
                          </span>
                          <span
                            className={getDifferenceColorClass(
                              diferenciaProducto.cajas,
                            )}
                          >
                            {formatSignedNumber(diferenciaProducto.cajas)} cajas
                          </span>
                          <span
                            className={getDifferenceColorClass(
                              diferenciaProducto.pesoNeto,
                            )}
                          >
                            {formatSignedWeight(diferenciaProducto.pesoNeto)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
