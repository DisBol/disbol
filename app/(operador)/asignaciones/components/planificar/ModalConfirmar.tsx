"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { Select, type SelectOption } from "@/components/ui/SelecMultipe";
import type { ContainerOption } from "../../../configuraciones/hooks/contenedores/useContainer";

interface DetalleSobrante {
  label: string;
  cajas: string;
  unidades: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isFinalizando: boolean;
  updatedDetalles: DetalleSobrante[];
  containers: ContainerOption[];
  containersLoading: boolean;
  selectedContainers: Record<string, number>;
  setSelectedContainers: React.Dispatch<
    React.SetStateAction<Record<string, number>>
  >;
  onConfirm: () => void;
}

export default function ModalConfirmar({
  isOpen,
  onClose,
  isFinalizando,
  updatedDetalles,
  containers,
  containersLoading,
  selectedContainers,
  setSelectedContainers,
  onConfirm,
}: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Finalizar Planificación"
      size="sm"
    >
      {containersLoading ? (
        <div className="text-sm text-gray-600 mb-6">
          Cargando contenedores...
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-600 mb-4">
            Seleccione en qué contenedor guardar los sobrantes por producto:
          </p>

          <div className="space-y-3 max-h-56 overflow-auto mb-4">
            {updatedDetalles
              .filter((detalle) => {
                const [recibidoCajasRaw, asignadoCajasRaw] =
                  detalle.cajas.split("/");
                const [recibidoUnidadesRaw, asignadoUnidadesRaw] =
                  detalle.unidades.split("/");

                const recibidoCajas = Number(recibidoCajasRaw ?? 0) || 0;
                const asignadoCajas = Number(asignadoCajasRaw ?? 0) || 0;
                const recibidoUnidades = Number(recibidoUnidadesRaw ?? 0) || 0;
                const asignadoUnidades = Number(asignadoUnidadesRaw ?? 0) || 0;

                const sobradoCajas = Math.max(asignadoCajas - recibidoCajas, 0);
                const sobradoUnidades = Math.max(
                  asignadoUnidades - recibidoUnidades,
                  0,
                );

                return sobradoCajas > 0 || sobradoUnidades > 0;
              })
              .map((detalle) => {
                const [recibidoCajasRaw, asignadoCajasRaw] =
                  detalle.cajas.split("/");
                const [recibidoUnidadesRaw, asignadoUnidadesRaw] =
                  detalle.unidades.split("/");

                const recibidoCajas = Number(recibidoCajasRaw ?? 0) || 0;
                const asignadoCajas = Number(asignadoCajasRaw ?? 0) || 0;
                const recibidoUnidades = Number(recibidoUnidadesRaw ?? 0) || 0;
                const asignadoUnidades = Number(asignadoUnidadesRaw ?? 0) || 0;

                const sobradoCajas = Math.max(asignadoCajas - recibidoCajas, 0);
                const sobradoUnidades = Math.max(
                  asignadoUnidades - recibidoUnidades,
                  0,
                );

                return (
                  <div
                    key={detalle.label}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-sm">
                        {detalle.label}
                      </div>
                      <div className="text-xs text-gray-500">
                        Sobrante: {sobradoCajas} cajas, {sobradoUnidades}{" "}
                        unidades
                      </div>
                    </div>

                    <div className="w-56 shrink-0">
                      <Select
                        options={containers as SelectOption[]}
                        selectedValues={[
                          String(
                            selectedContainers[detalle.label] ??
                              (containers.length > 0
                                ? Number(containers[0].value)
                                : 2),
                          ),
                        ]}
                        placeholder="Seleccionar contenedor"
                        emptyMessage="No hay contenedores disponibles"
                        onSelect={(option: SelectOption) =>
                          setSelectedContainers((prev) => ({
                            ...prev,
                            [detalle.label]: Number(option.value),
                          }))
                        }
                        closeOnSelect
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </>
      )}

      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg text-sm font-bold border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          disabled={isFinalizando}
          className="px-4 py-2 rounded-lg text-sm font-bold shadow-sm text-white bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors"
        >
          {isFinalizando ? "Finalizando..." : "Confirmar"}
        </button>
      </div>
    </Modal>
  );
}
