"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/InputField";
import { Checkbox } from "@/components/ui/Checkbox";
import { Card } from "@/components/ui/Card";

interface ProductReception {
  codigo: string;
  cajas: number;
  unidades: number;
  kgBruto: number;
  kgNeto: number;
  kgRecibidos: number;
}

interface Boleta {
  id: string;
  codigo: string;
  costoPorKg: string;
  costoTotal: string;
  precioDiferido: boolean;
  codigosSeleccionados: string[];
}

interface ReceptionTicketsProps {
  productos: ProductReception[];
  boletas: Boleta[];
  pesoTotalGeneral: string;
  onAgregarBoleta: () => void;
  onEliminarBoleta: (boletaId: string) => void;
  onUpdateBoleta: (boletaId: string, field: keyof Boleta, value: any) => void;
  onToggleCodigoEnBoleta: (boletaId: string, codigo: string) => void;
}

export default function ReceptionTickets({
  productos,
  boletas,
  pesoTotalGeneral,
  onAgregarBoleta,
  onEliminarBoleta,
  onUpdateBoleta,
  onToggleCodigoEnBoleta,
}: ReceptionTicketsProps) {
  return (
    <Card className="p-4 md:p-6 mt-4">
      {/* Boletas de Recepción */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-md font-bold text-gray-900">
            Boletas de Recepción
          </h2>
          <Button
            variant="primary"
            color="danger"
            leftIcon={<span>+</span>}
            onClick={onAgregarBoleta}
          >
            Agregar Boleta
          </Button>
        </div>

        <div className="space-y-6">
          {boletas.map((boleta, index) => (
            <div
              key={boleta.id}
              className="border border-gray-200 rounded-lg p-4 bg-gray-50"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-red-500">
                  Boleta #{index + 1}
                </h3>
                <div className="flex gap-2">
                  <Button variant="success" color="success" size="sm">
                    Guardar Boleta
                  </Button>
                  <Button
                    variant="danger"
                    color="danger"
                    size="sm"
                    onClick={() => onEliminarBoleta(boleta.id)}
                  >
                    Eliminar Boleta
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase block mb-1">
                    CÓDIGO DE BOLETA
                  </span>
                  <InputField
                    placeholder="Ingrese código"
                    value={boleta.codigo}
                    onChange={(e) =>
                      onUpdateBoleta(boleta.id, "codigo", e.target.value)
                    }
                  />
                </div>

                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase block mb-1">
                    COSTO POR KG (Bs)
                  </span>
                  <InputField
                    value={boleta.costoPorKg}
                    onChange={(e) =>
                      onUpdateBoleta(boleta.id, "costoPorKg", e.target.value)
                    }
                  />
                </div>

                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase block mb-1">
                    COSTO DE ESTA BOLETA
                  </span>
                  <div className="text-2xl font-bold text-red-500">
                    Bs {boleta.costoTotal}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <Checkbox
                  label="Precio diferido"
                  checked={boleta.precioDiferido}
                  onChange={(checked) =>
                    onUpdateBoleta(boleta.id, "precioDiferido", checked)
                  }
                />
              </div>

              {/* Códigos en esta Boleta */}
              <div className="mb-4">
                <h4 className="text-sm font-bold text-gray-600 uppercase mb-3">
                  Códigos en esta Boleta
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                  {productos.map((producto) => (
                    <div
                      key={producto.codigo}
                      className="flex items-center gap-2"
                    >
                      <Checkbox
                        checked={boleta.codigosSeleccionados.includes(
                          producto.codigo,
                        )}
                        onChange={() =>
                          onToggleCodigoEnBoleta(boleta.id, producto.codigo)
                        }
                      />
                      <span className="text-xs font-medium text-gray-700">
                        Código {producto.codigo}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Peso Total General */}
      <div className="text-left">
        <span className="text-lg font-bold text-red-500">
          Peso Total General: {pesoTotalGeneral} kg
        </span>
      </div>
    </Card>
  );
}
