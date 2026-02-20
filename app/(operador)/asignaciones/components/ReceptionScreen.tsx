"use client";

import React, { useState, useMemo } from "react";
import ReceptionSummaryModal from "./ReceptionSummaryModal";
import ReceptionHeader from "./ReceptionHeader";
import ReceptionTickets from "./ReceptionTickets";
import { Assignment, ProductQuantity } from "../stores/assignments-store";

// Interfaces
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
    return assignment.productos.map((producto: ProductQuantity) => ({
      codigo: producto.codigo,
      cajas: producto.cajas,
      unidades: producto.unidades,
      kgBruto: producto.kgBruto,
      kgNeto: producto.kgNeto,
      kgRecibidos: 0.0, // Valor inicial para kg recibidos
    }));
  }, [assignment.productos]);

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
    field: "cajas" | "unidades" | "kg",
    value: number,
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
        onAgregarPesaje={handleAgregarPesaje}
        onUpdatePesaje={handleUpdatePesaje}
        onRemovePesaje={handleRemovePesaje}
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
