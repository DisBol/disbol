"use client";

import { useState, useMemo, useEffect } from "react";
import ReceptionSummaryModal from "./ReceptionSummaryModal";
import ReceptionHeader from "./ReceptionHeader";
import ReceptionTickets from "./ReceptionTickets";
import { Modal } from "@/components/ui/Modal";
import { Assignment, useAssignmentsStore } from "../stores/assignments-store";
import { useAddAssignmentStage } from "../hooks/useAddAssignmentStage";
import { useAddTicket } from "../hooks/useAddTicket";
import { useAddProductAssignment } from "../hooks/useAddProductAssignment";
import { useAddTicketsWeighing } from "../hooks/useAddTicketsWeighing";
import { useUpdateProductAssignment } from "../hooks/useUpdateProductAssignment";
import { useUpdateTicket } from "../hooks/useUpdateTicket";
import { useContainer } from "../../configuraciones/hooks/contenedores/useContainer";
import { useGetTicketsHistory } from "../hooks/useGetTicketsHistory";
import { useGetTicketsByAssignmentHistory } from "../hooks/useGetTicketsByAssignmentHistory";
import { UpdateTicketsWeighing } from "../service/updateticketsweighing";
import { useUpdateAssignment } from "../hooks/useUpdateAssignment";
import { useAddContainerMovements } from "../hooks/repartir/useAddContainerMovements";

// Interfaces
interface ProductReception {
  codigo: string;
  cajas: number;
  unidades: number;
  kgBruto: number;
  kgNeto: number;
  kgRecibidos: number;
  recibidosCajas: number;
  recibidosUnidades: number;
  productId: string;
  active: boolean; // Agregar estado activo
}

export interface PesajeData {
  id: string;
  cajas: number;
  unidades: number;
  kg: number;
  contenedor?: string;
  guardado?: boolean;
}

interface BoletaDetail {
  cajas: number;
  unidades: number;
  precio?: string;
  pesajes?: PesajeData[];
  kgBruto?: number;
  kgNeto?: number;
  productAssignmentId?: string;
  _isEdited?: boolean; // Flag para saber si los valores han sido editados por el usuario
}

interface Boleta {
  id: string;
  ticketId?: string;
  assignmentStageId?: number;
  flujoCompletado?: boolean;
  hasPendingChanges?: boolean;
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
  const { containersData } = useContainer();
  const { updateAssignmentFlags } = useAssignmentsStore();

  const markBoletaAsPendingEdit = (boleta: Boleta): Boleta => {
    if (!boleta.flujoCompletado) return boleta;
    return { ...boleta, hasPendingChanges: true };
  };

