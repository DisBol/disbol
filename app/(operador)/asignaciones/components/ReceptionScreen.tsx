"use client";

import React, { useState } from "react";
import ReceptionSummaryModal from "./ReceptionSummaryModal";
import ReceptionHeader from "./ReceptionHeader";
import ReceptionTickets from "./ReceptionTickets";

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
