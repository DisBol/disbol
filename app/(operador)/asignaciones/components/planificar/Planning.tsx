"use client";

import React, { useState, useMemo, useCallback } from "react";
import DetailAssignment from "./DetailAssignment";
import TotalGroup from "./TotalGroup";
import { Assignment } from "../../stores/assignments-store";
import { Datum } from "../../interfaces/getassignmenthistory.interface";
import { useGetRequestForPlanning } from "../../hooks/planificar/useGetRequestForPlanning";
import { Datum as RequestDatum } from "../../interfaces/planificar/getrequestforplanning.interface";

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
  clientes: Array<{
    name: string;
    estado: string;
    codes: Array<{
      label: string;
      solicitado: number;
      cajas: number;
      unidades: number;
      restante: number;
    }>;
    totalCajas: number;
    totalUnid: number;
  }>;
}

interface EditableGroupData extends Omit<
  GroupData,
  "codes" | "totalCajas" | "totalUnid"
> {
  codes: Array<{ label: string; cajas: number; unidades: number }>;
  totalCajas: number;
  totalUnid: number;
}

export default function Planificar({
  assignment = null,
  rawData = null,
  onClose,
}: PlanningProps) {
  // Hook para obtener datos de planificación
  const { data: requestData, loading, error } = useGetRequestForPlanning();

  // Estado editable para los grupos
  const [editableGroups, setEditableGroups] = useState<EditableGroupData[]>([]);

  // Función para recalcular totales de un grupo basado en sus clientes
  const recalculateGroupTotals = useCallback(
    (group: EditableGroupData): EditableGroupData => {
      // Crear un mapa para acumular totales por producto
      const productTotals = new Map<
        string,
        { cajas: number; unidades: number }
      >();

      // Sumar todos los valores de los clientes para cada producto
      group.clientes.forEach((cliente) => {
        cliente.codes.forEach((code) => {
          if (!productTotals.has(code.label)) {
            productTotals.set(code.label, { cajas: 0, unidades: 0 });
          }
          const total = productTotals.get(code.label)!;
          total.cajas += code.cajas;
          total.unidades += code.unidades;
        });
      });

      // Actualizar los códigos del grupo
      const updatedCodes = group.codes.map((code) => {
        const total = productTotals.get(code.label) || {
          cajas: 0,
          unidades: 0,
        };
        return {
          ...code,
          cajas: total.cajas,
          unidades: total.unidades,
        };
      });

      // Calcular totales generales
      const totalCajas = updatedCodes.reduce(
        (sum, code) => sum + code.cajas,
        0,
      );
      const totalUnid = updatedCodes.reduce(
        (sum, code) => sum + code.unidades,
        0,
      );

      return {
        ...group,
        codes: updatedCodes,
        totalCajas,
        totalUnid,
      };
    },
    [],
  );

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

  // Procesar datos dinámicamente
  const { detalles, processedGroups, proveedor, clienteOrigen } = useMemo((): {
    detalles: Array<{
      label: string;
      cajas: string;
      unidades: string;
    }>;
    processedGroups: GroupData[];
    proveedor: string;
    clienteOrigen: string;
  } => {
    // Siempre procesar datos del hook para grupos
    let groups: GroupData[] = [];
    let proveedorNombre = "";

    if (requestData?.data && requestData.data.length > 0) {
      // Agrupar por ClientGroup_name
      const groupMap = new Map<string, RequestDatum[]>();

      requestData.data.forEach((item) => {
        const groupName = item.ClientGroup_name;
        if (!groupMap.has(groupName)) {
          groupMap.set(groupName, []);
        }
        groupMap.get(groupName)?.push(item);
      });

      // Procesar cada grupo
      groups = Array.from(groupMap.entries()).map(([groupName, items]) => {
        // Agrupar por cliente dentro del grupo
        const clientMap = new Map<string, RequestDatum[]>();

        items.forEach((item) => {
          const clientName = item.Client_name;
          if (!clientMap.has(clientName)) {
            clientMap.set(clientName, []);
          }
          clientMap.get(clientName)?.push(item);
        });

        // Calcular códigos del grupo (totalizar por producto)
        const productMap = new Map<
          string,
          { containers: number; units: number }
        >();

        items.forEach((item) => {
          const productName = item.Product_name;
          if (!productMap.has(productName)) {
            productMap.set(productName, { containers: 0, units: 0 });
          }
          const product = productMap.get(productName)!;
          product.containers += item.ProductRequest_containers;
          product.units += item.ProductRequest_units;
        });

        const groupCodes = Array.from(productMap.entries()).map(
          ([productName, totals]) => ({
            label: productName,
            cajas: totals.containers,
            unidades: totals.units,
          }),
        );

        // Procesar clientes
        const clientes = Array.from(clientMap.entries()).map(
          ([clientName, clientItems]) => {
            // Agrupar productos del cliente
            const clientProductMap = new Map<
              string,
              { containers: number; units: number }
            >();

            clientItems.forEach((item) => {
              const productName = item.Product_name;
              if (!clientProductMap.has(productName)) {
                clientProductMap.set(productName, { containers: 0, units: 0 });
              }
              const product = clientProductMap.get(productName)!;
              product.containers += item.ProductRequest_containers;
              product.units += item.ProductRequest_units;
            });

            const clientCodes = Array.from(clientProductMap.entries()).map(
              ([productName, totals]) => ({
                label: productName,
                solicitado: totals.units,
                cajas: totals.containers,
                unidades: totals.units,
                restante: 0,
              }),
            );

            const totalCajas = clientCodes.reduce(
              (sum, code) => sum + code.cajas,
              0,
            );
            const totalUnid = clientCodes.reduce(
              (sum, code) => sum + code.unidades,
              0,
            );

            return {
              name: clientName,
              estado: "pendiente",
              codes: clientCodes,
              totalCajas,
              totalUnid,
            };
          },
        );

        const totalCajas = groupCodes.reduce(
          (sum, code) => sum + code.cajas,
          0,
        );
        const totalUnid = groupCodes.reduce(
          (sum, code) => sum + code.unidades,
          0,
        );

        return {
          name: groupName,
          status: "pendiente" as const,
          codes: groupCodes,
          totalCajas,
          totalUnid,
          clientes,
        };
      });

      proveedorNombre = requestData.data[0]?.Provider_name || "";
    }

    // Procesar detalles si hay assignment y rawData
    let detallesArray: Array<{
      label: string;
      cajas: string;
      unidades: string;
    }> = [];

    if (assignment && rawData) {
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
        if (!productoMap.has(productCode)) {
          productoMap.set(productCode, null);
        }
      });

      // Crear detalles solo con posición 2 (formato: 0/{pos2})
      detallesArray = Array.from(productoMap.entries()).map(([code, pos2]) => ({
        label: code,
        cajas: pos2 ? `0/${pos2.ProductAssignment_container}` : "0/0",
        unidades: pos2 ? `0/${pos2.ProductAssignment_units}` : "0/0",
      }));
    } else if (groups.length > 0) {
      // Si no hay assignment/rawData, crear detalles base desde los productos de los grupos
      const allProducts = new Set<string>();
      groups.forEach((group) => {
        group.codes.forEach((code) => {
          allProducts.add(code.label);
        });
      });

      detallesArray = Array.from(allProducts).map((productName) => ({
        label: productName,
        cajas: "0/0",
        unidades: "0/0",
      }));
    }

    return {
      detalles: detallesArray,
      processedGroups: groups,
      proveedor: assignment ? assignment.proveedor : proveedorNombre,
      clienteOrigen: assignment ? assignment.proveedor : "",
    };
  }, [assignment, rawData, requestData]);

  // Inicializar estado editable cuando cambien los datos procesados
  React.useEffect(() => {
    if (processedGroups.length > 0) {
      setEditableGroups(processedGroups);
    }
  }, [processedGroups]);

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

    // Debug: Log para verificar que los totales se calculan correctamente
    console.log("Calculated totals:", Array.from(totals.entries()));
    console.log("Editable groups:", editableGroups);

    return totals;
  }, [editableGroups]);

  // Actualizar detalles con totales calculados en tiempo real
  const updatedDetalles = useMemo(() => {
    if (detalles.length === 0) return [];

    const result = detalles.map((detalle) => {
      const total = calculatedTotals.get(detalle.label) || {
        cajas: 0,
        unidades: 0,
      };
      const cajasParts = detalle.cajas.split("/");
      const unidadesParts = detalle.unidades.split("/");
      const cajasPart = cajasParts.length > 1 ? cajasParts[1] : "0";
      const unidadesPart = unidadesParts.length > 1 ? unidadesParts[1] : "0";

      return {
        ...detalle,
        cajas: `${total.cajas}/${cajasPart}`,
        unidades: `${total.unidades}/${unidadesPart}`,
      };
    });

    // Debug: Log para verificar detalles actualizados
    console.log("Updated detalles:", result);

    return result;
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
                  onSaveGroup={() =>
                    console.log(`Save group ${groupIdx} clicked`)
                  }
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
