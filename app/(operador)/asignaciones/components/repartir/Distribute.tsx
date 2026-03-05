"use client";

import React, { useState, useMemo } from "react";
import DistributeAssignmentHeader from "./DistributeAssignmentHeader";
import DistributeGroup from "./DistributeGroup";
import { Assignment } from "../../stores/assignments-store";
import { Datum } from "../../interfaces/getassignmenthistory.interface";

interface DistributeProps {
  assignment?: Assignment | null;
  rawData?: Datum[] | null;
  onClose?: () => void;
}

export default function Repartir({
  assignment = null,
  rawData = null,
  onClose,
}: DistributeProps) {
  // Procesar datos dinámicamente si viene assignment
  const { detalles, proveedor, costoPorKg, precioDiferido } = useMemo((): {
    detalles: Array<{
      label: string;
      cajas: string;
      unidades: string;
    }>;
    proveedor: string;
    costoPorKg: string;
    precioDiferido: boolean;
  } => {
    if (!assignment || !rawData) {
      // Sin datos por defecto
      return {
        detalles: [],
        proveedor: "",
        costoPorKg: "0.00",
        precioDiferido: false,
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
      proveedor: assignment.proveedor,
      costoPorKg: "10.00", // Puede obtenerse de los datos si está disponible
      precioDiferido: false,
    };
  }, [assignment, rawData]);

  const initialGroups = [
    {
      name: "El Alto Norte",
      clientesCount: 2,
      codes: [
        { label: "Código 104", cajas: 0, unidades: 0 },
        { label: "Código 105", cajas: 0, unidades: 0 },
        { label: "Código 106", cajas: 0, unidades: 0 },
        { label: "Código 107", cajas: 0, unidades: 0 },
        { label: "Código 108", cajas: 0, unidades: 0 },
        { label: "Código 109", cajas: 0, unidades: 0 },
        { label: "Código 110", cajas: 0, unidades: 0 },
      ],
      totalCajas: 0,
      totalUnid: 0,
    },
    {
      name: "El Alto Sur",
      clientesCount: 1,
      codes: [
        { label: "Código 104", cajas: 0, unidades: 0 },
        { label: "Código 105", cajas: 0, unidades: 0 },
        { label: "Código 106", cajas: 0, unidades: 0 },
        { label: "Código 107", cajas: 0, unidades: 0 },
        { label: "Código 108", cajas: 0, unidades: 0 },
        { label: "Código 109", cajas: 0, unidades: 0 },
        { label: "Código 110", cajas: 0, unidades: 0 },
      ],
      totalCajas: 0,
      totalUnid: 0,
    },
  ];

  const [groups, setGroups] = useState(initialGroups);

  return (
    <div className="min-h-screen max-w-full bg-gray-50">
      {/* Contenido de Distribute */}
      <div className="p-4 lg:p-6">
        {/* Repartir Asignación Header */}
        <DistributeAssignmentHeader
          proveedor={proveedor}
          costoPorKg={costoPorKg}
          precioDiferido={precioDiferido}
          detalles={detalles}
          onCancel={onClose}
          onSave={() => console.log("Save clicked")}
        />

        {/* Bottom Section - Groups */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="space-y-4">
            {groups.map((group, groupIdx) => (
              <DistributeGroup
                key={groupIdx}
                name={group.name}
                clientesCount={group.clientesCount}
                codes={group.codes}
                totalCajas={group.totalCajas}
                totalUnid={group.totalUnid}
                onCajasChange={(codeIdx, val) => {
                  const newGroups = [...groups];
                  newGroups[groupIdx].codes[codeIdx].cajas = val;
                  setGroups(newGroups);
                }}
                onUnidadesChange={(codeIdx, val) => {
                  const newGroups = [...groups];
                  newGroups[groupIdx].codes[codeIdx].unidades = val;
                  setGroups(newGroups);
                }}
                onEmpezar={() => console.log(`Empezar ${group.name}`)}
              />
            ))}
          </div>

          {/* Global Footer Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <button className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-bold shadow-sm bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors sm:w-75 shrink-0 text-center">
              Cancelar
            </button>
            <button className="px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm bg-[#e11d48] hover:bg-rose-700 text-white transition-colors flex-1 flex items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              Guardar Distribución
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
