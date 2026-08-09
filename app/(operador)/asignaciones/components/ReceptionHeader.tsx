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

interface ReceptionHeaderProps {
  assignment: Assignment;
  totalesGlobales: {
    totalSolicitud: Totals;
    totalEmpresa: Totals;
    totalRecibido: Totals;
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
  const empresa = totalesGlobales.totalEmpresa;
  const recibido = totalesGlobales.totalRecibido;
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

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
          {/* TOTAL SOLICITUD */}
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition-transform transition-shadow hover:-translate-y-0.5 hover:shadow-lg">
            <div className="mb-4 flex items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-[13px] font-black tracking-[0.16em] text-gray-800">
                  SOLICITUD
                </h3>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400">
                  Base solicitada
                </p>
              </div>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-gray-600">
                Original
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-gray-500">
                  Unidades
                </span>
                <span className="text-sm font-black text-gray-900">
                  {formatNumber(solicitud.unidades || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-gray-500">
                  Cajas
                </span>
                <span className="text-sm font-black text-gray-900">
                  {formatNumber(solicitud.cajas)}
                </span>
              </div>
            </div>
          </div>

          {/* TOTAL EMPRESA */}
          <div className="overflow-hidden rounded-3xl border border-amber-200 bg-gradient-to-b from-amber-50 to-white p-5 shadow-sm transition-transform transition-shadow hover:-translate-y-0.5 hover:shadow-lg">
            <div className="mb-4 flex items-center justify-between gap-3 border-b border-amber-100 pb-3">
              <div>
                <h3 className="text-[13px] font-black tracking-[0.16em] text-amber-900">
                  EMPRESA
                </h3>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-700/80">
                  Entrada de la empresa
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between rounded-2xl border border-amber-100 bg-white px-4 py-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-amber-700">
                  Unidades
                </span>
                <span className="text-sm font-black text-amber-950">
                  {formatNumber(empresa.unidades || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-amber-100 bg-white px-4 py-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-amber-700">
                  Cajas
                </span>
                <span className="text-sm font-black text-amber-950">
                  {formatNumber(empresa.cajas)}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-amber-100 bg-white px-4 py-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-amber-700">
                  Peso neto
                </span>
                <span className="text-sm font-black text-amber-950">
                  {formatWeight(empresa.pesoNeto || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* TOTAL RECIBIDO */}
          <div className="overflow-hidden rounded-3xl border border-violet-200 bg-gradient-to-b from-violet-50 to-white p-5 shadow-sm transition-transform transition-shadow hover:-translate-y-0.5 hover:shadow-lg">
            <div className="mb-4 flex items-center justify-between gap-3 border-b border-violet-100 pb-3">
              <div>
                <h3 className="text-[13px] font-black tracking-[0.16em] text-violet-900">
                  RECIBIDO
                </h3>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-violet-700/80">
                  Lo que entra a recepción
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between rounded-2xl border border-violet-100 bg-white px-4 py-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-violet-700">
                  Unidades
                </span>
                <span className="text-sm font-black text-violet-950">
                  {formatNumber(recibido.unidades || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-violet-100 bg-white px-4 py-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-violet-700">
                  Cajas
                </span>
                <span className="text-sm font-black text-violet-950">
                  {formatNumber(recibido.cajas)}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-violet-100 bg-white px-4 py-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-violet-700">
                  Peso neto
                </span>
                <span className="text-sm font-black text-violet-950">
                  {formatWeight(recibido.pesoNeto || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* DIFERENCIA */}
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition-transform transition-shadow hover:-translate-y-0.5 hover:shadow-lg">
            <div className="mb-4 flex items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-[13px] font-black tracking-[0.16em] text-gray-800">
                  DIFERENCIA
                </h3>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400">
                  Recibido - Empresa
                </p>
              </div>
              {/* <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em]">
                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-amber-800">
                  Empresa
                </span>
                <span className="rounded-full bg-violet-100 px-2.5 py-1 text-violet-800">
                  Recibido
                </span>
              </div> */}
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-gray-500">
                  Unidades
                </span>
                <span
                  className={`text-sm font-black ${getDifferenceColorClass(diferencia.unidades)}`}
                >
                  {formatSignedNumber(diferencia.unidades)}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-gray-500">
                  Cajas
                </span>
                <span
                  className={`text-sm font-black ${getDifferenceColorClass(diferencia.cajas)}`}
                >
                  {formatSignedNumber(diferencia.cajas)}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-gray-500">
                  Peso neto
                </span>
                <span
                  className={`text-sm font-black ${getDifferenceColorClass(diferencia.pesoNeto)}`}
                >
                  {formatSignedWeight(diferencia.pesoNeto)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
