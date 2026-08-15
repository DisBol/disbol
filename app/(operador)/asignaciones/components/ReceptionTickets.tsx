"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/InputField";
import { Checkbox } from "@/components/ui/Checkbox";
import { Card } from "@/components/ui/Card";
import CardCode from "@/components/ui/CardCode";
import { Modal } from "@/components/ui/Modal";
import { useContainer } from "../../configuraciones/hooks/contenedores/useContainer";
import { useProductsByCategory } from "../../configuraciones/hooks/productos/useProductsByCategory";
import { useGetAccount } from "../hooks/useGetAccount";
import RecibirEmpresaModal, {
  type EntregaEmpresa,
} from "./RecibirEmpresaModal";
import { Boleta, BoletaDetail } from "../types/reception.types";

interface ProductReception {
  codigo: string;
  cajas: number;
  unidades: number;
  kgBruto: number;
  kgNeto: number;
  kgRecibidos: number;
}

interface ReceptionTicketsProps {
  productos: ProductReception[];
  boletas: Boleta[];
  pesoTotalGeneral: string;
  isRecibir?: string;
  onAgregarBoleta: () => void;
  onAgregarBoletaFromCategory?: (categoryId: number) => void;
  onEliminarBoleta: (boletaId: string) => void;
  onUpdateBoleta: (
    boletaId: string,
    field: keyof Boleta,
    value: string | number | boolean | string[] | Record<string, BoletaDetail>,
  ) => void;
  onToggleCodigoEnBoleta: (boletaId: string, codigo: string) => void;
  onToggleMenudenciaEnBoleta: (boletaId: string, codigo: string) => void;
  onUpdateCantidadBoleta: (
    boletaId: string,
    codigo: string,
    field: "cajas" | "unidades" | "precio",
    value: number | string,
  ) => void;
  onUpdateTipoContenedorBoleta: (
    boletaId: string,
    codigo: string,
    tipo: "caja" | "pallet" | "contenedor",
  ) => void;
  onAgregarPesaje: (boletaId: string, codigo: string) => void;
  onUpdatePesaje: (
    boletaId: string,
    codigo: string,
    pesajeId: string,
    field: "cajas" | "unidades" | "kg" | "contenedor",
    value: number | string,
  ) => void;
  onRemovePesaje: (
    boletaId: string,
    codigo: string,
    pesajeId: string,
  ) => void | Promise<void>;
  onGuardarPesaje: (
    boletaId: string,
    codigo: string,
    pesajeId: string,
  ) => void | Promise<void>;
  onGuardarBoleta: (boletaId: string) => void;
  entregasList: EntregaEmpresa[];
  setEntregasList: React.Dispatch<React.SetStateAction<EntregaEmpresa[]>>;
  assignmentId: number;
}

