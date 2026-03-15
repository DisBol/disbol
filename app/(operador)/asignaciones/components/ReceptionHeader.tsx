"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { CarOutlineIcon } from "@/components/icons/CarOutlineIcon";
import { Card } from "@/components/ui/Card";
import CardCode from "@/components/ui/CardCode";
import { Assignment } from "../stores/assignments-store";

interface ProductReception {
  codigo: string;
  cajas: number;
  unidades: number;
  kgBruto: number;
  kgNeto: number;
  kgRecibidos: number;
  recibidosCajas: number;
  recibidosUnidades: number;
  active: boolean; // Agregar estado activo
}

interface ReceptionHeaderProps {
  assignment: Assignment;
  productos: ProductReception[];
  costoTotalGeneral: string;
  onBack: () => void;
  onRegistrarRecepcion: () => void;
}

export default function ReceptionHeader({
  assignment,
  productos,
  costoTotalGeneral,
  onBack,
  onRegistrarRecepcion,
}: ReceptionHeaderProps) {
  return (
    <Card className="p-4 md:p-6">
      {/* Header con información general */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <span className="text-xs font-bold text-gray-500 uppercase block">
            PROVEEDOR:
          </span>
          <span className="text-md font-bold text-gray-900">
            {assignment.proveedor}
          </span>
        </div>

        {/* <div>
            <span className="text-xs font-bold text-gray-500 uppercase block">
              CLIENTE:
            </span>
            <span className="text-md font-bold text-gray-900">
              Pollería El Rey
            </span>
          </div> */}

        <div>
          <span className="text-xs font-bold text-gray-500 uppercase block">
            COSTO TOTAL GENERAL
          </span>
          <span className="text-md font-bold text-red-500">
            Bs {costoTotalGeneral}
          </span>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" color="secondary" onClick={onBack}>
            Cancelar
          </Button>
          <Button
            variant="success"
            color="success"
            leftIcon={<CarOutlineIcon />}
            onClick={onRegistrarRecepcion}
          >
            Registrar Recepción
          </Button>
        </div>
      </div>

      {/* Detalles de la Asignación */}
      <div className="mb-8">
        <h2 className="text-md font-bold text-gray-900 mb-4">
          Detalles de la Asignación
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {productos.map((producto) => (
            <div
              key={producto.codigo}
              className={`${!producto.active ? "opacity-60" : ""}`}
            >
              <div
                className={!producto.active ? "bg-gray-200 rounded-lg p-1" : ""}
              >
                <CardCode
                  label={`Código ${producto.codigo}`}
                  cajas={producto.cajas}
                  unidades={producto.unidades}
                  readOnly={true}
                  compareReadOnly={{
                    leftLabel: "Asig.",
                    rightLabel: "Rec.",
                    rightCajas: producto.recibidosCajas,
                    rightUnidades: producto.recibidosUnidades,
                  }}
                  differences={{
                    cajas: producto.recibidosCajas - producto.cajas,
                    unidades: producto.recibidosUnidades - producto.unidades,
                  }}
                  weightInfo={{
                    // bruto: `${producto.kgBruto.toFixed(2)}`,
                    // neto: `${producto.kgNeto.toFixed(2)}`,
                    recibidos: `${producto.kgRecibidos.toFixed(2)}`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
