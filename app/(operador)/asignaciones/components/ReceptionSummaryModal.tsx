"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import ProductCard from "@/components/ui/ProductCard";

interface ProductReception {
  codigo: string;
  cajas: number;
  unidades: number;
  kgBruto: number;
  kgNeto: number;
  kgRecibidos: number;
}

interface ReceptionSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productos: ProductReception[];
}

export default function ReceptionSummaryModal({
  isOpen,
  onClose,
  onConfirm,
  productos,
}: ReceptionSummaryModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Resumen de Recepción"
      size="xl"
    >
      {/* Contenedor con altura fija y scroll */}
      <div className="max-h-[70vh] overflow-y-auto">
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-gray-900">
            Resumen por Código
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {productos.map((producto) => {
              // Simular datos recibidos (en producción vendrían de las boletas)
              const recibidos = {
                cajas:
                  producto.cajas === 0 ? 0 : Math.max(0, producto.cajas - 1),
                unidades:
                  producto.unidades === 0
                    ? 0
                    : Math.max(0, producto.unidades - 1),
                kgBruto:
                  producto.kgBruto === 0
                    ? 0
                    : Math.max(0, producto.kgBruto - 5),
                kgNeto:
                  producto.kgNeto === 0
                    ? 0
                    : Math.max(0, producto.kgNeto - 4.5),
              };

              return (
                <ProductCard
                  key={producto.codigo}
                  producto={producto}
                  recibidos={recibidos}
                  showWeights={true}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Botones fijos al final */}
      <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 bg-white">
        <Button variant="outline" color="secondary" onClick={onClose}>
          Cerrar
        </Button>
        <Button variant="success" color="success" onClick={onConfirm}>
          Confirmar
        </Button>
      </div>
    </Modal>
  );
}
