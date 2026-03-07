import { useMemo } from "react";
import { Assignment } from "../../stores/assignments-store";
import { Datum } from "../../interfaces/getassignmenthistory.interface";
import {
  Datum as RequestDatum,
  GetRequestForPlanningResponse,
} from "../../interfaces/planificar/getrequestforplanning.interface";
import { ProcessedPlanningData, GroupData } from "../../types/planning.types";

export const usePlanningData = (
  assignment: Assignment | null,
  rawData: Datum[] | null,
  requestData: GetRequestForPlanningResponse | null,
): ProcessedPlanningData => {
  return useMemo((): ProcessedPlanningData => {
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
};
