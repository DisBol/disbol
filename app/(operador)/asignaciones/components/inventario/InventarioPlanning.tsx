"use client";

import React, { useState, useMemo, useCallback } from "react";
import jsPDF from "jspdf";
import DetailInventario from "./DetailInventario";
import InventarioTotalGroup from "./InventarioTotalGroup";
import DistributeGroup from "../repartir/DistributeGroup";
import { useCategoryProvider } from "@/app/(operador)/configuraciones/hooks/proveedores/useCategoryprovider";
import { useContainer } from "@/app/(operador)/configuraciones/hooks/contenedores/useContainer";
import { useCar } from "@/app/(operador)/configuraciones/hooks/vehiculos/useCar";
import { useGetEmployeeDriver } from "../../hooks/chofer/useGetEmployeeDriver";
import { useGetProductInventory } from "../../hooks/inventario/useGetProductInventory";
import { useGetRequestForPlanning } from "../../hooks/planificar/useGetRequestForPlanning";
import { useGetProductInventoryContainer } from "../../hooks/inventario/useGetProductInventoryContainer";
import { useAddAssignmentRequest } from "../../hooks/useAddAssignmentRequest";
import { useAddRequestStage } from "../../../solicitudes/hooks/useAddrequeststage";
import { useAddProductRequest } from "../../../solicitudes/hooks/useAddproductrequest";
import { EditableGroupData } from "../../types/planning.types";
import { Datum as RequestDatum } from "../../interfaces/planificar/getrequestforplanning.interface";
import { RouteReportData } from "../repartir/DistributeAssignmentHeader";

interface InventarioPlanningProps {
  onClose?: () => void;
}

