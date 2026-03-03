"use client";

import React, { useState, useMemo } from "react";
import DetailAssignment from "./DetailAssignment";
import TotalGroup from "./TotalGroup";
import { Assignment } from "../../stores/assignments-store";
import { Datum } from "../../interfaces/getassignmenthistory.interface";

interface PlanningProps {
  assignment?: Assignment | null;
  rawData?: Datum[] | null;
  onClose?: () => void;
}

interface GroupData {
  name: string;
  status: "guardado" | "pendiente";
  codes: Array<{ label: string; cajas: number; unidades: number }>;
  totalCajas: number;
  totalUnid: number;
  clientes: never[];
}

export default function Planificar({
  assignment = null,
  rawData = null,
  onClose,
}: PlanningProps) {
  // Procesar datos dinámicamente si viene assignment
  const { detalles, initialGroups, proveedor, clienteOrigen } = useMemo((): {
    detalles: Array<{
      label: string;
      cajas: string;
      unidades: string;
    }>;
    initialGroups: GroupData[];
    proveedor: string;
    clienteOrigen: string;
  } => {
    if (!assignment || !rawData) {
      // Sin datos por defecto
      return {
        detalles: [],
        initialGroups: [],
        proveedor: "",
        clienteOrigen: "",
      };
    }

    // Filtrar datos por assignmentId
    const assignmentData = rawData.filter(
      (item) => item.Assignment_id.toString() === assignment.id,
    );

    // Agrupar datos de posición 2 por producto
    const productoMap = new Map<string, Datum | null>();

    assignmentData.forEach((item) => {
      const productCode = item.Product_name;
      if (item.AssignmentStage_position === 2) {
        productoMap.set(productCode, item);
      }
      // Si no existe entrada para este producto, crear con null
      if (!productoMap.has(productCode)) {
        productoMap.set(productCode, null);
      }
    });

    // Crear detalles solo con posición 2 (formato: 0/{pos2})
    const detallesArray = Array.from(productoMap.entries()).map(
      ([code, pos2]) => ({
        label: code,
        cajas: pos2 ? `0/${pos2.ProductAssignment_container}` : "0/0",
        unidades: pos2 ? `0/${pos2.ProductAssignment_units}` : "0/0",
      }),
    );

    return {
      detalles: detallesArray,
      initialGroups: [],
      proveedor: assignment.proveedor,
      clienteOrigen: assignment.proveedor,
    };
  }, [assignment, rawData]);

  // We keep an array of expanded group indices. Default open the first one.
  const [expandedGroups, setExpandedGroups] = useState<number[]>([0]);

  const toggleGroup = (index: number) => {
    if (expandedGroups.includes(index)) {
      setExpandedGroups(expandedGroups.filter((i) => i !== index));
    } else {
      setExpandedGroups([...expandedGroups, index]);
    }
  };

  return (
    <div className="min-h-screen max-w-full bg-gray-50">
      {/* Contenido de Planning */}
      <div className="p-3">
        {/* Detail Assignment Section */}
        <DetailAssignment
          proveedor={proveedor}
          clienteOrigen={clienteOrigen}
          detalles={detalles}
          onCancel={onClose}
          onAutomaticPlanning={() => console.log("Automatic planning clicked")}
          onSavePlanning={() => console.log("Save planning clicked")}
        />

        {/* Total Groups Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 pb-2">
            <h2 className="text-sm font-bold text-[#1e293b] mb-2">
              Totales por Grupo
            </h2>
          </div>

          <div className="p-4 pt-0 space-y-3">
            {initialGroups.length > 0 ? (
              initialGroups.map((group, groupIdx) => (
                <TotalGroup
                  key={groupIdx}
                  name={group.name}
                  status={group.status}
                  codes={group.codes}
                  totalCajas={group.totalCajas}
                  totalUnid={group.totalUnid}
                  clientes={group.clientes}
                  isExpanded={expandedGroups.includes(groupIdx)}
                  onToggleExpand={() => toggleGroup(groupIdx)}
                  onSaveGroup={() =>
                    console.log(`Save group ${groupIdx} clicked`)
                  }
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Sin grupos disponibles para esta asignación</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
