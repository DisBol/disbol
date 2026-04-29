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
  recibidosCajas: number;
  recibidosUnidades: number;
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
        <div className="space-y-6 pb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {productos.map((producto) => {
              const recibidos = {
                cajas: producto.recibidosCajas || 0,
                unidades: producto.recibidosUnidades || 0,
                kgBruto: producto.kgRecibidos || 0,
                kgNeto: producto.kgRecibidos || 0,
              };

              return (
                <ProductCard
                  key={producto.codigo}
                  producto={producto}
                  recibidos={recibidos}
                  showWeights={false}
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
