"use client";

import React, { useState, useMemo, useEffect } from "react";
import ReceptionSummaryModal from "./ReceptionSummaryModal";
import ReceptionHeader from "./ReceptionHeader";
import ReceptionTickets from "./ReceptionTickets";
import { Assignment, useAssignmentsStore } from "../stores/assignments-store";
import { useAddAssignmentStage } from "../hooks/useAddAssignmentStage";
import { useAddTicket } from "../hooks/useAddTicket";
import { useAddProductAssignment } from "../hooks/useAddProductAssignment";
import { useAddTicketsWeighing } from "../hooks/useAddTicketsWeighing";
import { useUpdateProductAssignment } from "../hooks/useUpdateProductAssignment";
import { useUpdateTicket } from "../hooks/useUpdateTicket";
import { useContainer } from "../../configuraciones/hooks/contenedores/useContainer";
import { useGetTicketsHistory } from "../hooks/useGetTicketsHistory";

// Interfaces
interface ProductReception {
  codigo: string;
  cajas: number;
  unidades: number;
  kgBruto: number;
  kgNeto: number;
  kgRecibidos: number;
  productId: string;
  active: boolean; // Agregar estado activo
}

export interface PesajeData {
  id: string;
  cajas: number;
  unidades: number;
  kg: number;
  contenedor?: string;
}

interface BoletaDetail {
  cajas: number;
  unidades: number;
  precio?: string;
  pesajes?: PesajeData[];
  kgBruto?: number;
  kgNeto?: number;
  _isEdited?: boolean; // Flag para saber si los valores han sido editados por el usuario
}

interface Boleta {
  id: string;
  ticketId?: string;
  codigo: string;
  costoPorKg: string;
  costoTotal: string;
  precioDiferido: boolean;
  codigosSeleccionados: string[];
  menudencias: string[];
  detalles: Record<string, BoletaDetail>;
  tiposContenedor: Record<string, "caja" | "pallet" | "contenedor">;
}

interface ReceptionScreenProps {
  assignment: Assignment;
  onBack: () => void;
}