export default function ReceptionTickets({
  productos,
  boletas,
  pesoTotalGeneral,
  isRecibir,
  onAgregarBoleta,
  onAgregarBoletaFromCategory,
  onEliminarBoleta,
  onUpdateBoleta,
  onToggleCodigoEnBoleta,
  // onToggleMenudenciaEnBoleta,
  onUpdateCantidadBoleta,
  // onUpdateTipoContenedorBoleta,
  onAgregarPesaje,
  onUpdatePesaje,
  onRemovePesaje,
  onGuardarPesaje,
  onGuardarBoleta,
  entregasList,
  setEntregasList,
  assignmentId,
}: ReceptionTicketsProps) {
  const { containers, containersData } = useContainer();
  const { accounts, loading: accountsLoading } = useGetAccount();
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useProductsByCategory();
  const readOnly = isRecibir === "true";
  const [savingBoletas, setSavingBoletas] = useState<Set<string>>(new Set());

  const [savingPesajes, setSavingPesajes] = useState<Set<string>>(new Set());

  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const [isEntregaModalOpen, setIsEntregaModalOpen] = useState(false);

  const handleAddCategoryBoleta = (categoryId: number) => {
    // Prefer explicit handler if provided, otherwise fallback to generic add
    if (typeof onAgregarBoletaFromCategory === "function") {
      onAgregarBoletaFromCategory(categoryId);
    } else {
      onAgregarBoleta();
    }
    setIsCategoriesModalOpen(false);
  };

  const codigoInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const prevBoletasCount = useRef<number>(0);

  useEffect(() => {
    if (boletas.length > prevBoletasCount.current) {
      const lastBoleta = boletas[boletas.length - 1];
      const input = codigoInputRefs.current[lastBoleta.id];
      if (input) {
        input.focus();
      }
    }
    prevBoletasCount.current = boletas.length;
  }, [boletas]);

  const getPesajeSaveKey = (
    boletaId: string,
    codigo: string,
    pesajeId: string,
  ) => `${boletaId}-${codigo}-${pesajeId}`;

  const handleGuardarBoleta = async (boletaId: string) => {
    if (savingBoletas.has(boletaId)) return;

    setSavingBoletas((prev) => {
      const next = new Set(prev);
      next.add(boletaId);
      return next;
    });

    try {
      await Promise.resolve(onGuardarBoleta(boletaId));
    } finally {
      setSavingBoletas((prev) => {
        const next = new Set(prev);
        next.delete(boletaId);
        return next;
      });
    }
  };



  const handleGuardarPesaje = async (
    boletaId: string,
    codigo: string,
    pesajeId: string,
  ) => {
    const saveKey = getPesajeSaveKey(boletaId, codigo, pesajeId);
    if (savingPesajes.has(saveKey)) return;

    setSavingPesajes((prev) => {
      const next = new Set(prev);
      next.add(saveKey);
      return next;
    });

    try {
      await Promise.resolve(onGuardarPesaje(boletaId, codigo, pesajeId));
    } finally {
      setSavingPesajes((prev) => {
        const next = new Set(prev);
        next.delete(saveKey);
        return next;
      });
    }
  };

  // Función para calcular el total_payment en tiempo real
  const calculateTotalPayment = (boleta: Boleta): number => {
    let totalPayment = 0;

    if (!boleta.precioDiferido) {
      // Precio NO diferido: total_payment = costoPorKg * suma de net_weight
      const costoPorKg = Number(boleta.costoPorKg) || 0;
      let totalNetWeight = 0;

      for (const codigo of boleta.codigosSeleccionados) {
        const detalle = boleta.detalles[codigo];
        if (detalle?.pesajes) {
          for (const pesaje of detalle.pesajes) {
            // Calcular net_weight de cada pesaje
            const selectedContainer = containersData?.find(
              (container) => container.id.toString() === pesaje.contenedor,
            );
            const destare = selectedContainer?.destare || 0;
            const grossWeight = Number(pesaje.kg) || 0;
            const cantidadCajas = Number(pesaje.cajas) || 0;
            const netWeight = grossWeight - destare * cantidadCajas;
            totalNetWeight += netWeight;
          }
        }
      }

      totalPayment = costoPorKg * totalNetWeight;
    } else {
      // Precio diferido: total_payment = suma de (precio_producto * net_weight_producto)
      for (const codigo of boleta.codigosSeleccionados) {
        const detalle = boleta.detalles[codigo];
        if (detalle?.pesajes) {
          const precioProducto = Number(detalle.precio) || 0;
          let netWeightProducto = 0;

          for (const pesaje of detalle.pesajes) {
            // Calcular net_weight de cada pesaje
            const selectedContainer = containersData?.find(
              (container) => container.id.toString() === pesaje.contenedor,
            );
            const destare = selectedContainer?.destare || 0;
            const grossWeight = Number(pesaje.kg) || 0;
            const cantidadCajas = Number(pesaje.cajas) || 0;
            const netWeight = grossWeight - destare * cantidadCajas;
            netWeightProducto += netWeight;
          }

          totalPayment += precioProducto * netWeightProducto;
        }
      }
    }

    return Math.round(totalPayment * 100) / 100; // Redondear a 2 decimales
  };

  const calculateBoletaTotals = (boleta: Boleta) => {
    return boleta.codigosSeleccionados.reduce(
      (acc, codigo) => {
        const detalle = boleta.detalles[codigo];
        if (!detalle) return acc;

        acc.totalCajas += Number(detalle.cajas) || 0;
        acc.totalUnidades += Number(detalle.unidades) || 0;

        const hasPesajes = (detalle.pesajes?.length || 0) > 0;
        let kgBruto = 0;
        let kgNeto = 0;
        let destare = 0;

        if (hasPesajes && detalle.pesajes) {
          kgBruto = detalle.pesajes.reduce(
            (sum, p) => sum + (Number(p.kg) || 0),
            0,
          );
          kgNeto = detalle.pesajes.reduce((sum, p) => {
            const selectedContainer = containersData?.find(
              (container) => container.id.toString() === p.contenedor,
            );
            const containerDestare = selectedContainer?.destare || 0;
            const grossWeight = Number(p.kg) || 0;
            const cantidadCajas = Number(p.cajas) || 0;
            const netWeight = grossWeight - containerDestare * cantidadCajas;
            return sum + netWeight;
          }, 0);
          destare = kgBruto - kgNeto;
        } else {
          kgBruto = Number(detalle.kgBruto) || 0;
          kgNeto = Number(detalle.kgNeto) || 0;
          destare = kgBruto - kgNeto;
        }

        acc.totalKgBruto += kgBruto;
        acc.totalKgNeto += kgNeto;
        acc.totalDestare += destare;

        return acc;
      },
      {
        totalCajas: 0,
        totalUnidades: 0,
        totalKgBruto: 0,
        totalKgNeto: 0,
        totalDestare: 0,
      },
    );
  };

  const resolveBoletaProducts = (boleta: Boleta) => {
    let result = [];
    if (boleta.categoryProducts && boleta.categoryProducts.length > 0) {
      result = boleta.categoryProducts;
    } else {
      const loadedProductIds = Object.values(boleta.detalles)
        .map((detalle) => detalle.productId)
        .filter((productId): productId is string => Boolean(productId));

      if (loadedProductIds.length === 0) {
        result = productos;
      } else {
        const matchedCategory = categories.find((category) => {
          const categoryProductIds = new Set(
            category.products.map((product) => product.id.toString()),
          );

          return loadedProductIds.every((productId) =>
            categoryProductIds.has(productId),
          );
        });

        if (matchedCategory) {
          result = matchedCategory.products.map((product) => ({
            codigo: product.name,
            cajas: 0,
            unidades: 0,
            kgBruto: 0,
            kgNeto: 0,
            kgRecibidos: 0,
          }));
        } else {
          const productsById = new Map(
            categories
              .flatMap((category) => category.products)
              .map((product) => [product.id.toString(), product]),
          );

          const resolvedProducts = loadedProductIds
            .map((productId) => productsById.get(productId))
            .filter((product): product is { id: number; name: string } =>
              Boolean(product),
            )
            .map((product) => ({
              codigo: product.name,
              cajas: 0,
              unidades: 0,
              kgBruto: 0,
              kgNeto: 0,
              kgRecibidos: 0,
            }));

          result = resolvedProducts.length > 0 ? resolvedProducts : productos;
        }
      }
    }

    // Sort by code numerically
    return [...result].sort((a, b) => {
      const numA = parseInt(a.codigo, 10);
      const numB = parseInt(b.codigo, 10);
      if (isNaN(numA) && isNaN(numB)) return a.codigo.localeCompare(b.codigo);
      if (isNaN(numA)) return 1;
      if (isNaN(numB)) return -1;
      return numA - numB;
    });
  };

  return (
    <Card className="p-4 md:p-6 mt-4">
      {/* Boletas de Recepción */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-md font-bold text-gray-900">Recepción</h2>
          {!readOnly && (
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="primary"
                onClick={() => setIsEntregaModalOpen(true)}
              >
                Registrar entrega de empresa
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {boletas.map((boleta, index) => (
            <div
              key={boleta.id}
              className="border border-gray-200 rounded-lg p-4 bg-gray-50"
            >
              {(() => {
                const isSaved = Boolean(boleta.ticketId);
                const {
                  totalCajas,
                  totalUnidades,
                  totalKgBruto,
                  totalKgNeto,
                  totalDestare,
                } = calculateBoletaTotals(boleta);
                const boletaProducts = resolveBoletaProducts(boleta);

                return (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-4 py-2">
                          <h3 className="text-md font-bold tracking-tight text-red-500 uppercase">
                            PESAJE
                          </h3>

                          <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-baseline gap-1.5 bg-gray-50 px-2 py-1 rounded-md border border-gray-200">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                                Destare
                              </span>
                              <span className="text-sm font-bold text-gray-800">
                                {totalDestare.toFixed(2)} kg
                              </span>
                            </div>

                            <div className="flex items-baseline gap-1.5 bg-gray-50 px-2 py-1 rounded-md border border-gray-200">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                                Peso Bruto Total
                              </span>
                              <span className="text-sm font-bold text-gray-800">
                                {totalKgBruto.toFixed(2)} kg
                              </span>
                            </div>

                            <div className="flex items-baseline gap-1.5 bg-red-50 px-2 py-1 rounded-md border border-red-200">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-red-500">
                                Pesaje Total
                              </span>
                              <span className="text-sm font-bold text-red-600">
                                {totalKgNeto.toFixed(2)} kg
                              </span>
                            </div>
                          </div>
                        </div>

                        {isSaved &&
                          boleta.flujoCompletado &&
                          boleta.hasPendingChanges && (
                            <p className="text-xs text-amber-700 mt-1">
                              Hay cambios pendientes en ticket o productos.
                            </p>
                          )}
                      </div>

                      <div className="flex gap-2">
                        {!readOnly && (
                          <Button
                            variant={
                              !isSaved
                                ? "success"
                                : boleta.hasPendingChanges
                                  ? "info"
                                  : "outline"
                            }
                            color={
                              !isSaved
                                ? "success"
                                : boleta.hasPendingChanges
                                  ? "info"
                                  : "secondary"
                            }
                            size="sm"
                            loading={savingBoletas.has(boleta.id)}
                            disabled={
                              savingBoletas.has(boleta.id) ||
                              (isSaved && !boleta.hasPendingChanges)
                            }
                            onClick={() => handleGuardarBoleta(boleta.id)}
                          >
                            {!isSaved
                              ? "Guardar Boleta"
                              : boleta.hasPendingChanges
                                ? "Guardar Cambios"
                                : "Guardado"}
                          </Button>
                        )}
                        {/* Removed Ver Detalle button */}
                      </div>
                    </div>

                    <>
                        {/* <div className="grid grid-cols-1 md:grid-cols-6 gap-5 mb-5">
                          <div>
                            <span className="text-xs font-bold text-gray-500 uppercase block mb-1">
                              CÓDIGO DE BOLETA
                            </span>
                            <InputField
                              ref={(el) => {
                                if (el) {
                                  codigoInputRefs.current[boleta.id] = el;
                                }
                              }}
                              placeholder="Ingrese código"
                              value={boleta.codigo}
                              disabled={readOnly}
                              onChange={(e) =>
                                onUpdateBoleta(
                                  boleta.id,
                                  "codigo",
                                  e.target.value,
                                )
                              }
                            />
                          </div>

                          <div>
                            <span className="text-xs font-bold text-gray-500 uppercase block mb-1">
                              COSTO POR KG (Bs)
                            </span>
                            <InputField
                              value={boleta.costoPorKg}
                              disabled={boleta.precioDiferido || readOnly}
                              onChange={(e) =>
                                onUpdateBoleta(
                                  boleta.id,
                                  "costoPorKg",
                                  e.target.value,
                                )
                              }
                            />
                          </div>

                          <div>
                            <span className="text-xs font-bold text-gray-500 uppercase block mb-1">
                              COSTO BOLETA
                            </span>
                            <InputField
                              value={boleta.ticket_payment}
                              disabled={readOnly}
                              onChange={(e) =>
                                onUpdateBoleta(
                                  boleta.id,
                                  "ticket_payment",
                                  e.target.value,
                                )
                              }
                            />
                          </div>

                          <div>
                            <span className="text-xs font-bold text-gray-500 uppercase block mb-1">
                              PESO BOLETA
                            </span>
                            <InputField
                              value={boleta.ticket_weight ?? ""}
                              disabled={readOnly}
                              onChange={(e) =>
                                onUpdateBoleta(
                                  boleta.id,
                                  "ticket_weight",
                                  e.target.value,
                                )
                              }
                            />
                          </div>

                          <div>
                            <span className="text-xs font-bold text-gray-500 uppercase block mb-1">
                              CUENTA
                            </span>
                            <select
                              value={boleta.Account_id || ""}
                              disabled={readOnly || accountsLoading}
                              onChange={(e) =>
                                onUpdateBoleta(
                                  boleta.id,
                                  "Account_id",
                                  e.target.value ? Number(e.target.value) : 0,
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            >
                              <option value="">Seleccionar cuenta...</option>
                              {accounts.map((account) => (
                                <option key={account.id} value={account.id}>
                                  {account.name} ({account.code})
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <span className="text-xs font-bold text-gray-500 uppercase block mb-1">
                              COSTO CALCULADO
                            </span>
                            <div className="text-2x1 font-bold text-black-500">
                              Bs {calculateTotalPayment(boleta).toFixed(2)}
                            </div>
                          </div>
                        </div> */}

                        {/* <div className="mb-4">
                          <Checkbox
                            label="Precio diferido"
                            checked={boleta.precioDiferido}
                            disabled={readOnly}
                            onChange={(checked) =>
                              onUpdateBoleta(
                                boleta.id,
                                "precioDiferido",
                                checked,
                              )
                            }
                          />
                        </div> */}

                        {/* Códigos en esta Boleta */}
                        <div className="mb-4">
                          <h4 className="text-sm font-bold text-gray-600 uppercase mb-3">
                            Códigos
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
                            {boletaProducts.map((producto) => {
                              const isSelected =
                                boleta.codigosSeleccionados.includes(
                                  producto.codigo,
                                );
                              // const isMenudencia = boleta.menudencias?.includes(
                              //   producto.codigo,
                              // );

                              const detalle = boleta.detalles?.[
                                producto.codigo
                              ] || {
                                cajas: 0,
                                unidades: 0,
                              };

                              const totalPesajeCajas = (
                                detalle.pesajes || []
                              ).reduce(
                                (sum, pesaje) =>
                                  sum + (Number(pesaje.cajas) || 0),
                                0,
                              );
                              const totalPesajeUnidades = (
                                detalle.pesajes || []
                              ).reduce(
                                (sum, pesaje) =>
                                  sum + (Number(pesaje.unidades) || 0),
                                0,
                              );

                              const totalPesajeKgBruto = (
                                detalle.pesajes || []
                              ).reduce(
                                (sum, pesaje) => sum + (Number(pesaje.kg) || 0),
                                0,
                              );

                              const totalPesajeKgNeto = (
                                detalle.pesajes || []
                              ).reduce((sum, pesaje) => {
                                const selectedContainer = containersData?.find(
                                  (container) =>
                                    container.id.toString() ===
                                    pesaje.contenedor,
                                );
                                const destare = selectedContainer?.destare || 0;
                                const grossWeight = Number(pesaje.kg) || 0;
                                const cantidadCajas = Number(pesaje.cajas) || 0;
                                const netWeight =
                                  grossWeight - destare * cantidadCajas;
                                return sum + netWeight;
                              }, 0);

                              const kgBrutoRealtime =
                                (detalle.pesajes?.length || 0) > 0
                                  ? totalPesajeKgBruto
                                  : Number(detalle.kgBruto) || 0;

                              const kgNetoRealtime =
                                (detalle.pesajes?.length || 0) > 0
                                  ? totalPesajeKgNeto
                                  : Number(detalle.kgNeto) || 0;

                              return (
                                <div
                                  key={producto.codigo}
                                  className="relative h-full"
                                >
                                  {isSelected ? (
                                    <div className="h-full">
                                      <CardCode
                                        label={
                                          <div className="flex items-center justify-center gap-2">
                                            <Checkbox
                                              checked={true}
                                              disabled={readOnly}
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
                                        cajas={totalPesajeCajas}
                                        unidades={totalPesajeUnidades}
                                        topReadOnly={true}
                                        readOnly={readOnly}
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
                                        productName={producto.codigo}
                                        variant="active"
                                        // Don't pass menudencia props to hide the checkbox at bottom
                                        weightInfo={{
                                          bruto: `${kgBrutoRealtime.toFixed(2)}`,
                                          neto: `${kgNetoRealtime.toFixed(2)}`,
                                        }}
                                        className="pointer-events-auto h-full"
                                        pesajes={detalle.pesajes}
                                        onAgregarPesaje={() =>
                                          onAgregarPesaje(
                                            boleta.id,
                                            producto.codigo,
                                          )
                                        }
                                        disableAgregarPesaje={readOnly}
                                        onUpdatePesaje={
                                          readOnly
                                            ? undefined
                                            : (pesajeId, field, value) =>
                                                onUpdatePesaje(
                                                  boleta.id,
                                                  producto.codigo,
                                                  pesajeId,
                                                  field,
                                                  value,
                                                )
                                        }
                                        onRemovePesaje={
                                          readOnly
                                            ? undefined
                                            : (pesajeId) =>
                                                onRemovePesaje(
                                                  boleta.id,
                                                  producto.codigo,
                                                  pesajeId,
                                                )
                                        }
                                        onGuardarPesaje={
                                          readOnly
                                            ? undefined
                                            : (pesajeId) =>
                                                handleGuardarPesaje(
                                                  boleta.id,
                                                  producto.codigo,
                                                  pesajeId,
                                                )
                                        }
                                        isSavingPesaje={(pesajeId) =>
                                          savingPesajes.has(
                                            getPesajeSaveKey(
                                              boleta.id,
                                              producto.codigo,
                                              pesajeId,
                                            ),
                                          )
                                        }
                                        containers={containers}
                                        disableAutoComplete={true}
                                      />
                                    </div>
                                  ) : (
                                    <div className="border border-gray-200 rounded-lg p-3 bg-white flex items-center gap-3 h-full">
                                      <div>
                                        <Checkbox
                                          checked={false}
                                          disabled={readOnly}
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
                      </>
                  </>
                );
              })()}
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={isCategoriesModalOpen}
        onClose={() => setIsCategoriesModalOpen(false)}
        title="Categorías disponibles"
        size="xl"
      >
        {categoriesLoading ? (
          <p className="text-sm text-gray-500">Cargando categorías...</p>
        ) : categoriesError ? (
          <p className="text-sm text-red-600">
            No se pudieron cargar las categorías.
          </p>
        ) : categories.length === 0 ? (
          <p className="text-sm text-gray-500">
            No hay categorías disponibles.
          </p>
        ) : (
          <div className="space-y-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold uppercase text-red-600">
                    {category.name}
                  </h3>
                  <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                    <span className="text-xs text-gray-500">
                      {category.products.length} productos
                    </span>
                    {!readOnly && (
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleAddCategoryBoleta(category.id)}
                      >
                        Agregar boleta
                      </Button>
                    )}
                  </div>
                </div>
                {/* <div className="mt-3 flex flex-wrap gap-2">
                  {category.products.map((product) => (
                    <span
                      key={product.id}
                      className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700"
                    >
                      {product.name}
                    </span>
                  ))}
                </div> */}
              </div>
            ))}
          </div>
        )}
      </Modal>

      <RecibirEmpresaModal
        isOpen={isEntregaModalOpen}
        onClose={() => setIsEntregaModalOpen(false)}
        entregasList={entregasList}
        setEntregasList={setEntregasList}
        assignmentId={assignmentId}
      />
    </Card>
  );
}
