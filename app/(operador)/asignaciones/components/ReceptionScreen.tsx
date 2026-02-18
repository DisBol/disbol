"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/InputField";
import { Checkbox } from "@/components/ui/Checkbox";
import ReceptionSummaryModal from "./ReceptionSummaryModal";
import { CarOutlineIcon } from "@/components/icons/CarOutlineIcon";
import { Card } from "@/components/ui/Card";
import CardCode from "@/components/ui/CardCode";

// Interfaces
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

interface ReceptionScreenProps {
  assignment: {
    id: string;
    fecha: string;
    proveedor: string;
    productos: any[];
  };
  onBack: () => void;
}

export default function ReceptionScreen({
  assignment,
  onBack,
}: ReceptionScreenProps) {
  const [productos] = useState<ProductReception[]>([
    {
      codigo: "104",
      cajas: 10,
      unidades: 5,
      kgBruto: 100.0,
      kgNeto: 95.0,
      kgRecibidos: 0.0,
    },
    {
      codigo: "105",
      cajas: 0,
      unidades: 0,
      kgBruto: 0.0,
      kgNeto: 0.0,
      kgRecibidos: 0.0,
    },
    {
      codigo: "106",
      cajas: 0,
      unidades: 0,
      kgBruto: 0.0,
      kgNeto: 0.0,
      kgRecibidos: 0.0,
    },
    {
      codigo: "107",
      cajas: 5,
      unidades: 2,
      kgBruto: 50.0,
      kgNeto: 47.5,
      kgRecibidos: 0.0,
    },
    {
      codigo: "108",
      cajas: 0,
      unidades: 0,
      kgBruto: 0.0,
      kgNeto: 0.0,
      kgRecibidos: 0.0,
    },
    {
      codigo: "109",
      cajas: 0,
      unidades: 0,
      kgBruto: 0.0,
      kgNeto: 0.0,
      kgRecibidos: 0.0,
    },
    {
      codigo: "110",
      cajas: 0,
      unidades: 0,
      kgBruto: 0.0,
      kgNeto: 0.0,
      kgRecibidos: 0.0,
    },
  ]);

  const [boletas, setBoletas] = useState<Boleta[]>([
    {
      id: "1",
      codigo: "",
      costoPorKg: "0.00",
      costoTotal: "0.00",
      precioDiferido: false,
      codigosSeleccionados: [],
    },
  ]);

  const [costoTotalGeneral] = useState("0.00");
  const [pesoTotalGeneral] = useState("0.00");
  const [showResumenModal, setShowResumenModal] = useState(false);

  const handleAgregarBoleta = () => {
    const nuevaBoleta: Boleta = {
      id: Date.now().toString(),
      codigo: "",
      costoPorKg: "0.00",
      costoTotal: "0.00",
      precioDiferido: false,
      codigosSeleccionados: [],
    };
    setBoletas([...boletas, nuevaBoleta]);
  };

  const handleEliminarBoleta = (boletaId: string) => {
    setBoletas(boletas.filter((b) => b.id !== boletaId));
  };

  const updateBoleta = (boletaId: string, field: keyof Boleta, value: any) => {
    setBoletas(
      boletas.map((boleta) =>
        boleta.id === boletaId ? { ...boleta, [field]: value } : boleta,
      ),
    );
  };

  const toggleCodigoEnBoleta = (boletaId: string, codigo: string) => {
    setBoletas(
      boletas.map((boleta) => {
        if (boleta.id === boletaId) {
          const codigosActuales = boleta.codigosSeleccionados;
          const nuevosCodigos = codigosActuales.includes(codigo)
            ? codigosActuales.filter((c) => c !== codigo)
            : [...codigosActuales, codigo];
          return { ...boleta, codigosSeleccionados: nuevosCodigos };
        }
        return boleta;
      }),
    );
  };

  const handleRegistrarRecepcion = () => {
    setShowResumenModal(true);
  };

  const handleConfirmarRecepcion = () => {
    setShowResumenModal(false);
    // Aquí iría la lógica para guardar la recepción
    console.log("Recepción confirmada");
  };

  return (
    <div className="min-h-screen max-w-full">
      <Card className="p-4 md:p-6">
        {/* Header con información general */}
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
                CLIENTE:
              </span>
              <span className="text-md font-bold text-gray-900">
                Pollería El Rey
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
          </div>

          <div className="flex gap-3">
            <Button variant="outline" color="secondary" onClick={onBack}>
              Cancelar
            </Button>
            <Button
              variant="success"
              color="success"
              leftIcon={<CarOutlineIcon />}
              onClick={handleRegistrarRecepcion}
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

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {productos.map((producto) => (
              <CardCode
                key={producto.codigo}
                label={`Código ${producto.codigo}`}
                cajas={producto.cajas}
                unidades={producto.unidades}
                readOnly={true}
                weightInfo={{
                  bruto: `${producto.kgBruto.toFixed(2)}`,
                  neto: `${producto.kgNeto.toFixed(2)}`,
                  recibidos: `${producto.kgRecibidos.toFixed(2)}`,
                }}
              />
            ))}
          </div>
        </div>
      </Card>

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
              onClick={handleAgregarBoleta}
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
                      onClick={() => handleEliminarBoleta(boleta.id)}
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
                        updateBoleta(boleta.id, "codigo", e.target.value)
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
                        updateBoleta(boleta.id, "costoPorKg", e.target.value)
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
                      updateBoleta(boleta.id, "precioDiferido", checked)
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
                            toggleCodigoEnBoleta(boleta.id, producto.codigo)
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

      {/* Modal de Resumen de Recepción */}
      <ReceptionSummaryModal
        isOpen={showResumenModal}
        onClose={() => setShowResumenModal(false)}
        onConfirm={handleConfirmarRecepcion}
        productos={productos}
      />
    </div>
  );
}