  const [boletas, setBoletas] = useState<Boleta[]>([
    {
      id: "1",
      codigo: "",
      costoPorKg: "0.00",
      costoTotal: "0.00",
      precioDiferido: false,
      hasPendingChanges: false,
      codigosSeleccionados: [],
      menudencias: [],
      detalles: {},
      tiposContenedor: {},
    },
  ]);

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
        recibidosCajas: 0,
        recibidosUnidades: 0,
        productId: p.productId,
        active: p.active,
      }));
  }, [assignment.productos]);

  const recibidosPorCodigo = useMemo(() => {
    const acc: Record<
      string,
      { cajas: number; unidades: number; kgRecibidos: number }
    > = {};

    boletas.forEach((boleta) => {
      boleta.codigosSeleccionados.forEach((codigo) => {
        const detalle = boleta.detalles[codigo];
        if (!detalle) return;

        if (!acc[codigo]) {
          acc[codigo] = { cajas: 0, unidades: 0, kgRecibidos: 0 };
        }

        const cajasValue = Number(detalle.cajas) || 0;
        const unidadesValue = Number(detalle.unidades) || 0;

        acc[codigo].cajas += cajasValue;
        acc[codigo].unidades += unidadesValue;

        if (detalle.pesajes && detalle.pesajes.length > 0) {
          const netoFromPesajes = detalle.pesajes.reduce((sum, pesaje) => {
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
            return sum + netWeight;
          }, 0);

          acc[codigo].kgRecibidos += netoFromPesajes;
        }
      });
    });

    return acc;
  }, [boletas, containersData]);

  const productosConComparacion = useMemo(
    () =>
      productos.map((producto) => {
        const recibido = recibidosPorCodigo[producto.codigo];

        return {
          ...producto,
          recibidosCajas: recibido?.cajas || 0,
          recibidosUnidades: recibido?.unidades || 0,
          kgRecibidos: recibido?.kgRecibidos || 0,
        };
      }),
    [productos, recibidosPorCodigo],
  );

  const { addAssignmentStage } = useAddAssignmentStage();
  const { addTicket } = useAddTicket();
  const { addProductAssignment } = useAddProductAssignment();
  const { addTicketsWeighing } = useAddTicketsWeighing();
  const { updateProductAssignment } = useUpdateProductAssignment();
  const { updateTicket } = useUpdateTicket();
  const { updateAssignment, loading: isFinalizando } = useUpdateAssignment();

  const { fetchTicketsHistory } = useGetTicketsHistory();
  const { fetchTicketsByAssignmentHistory } =
    useGetTicketsByAssignmentHistory();

  useEffect(() => {
    let isMounted = true;
    const loadTickets = async () => {
      // 1) Historial base por asignacion: asegura tickets registrados
      const boletasMap = new Map<string, Boleta>();

      const assignmentHistory = await fetchTicketsByAssignmentHistory(
        Number(assignment.id),
      );

      assignmentHistory?.data?.forEach((row) => {
        const ticketId = row.Tickets_id?.toString() ?? "";
        if (!ticketId) return;

        const isDeferred =
          String(row.Tickets_deferred_payment) === "1" ||
          String(row.Tickets_deferred_payment) === "true";

        if (!boletasMap.has(ticketId)) {
          boletasMap.set(ticketId, {
            id: ticketId,
            ticketId,
            assignmentStageId: Number(row.AssignmentStage_id) || undefined,
            flujoCompletado: false,
            hasPendingChanges: false,
            codigo: row.Tickets_code || "",
            costoPorKg: row.Tickets_product_payment?.toString() || "0",
            costoTotal: "0",
            precioDiferido: isDeferred,
            codigosSeleccionados: [],
            menudencias: [],
            detalles: {},
            tiposContenedor: {},
          });
        }

        // Cargar productos registrados desde getticketsbyassignmenthistory
        const boleta = boletasMap.get(ticketId)!;
        const productCode = row.Product_name;

        if (productCode && !boleta.codigosSeleccionados.includes(productCode)) {
          boleta.codigosSeleccionados.push(productCode);
          boleta.detalles[productCode] = {
            cajas: Number(row.ProductAssignment_container) || 0,
            unidades: Number(row.ProductAssignment_units) || 0,
            productAssignmentId: row.ProductAssignment_id?.toString(),
            precio: isDeferred
              ? row.ProductAssignment_payment?.toString() || "0"
              : row.Tickets_product_payment?.toString() || "0",
            pesajes: [],
            kgBruto: Number(row.ProductAssignment_gross_weight) || 0,
            kgNeto: Number(row.ProductAssignment_net_weight) || 0,
            _isEdited: true,
          };
        }
      });

      // 2) Historial detallado: complementa pesajes cuando existan
      const data = await fetchTicketsHistory(Number(assignment.id));
      if (!data || !data.data || data.data.length === 0) {
        const baseBoletas = Array.from(boletasMap.values());
        if (!isMounted || baseBoletas.length === 0) return;

        setBoletas((prev) => {
          if (
            prev.length === 1 &&
            !prev[0].codigo &&
            prev[0].codigosSeleccionados.length === 0
          ) {
            return baseBoletas;
          }
          return prev;
        });
        return;
      }

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
            flujoCompletado: false,
            hasPendingChanges: false,
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
            productAssignmentId: row.ProductAssignment_id?.toString(),
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
          boleta.flujoCompletado = true;
          boleta.detalles[row.Product_name].pesajes?.push({
            id: row.TicketsWeighing_id.toString(),
            cajas: Number(row.TicketsWeighing_container) || 0,
            unidades: Number(row.TicketsWeighing_units) || 0,
            kg: Number(row.TicketsWeighing_gross_weight) || 0,
            contenedor: row.TicketsWeighing_Container_id?.toString() || "",
            guardado: true,
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
      hasPendingChanges: false,
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
        boleta.id === boletaId
          ? markBoletaAsPendingEdit({ ...boleta, [field]: value })
          : boleta,
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
              nuevosDetalles[codigo] = {
                cajas: 0,
                unidades: 0,
                pesajes: [],
                _isEdited: false, // IMPORTANTE: marcar como NO editado inicialmente
              };
            }
          }
          return {
            ...markBoletaAsPendingEdit(boleta),
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
            const detalleInicial = {
              cajas: 0,
              unidades: 0,
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
              ...markBoletaAsPendingEdit(boleta),
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
            ...markBoletaAsPendingEdit(boleta),
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
            ...markBoletaAsPendingEdit(boleta),
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
          return markBoletaAsPendingEdit({
            ...boleta,
            menudencias: nuevasMenudencias,
          });
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
            baseDetalle = {
              cajas: 0,
              unidades: 0,
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
              guardado: false,
            },
          ];
          return {
            ...markBoletaAsPendingEdit(boleta),
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
              return { ...pesaje, [field]: value, guardado: false };
            }
            return pesaje;
          });

          return {
            ...markBoletaAsPendingEdit(boleta),
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

  const handleRemovePesaje = async (
    boletaId: string,
    codigo: string,
    pesajeId: string,
  ) => {
    const boleta = boletas.find((b) => b.id === boletaId);
    const detalle = boleta?.detalles[codigo];
    const pesaje = detalle?.pesajes?.find((p) => p.id === pesajeId);

    if (pesaje?.guardado && /^\d+$/.test(String(pesaje.id))) {
      try {
        const selectedContainer = containersData?.find(
          (container) => container.id.toString() === pesaje.contenedor,
        );
        const destare = selectedContainer?.destare || 0;
        const grossWeight = Number(pesaje.kg) || 0;
        const containerCount = Number(pesaje.cajas) || 0;
        const netWeight = Math.max(0, grossWeight - destare * containerCount);

        await UpdateTicketsWeighing(
          Number(pesaje.id),
          netWeight,
          grossWeight,
          Number(pesaje.unidades) || 0,
          containerCount,
          Number(pesaje.contenedor) || 0,
          "false",
        );
      } catch (error) {
        console.error("No se pudo eliminar el pesaje en backend", error);
        return;
      }
    }

    setBoletas(
      boletas.map((boleta) => {
        if (boleta.id === boletaId) {
          const detalleActual = boleta.detalles[codigo];
          if (!detalleActual || !detalleActual.pesajes) return boleta;

          const nuevosPesajes = detalleActual.pesajes.filter(
            (pesaje) => pesaje.id !== pesajeId,
          );

          return {
            ...markBoletaAsPendingEdit(boleta),
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

  const { addContainerMovements } = useAddContainerMovements();

  const [showConfirmFinalizar, setShowConfirmFinalizar] = useState(false);
  const [cajasFinalizacion, setCajasFinalizacion] = useState<number>(0);
  const [cajasDevolver, setCajasDevolver] = useState<number>(0);

  const handleFinalizarRecepcion = () => {
    const totalCajasRec = productosConComparacion.reduce(
      (sum, p) => sum + p.recibidosCajas,
      0,
    );
    setCajasFinalizacion(totalCajasRec);
    setCajasDevolver(0);
    setShowConfirmFinalizar(true);
  };

  const handleConfirmFinalizar = async () => {
    setShowConfirmFinalizar(false);

    const providerId = assignment.providerId ? Number(assignment.providerId) : null;

    // 1. Registrar cajas recibidas (positivo)
    await addContainerMovements(
      cajasFinalizacion,
      "true",
      1,
      null,
      null,
      Number(assignment.id),
      providerId,
    );

    // 2. Registrar cajas a devolver (negativo)
    if (cajasDevolver > 0) {
      await addContainerMovements(
        -cajasDevolver,
        "true",
        1,
        null,
        null,
        Number(assignment.id),
        providerId,
      );
    }

    const ok = await updateAssignment({
      id: assignment.id,
      active: "true",
      CategoryProvider_id: assignment.categoryProviderId,
      isRecibir: "true",
      isPlanificar: assignment.isPlanificar,
      isRepartir: assignment.isRepartir,
    });
    if (ok) {
      updateAssignmentFlags(assignment.id, { isRecibir: "true" });
    }
    onBack();
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
      // FLUJO SIMPLIFICADO: Solo hasta AddProductAssignment
      // 1. Crear assignment stage
      // 2. Crear ticket
      // 3. Crear product assignments
      // (Los pesajes se agregarán en un paso posterior)

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
        total_container: 0,
        total_units: 0,
      });

      if (newTicketId) {
        console.log("Ticket created successfully", newTicketId);

        for (const codigo of boleta.codigosSeleccionados) {
          const detalle = boleta.detalles[codigo];
          const productoData = productos.find((p) => p.codigo === codigo);

          if (productoData && productoData.productId) {
            // Sin autocompletado: solo usar valores ingresados en la boleta
            const cajasValue = Number(detalle?.cajas) || 0;
            const unidadesValue = Number(detalle?.unidades) || 0;

            // Debug logs específicos para encontrar el problema
            console.log(`🚨 ANÁLISIS DETALLADO para ${codigo}:`, {
              "1_detalleCompleto": detalle,
              "2_detalleExiste": !!detalle,
              "3_fueEditado": detalle?._isEdited,
              "4_usarValoresEditados": false,
              "5_detalle_cajas_RAW": detalle?.cajas,
              "6_detalle_unidades_RAW": detalle?.unidades,
              "7_producto_cajas_ORIGINAL": productoData.cajas,
              "8_producto_unidades_ORIGINAL": productoData.unidades,
              "9_cajasValue_FINAL": cajasValue,
              "10_unidadesValue_FINAL": unidadesValue,
              "11_fuenteDatos": "VALORES DE BOLETA (sin autocompletado)",
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

            // SOLO crear el ProductAssignment - sin pesajes ni actualizaciones posteriores
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

            console.log(
              `Product assignment created successfully: ${newProductAssignmentId}`,
            );

            if (newProductAssignmentId) {
              boleta.detalles[codigo] = {
                ...detalle,
                productAssignmentId: newProductAssignmentId.toString(),
              };
            }
          }
        }

        // Actualizar la boleta en el estado local con el ticketId
        // Esto marca a la boleta como guardada y habilita el botón "Agregar pesaje"
        setBoletas((prev) =>
          prev.map((b) => {
            if (b.id !== boletaId) return b;

            return {
              ...b,
              ticketId: newTicketId.toString(),
              id: newTicketId.toString(),
              assignmentStageId: Number(stageId),
              flujoCompletado: false,
              hasPendingChanges: false,
              detalles: { ...boleta.detalles },
            };
          }),
        );

        console.log("Boleta guardada hasta ProductAssignment exitosamente");
        console.log("Resumen final de la boleta guardada:", {
          boletaId: boleta.id,
          ticketId: newTicketId.toString(),
          productosGuardados: boleta.codigosSeleccionados.length,
        });
      }
    } catch (error) {
      console.error("Error saving boleta", error);
    }
  };

  const handleGuardarPesaje = async (
    boletaId: string,
    codigo: string,
    pesajeId: string,
  ) => {
    const boleta = boletas.find((b) => b.id === boletaId);
    if (!boleta || !boleta.ticketId) return;

    const detalle = boleta.detalles[codigo];
    if (!detalle || !detalle.productAssignmentId || !detalle.pesajes) return;

    const pesajeIndex = detalle.pesajes.findIndex((p) => p.id === pesajeId);
    if (pesajeIndex === -1) return;

    const pesaje = detalle.pesajes[pesajeIndex];
    if (pesaje.guardado) return;

    try {
      const selectedContainer = containersData?.find(
        (container) => container.id.toString() === pesaje.contenedor,
      );
      const destare = selectedContainer?.destare || 0;
      const grossWeight = Number(pesaje.kg) || 0;
      const cantidadCajas = Number(pesaje.cajas) || 0;
      const netWeight = Math.max(0, grossWeight - destare * cantidadCajas);

      const pesajePersistido = /^\d+$/.test(String(pesaje.id));
      let persistedWeighingId = pesaje.id;

      if (pesajePersistido) {
        await UpdateTicketsWeighing(
          Number(pesaje.id),
          netWeight,
          grossWeight,
          Number(pesaje.unidades) || 0,
          cantidadCajas,
          Number(pesaje.contenedor) || 0,
          "true",
        );
      } else {
        const newWeighingId = await addTicketsWeighing({
          gross_weight: grossWeight,
          net_weight: netWeight,
          units: Number(pesaje.unidades) || 0,
          container: cantidadCajas,
          Container_id: pesaje.contenedor || "",
          ProductAssignment_id: detalle.productAssignmentId,
        });

        if (!newWeighingId) {
          console.error("No se pudo guardar el pesaje");
          return;
        }

        persistedWeighingId = newWeighingId.toString();
      }

      const detalleActualizado: BoletaDetail = {
        ...detalle,
        pesajes: detalle.pesajes.map((p) =>
          p.id === pesajeId
            ? { ...p, id: persistedWeighingId, guardado: true }
            : p,
        ),
      };

      const pesajesGuardados = (detalleActualizado.pesajes || []).filter(
        (p) => p.guardado,
      );

      const totalesProducto = pesajesGuardados.reduce(
        (acc, p) => {
          const container = containersData?.find(
            (c) => c.id.toString() === p.contenedor,
          );
          const itemDestare = container?.destare || 0;
          const itemGross = Number(p.kg) || 0;
          const itemCajas = Number(p.cajas) || 0;
          const itemNet = Math.max(0, itemGross - itemDestare * itemCajas);

          return {
            gross: acc.gross + itemGross,
            net: acc.net + itemNet,
          };
        },
        { gross: 0, net: 0 },
      );

      const paymentValue = boleta.precioDiferido ? detalle.precio || "0" : "0";
      const productoData = productos.find((p) => p.codigo === codigo);

      if (!productoData?.productId) return;

      const updateProductOk = await updateProductAssignment({
        id: detalle.productAssignmentId,
        container: Number(detalle.cajas) || 0,
        units: Number(detalle.unidades) || 0,
        menudencia: "0",
        net_weight: totalesProducto.net.toString(),
        gross_weight: totalesProducto.gross.toString(),
        payment: paymentValue,
        active: "true",
        Tickets_id: boleta.ticketId,
        Product_id: productoData.productId.toString(),
      });

      if (!updateProductOk) {
        console.error(
          "No se pudo actualizar ProductAssignment al guardar pesaje",
        );
        return;
      }

      const detallesBoletaActualizados: Record<string, BoletaDetail> = {
        ...boleta.detalles,
        [codigo]: {
          ...detalleActualizado,
          kgBruto: totalesProducto.gross,
          kgNeto: totalesProducto.net,
        },
      };

      let totalNetWeightAllProducts = 0;
      let totalPaymentWeightSum = 0;

      for (const cod of boleta.codigosSeleccionados) {
        const det = detallesBoletaActualizados[cod];
        if (!det) continue;

        const pesajes = (det.pesajes || []).filter((p) => p.guardado);
        let netProducto = 0;

        for (const p of pesajes) {
          const container = containersData?.find(
            (c) => c.id.toString() === p.contenedor,
          );
          const d = container?.destare || 0;
          const g = Number(p.kg) || 0;
          const c = Number(p.cajas) || 0;
          netProducto += Math.max(0, g - d * c);
        }

        totalNetWeightAllProducts += netProducto;

        if (boleta.precioDiferido) {
          totalPaymentWeightSum += (Number(det.precio) || 0) * netProducto;
        }
      }

      const finalTotalPayment = boleta.precioDiferido
        ? totalPaymentWeightSum
        : (Number(boleta.costoPorKg) || 0) * totalNetWeightAllProducts;

      const finalTotalContainer = boleta.codigosSeleccionados.reduce(
        (sum, cod) =>
          sum + (Number(detallesBoletaActualizados[cod]?.cajas) || 0),
        0,
      );
      const finalTotalUnits = boleta.codigosSeleccionados.reduce(
        (sum, cod) =>
          sum + (Number(detallesBoletaActualizados[cod]?.unidades) || 0),
        0,
      );

      const updateTicketOk = await updateTicket({
        id: boleta.ticketId,
        code: boleta.codigo || "0",
        deferred_payment: boleta.precioDiferido ? "1" : "0",
        total_payment: finalTotalPayment.toString(),
        product_payment: boleta.precioDiferido ? "0" : boleta.costoPorKg || "0",
        active: "true",
        AssignmentStage_id: boleta.assignmentStageId || 0,
        total_container: finalTotalContainer,
        total_units: finalTotalUnits,
      });

      if (!updateTicketOk) {
        console.error("No se pudo actualizar ticket al guardar pesaje");
        return;
      }

      setBoletas((prev) =>
        prev.map((b) =>
          b.id === boletaId
            ? {
                ...b,
                costoTotal: finalTotalPayment.toString(),
                hasPendingChanges: false,
                detalles: detallesBoletaActualizados,
              }
            : b,
        ),
      );
    } catch (error) {
      console.error("Error guardando pesaje", error);
    }
  };

  const handleCompletarFlujoBoleta = async (boletaId: string) => {
    const boleta = boletas.find((b) => b.id === boletaId);
    if (!boleta || !boleta.ticketId) return;

    try {
      const updatedDetalles: Record<string, BoletaDetail> = {
        ...boleta.detalles,
      };

      let totalNetWeightAllProducts = 0;
      let totalPaymentWeightSum = 0;

      for (const codigo of boleta.codigosSeleccionados) {
        const detalle = updatedDetalles[codigo];
        const productoData = productos.find((p) => p.codigo === codigo);

        if (!detalle || !productoData?.productId) continue;

        const productAssignmentId = detalle.productAssignmentId;
        if (!productAssignmentId) {
          console.warn(
            `ProductAssignment no encontrado para ${codigo}. Guarda nuevamente la boleta.`,
          );
          continue;
        }

        const pesajes = [...(detalle.pesajes || [])];
        let totalNetWeight = 0;
        let totalGrossWeight = 0;

        for (let i = 0; i < pesajes.length; i += 1) {
          const pesaje = pesajes[i];

          const selectedContainer = containersData?.find(
            (container) => container.id.toString() === pesaje.contenedor,
          );
          const destare = selectedContainer?.destare || 0;
          const grossWeight = Number(pesaje.kg) || 0;
          const cantidadCajas = Number(pesaje.cajas) || 0;
          const netWeight = Math.max(0, grossWeight - destare * cantidadCajas);

          totalNetWeight += netWeight;
          totalGrossWeight += grossWeight;

          const pesajePersistido = /^\d+$/.test(String(pesaje.id));

          if (!pesajePersistido) {
            const newWeighingId = await addTicketsWeighing({
              gross_weight: grossWeight,
              net_weight: netWeight,
              units: Number(pesaje.unidades) || 0,
              container: cantidadCajas,
              Container_id: pesaje.contenedor || "",
              ProductAssignment_id: productAssignmentId,
            });

            if (newWeighingId) {
              pesajes[i] = {
                ...pesaje,
                id: newWeighingId.toString(),
              };
            }
          }
        }

        totalNetWeightAllProducts += totalNetWeight;

        const paymentValue = boleta.precioDiferido
          ? detalle.precio || "0"
          : "0";
        if (boleta.precioDiferido) {
          totalPaymentWeightSum += (Number(paymentValue) || 0) * totalNetWeight;
        }

        const updateProductOk = await updateProductAssignment({
          id: productAssignmentId,
          container: Number(detalle.cajas) || 0,
          units: Number(detalle.unidades) || 0,
          menudencia: "0",
          net_weight: totalNetWeight.toString(),
          gross_weight: totalGrossWeight.toString(),
          payment: paymentValue,
          active: "true",
          Tickets_id: boleta.ticketId,
          Product_id: productoData.productId.toString(),
        });

        if (!updateProductOk) {
          console.error(`No se pudo actualizar ProductAssignment de ${codigo}`);
          return;
        }

        updatedDetalles[codigo] = {
          ...detalle,
          pesajes,
          kgBruto: totalGrossWeight,
          kgNeto: totalNetWeight,
        };
      }

      const finalTotalPayment = boleta.precioDiferido
        ? totalPaymentWeightSum
        : (Number(boleta.costoPorKg) || 0) * totalNetWeightAllProducts;

      const finalTotalContainer = boleta.codigosSeleccionados.reduce(
        (sum, codigo) => sum + (Number(updatedDetalles[codigo]?.cajas) || 0),
        0,
      );
      const finalTotalUnits = boleta.codigosSeleccionados.reduce(
        (sum, codigo) => sum + (Number(updatedDetalles[codigo]?.unidades) || 0),
        0,
      );

      const updateTicketOk = await updateTicket({
        id: boleta.ticketId,
        code: boleta.codigo || "0",
        deferred_payment: boleta.precioDiferido ? "1" : "0",
        total_payment: finalTotalPayment.toString(),
        product_payment: boleta.precioDiferido ? "0" : boleta.costoPorKg || "0",
        active: "true",
        AssignmentStage_id: boleta.assignmentStageId || 0,
        total_container: finalTotalContainer,
        total_units: finalTotalUnits,
      });

      if (!updateTicketOk) {
        console.error("No se pudo actualizar el ticket al completar flujo");
        return;
      }

      setBoletas((prev) =>
        prev.map((b) => {
          if (b.id !== boletaId) return b;

          return {
            ...b,
            flujoCompletado: true,
            hasPendingChanges: false,
            costoTotal: finalTotalPayment.toString(),
            detalles: updatedDetalles,
          };
        }),
      );

      console.log("Flujo completado exitosamente para boleta", boletaId);
    } catch (error) {
      console.error("Error completando flujo de boleta", error);
    }
  };

  return (
    <div className="min-h-screen max-w-full">
      <ReceptionHeader
        assignment={assignment}
        productos={productosConComparacion}
        costoTotalGeneral={costoTotalGeneral}
        onBack={onBack}
        onRegistrarRecepcion={handleRegistrarRecepcion}
        onFinalizarRecepcion={handleFinalizarRecepcion}
        isFinalizando={isFinalizando}
      />

      <ReceptionTickets
        productos={productos}
        boletas={boletas}
        pesoTotalGeneral={pesoTotalGeneral}
        isRecibir={assignment.isRecibir}
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
        onGuardarPesaje={handleGuardarPesaje}
        onGuardarBoleta={handleGuardarBoleta}
        onCompletarFlujoBoleta={handleCompletarFlujoBoleta}
      />

      {/* Modal de Resumen de Recepción */}
      <ReceptionSummaryModal
        isOpen={showResumenModal}
        onClose={() => setShowResumenModal(false)}
        onConfirm={handleConfirmarRecepcion}
        productos={productosConComparacion}
      />

      {/* Modal Confirmar Finalizar Recepción */}
      <Modal
        isOpen={showConfirmFinalizar}
        onClose={() => setShowConfirmFinalizar(false)}
        title="Finalizar Recepción"
        size="sm"
      >
        <p className="text-sm text-gray-600 mb-4">
          ¿Está seguro de finalizar la recepción? Una vez finalizada no podrá
          realizar cambios.
        </p>
        <div className="flex gap-3 mb-6">
          <div className="flex-1">
            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">
              Total cajas recibidas (REC)
            </label>
            <input
              type="number"
              min={0}
              value={cajasFinalizacion}
              onChange={(e) => setCajasFinalizacion(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">
              Cajas a devolver
            </label>
            <input
              type="number"
              min={0}
              value={cajasDevolver}
              onChange={(e) => setCajasDevolver(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowConfirmFinalizar(false)}
            className="px-4 py-2 rounded-lg text-sm font-bold border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmFinalizar}
            disabled={isFinalizando}
            className="px-4 py-2 rounded-lg text-sm font-bold shadow-sm text-white bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors"
          >
            {isFinalizando ? "Finalizando..." : "Confirmar"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
