"use client";

import React, { useState, useMemo } from "react";
import ReceptionSummaryModal from "./ReceptionSummaryModal";
import ReceptionHeader from "./ReceptionHeader";
import ReceptionTickets from "./ReceptionTickets";
import { Assignment, ProductQuantity } from "../stores/assignments-store";
import { useAddAssignmentStage } from "../hooks/useAddAssignmentStage";
import { useAddTicket } from "../hooks/useAddTicket";
import { useAddProductAssignment } from "../hooks/useAddProductAssignment";
import { useAddTicketsWeighing } from "../hooks/useAddTicketsWeighing";

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
  const [currentAssignmentStageId, setCurrentAssignmentStageId] = useState<
    string | null
  >(null);

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
      menudencias: [],
      detalles: {},
      tiposContenedor: {},
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
          const isSelected = codigosActuales.includes(codigo);
          let nuevosCodigos;
          let nuevosDetalles = { ...boleta.detalles };

          if (isSelected) {
            nuevosCodigos = codigosActuales.filter((c) => c !== codigo);
            // Opcional: limpiar detalles al deseleccionar
            // delete nuevosDetalles[codigo];
          } else {
            nuevosCodigos = [...codigosActuales, codigo];
            // Inicializar en 0 si no existe
            if (!nuevosDetalles[codigo]) {
              nuevosDetalles[codigo] = { cajas: 0, unidades: 0, pesajes: [] };
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
    setBoletas(
      boletas.map((boleta) => {
        if (boleta.id === boletaId) {
          const detalleActual = boleta.detalles[codigo] || {
            cajas: 0,
            unidades: 0,
          };
          return {
            ...boleta,
            detalles: {
              ...boleta.detalles,
              [codigo]: {
                ...detalleActual,
                [field]: value,
              },
            },
          };
        }
        return boleta;
      }),
    );
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
    setBoletas(
      boletas.map((boleta) => {
        if (boleta.id === boletaId) {
          const detalleActual = boleta.detalles[codigo] || {
            cajas: 0,
            unidades: 0,
            pesajes: [],
          };
          const nuevosPesajes = [
            ...(detalleActual.pesajes || []),
            {
              id: Date.now().toString() + Math.random().toString(),
              cajas: 0,
              unidades: 0,
              kg: 0,
            },
          ];
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
      let stageId = currentAssignmentStageId;

      if (!stageId) {
        const newStageId = await addAssignmentStage({
          position: "2",
          in_container: 0,
          out_container: 0,
          units: 0,
          container: 0,
          payment: "0",
          Assignment_id: assignment.id,
        });

        if (newStageId) {
          stageId = newStageId.toString();
          setCurrentAssignmentStageId(stageId);
        } else {
          console.error("Failed to create assignment stage");
          return;
        }
      }

      if (stageId) {
        const newTicketId = await addTicket({
          code: boleta.codigo || "0",
          deferred_payment: boleta.precioDiferido ? "1" : "0",
          total_payment: boleta.costoTotal || "0",
          product_payment: boleta.costoPorKg || "0",
          AssignmentStage_id: stageId,
        });

        if (newTicketId) {
          console.log("Ticket created successfully", newTicketId);

          for (const codigo of boleta.codigosSeleccionados) {
            const detalle = boleta.detalles[codigo] || {
              cajas: 0,
              unidades: 0,
            };
            const productoData = productos.find((p) => p.codigo === codigo);

            if (productoData && productoData.productId) {
              const newProductAssignmentId = await addProductAssignment({
                container: Number(detalle.cajas) || 0,
                units: Number(detalle.unidades) || 0,
                menudencia: "0",
                net_weight: "0",
                gross_weight: "0",
                payment: "0",
                Tickets_id: newTicketId.toString(),
                Product_id: productoData.productId.toString(),
              });

              if (
                newProductAssignmentId &&
                detalle.pesajes &&
                detalle.pesajes.length > 0
              ) {
                console.log(
                  `Product assignment created: ${newProductAssignmentId}. Sending pesajes...`,
                );
                for (const pesaje of detalle.pesajes) {
                  await addTicketsWeighing({
                    weight: Number(pesaje.kg) || 0,
                    units: Number(pesaje.unidades) || 0,
                    container: Number(pesaje.cajas) || 0,
                    ProductAssignment_id: newProductAssignmentId.toString(),
                  });
                }
              }
            }
          }
        }
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
      />
    </div>
  );
}