export default function ReceptionScreen({
  assignment,
  onBack,
}: ReceptionScreenProps) {
  // Obtener rawData del store para acceder a productos de posición 2
  const { rawData } = useAssignmentsStore();

  // Transformar productos del assignment a formato de recepción
  const productos = useMemo<ProductReception[]>(() => {
    // Mostrar todos los productos del assignment que tienen posición === 1 (activos e inactivos)
    return assignment.productos
      .filter((p) => p.posicion === 1)
      .map((p) => ({
        codigo: p.codigo,
        cajas: p.cajas,
        unidades: p.unidades,
        kgBruto: p.kgBruto,
        kgNeto: p.kgNeto,
        kgRecibidos: 0.0,
        productId: p.productId,
        active: p.active,
      }));
  }, [assignment.productos]);

  const { addAssignmentStage } = useAddAssignmentStage();
  const { addTicket } = useAddTicket();
  const { addProductAssignment } = useAddProductAssignment();
  const { addTicketsWeighing } = useAddTicketsWeighing();
  const { updateProductAssignment } = useUpdateProductAssignment();
  const { updateTicket } = useUpdateTicket();
  const { containersData } = useContainer();

  const [boletas, setBoletas] = useState<Boleta[]>([
    {
      id: "1",
      codigo: "",
      costoPorKg: "0.00",
      costoTotal: "0.00",
      precioDiferido: false,
      codigosSeleccionados: [],
      menudencias: [],
      detalles: {},
      tiposContenedor: {},
    },
  ]);

  const { fetchTicketsHistory } = useGetTicketsHistory();

  useEffect(() => {
    let isMounted = true;
    const loadTickets = async () => {
      // Una sola llamada con el Assignment_id seleccionado
      const data = await fetchTicketsHistory(Number(assignment.id));
      if (!data || !data.data || data.data.length === 0) return;

      // Agrupar filas por Tickets_id para construir una Boleta por ticket
      const boletasMap = new Map<string, Boleta>();

      data.data.forEach((row) => {
        const ticketId = row.Tickets_id?.toString() ?? "";
        if (!ticketId) return;

        if (!boletasMap.has(ticketId)) {
          const isDeferred =
            String(row.Tickets_deferred_payment) === "1" ||
            String(row.Tickets_deferred_payment) === "true";

          boletasMap.set(ticketId, {
            id: ticketId,
            ticketId: ticketId,
            codigo: row.Tickets_code || "",
            costoPorKg: row.Tickets_product_payment?.toString() || "0",
            costoTotal: row.Tickets_product_payment?.toString() || "0",
            precioDiferido: isDeferred,
            codigosSeleccionados: [],
            menudencias: [],
            detalles: {},
            tiposContenedor: {},
          });
        }

        const boleta = boletasMap.get(ticketId)!;
        const isDeferred =
          String(row.Tickets_deferred_payment) === "1" ||
          String(row.Tickets_deferred_payment) === "true";

        if (!boleta.codigosSeleccionados.includes(row.Product_name)) {
          boleta.codigosSeleccionados.push(row.Product_name);
          boleta.detalles[row.Product_name] = {
            cajas: Number(row.ProductAssignment_container) || 0,
            unidades: Number(row.ProductAssignment_units) || 0,
            precio: isDeferred
              ? row.ProductAssignment_payment?.toString() || "0"
              : row.Tickets_product_payment?.toString() || "0",
            pesajes: [],
            kgBruto: Number(row.ProductAssignment_gross_weight) || 0,
            kgNeto: Number(row.ProductAssignment_net_weight) || 0,
            _isEdited: true,
          };
        }

        if (row.TicketsWeighing_id) {
          boleta.detalles[row.Product_name].pesajes?.push({
            id: row.TicketsWeighing_id.toString(),
            cajas: Number(row.TicketsWeighing_container) || 0,
            unidades: Number(row.TicketsWeighing_units) || 0,
            kg: Number(row.TicketsWeighing_gross_weight) || 0,
            contenedor: row.TicketsWeighing_Container_id?.toString() || "",
          });
        }
      });

      const allLoadedBoletas = Array.from(boletasMap.values());

      if (isMounted && allLoadedBoletas.length > 0) {
        setBoletas((prev) => {
          if (
            prev.length === 1 &&
            !prev[0].codigo &&
            prev[0].codigosSeleccionados.length === 0
          ) {
            return allLoadedBoletas;
          }
          return prev;
        });
      }
    };

    // Ejecutar loadTickets la primera vez
    if (
      boletas.length === 1 &&
      !boletas[0].codigo &&
      boletas[0].codigosSeleccionados.length === 0
    ) {
      loadTickets();
    }

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignment.id]);

  const { costoTotalGeneral, pesoTotalGeneral } = useMemo(() => {
    let totalCost = 0;
    let totalWeight = 0;

    boletas.forEach((boleta) => {
      let boletaCost = 0;
      let boletaWeight = 0;

      if (!boleta.precioDiferido) {
        const costoPorKg = Number(boleta.costoPorKg) || 0;
        let totalNetWeight = 0;

        for (const codigo of boleta.codigosSeleccionados) {
          const detalle = boleta.detalles[codigo];
          if (detalle?.pesajes) {
            for (const pesaje of detalle.pesajes) {
              const selectedContainer = containersData?.find(
                (container) => container.id.toString() === pesaje.contenedor,
              );
              const destare = selectedContainer?.destare || 0;
              const grossWeight = Number(pesaje.kg) || 0;
              const cantidadCajas = Number(pesaje.cajas) || 0;
              const netWeight = Math.max(
                0,
                grossWeight - destare * cantidadCajas,
              );
              totalNetWeight += netWeight;
            }
          }
        }

        boletaCost = costoPorKg * totalNetWeight;
        boletaWeight = totalNetWeight;
      } else {
        for (const codigo of boleta.codigosSeleccionados) {
          const detalle = boleta.detalles[codigo];
          if (detalle?.pesajes) {
            const precioProducto = Number(detalle.precio) || 0;
            let netWeightProducto = 0;

            for (const pesaje of detalle.pesajes) {
              const selectedContainer = containersData?.find(
                (container) => container.id.toString() === pesaje.contenedor,
              );
              const destare = selectedContainer?.destare || 0;
              const grossWeight = Number(pesaje.kg) || 0;
              const cantidadCajas = Number(pesaje.cajas) || 0;
              const netWeight = Math.max(
                0,
                grossWeight - destare * cantidadCajas,
              );
              netWeightProducto += netWeight;
            }

            boletaCost += precioProducto * netWeightProducto;
            boletaWeight += netWeightProducto;
          }
        }
      }

      totalCost += boletaCost;
      totalWeight += boletaWeight;
    });

    return {
      costoTotalGeneral: (Math.round(totalCost * 100) / 100).toFixed(2),
      pesoTotalGeneral: (Math.round(totalWeight * 100) / 100).toFixed(2),
    };
  }, [boletas, containersData]);

  const [showResumenModal, setShowResumenModal] = useState(false);

  const handleAgregarBoleta = () => {
    const nuevaBoleta: Boleta = {
      id: Date.now().toString(),
      codigo: "",
      costoPorKg: "0.00",
      costoTotal: "0.00",
      precioDiferido: false,
      codigosSeleccionados: [],
      menudencias: [],
      detalles: {},
      tiposContenedor: {},
    };
    setBoletas([...boletas, nuevaBoleta]);
  };

  const handleEliminarBoleta = (boletaId: string) => {
    setBoletas(boletas.filter((b) => b.id !== boletaId));
  };

  const updateBoleta = (
    boletaId: string,
    field: keyof Boleta,
    value:
      | string
      | boolean
      | string[]
      | Record<string, BoletaDetail>
      | Record<string, "caja" | "pallet" | "contenedor">,
  ) => {
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
          const isSelected = codigosActuales.includes(codigo);
          let nuevosCodigos;
          const nuevosDetalles = { ...boleta.detalles };

          if (isSelected) {
            console.log(`📤 DESELECCIONANDO producto ${codigo}`);
            nuevosCodigos = codigosActuales.filter((c) => c !== codigo);
            // Al deseleccionar, remover el detalle completamente
            delete nuevosDetalles[codigo];
          } else {
            console.log(`📥 SELECCIONANDO producto ${codigo}`);
            nuevosCodigos = [...codigosActuales, codigo];
            // Al seleccionar por primera vez, NO crear detalle automáticamente
            // Solo crear la estructura mínima para que el usuario pueda editarla
            if (!nuevosDetalles[codigo]) {
              const productoData = productos.find((p) => p.codigo === codigo);
              console.log(`📥 Inicializando detalle para ${codigo} con:`, {
                cajasOriginales: productoData?.cajas,
                unidadesOriginales: productoData?.unidades,
              });

              nuevosDetalles[codigo] = {
                cajas: productoData?.cajas || 0,
                unidades: productoData?.unidades || 0,
                pesajes: [],
                _isEdited: false, // IMPORTANTE: marcar como NO editado inicialmente
              };
            }
          }
          return {
            ...boleta,
            codigosSeleccionados: nuevosCodigos,
            detalles: nuevosDetalles,
          };
        }
        return boleta;
      }),
    );
  };

  const updateCantidadBoleta = (
    boletaId: string,
    codigo: string,
    field: "cajas" | "unidades" | "precio",
    value: number | string,
  ) => {
    // Log para rastrear el origen de las llamadas
    console.log(
      `🔥 Usuario editó ${field} para producto ${codigo}: ${value} (marcando como editado)`,
    );
    console.trace("🔍 Origen de la llamada updateCantidadBoleta:");

    setBoletas((prevBoletas) => {
      const nuevasBoletas = prevBoletas.map((boleta) => {
        if (boleta.id === boletaId) {
          const detalleActual = boleta.detalles[codigo];

          console.log(
            `🔥 Detalle actual antes de actualizar ${codigo}:`,
            detalleActual,
          );

          // Si no existe el detalle, inicializar con valores del producto original
          if (!detalleActual) {
            const productoData = productos.find((p) => p.codigo === codigo);
            const detalleInicial = {
              cajas: productoData?.cajas || 0,
              unidades: productoData?.unidades || 0,
              pesajes: [],
              _isEdited: false,
            };

            const nuevoDetalle = {
              ...detalleInicial,
              [field]: field === "precio" ? String(value) : Number(value),
              _isEdited: true, // Marcar como editado cuando el usuario cambia un valor
            };

            console.log(`🔥 Detalle creado para ${codigo}:`, {
              inicial: detalleInicial,
              final: nuevoDetalle,
              fieldEditado: field,
              valorNuevo: value,
            });

            return {
              ...boleta,
              detalles: {
                ...boleta.detalles,
                [codigo]: nuevoDetalle,
              },
            };
          }

          // Si existe el detalle, actualizar y marcar como editado
          const nuevoDetalle = {
            ...detalleActual,
            [field]: field === "precio" ? String(value) : Number(value),
            _isEdited: true, // Marcar como editado cuando el usuario cambia un valor
          };

          console.log(`🔥 Detalle actualizado para ${codigo}:`, {
            anterior: detalleActual,
            nuevo: nuevoDetalle,
            campo: field,
            valor: value,
            valorAnterior: detalleActual[field as keyof typeof detalleActual],
          });

          return {
            ...boleta,
            detalles: {
              ...boleta.detalles,
              [codigo]: nuevoDetalle,
            },
          };
        }
        return boleta;
      });

      // Log del estado final
      const boletaActualizada = nuevasBoletas.find((b) => b.id === boletaId);
      const detalleActualizado = boletaActualizada?.detalles[codigo];
      console.log(
        `🔥 Estado final COMPLETO del detalle para ${codigo}:`,
        detalleActualizado,
      );

      return nuevasBoletas;
    });
  };

  const updateTipoContenedorBoleta = (
    boletaId: string,
    codigo: string,
    tipo: "caja" | "pallet" | "contenedor",
  ) => {
    setBoletas(
      boletas.map((boleta) => {
        if (boleta.id === boletaId) {
          return {
            ...boleta,
            tiposContenedor: {
              ...boleta.tiposContenedor,
              [codigo]: tipo,
            },
          };
        }
        return boleta;
      }),
    );
  };

  const toggleMenudenciaEnBoleta = (boletaId: string, codigo: string) => {
    setBoletas(
      boletas.map((boleta) => {
        if (boleta.id === boletaId) {
          const menudenciasActuales = boleta.menudencias;
          const nuevasMenudencias = menudenciasActuales.includes(codigo)
            ? menudenciasActuales.filter((c) => c !== codigo)
            : [...menudenciasActuales, codigo];
          return { ...boleta, menudencias: nuevasMenudencias };
        }
        return boleta;
      }),
    );
  };

  const handleAgregarPesaje = (boletaId: string, codigo: string) => {
    // Buscar el contenedor por defecto (deff: true)
    const defaultContainer = containersData?.find(
      (container) =>
        container.deff === true ||
        container.deff === "true" ||
        container.deff === 1,
    );
    const defaultContainerId = defaultContainer?.id.toString() || "";

    setBoletas(
      boletas.map((boleta) => {
        if (boleta.id === boletaId) {
          const detalleActual = boleta.detalles[codigo];

          // Si no existe el detalle, inicializarlo con valores del producto original
          let baseDetalle;
          if (!detalleActual) {
            const productoData = productos.find((p) => p.codigo === codigo);
            baseDetalle = {
              cajas: productoData?.cajas || 0,
              unidades: productoData?.unidades || 0,
              pesajes: [],
              _isEdited: false,
            };
          } else {
            baseDetalle = detalleActual;
          }

          const nuevosPesajes = [
            ...(baseDetalle.pesajes || []),
            {
              id: Date.now().toString() + Math.random().toString(),
              cajas: 0,
              unidades: 0,
              kg: 0,
              contenedor: defaultContainerId,
            },
          ];
          return {
            ...boleta,
            detalles: {
              ...boleta.detalles,
              [codigo]: {
                ...baseDetalle,
                pesajes: nuevosPesajes,
              },
            },
          };
        }
        return boleta;
      }),
    );
  };

  const handleUpdatePesaje = (
    boletaId: string,
    codigo: string,
    pesajeId: string,
    field: "cajas" | "unidades" | "kg" | "contenedor",
    value: number | string,
  ) => {
    setBoletas(
      boletas.map((boleta) => {
        if (boleta.id === boletaId) {
          const detalleActual = boleta.detalles[codigo];
          if (!detalleActual || !detalleActual.pesajes) return boleta;

          const nuevosPesajes = detalleActual.pesajes.map((pesaje) => {
            if (pesaje.id === pesajeId) {
              return { ...pesaje, [field]: value };
            }
            return pesaje;
          });

          return {
            ...boleta,
            detalles: {
              ...boleta.detalles,
              [codigo]: {
                ...detalleActual,
                pesajes: nuevosPesajes,
              },
            },
          };
        }
        return boleta;
      }),
    );
  };

  const handleRemovePesaje = (
    boletaId: string,
    codigo: string,
    pesajeId: string,
  ) => {
    setBoletas(
      boletas.map((boleta) => {
        if (boleta.id === boletaId) {
          const detalleActual = boleta.detalles[codigo];
          if (!detalleActual || !detalleActual.pesajes) return boleta;

          const nuevosPesajes = detalleActual.pesajes.filter(
            (pesaje) => pesaje.id !== pesajeId,
          );

          return {
            ...boleta,
            detalles: {
              ...boleta.detalles,
              [codigo]: {
                ...detalleActual,
                pesajes: nuevosPesajes,
              },
            },
          };
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

  const handleGuardarBoleta = async (boletaId: string) => {
    const boleta = boletas.find((b) => b.id === boletaId);
    if (!boleta) return;

    try {
      // MEJORAS IMPLEMENTADAS:
      // 1. Se usan los valores originales del producto cuando no hay detalles editados
      // 2. Se agregan logs para debug de valores
      // 3. Se valida que los valores sean consistentes

      // Siempre crear un nuevo assignment stage
      const newStageId = await addAssignmentStage({
        position: "2",
        in_container: 0,
        out_container: 0,
        units: 0,
        container: 0,
        payment: "0",
        Assignment_id: assignment.id,
      });

      if (!newStageId) {
        console.error("Failed to create assignment stage");
        return;
      }

      const stageId = newStageId.toString();

      const newTicketId = await addTicket({
        code: boleta.codigo || "0",
        deferred_payment: boleta.precioDiferido ? "1" : "0",
        total_payment: boleta.costoTotal || "0",
        product_payment: boleta.precioDiferido ? "0" : boleta.costoPorKg || "0",
        AssignmentStage_id: stageId,
      });

      if (newTicketId) {
        console.log("Ticket created successfully", newTicketId);

        let totalNetWeightAllProducts = 0; // Acumular el net weight total de todos los productos
        let totalPaymentWeightSum = 0; // Acumular payment * net_weight para precio diferido

        for (const codigo of boleta.codigosSeleccionados) {
          const detalle = boleta.detalles[codigo];
          const productoData = productos.find((p) => p.codigo === codigo);

          if (productoData && productoData.productId) {
            // LÓGICA CORREGIDA:
            // - Si existe detalle Y fue editado por el usuario (_isEdited = true): usar valores editados
            // - Si NO existe detalle O NO fue editado: usar valores originales del producto
            const usarValoresEditados = detalle && detalle._isEdited === true;

            const cajasValue = usarValoresEditados
              ? Number(detalle.cajas) || 0
              : Number(productoData.cajas) || 0;

            const unidadesValue = usarValoresEditados
              ? Number(detalle.unidades) || 0
              : Number(productoData.unidades) || 0;

            // Debug logs específicos para encontrar el problema
            console.log(`🚨 ANÁLISIS DETALLADO para ${codigo}:`, {
              "1_detalleCompleto": detalle,
              "2_detalleExiste": !!detalle,
              "3_fueEditado": detalle?._isEdited,
              "4_usarValoresEditados": usarValoresEditados,
              "5_detalle_cajas_RAW": detalle?.cajas,
              "6_detalle_unidades_RAW": detalle?.unidades,
              "7_producto_cajas_ORIGINAL": productoData.cajas,
              "8_producto_unidades_ORIGINAL": productoData.unidades,
              "9_cajasValue_FINAL": cajasValue,
              "10_unidadesValue_FINAL": unidadesValue,
              "11_fuenteDatos": usarValoresEditados
                ? "VALORES EDITADOS (detalle)"
                : "VALORES ORIGINALES (producto)",
            });

            // Validar que los valores no sean 0 si es importante para el negocio
            if (cajasValue <= 0 && unidadesValue <= 0) {
              console.warn(
                `❌ Producto ${codigo} tiene valores 0 en cajas y unidades. Verificar si esto es correcto.`,
              );
            }

            // Validación adicional antes de enviar a la API
            console.log(
              `🎯 VERIFICACIÓN FINAL antes de crear ProductAssignment para ${codigo}:`,
              {
                cajasEnviadas: cajasValue,
                unidadesEnviadas: unidadesValue,
                detalle_cajas_actual: detalle?.cajas,
                detalle_unidades_actual: detalle?.unidades,
                son_iguales_cajas: cajasValue === Number(detalle?.cajas),
                son_iguales_unidades:
                  unidadesValue === Number(detalle?.unidades),
              },
            );

            // Determinar el payment según si es precio diferido o no
            const paymentValue = boleta.precioDiferido
              ? detalle?.precio || "0"
              : "0";

            const newProductAssignmentId = await addProductAssignment({
              container: cajasValue,
              units: unidadesValue,
              menudencia: "0",
              net_weight: "0",
              gross_weight: "0",
              payment: paymentValue,
              Tickets_id: newTicketId.toString(),
              Product_id: productoData.productId.toString(),
              active: "true",
            });

            if (
              newProductAssignmentId &&
              detalle.pesajes &&
              detalle.pesajes.length > 0
            ) {
              console.log(
                `Product assignment created: ${newProductAssignmentId}. Sending pesajes...`,
              );

              let totalNetWeight = 0;
              let totalGrossWeight = 0;

              for (const pesaje of detalle.pesajes) {
                // Buscar el contenedor seleccionado para obtener su destare
                const selectedContainer = containersData?.find(
                  (container) => container.id.toString() === pesaje.contenedor,
                );
                const destare = selectedContainer?.destare || 0;
                const grossWeight = Number(pesaje.kg) || 0;
                const cantidadCajas = Number(pesaje.cajas) || 0;
                const netWeight = grossWeight - destare * cantidadCajas;

                // Acumular los totales
                totalNetWeight += netWeight;
                totalGrossWeight += grossWeight;

                await addTicketsWeighing({
                  gross_weight: grossWeight,
                  net_weight: netWeight,
                  units: Number(pesaje.unidades) || 0,
                  container: cantidadCajas,
                  Container_id: pesaje.contenedor || "",
                  ProductAssignment_id: newProductAssignmentId.toString(),
                });
              }

              // Acumular para el total del ticket
              totalNetWeightAllProducts += totalNetWeight;

              // Para precio diferido: acumular payment * net_weight
              if (boleta.precioDiferido) {
                const productPayment = Number(paymentValue) || 0;
                totalPaymentWeightSum += productPayment * totalNetWeight;
              }

              // Actualizar el ProductAssignment con las sumas totales
              await updateProductAssignment({
                id: newProductAssignmentId.toString(),
                container: cajasValue,
                units: unidadesValue,
                menudencia: "0",
                net_weight: totalNetWeight.toString(),
                gross_weight: totalGrossWeight.toString(),
                payment: paymentValue,
                active: "true",
                Tickets_id: newTicketId.toString(),
                Product_id: productoData.productId.toString(),
              });
            }
          }
        }

        // Actualizar total_payment del ticket
        let finalTotalPayment = 0;
        if (!boleta.precioDiferido) {
          // Precio NO diferido: total_payment = product_payment * totalNetWeight
          const productPayment = Number(boleta.costoPorKg) || 0;
          finalTotalPayment = productPayment * totalNetWeightAllProducts;

          await updateTicket({
            id: newTicketId.toString(),
            code: boleta.codigo || "0",
            deferred_payment: "0",
            total_payment: finalTotalPayment.toString(),
            product_payment: boleta.costoPorKg || "0",
            active: "true",
            AssignmentStage_id: Number(stageId),
          });

          console.log(
            `Ticket total_payment updated (NO diferido): ${finalTotalPayment} (${Number(boleta.costoPorKg)} * ${totalNetWeightAllProducts})`,
          );
        } else {
          // Precio diferido: total_payment = suma de (payment * net_weight) de todos los productAssignment
          finalTotalPayment = totalPaymentWeightSum;

          await updateTicket({
            id: newTicketId.toString(),
            code: boleta.codigo || "0",
            deferred_payment: "1",
            total_payment: totalPaymentWeightSum.toString(),
            product_payment: "0",
            active: "true",
            AssignmentStage_id: Number(stageId),
          });

          console.log(
            `Ticket total_payment updated (diferido): ${totalPaymentWeightSum} (suma de payment * net_weight)`,
          );
        }

        // Actualizar la boleta en el estado local con el ticketId y datos calculados
        // para mostrar los datos en tiempo real sin recargar la lista
        setBoletas((prev) =>
          prev.map((b) => {
            if (b.id !== boletaId) return b;

            // Recalcular kgBruto y kgNeto por código para mostrarlos en UI
            const detallesActualizados = { ...b.detalles };
            for (const codigo of b.codigosSeleccionados) {
              const detalle = detallesActualizados[codigo];
              if (!detalle || !detalle.pesajes) continue;
              let totalBruto = 0;
              let totalNeto = 0;
              for (const pesaje of detalle.pesajes) {
                const selectedContainer = containersData?.find(
                  (c) => c.id.toString() === pesaje.contenedor,
                );
                const destare = selectedContainer?.destare || 0;
                const grossWeight = Number(pesaje.kg) || 0;
                const cantidadCajas = Number(pesaje.cajas) || 0;
                totalBruto += grossWeight;
                totalNeto += grossWeight - destare * cantidadCajas;
              }
              detallesActualizados[codigo] = {
                ...detalle,
                kgBruto: totalBruto,
                kgNeto: totalNeto,
              };
            }

            return {
              ...b,
              ticketId: newTicketId.toString(),
              id: newTicketId.toString(),
              costoTotal: finalTotalPayment.toString(),
              detalles: detallesActualizados,
            };
          }),
        );

        console.log(
          "Boleta guardada y actualizada en tiempo real exitosamente",
        );

        console.log("Resumen final de la boleta guardada:", {
          boletaId: boleta.id,
          ticketId: newTicketId.toString(),
          totalNetWeight: totalNetWeightAllProducts,
          finalTotalPayment,
          productosGuardados: boleta.codigosSeleccionados.length,
        });
      }
    } catch (error) {
      console.error("Error saving boleta", error);
    }
  };

  return (
    <div className="min-h-screen max-w-full">
      <ReceptionHeader
        assignment={assignment}
        productos={productos}
        costoTotalGeneral={costoTotalGeneral}
        onBack={onBack}
        onRegistrarRecepcion={handleRegistrarRecepcion}
      />

      <ReceptionTickets
        productos={productos}
        boletas={boletas}
        pesoTotalGeneral={pesoTotalGeneral}
        onAgregarBoleta={handleAgregarBoleta}
        onEliminarBoleta={handleEliminarBoleta}
        onUpdateBoleta={updateBoleta}
        onToggleCodigoEnBoleta={toggleCodigoEnBoleta}
        onToggleMenudenciaEnBoleta={toggleMenudenciaEnBoleta}
        onUpdateCantidadBoleta={updateCantidadBoleta}
        onUpdateTipoContenedorBoleta={updateTipoContenedorBoleta}
        onAgregarPesaje={handleAgregarPesaje}
        onUpdatePesaje={handleUpdatePesaje}
        onRemovePesaje={handleRemovePesaje}
        onGuardarBoleta={handleGuardarBoleta}
      />

      {/* Modal de Resumen de Recepción */}
      <ReceptionSummaryModal
        isOpen={showResumenModal}
        onClose={() => setShowResumenModal(false)}
        onConfirm={handleConfirmarRecepcion}
        productos={productos}
        assignment={assignment}
        rawData={rawData}
      />
    </div>
  );
}
