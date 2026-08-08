"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { CarOutlineIcon } from "@/components/icons/CarOutlineIcon";
import { Card } from "@/components/ui/Card";
import { Assignment } from "../stores/assignments-store";

interface Totals {
  cajas: number;
  pesoNeto: number;
}

interface ReceptionHeaderProps {
  assignment: Assignment;
  totalesGlobales: {
    totalSolicitud: Totals;
    totalEmpresa: Totals;
    totalRecibido: Totals;
  };
  costoTotalGeneral: string;
  onBack: () => void;
  onRegistrarRecepcion: () => void;
  onFinalizarRecepcion: () => void;
  isFinalizando?: boolean;
}

export default function ReceptionHeader({
  assignment,
  totalesGlobales,
  costoTotalGeneral,
  onBack,
  onRegistrarRecepcion,
  onFinalizarRecepcion,
  isFinalizando,
}: ReceptionHeaderProps) {
  return (
    <Card className="p-4 md:p-6 mb-6">
      {/* Header con información general */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-100">
        <div>
          <span className="text-xs font-bold text-gray-500 uppercase block">
            PROVEEDOR:
          </span>
          <span className="text-md font-bold text-gray-900">
            {assignment.proveedor}
          </span>
        </div>

        <div>
          <span className="text-xs font-bold text-gray-500 uppercase block">
            COSTO TOTAL GENERAL
          </span>
          <span className="text-md font-bold text-red-500">
            Bs {costoTotalGeneral}
          </span>
        </div>

        <div className="flex gap-3 flex-wrap items-center">
          <Button variant="outline" color="secondary" onClick={onBack}>
            Cancelar
          </Button>
          {assignment.isRecibir !== "true" && (
            <Button
              variant="success"
              color="success"
              leftIcon={<CarOutlineIcon />}
              onClick={onRegistrarRecepcion}
            >
              Registrar Recepción
            </Button>
          )}
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
        <h2 className="text-md font-bold text-gray-900 mb-5">
          Resumen de Totales
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* TOTAL SOLICITUD */}
          <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col items-center">
            <h3 className="text-[13px] font-black text-gray-800 tracking-[0.1em] mb-6">
              TOTAL SOLICITUD
            </h3>
            <div className="w-full flex flex-col divide-y divide-gray-100 border-t border-b border-gray-200">
              <div className="flex justify-between py-3">
                <span className="text-sm font-semibold text-gray-500 uppercase">
                  TOTAL CAJAS
                </span>
                <span className="text-sm font-black text-gray-900">
                  {totalesGlobales.totalSolicitud.cajas}
                </span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-sm font-semibold text-gray-500 uppercase">
                  Peso neto
                </span>
                <span className="text-sm font-black text-gray-900">
                  {totalesGlobales.totalSolicitud.pesoNeto
                    .toFixed(1)
                    .replace(".", ",")}
                </span>
              </div>
            </div>
          </div>

          {/* TOTAL EMPRESA */}
          <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col items-center">
            <h3 className="text-[13px] font-black text-gray-800 tracking-[0.1em] mb-6">
              TOTAL EMPRESA
            </h3>
            <div className="w-full flex flex-col divide-y divide-gray-100 border-t border-b border-gray-200">
              <div className="flex justify-between py-3">
                <span className="text-sm font-semibold text-gray-500 uppercase">
                  TOTAL CAJAS
                </span>
                <span className="text-sm font-black text-gray-900">
                  {totalesGlobales.totalEmpresa.cajas}
                </span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-sm font-semibold text-gray-500 uppercase">
                  Peso neto
                </span>
                <span className="text-sm font-black text-gray-900">
                  {totalesGlobales.totalEmpresa.pesoNeto
                    .toFixed(1)
                    .replace(".", ",")}
                </span>
              </div>
            </div>
          </div>

          {/* TOTAL RECIBIDO */}
          <div className="border border-blue-200 rounded-2xl p-6 bg-blue-50/30 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
            <h3 className="text-[13px] font-black text-blue-900 tracking-[0.1em] mb-6">
              TOTAL RECIBIDO
            </h3>
            <div className="w-full flex flex-col divide-y divide-blue-100 border-t border-b border-blue-200">
              <div className="flex justify-between py-3">
                <span className="text-sm font-semibold text-blue-700 uppercase">
                  TOTAL CAJAS
                </span>
                <span className="text-sm font-black text-blue-950">
                  {totalesGlobales.totalRecibido.cajas}
                </span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-sm font-semibold text-blue-700 uppercase">
                  Peso neto
                </span>
                <span className="text-sm font-black text-blue-950">
                  {totalesGlobales.totalRecibido.pesoNeto
                    .toFixed(1)
                    .replace(".", ",")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
