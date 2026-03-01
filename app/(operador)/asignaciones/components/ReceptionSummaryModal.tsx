"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import ProductCard from "@/components/ui/ProductCard";
import { Assignment } from "../stores/assignments-store";
import { Datum } from "../interfaces/getassignmenthistory.interface";

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
  assignment: Assignment;
  rawData: Datum[] | null;
}

export default function ReceptionSummaryModal({
  isOpen,
  onClose,
  onConfirm,
  productos,
  assignment,
  rawData,
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
              // Buscar en rawData los productos con posición 2 del assignment actual
              const productosRecibidos =
                rawData?.filter(
                  (item) =>
                    item.Assignment_id.toString() === assignment.id &&
                    item.Product_name === producto.codigo &&
                    item.AssignmentStage_position === 2,
                ) || [];

              const recibidos =
                productosRecibidos.length > 0
                  ? {
                      cajas: productosRecibidos[0].ProductAssignment_container,
                      unidades: productosRecibidos[0].ProductAssignment_units,
                      kgBruto: parseFloat(
                        productosRecibidos[0].ProductAssignment_gross_weight ||
                          "0",
                      ),
                      kgNeto: parseFloat(
                        productosRecibidos[0].ProductAssignment_net_weight ||
                          "0",
                      ),
                    }
                  : {
                      // Si no se encuentra producto con posición 2, mostrar ceros
                      cajas: 0,
                      unidades: 0,
                      kgBruto: 0,
                      kgNeto: 0,
                    };

              return (
                <ProductCard
                  key={producto.codigo}
                  producto={producto}
                  recibidos={recibidos}
                  // showWeights={true}
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
