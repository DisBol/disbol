"use client";

import React, { useState, useMemo, useCallback } from "react";
import DetailInventario from "./DetailInventario";
import InventarioTotalGroup from "./InventarioTotalGroup";
import { useCategoryProvider } from "@/app/(operador)/configuraciones/hooks/proveedores/useCategoryprovider";
import { useContainer } from "@/app/(operador)/configuraciones/hooks/contenedores/useContainer";
import { useGetProductInventoryUnits } from "../../hooks/inventario/useGetProductInventoryunits";
import { useGetRequestForPlanning } from "../../hooks/planificar/useGetRequestForPlanning";
import { useGetProductInventoryContainer } from "../../hooks/inventario/useGetProductInventoryContainer";
import { EditableGroupData } from "../../types/planning.types";
import { Datum as RequestDatum } from "../../interfaces/planificar/getrequestforplanning.interface";

interface InventarioPlanningProps {
  onClose?: () => void;
}

export default function InventarioPlanning({ onClose }: InventarioPlanningProps) {
  const { providers, loading: isLoadingProviders } = useCategoryProvider();
  const { containers, isLoading: isLoadingContainers } = useContainer();
  const [proveedor, setProveedor] = useState("");
  const [grupo, setGrupo] = useState("");
  const [contenedor, setContenedor] = useState("");

  const { data: containerData } = useGetProductInventoryContainer(
    contenedor ? Number(contenedor) : null,
  );
  const containerInfo = containerData?.data?.[0] ?? null;

  const providerOptions = useMemo(
    () => providers.map((p) => ({ value: p.id.toString(), label: p.nombre })),
    [providers],
  );

  const groupOptions = useMemo(() => {
    const selected = providers.find((p) => p.id.toString() === proveedor);
    return selected
      ? selected.grupos.map((g) => ({ value: g.id.toString(), label: g.name }))
      : [];
  }, [proveedor, providers]);

  const selectedGroupMeta = useMemo(() => {
    const selectedProvider = providers.find((p) => p.id.toString() === proveedor);
    return selectedProvider?.grupos.find((g) => g.id.toString() === grupo) ?? null;
  }, [proveedor, grupo, providers]);

  const categoryId = grupo ? Number(grupo) : null;
  const categoryProviderId = selectedGroupMeta?.CategoryProvider_id ?? null;

  const { data: inventoryData, loading: loadingInventory } =
    useGetProductInventoryUnits(categoryId);
  const { data: requestData, loading: loadingRequest, error: errorRequest } =
    useGetRequestForPlanning(categoryProviderId);

  // Build EditableGroupData from request data
  const processedGroups = useMemo((): EditableGroupData[] => {
    if (!requestData?.data || requestData.data.length === 0) return [];

    const groupMap = new Map<string, RequestDatum[]>();
    requestData.data.forEach((item) => {
      if (!groupMap.has(item.ClientGroup_name)) groupMap.set(item.ClientGroup_name, []);
      groupMap.get(item.ClientGroup_name)!.push(item);
    });

    return Array.from(groupMap.entries()).map(([groupName, items]) => {
      const productMap = new Map<string, { containers: number; units: number }>();
      items.forEach((item) => {
        if (!productMap.has(item.Product_name))
          productMap.set(item.Product_name, { containers: 0, units: 0 });
        const p = productMap.get(item.Product_name)!;
        p.containers += item.ProductRequest_containers;
        p.units += item.ProductRequest_units;
      });

      const groupCodes = Array.from(productMap.entries()).map(([name, t]) => ({
        label: name,
        cajas: t.containers,
        unidades: t.units,
      }));

      const clientMap = new Map<string, RequestDatum[]>();
      items.forEach((item) => {
        if (!clientMap.has(item.Client_name)) clientMap.set(item.Client_name, []);
        clientMap.get(item.Client_name)!.push(item);
      });

      const clientes = Array.from(clientMap.entries()).map(([clientName, clientItems]) => {
        const clientProductMap = new Map<string, { containers: number; units: number }>();
        clientItems.forEach((item) => {
          if (!clientProductMap.has(item.Product_name))
            clientProductMap.set(item.Product_name, { containers: 0, units: 0 });
          const p = clientProductMap.get(item.Product_name)!;
          p.containers += item.ProductRequest_containers;
          p.units += item.ProductRequest_units;
        });

        const clientCodes = Array.from(clientProductMap.entries()).map(([name, t]) => ({
          label: name,
          solicitado: t.units,
          cajas: t.containers,
          unidades: t.units,
          restante: 0,
        }));

        return {
          name: clientName,
          estado: "pendiente",
          codes: clientCodes,
          totalCajas: clientCodes.reduce((s, c) => s + c.cajas, 0),
          totalUnid: clientCodes.reduce((s, c) => s + c.unidades, 0),
        };
      });

      return {
        name: groupName,
        status: "pendiente" as const,
        codes: groupCodes,
        totalCajas: groupCodes.reduce((s, c) => s + c.cajas, 0),
        totalUnid: groupCodes.reduce((s, c) => s + c.unidades, 0),
        clientes,
      };
    });
  }, [requestData]);

  const [editableGroups, setEditableGroups] = useState<EditableGroupData[]>([]);

  React.useEffect(() => {
    setEditableGroups(processedGroups);
  }, [processedGroups]);

  const handleProviderChange = (value: string) => {
    setProveedor(value);
    setGrupo("");
    setEditableGroups([]);
  };

  const handleGrupoChange = (value: string) => {
    setGrupo(value);
    setEditableGroups([]);
  };

  // Planned totals per product from editableGroups
  const plannedTotals = useMemo(() => {
    const totals = new Map<string, { cajas: number; unidades: number }>();
    editableGroups.forEach((group) => {
      group.codes.forEach((code) => {
        if (!totals.has(code.label)) totals.set(code.label, { cajas: 0, unidades: 0 });
        const t = totals.get(code.label)!;
        t.cajas += code.cajas;
        t.unidades += code.unidades;
      });
    });
    return totals;
  }, [editableGroups]);

  // Build detalles: compare planned vs inventory
  const detalles = useMemo(() => {
    const inventoryMap = new Map<string, number>();
    inventoryData?.data.forEach((item) => {
      inventoryMap.set(item.Product_name, item.Productinventory_units);
    });

    const allProducts = new Set<string>([
      ...Array.from(plannedTotals.keys()),
      ...Array.from(inventoryMap.keys()),
    ]);

    return Array.from(allProducts).map((productName) => {
      const planned = plannedTotals.get(productName) ?? { cajas: 0, unidades: 0 };
      const inventoryUnits = inventoryMap.get(productName) ?? 0;

      return {
        label: productName,
        cajas: `${planned.cajas}/0`,
        unidades: `${planned.unidades}/${inventoryUnits}`,
        cajasExcedidas: false,
        unidadesExcedidas: planned.unidades > inventoryUnits,
      };
    });
  }, [plannedTotals, inventoryData]);

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

        code[field] = value;
        code.restante = code.solicitado - code.unidades;

        codes[codeIndex] = code;
        cliente.codes = codes;
        cliente.totalCajas = codes.reduce((s, c) => s + c.cajas, 0);
        cliente.totalUnid = codes.reduce((s, c) => s + c.unidades, 0);
        clientes[clientIndex] = cliente;
        group.clientes = clientes;

        const productTotals = new Map<string, { cajas: number; unidades: number }>();
        group.clientes.forEach((cl) => {
          cl.codes.forEach((c) => {
            if (!productTotals.has(c.label)) productTotals.set(c.label, { cajas: 0, unidades: 0 });
            const t = productTotals.get(c.label)!;
            t.cajas += c.cajas;
            t.unidades += c.unidades;
          });
        });
        const updatedCodes = group.codes.map((c) => {
          const t = productTotals.get(c.label) ?? { cajas: 0, unidades: 0 };
          return { ...c, cajas: t.cajas, unidades: t.unidades };
        });
        newGroups[groupIndex] = {
          ...group,
          codes: updatedCodes,
          totalCajas: updatedCodes.reduce((s, c) => s + c.cajas, 0),
          totalUnid: updatedCodes.reduce((s, c) => s + c.unidades, 0),
        };

        return newGroups;
      });
    },
    [],
  );

  const [expandedGroups, setExpandedGroups] = useState<number[]>([0]);
  const toggleGroup = (index: number) => {
    setExpandedGroups((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const loading = loadingInventory || loadingRequest;

  return (
    <div className="min-h-screen max-w-full bg-gray-50">
      <div className="p-3">
        <DetailInventario
          detalles={detalles}
          providerOptions={providerOptions}
          groupOptions={groupOptions}
          selectedProveedor={proveedor}
          selectedGrupo={grupo}
          isLoadingProviders={isLoadingProviders}
          containerOptions={containers.map((c) => ({ value: c.value, label: c.label }))}
          selectedContenedor={contenedor}
          isLoadingContainers={isLoadingContainers}
          onProviderChange={handleProviderChange}
          onGrupoChange={handleGrupoChange}
          onContenedorChange={setContenedor}
          containerInfo={containerInfo}
          onCancel={onClose}
        />

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 pb-2">
            <h2 className="text-sm font-bold text-[#1e293b] mb-2">
              Totales por Grupo
            </h2>
          </div>
          <div className="p-4 pt-0 space-y-3">
            {!grupo ? (
              <div className="text-center py-8 text-gray-500">
                <p>Seleccione un proveedor y categoría</p>
              </div>
            ) : loading ? (
              <div className="text-center py-8 text-gray-500">
                <p>Cargando datos...</p>
              </div>
            ) : errorRequest ? (
              <div className="text-center py-8 text-red-500">
                <p>Error: {errorRequest}</p>
              </div>
            ) : editableGroups.length > 0 ? (
              editableGroups.map((group, groupIdx) => (
                <InventarioTotalGroup
                  key={groupIdx}
                  name={group.name}
                  codes={group.codes}
                  totalCajas={group.totalCajas}
                  totalUnid={group.totalUnid}
                  clientes={group.clientes}
                  isExpanded={expandedGroups.includes(groupIdx)}
                  onToggleExpand={() => toggleGroup(groupIdx)}
                  onUpdateClientCode={(clientIndex, codeIndex, field, value) =>
                    updateClientCode(groupIdx, clientIndex, codeIndex, field, value)
                  }
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Sin grupos disponibles para esta categoría</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
