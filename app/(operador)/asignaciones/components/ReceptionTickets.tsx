"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/InputField";
import { Checkbox } from "@/components/ui/Checkbox";
import { Card } from "@/components/ui/Card";
import CardCode from "@/components/ui/CardCode";

interface ProductReception {
  codigo: string;
  cajas: number;
  unidades: number;
  kgBruto: number;
  kgNeto: number;
  kgRecibidos: number;
}

export interface PesajeData {
  id: string;
  cajas: number;
  unidades: number;
  kg: number;
}

interface BoletaDetail {
  cajas: number;
  unidades: number;
  precio?: string;
  pesajes?: PesajeData[];
}

interface Boleta {
  id: string;
  codigo: string;
  costoPorKg: string;
  costoTotal: string;
  precioDiferido: boolean;
  codigosSeleccionados: string[];
  menudencias: string[];
  detalles: Record<string, BoletaDetail>;
}

interface ReceptionTicketsProps {
  productos: ProductReception[];
  boletas: Boleta[];
  pesoTotalGeneral: string;
  onAgregarBoleta: () => void;
  onEliminarBoleta: (boletaId: string) => void;
  onUpdateBoleta: (boletaId: string, field: keyof Boleta, value: any) => void;
  onToggleCodigoEnBoleta: (boletaId: string, codigo: string) => void;
  onToggleMenudenciaEnBoleta: (boletaId: string, codigo: string) => void;
  onUpdateCantidadBoleta: (
    boletaId: string,
    codigo: string,
    field: "cajas" | "unidades" | "precio",
    value: number | string,
  ) => void;
  onAgregarPesaje: (boletaId: string, codigo: string) => void;
  onUpdatePesaje: (
    boletaId: string,
    codigo: string,
    pesajeId: string,
    field: "cajas" | "unidades" | "kg",
    value: number,
  ) => void;
  onRemovePesaje: (boletaId: string, codigo: string, pesajeId: string) => void;
}

export default function ReceptionTickets({
  productos,
  boletas,
  pesoTotalGeneral,
  onAgregarBoleta,
  onEliminarBoleta,
  onUpdateBoleta,
  onToggleCodigoEnBoleta,
  onUpdateCantidadBoleta,
  onAgregarPesaje,
  onUpdatePesaje,
  onRemovePesaje,
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
                    disabled={boleta.precioDiferido}
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
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {productos.map((producto) => {
                    const isSelected = boleta.codigosSeleccionados.includes(
                      producto.codigo,
                    );
                    const isMenudencia = boleta.menudencias?.includes(
                      producto.codigo,
                    );

                    const detalle = boleta.detalles?.[producto.codigo] || {
                      cajas: 0,
                      unidades: 0,
                    };

                    return (
                      <div key={producto.codigo} className="relative h-full">
                        {isSelected ? (
                          <div className="h-full">
                            <CardCode
                              label={
                                <div className="flex items-center justify-center gap-2">
                                  <Checkbox
                                    checked={true}
                                    onChange={() =>
                                      onToggleCodigoEnBoleta(
                                        boleta.id,
                                        producto.codigo,
                                      )
                                    }
                                    label={`Código ${producto.codigo}`}
                                  />
                                </div>
                              }
                              cajas={detalle.cajas}
                              unidades={detalle.unidades}
                              readOnly={false}
                              onCajasChange={(val) =>
                                onUpdateCantidadBoleta(
                                  boleta.id,
                                  producto.codigo,
                                  "cajas",
                                  val === "" ? 0 : Number(val),
                                )
                              }
                              onUnidadesChange={(val) =>
                                onUpdateCantidadBoleta(
                                  boleta.id,
                                  producto.codigo,
                                  "unidades",
                                  val === "" ? 0 : Number(val),
                                )
                              }
                              showPrecio={boleta.precioDiferido}
                              precio={detalle.precio || ""}
                              onPrecioChange={(val) =>
                                onUpdateCantidadBoleta(
                                  boleta.id,
                                  producto.codigo,
                                  "precio",
                                  val,
                                )
                              }
                              variant="active"
                              // Don't pass menudencia props to hide the checkbox at bottom
                              weightInfo={{
                                bruto: `${producto.kgBruto.toFixed(2)}`,
                                neto: `${producto.kgNeto.toFixed(2)}`,
                              }}
                              className="pointer-events-auto h-full"
                              pesajes={detalle.pesajes}
                              onAgregarPesaje={() =>
                                onAgregarPesaje(boleta.id, producto.codigo)
                              }
                              onUpdatePesaje={(pesajeId, field, value) =>
                                onUpdatePesaje(
                                  boleta.id,
                                  producto.codigo,
                                  pesajeId,
                                  field,
                                  value,
                                )
                              }
                              onRemovePesaje={(pesajeId) =>
                                onRemovePesaje(
                                  boleta.id,
                                  producto.codigo,
                                  pesajeId,
                                )
                              }
                            />
                          </div>
                        ) : (
                          <div className="border border-gray-200 rounded-lg p-3 bg-white flex items-center gap-3 h-full">
                            <div>
                              <Checkbox
                                checked={false}
                                onChange={() =>
                                  onToggleCodigoEnBoleta(
                                    boleta.id,
                                    producto.codigo,
                                  )
                                }
                                label={`Código ${producto.codigo}`}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
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
