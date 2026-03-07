"use client";

import React, { useState, useMemo, useCallback } from "react";
import DetailAssignment from "./DetailAssignment";
import TotalGroup from "./TotalGroup";
import { useGetRequestForPlanning } from "../../hooks/planificar/useGetRequestForPlanning";
import { useAddRequestStage } from "../../../solicitudes/hooks/useAddrequeststage";
import { useAddProductRequest } from "../../../solicitudes/hooks/useAddproductrequest";
import { usePlanningData } from "../../hooks/planificar/usePlanningData";
import { useAutomaticPlanning } from "../../hooks/planificar/useAutomaticPlanning";
import { PlanningProps, EditableGroupData } from "../../types/planning.types";
import { Datum as RequestDatum } from "../../interfaces/planificar/getrequestforplanning.interface";

export default function Planificar({
  assignment = null,
  rawData = null,
  onClose,
}: PlanningProps) {
  // Hook para obtener datos de planificación
  const { data: requestData, loading, error } = useGetRequestForPlanning();

  // Hooks para guardar datos
  const { addStage, loading: loadingStage } = useAddRequestStage();
  const { addProduct, loading: loadingAdd } = useAddProductRequest();

  // Hook para procesamiento de datos
  const { detalles, processedGroups, proveedor, clienteOrigen } =
    usePlanningData(assignment, rawData, requestData);

  // Hook para planificación automática
  const { executeAutomaticPlanning, recalculateGroupTotals } =
    useAutomaticPlanning();

  // Estado editable para los grupos
  const [editableGroups, setEditableGroups] = useState<EditableGroupData[]>([]);

  // Inicializar estado editable cuando cambien los datos procesados
  React.useEffect(() => {
    if (processedGroups.length > 0) {
      setEditableGroups(processedGroups);
    }
  }, [processedGroups]);

  // Función para actualizar valores de un cliente específico
  const updateClientCode = useCallback(
    (
      groupIndex: number,
      clientIndex: number,
      codeIndex: number,
      field: "cajas" | "unidades",
      value: number,
    ) => {
      setEditableGroups((prevGroups) => {
        const newGroups = [...prevGroups];
        const group = { ...newGroups[groupIndex] };
        const clientes = [...group.clientes];
        const cliente = { ...clientes[clientIndex] };
        const codes = [...cliente.codes];
        const code = { ...codes[codeIndex] };

        // Actualizar el valor
        code[field] = value;

        // Recalcular restante (solicitado - unidades)
        code.restante = code.solicitado - code.unidades;

        codes[codeIndex] = code;
        cliente.codes = codes;

        // Recalcular totales del cliente
        cliente.totalCajas = codes.reduce((sum, c) => sum + c.cajas, 0);
        cliente.totalUnid = codes.reduce((sum, c) => sum + c.unidades, 0);

        clientes[clientIndex] = cliente;
        group.clientes = clientes;

        // Recalcular totales del grupo
        const updatedGroup = recalculateGroupTotals(group);
        newGroups[groupIndex] = updatedGroup;

        return newGroups;
      });
    },
    [recalculateGroupTotals],
  );

  // Función para guardar un grupo con position 2
  const handleSaveGroup = useCallback(
    async (groupIndex: number) => {
      try {
        const group = editableGroups[groupIndex];
        if (!group) return;

        // Obtener los RequestDatum originales para este grupo
        if (!requestData?.data) return;

        const groupRequestData = requestData.data.filter(
          (item) => item.ClientGroup_name === group.name,
        );

        if (groupRequestData.length === 0) return;

        // Track de cambios para actualizar el estado
        const updates: Array<{
          clientIndex: number;
          codeIndex: number;
          requestItems: RequestDatum[];
        }> = [];

        // Procesar cada cliente del grupo
        for (
          let clientIdx = 0;
          clientIdx < group.clientes.length;
          clientIdx++
        ) {
          const cliente = group.clientes[clientIdx];
          const clientRequestData = groupRequestData.filter(
            (item) => item.Client_name === cliente.name,
          );

          if (clientRequestData.length === 0) continue;

          // Obtener Request_id (igual para todos los items del cliente)
          const Request_id = clientRequestData[0].Request_id;

          // Crear RequestStage con position 2
          const stageResponse = await addStage(
            2, // position 2
            0, // in_container
            0, // out_container
            0, // units
            0, // container
            0, // payment
            Request_id,
          );

          if (!stageResponse) {
            console.error(`Error creating stage for Request_id ${Request_id}`);
            continue;
          }

          const RequestStage_id = stageResponse.data[0]?.requeststage_id;

          // Actualizar cada ProductRequest del cliente con los nuevos valores
          for (let codeIdx = 0; codeIdx < cliente.codes.length; codeIdx++) {
            const code = cliente.codes[codeIdx];

            // Encontrar el ProductRequest_id correspondiente
            const productItem = clientRequestData.find(
              (item) => item.Product_name === code.label,
            );

            if (!productItem) continue;

            try {
              await addProduct(
                code.cajas, // containers
                code.unidades, // units
                productItem.ProductRequest_menudencia === "true", // menudencia
                0, // net_weight
                0, // gross_weight
                0, // payment
                true, // active
                RequestStage_id,
                productItem.Product_id,
              );

              updates.push({
                clientIndex: clientIdx,
                codeIndex: codeIdx,
                requestItems: clientRequestData,
              });
            } catch (err) {
              console.error(
                `Error adding product request for stage 2, product ${productItem.Product_id}`,
                err,
              );
            }
          }
        }

        // Actualizar estado del grupo a "guardado"
        setEditableGroups((prevGroups) => {
          const newGroups = [...prevGroups];
          newGroups[groupIndex] = {
            ...newGroups[groupIndex],
            status: "guardado",
          };
          return newGroups;
        });

        console.log(`Group ${groupIndex} saved successfully`);
      } catch (err) {
        console.error("Error saving group:", err);
      }
    },
    [editableGroups, requestData, addStage, addProduct],
  );

  // Calcular totales en tiempo real desde editableGroups
  const calculatedTotals = useMemo(() => {
    const totals = new Map<string, { cajas: number; unidades: number }>();

    editableGroups.forEach((group) => {
      group.codes.forEach((code) => {
        if (!totals.has(code.label)) {
          totals.set(code.label, { cajas: 0, unidades: 0 });
        }
        const total = totals.get(code.label)!;
        total.cajas += code.cajas;
        total.unidades += code.unidades;
      });
    });

    return totals;
  }, [editableGroups]);

  // Actualizar detalles con totales calculados en tiempo real
  const updatedDetalles = useMemo(() => {
    if (detalles.length === 0) return [];

    return detalles.map((detalle) => {
      const total = calculatedTotals.get(detalle.label) || {
        cajas: 0,
        unidades: 0,
      };
      const cajasParts = detalle.cajas.split("/");
      const unidadesParts = detalle.unidades.split("/");
      const cajasPart = cajasParts.length > 1 ? cajasParts[1] : "0";
      const unidadesPart = unidadesParts.length > 1 ? unidadesParts[1] : "0";

      const cajasDisponibles = parseInt(cajasPart) || 0;
      const unidadesDisponibles = parseInt(unidadesPart) || 0;

      // Verificar si se exceden los valores disponibles
      const cajasExcedidas = total.cajas > cajasDisponibles;
      const unidadesExcedidas = total.unidades > unidadesDisponibles;

      return {
        ...detalle,
        cajas: `${total.cajas}/${cajasPart}`,
        unidades: `${total.unidades}/${unidadesPart}`,
        cajasExcedidas,
        unidadesExcedidas,
      };
    });
  }, [detalles, calculatedTotals]);

  // We keep an array of expanded group indices. Default open the first one.
  const [expandedGroups, setExpandedGroups] = useState<number[]>([0]);

  const toggleGroup = (index: number) => {
    if (expandedGroups.includes(index)) {
      setExpandedGroups(expandedGroups.filter((i) => i !== index));
    } else {
      setExpandedGroups([...expandedGroups, index]);
    }
  };

  // Función para planificación automática
  const handleAutomaticPlanning = useCallback(() => {
    if (editableGroups.length === 0 || updatedDetalles.length === 0) return;

    setEditableGroups((prevGroups) => {
      const result = executeAutomaticPlanning(prevGroups, updatedDetalles);
      console.log("Planificación automática aplicada");
      return result;
    });
  }, [editableGroups, updatedDetalles, executeAutomaticPlanning]);

  return (
    <div className="min-h-screen max-w-full bg-gray-50">
      {/* Contenido de Planning */}
      <div className="p-3">
        {/* Detail Assignment Section */}
        <DetailAssignment
          proveedor={proveedor}
          clienteOrigen={clienteOrigen}
          detalles={updatedDetalles}
          onCancel={onClose}
          onAutomaticPlanning={handleAutomaticPlanning}
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
            {loading ? (
              <div className="text-center py-8 text-gray-500">
                <p>Cargando datos de planificación...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                <p>Error: {error}</p>
              </div>
            ) : editableGroups.length > 0 ? (
              editableGroups.map((group, groupIdx) => (
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
                  onSaveGroup={() => handleSaveGroup(groupIdx)}
                  onUpdateClientCode={(clientIndex, codeIndex, field, value) =>
                    updateClientCode(
                      groupIdx,
                      clientIndex,
                      codeIndex,
                      field,
                      value,
                    )
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