export default function InventarioPlanning({
  onClose,
}: InventarioPlanningProps) {
  const { providers, loading: isLoadingProviders } = useCategoryProvider();
  const { containers, isLoading: isLoadingContainers } = useContainer();
  const { cars } = useCar();
  const { drivers } = useGetEmployeeDriver();
  const [proveedor, setProveedor] = useState("");
  const [grupo, setGrupo] = useState("");
  const [contenedor, setContenedor] = useState("");

  // Estados para distribución después de guardar inventario
  const [activeGroupIdxForDistribution, setActiveGroupIdxForDistribution] =
    useState<number | null>(null);
  const [vehiculo, setVehiculo] = useState<string>("");
  const [chofer, setChofer] = useState<string>("");
  const [routeReport, setRouteReport] = useState<RouteReportData | null>(null);
  const [requestStageMap, setRequestStageMap] = useState<Map<string, number>>(
    new Map(),
  );

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
    const selectedProvider = providers.find(
      (p) => p.id.toString() === proveedor,
    );
    return (
      selectedProvider?.grupos.find((g) => g.id.toString() === grupo) ?? null
    );
  }, [proveedor, grupo, providers]);

  const categoryProviderId = selectedGroupMeta?.CategoryProvider_id ?? null;

  const { data: inventoryData, loading: loadingInventory } =
    useGetProductInventory();
  const {
    data: requestData,
    loading: loadingRequest,
    error: errorRequest,
  } = useGetRequestForPlanning(categoryProviderId);

  // Build EditableGroupData from request data
  const processedGroups = useMemo((): EditableGroupData[] => {
    if (!requestData?.data || requestData.data.length === 0) return [];

    const groupMap = new Map<string, RequestDatum[]>();
    requestData.data.forEach((item) => {
      if (!groupMap.has(item.ClientGroup_name))
        groupMap.set(item.ClientGroup_name, []);
      groupMap.get(item.ClientGroup_name)!.push(item);
    });

    return Array.from(groupMap.entries()).map(([groupName, items]) => {
      const productMap = new Map<
        string,
        { containers: number; units: number }
      >();
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
        if (!clientMap.has(item.Client_name))
          clientMap.set(item.Client_name, []);
        clientMap.get(item.Client_name)!.push(item);
      });

      const clientes = Array.from(clientMap.entries()).map(
        ([clientName, clientItems]) => {
          const clientProductMap = new Map<
            string,
            { containers: number; units: number }
          >();
          clientItems.forEach((item) => {
            if (!clientProductMap.has(item.Product_name))
              clientProductMap.set(item.Product_name, {
                containers: 0,
                units: 0,
              });
            const p = clientProductMap.get(item.Product_name)!;
            p.containers += item.ProductRequest_containers;
            p.units += item.ProductRequest_units;
          });

          const clientCodes = Array.from(clientProductMap.entries()).map(
            ([name, t]) => ({
              label: name,
              solicitado: t.units,
              cajas: t.containers,
              unidades: t.units,
              restante: 0,
            }),
          );

          return {
            name: clientName,
            estado: "pendiente",
            codes: clientCodes,
            totalCajas: clientCodes.reduce((s, c) => s + c.cajas, 0),
            totalUnid: clientCodes.reduce((s, c) => s + c.unidades, 0),
          };
        },
      );

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
        if (!totals.has(code.label))
          totals.set(code.label, { cajas: 0, unidades: 0 });
        const t = totals.get(code.label)!;
        t.cajas += code.cajas;
        t.unidades += code.unidades;
      });
    });
    return totals;
  }, [editableGroups]);

  const totalPlannedCajas = useMemo(() => {
    let total = 0;
    plannedTotals.forEach((t) => {
      total += t.cajas;
    });
    return total;
  }, [plannedTotals]);

  // Build detalles: compare planned vs inventory
  const detalles = useMemo(() => {
    const productNameById = new Map<number, string>();
    requestData?.data?.forEach((item) => {
      if (!productNameById.has(item.Product_id)) {
        productNameById.set(item.Product_id, item.Product_name);
      }
    });

    const inventoryMap = new Map<
      string,
      { containers: number; units: number }
    >();
    inventoryData?.data.forEach((item) => {
      if (contenedor && item.Container_id !== Number(contenedor)) return;
      const productName = productNameById.get(item.Product_id);
      if (!productName) return;

      if (!inventoryMap.has(productName)) {
        inventoryMap.set(productName, { containers: 0, units: 0 });
      }

      const current = inventoryMap.get(productName)!;
      current.containers += item.container;
      current.units += item.units;
    });

    const allProducts = new Set<string>([
      ...Array.from(plannedTotals.keys()),
      ...Array.from(inventoryMap.keys()),
    ]);

    return Array.from(allProducts).map((productName) => {
      const planned = plannedTotals.get(productName) ?? {
        cajas: 0,
        unidades: 0,
      };
      const inventory = inventoryMap.get(productName) ?? {
        containers: 0,
        units: 0,
      };

      return {
        label: productName,
        cajas: `${planned.cajas}/${inventory.containers}`,
        unidades: `${planned.unidades}/${inventory.units}`,
        cajasExcedidas: planned.cajas > inventory.containers,
        unidadesExcedidas: planned.unidades > inventory.units,
      };
    });
  }, [plannedTotals, inventoryData, requestData, contenedor]);

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

        const productTotals = new Map<
          string,
          { cajas: number; unidades: number }
        >();
        group.clientes.forEach((cl) => {
          cl.codes.forEach((c) => {
            if (!productTotals.has(c.label))
              productTotals.set(c.label, { cajas: 0, unidades: 0 });
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

  const { addAssignment } = useAddAssignmentRequest();
  const { addStage } = useAddRequestStage();
  const { addProduct } = useAddProductRequest();

  const [savingGroups, setSavingGroups] = useState<number[]>([]);
  const handleSaveGroup = useCallback(
    async (groupIndex: number) => {
      const group = editableGroups[groupIndex];
      if (!group || !contenedor || !requestData?.data) return;

      const inventoryMap = new Map<string, number>();
      requestData.data.forEach((item) => {
        if (!inventoryMap.has(item.Product_name)) {
          inventoryMap.set(item.Product_name, item.Product_id);
        }
      });

      setSavingGroups((prev) => [...prev, groupIndex]);
      const stageMapAccumulator = new Map<string, number>();

      try {
        // Para cada cliente del grupo: vincular asignación, crear stage (position 2) y agregar productos
        for (
          let clientIdx = 0;
          clientIdx < group.clientes.length;
          clientIdx++
        ) {
          const cliente = group.clientes[clientIdx];
          const clientRequestData = requestData.data.filter(
            (item) =>
              item.Client_name === cliente.name &&
              item.ClientGroup_name === group.name,
          );

          if (clientRequestData.length === 0) continue;

          const Request_id = clientRequestData[0].Request_id;

          try {
            await addAssignment(1, Request_id, "true"); // Assignment_id estatico por ahora = 1 cambiar cuando la api de getproductinventory traiga el id de asignación
          } catch (err) {
            console.error(
              `Error linking assignment for Request ${Request_id}`,
              err,
            );
            continue;
          }

          const stageResponse = await addStage(
            2, // position
            0,
            0,
            0,
            0,
            0,
            Request_id,
          );

          if (!stageResponse) {
            console.error(`Error creating stage for Request ${Request_id}`);
            continue;
          }

          const RequestStage_id = stageResponse.data?.[0]?.requeststage_id;

          // Almacenar RequestStage_id en el acumulador para uso posterior
          if (RequestStage_id) {
            stageMapAccumulator.set(`${Request_id}`, RequestStage_id);
          }

          for (let codeIdx = 0; codeIdx < cliente.codes.length; codeIdx++) {
            const code = cliente.codes[codeIdx];
            const productItem = clientRequestData.find(
              (it) => it.Product_name === code.label,
            );
            if (!productItem) continue;

            try {
              await addProduct(
                code.cajas,
                code.unidades,
                productItem.ProductRequest_menudencia === "true",
                0,
                0,
                0,
                true,
                RequestStage_id,
                productItem.Product_id,
              );
            } catch (err) {
              console.error(
                `Error adding product request for Request ${Request_id}, product ${productItem.Product_id}`,
                err,
              );
            }
          }
        }

        // Actualizar el mapa de RequestStage_id una sola vez al final
        if (stageMapAccumulator.size > 0) {
          setRequestStageMap((prev) => {
            const newMap = new Map(prev);
            stageMapAccumulator.forEach((value, key) => {
              newMap.set(key, value);
            });
            return newMap;
          });
        }

        // Marcar el grupo como guardado y abrir vista de distribución
        setEditableGroups((prevGroups) => {
          const newGroups = [...prevGroups];
          if (newGroups[groupIndex]) {
            newGroups[groupIndex] = {
              ...newGroups[groupIndex],
              status: "guardado",
            };
          }
          return newGroups;
        });

        // Abrir vista de distribución para este grupo
        setActiveGroupIdxForDistribution(groupIndex);
      } finally {
        setSavingGroups((prev) => prev.filter((i) => i !== groupIndex));
      }
    },
    [
      editableGroups,
      contenedor,
      requestData,
      addAssignment,
      addStage,
      addProduct,
    ],
  );

  const loading = loadingInventory || loadingRequest;

  // Convertir editableGroups a formato compatible con DistributeGroup
  const convertedGroups = useMemo(() => {
    return editableGroups.map((group) => ({
      name: group.name,
      clientesCount: group.clientes.length,
      clientes: group.clientes.map((cliente) => {
        // Buscar datos del cliente en requestData para obtener IDs reales
        const clientRequestData = requestData?.data?.find(
          (item) =>
            item.Client_name === cliente.name &&
            item.ClientGroup_name === group.name,
        );

        const Request_id = clientRequestData?.Request_id ?? 0;

        return {
          name: cliente.name,
          estado: cliente.estado,
          Request_id,
          RequestStage_id: requestStageMap.get(`${Request_id}`) ?? 0,
          Client_id: clientRequestData?.Client_id ?? 0,
          Provider_id: clientRequestData?.Provider_id ?? 0,
          CategoryProvider_id:
            clientRequestData?.Request_CategoryProvider_id ?? 0,
          codes: cliente.codes
            .filter((code) => code.cajas > 0 || code.unidades > 0)
            .map((code) => {
              // Buscar ProductRequest_id real del requestData
              const productData = requestData?.data?.find(
                (item) =>
                  item.Client_name === cliente.name &&
                  item.Product_name === code.label &&
                  item.ClientGroup_name === group.name,
              );

              return {
                label: code.label,
                solicitado: code.solicitado,
                cajas: code.cajas,
                unidades: code.unidades,
                ProductRequest_id: productData?.ProductRequest_id ?? 0,
                Product_id: productData?.Product_id ?? 0,
                menudencia: productData?.ProductRequest_menudencia ?? "0",
              };
            }),
          totalCajas: cliente.codes
            .filter((code) => code.cajas > 0 || code.unidades > 0)
            .reduce((sum, c) => sum + c.cajas, 0),
          totalUnid: cliente.codes
            .filter((code) => code.cajas > 0 || code.unidades > 0)
            .reduce((sum, c) => sum + c.unidades, 0),
        };
      }),
      codes: group.codes.filter((code) => code.cajas > 0 || code.unidades > 0),
      totalCajas: group.codes
        .filter((code) => code.cajas > 0 || code.unidades > 0)
        .reduce((sum, c) => sum + c.cajas, 0),
      totalUnid: group.codes
        .filter((code) => code.cajas > 0 || code.unidades > 0)
        .reduce((sum, c) => sum + c.unidades, 0),
    }));
  }, [editableGroups, requestData, requestStageMap]);

  // Si hay un grupo activo para distribución, mostrar vista de distribución
  if (
    activeGroupIdxForDistribution !== null &&
    convertedGroups[activeGroupIdxForDistribution]
  ) {
    const activeGroup = convertedGroups[activeGroupIdxForDistribution];

    return (
      <div className="w-full bg-gray-50">
        <div className="p-4 lg:p-6">
          {/* Header de Distribución */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-5 p-5">
            <h2 className="text-[17px] font-bold text-[#1e293b] mb-5">
              Distribución del Inventario - {activeGroup.name}
            </h2>

            <div className="flex flex-col xl:flex-row items-start gap-6">
              {/* Selección de Vehículo */}
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-[#1e293b] mb-2">
                  Vehículo
                </label>
                <select
                  value={vehiculo}
                  onChange={(e) => setVehiculo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Seleccionar vehículo</option>
                  {cars.map((car) => (
                    <option key={car.id} value={car.id.toString()}>
                      {car.name} ({car.license})
                    </option>
                  ))}
                </select>
              </div>

              {/* Selección de Chofer */}
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-[#1e293b] mb-2">
                  Chofer
                </label>
                <select
                  value={chofer}
                  onChange={(e) => setChofer(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Seleccionar chofer</option>
                  {drivers.map((driver) => (
                    <option key={driver.id} value={driver.id.toString()}>
                      {driver.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Botones de Acción */}
              <div className="flex gap-3 items-end w-full xl:w-auto">
                <button
                  onClick={() => setActiveGroupIdxForDistribution(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-[#1e293b] hover:bg-gray-50 font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    if (routeReport) {
                      // Generar PDF con jsPDF
                      const pdfContent = document.createElement("div");
                      pdfContent.style.width = "900px";
                      pdfContent.style.padding = "32px";
                      pdfContent.style.backgroundColor = "#ffffff";
                      pdfContent.style.fontFamily = "Arial, sans-serif";
                      pdfContent.innerHTML = buildRoutePdfHtml();

                      document.body.appendChild(pdfContent);

                      const pdf = new jsPDF({
                        orientation: "portrait",
                        unit: "mm",
                        format: "a4",
                      });

                      pdf.html(pdfContent, {
                        callback: function (doc) {
                          const pdfBlob = doc.output("blob");
                          const pdfUrl = URL.createObjectURL(pdfBlob);
                          window.open(pdfUrl, "_blank");
                          document.body.removeChild(pdfContent);
                        },
                        x: 10,
                        y: 10,
                        width: 190,
                        windowWidth: 900,
                      });
                    }
                  }}
                  disabled={!routeReport}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium disabled:opacity-50"
                >
                  📄 Imprimir Ruta
                </button>
              </div>
            </div>

            {/* Información del Grupo */}
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 font-semibold">
                  Total Cajas
                </p>
                <p className="text-lg font-bold text-[#1e293b]">
                  {activeGroup.totalCajas}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 font-semibold">
                  Total Unidades
                </p>
                <p className="text-lg font-bold text-[#1e293b]">
                  {activeGroup.totalUnid}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 font-semibold">Clientes</p>
                <p className="text-lg font-bold text-[#1e293b]">
                  {activeGroup.clientesCount}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 font-semibold">Vehículo</p>
                <p className="text-lg font-bold text-[#1e293b]">
                  {vehiculo
                    ? cars.find((c) => c.id.toString() === vehiculo)?.license
                    : "No asignado"}
                </p>
              </div>
            </div>
          </div>

          {/* Grupo de Distribución */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <DistributeGroup
              name={activeGroup.name}
              clientesCount={activeGroup.clientesCount}
              clientes={activeGroup.clientes}
              codes={activeGroup.codes}
              totalCajas={activeGroup.totalCajas}
              totalUnid={activeGroup.totalUnid}
              costoPorKg="10.00"
              isActive={true}
              readOnly={false}
              vehiculo={vehiculo}
              chofer={chofer}
              proveedor={proveedor}
              onStarted={() => {}}
              onRouteReportChange={setRouteReport}
            />
          </div>
        </div>
      </div>
    );
  }

  // Vista normal de inventario
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
          containerOptions={containers.map((c) => ({
            value: c.value,
            label: c.label,
          }))}
          selectedContenedor={contenedor}
          isLoadingContainers={isLoadingContainers}
          onProviderChange={handleProviderChange}
          onGrupoChange={handleGrupoChange}
          onContenedorChange={setContenedor}
          containerInfo={containerInfo}
          plannedTotal={totalPlannedCajas}
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
                  status={group.status}
                  codes={group.codes}
                  totalCajas={group.totalCajas}
                  totalUnid={group.totalUnid}
                  clientes={group.clientes}
                  isExpanded={expandedGroups.includes(groupIdx)}
                  onToggleExpand={() => toggleGroup(groupIdx)}
                  onSave={() => handleSaveGroup(groupIdx)}
                  isSaving={savingGroups.includes(groupIdx)}
                  selectedContenedor={contenedor}
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
                <p>Sin grupos disponibles para esta categoría</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Función auxiliar para generar HTML de ruta PDF
  function buildRoutePdfHtml(): string {
    if (!routeReport) return "";

    const formatMoney = (value: number) =>
      value.toLocaleString("es-BO", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

    const clientsHtml = routeReport.clientes
      .map((cliente) => {
        const codesHtml = cliente.codes
          .map(
            (code, cIdx) =>
              `<tr style="background-color: ${cIdx % 2 === 0 ? "#f9fafb" : "#fff"}; border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 10px 12px; text-align: left; font-weight: 500;">${code.label}</td>
                <td style="padding: 10px 12px; text-align: right;">${code.solicitado}</td>
                <td style="padding: 10px 12px; text-align: right;">${code.cajas}</td>
                <td style="padding: 10px 12px; text-align: right;">${code.unidades}</td>
                <td style="padding: 10px 12px; text-align: right;">${code.bruto.toFixed(2)}</td>
                <td style="padding: 10px 12px; text-align: right;">${code.neto.toFixed(2)}</td>
                <td style="padding: 10px 12px; text-align: right;">Bs ${formatMoney(code.precioUnitario)}</td>
                <td style="padding: 10px 12px; text-align: right; font-weight: 700; color: #e11d48;">Bs ${formatMoney(code.totalBs)}</td>
              </tr>`,
          )
          .join("");

        return `
          <section style="margin-bottom: 24px; page-break-inside: avoid;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 16px; margin-bottom: 10px;">
              <div>
                <h3 style="margin: 0; font-size: 16px; color: #111827; font-weight: 700;">${cliente.nombre}</h3>
                <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 11px;">Solicitud #${cliente.requestId}</p>
              </div>
              <div style="text-align: right; font-size: 12px; color: #6b7280;">
                <div>Monto a cobrar: <strong style="color: #e11d48; font-size: 14px;">Bs ${formatMoney(cliente.montoACobrar)}</strong></div>
                <div style="margin-top: 4px;">Peso bruto: <strong style="color: #111827;">${formatMoney(cliente.totalBruto)} kg</strong></div>
                <div style="margin-top: 2px;">Peso neto: <strong style="color: #111827;">${formatMoney(cliente.totalNeto)} kg</strong></div>
              </div>
            </div>
            <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
              <thead>
                <tr style="background: #e11d48; color: #fff;">
                  <th style="padding: 10px 12px; text-align: left;">Código</th>
                  <th style="padding: 10px 12px; text-align: right;">Solic.</th>
                  <th style="padding: 10px 12px; text-align: right;">Cajas</th>
                  <th style="padding: 10px 12px; text-align: right;">Unid.</th>
                  <th style="padding: 10px 12px; text-align: right;">Bruto kg</th>
                  <th style="padding: 10px 12px; text-align: right;">Neto kg</th>
                  <th style="padding: 10px 12px; text-align: right;">Precio kg</th>
                  <th style="padding: 10px 12px; text-align: right;">Total Bs</th>
                </tr>
              </thead>
              <tbody>${codesHtml}</tbody>
            </table>
            <div style="display: flex; justify-content: flex-end; margin-top: 8px; font-size: 12px; color: #111827;">
              <div><strong>Costo de distribución:</strong> <span style="color: #e11d48; font-weight: 700; margin-left: 8px;">Bs ${formatMoney(cliente.totalBs)}</span></div>
            </div>
          </section>
        `;
      })
      .join("");

    return `
      <div style="margin-bottom: 40px; color: #111827; background-color: #ffffff;">
        <h1 style="font-size: 30px; font-weight: 800; color: #e11d48; margin: 0 0 10px 0; text-align: center; letter-spacing: 0.02em;">
          Ruta de Distribución
        </h1>
        <p style="margin: 0; text-align: center; color: #6b7280; font-size: 12px;">Detalle completo de entrega, pesajes y costo de distribución</p>

        <div style="margin-top: 18px; background-color: #ffffff; border: 1px solid #fecdd3; border-radius: 14px; padding: 18px 20px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px;">
          <div style="background-color: #fff7f7; border: 1px solid #ffd5dd; border-radius: 12px; padding: 12px 14px;">
            <div style="font-size: 11px; color: #6b7280; text-transform: uppercase; font-weight: 700; letter-spacing: 0.04em;">Grupo</div>
            <div style="font-size: 17px; font-weight: 800; color: #111827; margin-top: 4px;">${routeReport.groupName}</div>
          </div>
          <div style="background-color: #fff7f7; border: 1px solid #ffd5dd; border-radius: 12px; padding: 12px 14px;">
            <div style="font-size: 11px; color: #6b7280; text-transform: uppercase; font-weight: 700; letter-spacing: 0.04em;">Vehículo</div>
            <div style="font-size: 17px; font-weight: 800; color: #111827; margin-top: 4px;">${routeReport.vehiculo}</div>
          </div>
          <div style="background-color: #fff7f7; border: 1px solid #ffd5dd; border-radius: 12px; padding: 12px 14px;">
            <div style="font-size: 11px; color: #6b7280; text-transform: uppercase; font-weight: 700; letter-spacing: 0.04em;">Chofer</div>
            <div style="font-size: 17px; font-weight: 800; color: #111827; margin-top: 4px;">${routeReport.chofer}</div>
          </div>
          <div style="background-color: #fff7f7; border: 1px solid #ffd5dd; border-radius: 12px; padding: 12px 14px;">
            <div style="font-size: 11px; color: #6b7280; text-transform: uppercase; font-weight: 700; letter-spacing: 0.04em;">Proveedor</div>
            <div style="font-size: 17px; font-weight: 800; color: #111827; margin-top: 4px;">${routeReport.proveedor}</div>
          </div>
          <div style="background-color: #fff7f7; border: 1px solid #ffd5dd; border-radius: 12px; padding: 12px 14px;">
            <div style="font-size: 11px; color: #6b7280; text-transform: uppercase; font-weight: 700; letter-spacing: 0.04em;">Costo por kg</div>
            <div style="font-size: 17px; font-weight: 800; color: #111827; margin-top: 4px;">Bs ${routeReport.costoPorKg}</div>
          </div>
          <div style="background-color: #fff7f7; border: 1px solid #ffd5dd; border-radius: 12px; padding: 12px 14px;">
            <div style="font-size: 11px; color: #6b7280; text-transform: uppercase; font-weight: 700; letter-spacing: 0.04em;">Precio diferido</div>
            <div style="font-size: 17px; font-weight: 800; color: #111827; margin-top: 4px;">${routeReport.precioDiferido ? "Sí" : "No"}</div>
          </div>
        </div>

        <div style="margin-top: 16px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
          <div style="background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 14px 16px;">
            <div style="font-size: 11px; color: #6b7280; text-transform: uppercase; font-weight: 700;">Total cajas</div>
            <div style="font-size: 24px; font-weight: 800; color: #e11d48; margin-top: 4px;">${routeReport.totalCajas}</div>
          </div>
          <div style="background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 14px 16px;">
            <div style="font-size: 11px; color: #6b7280; text-transform: uppercase; font-weight: 700;">Total unidades</div>
            <div style="font-size: 24px; font-weight: 800; color: #e11d48; margin-top: 4px;">${routeReport.totalUnid}</div>
          </div>
        </div>

        <div style="margin-top: 26px;">
          <h2 style="font-size: 20px; font-weight: 800; color: #111827; margin: 0 0 14px 0;">Clientes y detalle de códigos</h2>
          ${clientsHtml || `<div style="padding: 18px; border: 1px dashed #d1d5db; border-radius: 12px; color: #6b7280; text-align: center;">Sin clientes registrados</div>`}
        </div>

        <div style="margin-top: 24px; padding-top: 14px; border-top: 2px solid #fecdd3; text-align: center; color: #6b7280; font-size: 11px;">
          Documento generado el ${new Date().toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>
    `;
  }
}
