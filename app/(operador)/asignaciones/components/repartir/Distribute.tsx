"use client";

import React, { useState, useMemo } from "react";
import DistributeAssignmentHeader from "./DistributeAssignmentHeader";
import DistributeGroup from "./DistributeGroup";
import { Assignment } from "../../stores/assignments-store";
import { Datum } from "../../interfaces/getassignmenthistory.interface";
import { useGetRequestForreparting } from "../../hooks/repartir/useGetRequestForreparting";
import { Datum as RepartirDatum } from "../../interfaces/repartir/getrequestforreparting.interface";
import { useDistributeStore } from "../../stores/distribute-store";
import { useAssignmentsStore } from "../../stores/assignments-store";
import { useUpdateAssignment } from "../../hooks/useUpdateAssignment";
import { useAddContainerMovements } from "../../hooks/repartir/useAddContainerMovements";
import { Modal } from "@/components/ui/Modal";

interface DistributeProps {
  assignment?: Assignment | null;
  rawData?: Datum[] | null;
  onClose?: () => void;
}

interface GroupData {
  name: string;
  clientesCount: number;
  clientes: Array<{
    name: string;
    estado: string;
    Request_id: number;
    Client_id: number;
    Provider_id: number;
    CategoryProvider_id: number;
    codes: Array<{
      label: string;
      solicitado: number;
      cajas: number;
      unidades: number;
      ProductRequest_id: number;
      Product_id: number;
      menudencia: string;
    }>;
    totalCajas: number;
    totalUnid: number;
  }>;
  codes: Array<{ label: string; cajas: number; unidades: number }>;
  totalCajas: number;
  totalUnid: number;
}

export default function Repartir({
  assignment = null,
  rawData = null,
  onClose,
}: DistributeProps) {
  const { data: repartirData, loading, error } = useGetRequestForreparting(
    Number(assignment?.categoryProviderId ?? 0),
  );
  const { clientTotals } = useDistributeStore();
  const { updateAssignment, loading: isFinalizando } = useUpdateAssignment();
  const { updateAssignmentFlags } = useAssignmentsStore();
  const { addContainerMovements } = useAddContainerMovements();

  const [showConfirmFinalizar, setShowConfirmFinalizar] = useState(false);
  const [cajasDistribuir, setCajasDistribuir] = useState<number>(0);
  const [cajasCanasto, setCajasCanasto] = useState<number>(0);
  // Map de Request_id -> containers totales para hacer una llamada por request
  const [requestTotals, setRequestTotals] = useState<Map<number, { containers: number; clientId: number; providerId: number }>>(new Map());

  const handleConfirmFinalizar = async () => {
    if (!assignment) return;
    setShowConfirmFinalizar(false);

    const providerId = assignment.providerId ? Number(assignment.providerId) : null;

    // Registrar cajas que salen: una llamada por cada Request_id
    if (requestTotals.size > 0) {
      for (const [requestId, data] of requestTotals) {
        await addContainerMovements(
          -data.containers,
          "true",
          1,
          requestId,
          data.clientId || null,
          null,
          data.providerId || providerId,
        );
      }
    } else {
      // Fallback si no hay data de requests
      await addContainerMovements(
        -cajasDistribuir,
        "true",
        1,
        null,
        null,
        null,
        providerId,
      );
    }

    // Registrar cajas que se quedan en canasto (positivo), solo si hay
    if (cajasCanasto > 0) {
      await addContainerMovements(
        cajasCanasto,
        "true",
        1,
        null,
        null,
        null,
        providerId,
      );
    }

    const ok = await updateAssignment({
      id: assignment.id,
      active: "true",
      CategoryProvider_id: assignment.categoryProviderId,
      isRecibir: assignment.isRecibir,
      isPlanificar: assignment.isPlanificar,
      isRepartir: "true",
    });
    if (ok) {
      updateAssignmentFlags(assignment.id, { isRepartir: "true" });
    }
    onClose?.();
  };

  const [activeGroupIdx, setActiveGroupIdx] = useState<number | null>(null);
  const [vehiculo, setVehiculo] = useState<string>("");
  const [chofer, setChofer] = useState<string>("");

  // Procesar datos del hook y del assignment en paralelo
  const { detalles, proveedor, costoPorKg, precioDiferido, groups } =
    useMemo((): {
      detalles: Array<{ label: string; cajas: string; unidades: string }>;
      proveedor: string;
      costoPorKg: string;
      precioDiferido: boolean;
      groups: GroupData[];
    } => {
      // --- Construir grupos desde el hook de repartir ---
      let builtGroups: GroupData[] = [];
      let proveedorNombre = "";

      if (repartirData?.data && repartirData.data.length > 0) {
        // Agrupar por ClientGroup_name
        const groupMap = new Map<string, RepartirDatum[]>();
        repartirData.data.forEach((item) => {
          const groupName = item.ClientGroup_name;
          if (!groupMap.has(groupName)) {
            groupMap.set(groupName, []);
          }
          groupMap.get(groupName)?.push(item);
        });

        builtGroups = Array.from(groupMap.entries()).map(
          ([groupName, items]) => {
            // Agrupar clientes dentro del grupo
            const clientMap = new Map<string, RepartirDatum[]>();
            items.forEach((item) => {
              const clientName = item.Client_name;
              if (!clientMap.has(clientName)) {
                clientMap.set(clientName, []);
              }
              clientMap.get(clientName)?.push(item);
            });

            // Calcular códigos (productos) del grupo totalizados
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

            // Procesar clientes del grupo
            const clientes = Array.from(clientMap.entries()).map(
              ([clientName, clientItems]) => {
                const clientProductMap = new Map<
                  string,
                  {
                    containers: number;
                    units: number;
                    ProductRequest_id: number;
                    Product_id: number;
                    menudencia: string;
                  }
                >();
                clientItems.forEach((item) => {
                  const productName = item.Product_name;
                  if (!clientProductMap.has(productName)) {
                    clientProductMap.set(productName, {
                      containers: 0,
                      units: 0,
                      ProductRequest_id: item.ProductRequest_id,
                      Product_id: item.Product_id,
                      menudencia: item.ProductRequest_menudencia,
                    });
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
                    ProductRequest_id: totals.ProductRequest_id,
                    Product_id: totals.Product_id,
                    menudencia: totals.menudencia,
                  }),
                );

                const totalCajas = clientCodes.reduce(
                  (sum, c) => sum + c.cajas,
                  0,
                );
                const totalUnid = clientCodes.reduce(
                  (sum, c) => sum + c.unidades,
                  0,
                );

                return {
                  name: clientName,
                  estado: "pendiente",
                  Request_id: clientItems[0]?.Request_id ?? 0,
                  Client_id: clientItems[0]?.Client_id ?? 0,
                  Provider_id: clientItems[0]?.Provider_id ?? 0,
                  CategoryProvider_id: clientItems[0]?.Request_CategoryProvider_id ?? 0,
                  codes: clientCodes,
                  totalCajas,
                  totalUnid,
                };
              },
            );

            const totalCajas = groupCodes.reduce((sum, c) => sum + c.cajas, 0);
            const totalUnid = groupCodes.reduce(
              (sum, c) => sum + c.unidades,
              0,
            );

            return {
              name: groupName,
              clientesCount: clientMap.size,
              clientes,
              codes: groupCodes,
              totalCajas,
              totalUnid,
            };
          },
        );

        proveedorNombre = repartirData.data[0]?.Provider_name || "";
      }

      // --- Construir detalles del header desde assignment/rawData ---
      let detallesArray: Array<{
        label: string;
        cajas: string;
        unidades: string;
      }> = [];

      // Calculate the sum of what all groups are requesting for each product
      const productTotals = new Map<
        string,
        { containers: number; units: number }
      >();
      builtGroups.forEach((group) => {
        group.codes.forEach((code) => {
          if (!productTotals.has(code.label)) {
            productTotals.set(code.label, { containers: 0, units: 0 });
          }
          const pt = productTotals.get(code.label)!;
          pt.containers += code.cajas;
          pt.units += code.unidades;
        });
      });

      if (assignment && rawData) {
        const assignmentData = rawData.filter(
          (item) => item.Assignment_id.toString() === assignment.id,
        );

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

        detallesArray = Array.from(productoMap.entries()).map(
          ([code, pos2]) => {
            const requested = productTotals.get(code) || {
              containers: 0,
              units: 0,
            };
            return {
              label: code,
              cajas: pos2
                ? `${requested.containers}/${pos2.ProductAssignment_container}`
                : `${requested.containers}/0`,
              unidades: pos2
                ? `${requested.units}/${pos2.ProductAssignment_units}`
                : `${requested.units}/0`,
            };
          },
        );
      } else if (builtGroups.length > 0) {
        detallesArray = Array.from(productTotals.entries()).map(
          ([productName, totals]) => ({
            label: productName,
            cajas: `${totals.containers}/0`,
            unidades: `${totals.units}/0`,
          }),
        );
      }

      return {
        detalles: detallesArray,
        proveedor: assignment ? assignment.proveedor : proveedorNombre,
        costoPorKg: "10.00",
        precioDiferido: false,
        groups: builtGroups,
      };
    }, [assignment, rawData, repartirData]);

  const [editableGroups, setEditableGroups] = useState<GroupData[]>([]);

  // Inicializar grupos editables cuando cargan los datos
  React.useEffect(() => {
    if (groups.length > 0) {
      setEditableGroups(groups);
    }
  }, [groups]);

  const displayGroups = editableGroups.length > 0 ? editableGroups : groups;

  const handleFinalizarRepartir = () => {
    const totalSolicit = detalles.reduce((sum, d) => {
      const parts = d.cajas.split("/");
      return sum + (Number(parts[0]) || 0);
    }, 0);

    // Calcular totales por Request_id desde repartirData
    const totalsMap = new Map<number, { containers: number; clientId: number; providerId: number }>();
    repartirData?.data?.forEach((item) => {
      const existing = totalsMap.get(item.Request_id);
      if (existing) {
        existing.containers += item.ProductRequest_containers;
      } else {
        totalsMap.set(item.Request_id, {
          containers: item.ProductRequest_containers,
          clientId: item.Client_id,
          providerId: item.Provider_id,
        });
      }
    });

    setRequestTotals(totalsMap);
    setCajasDistribuir(totalSolicit);
    setCajasCanasto(0);
    setShowConfirmFinalizar(true);
  };

  return (
    <div className="w-full bg-gray-50">
      {/* Contenido de Distribute */}
      <div className="p-4 lg:p-6">
        {/* Repartir Asignación Header */}
        <DistributeAssignmentHeader
          proveedor={proveedor}
          costoPorKg={costoPorKg}
          precioDiferido={precioDiferido}
          detalles={detalles}
          isRepartir={assignment?.isRepartir}
          isFinalizando={isFinalizando}
          onFinalizarRepartir={handleFinalizarRepartir}
          onCancel={() => {
            if (activeGroupIdx !== null) {
              setActiveGroupIdx(null);
            } else {
              onClose?.();
            }
          }}
          isStarted={activeGroupIdx !== null}
          groupName={
            activeGroupIdx !== null ? displayGroups[activeGroupIdx]?.name : ""
          }
          totalCajas={
            activeGroupIdx !== null
              ? displayGroups[activeGroupIdx]?.totalCajas
              : 0
          }
          totalUnid={
            activeGroupIdx !== null
              ? displayGroups[activeGroupIdx]?.totalUnid
              : 0
          }
          vehiculo={vehiculo}
          chofer={chofer}
          onVehiculoChange={setVehiculo}
          onChoferChange={setChofer}
          clientes={
            activeGroupIdx !== null
              ? displayGroups[activeGroupIdx]?.clientes.map((c) => ({
                  nombre: c.name,
                  montoACobrar: clientTotals[c.Request_id] || 0,
                  deudaCajas: 0,
                  deudaDinero: 0,
                }))
              : []
          }
        />

        {/* Bottom Section - Groups */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8 text-gray-500">
                <p>Cargando datos de distribución...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                <p>Error: {error}</p>
              </div>
            ) : activeGroupIdx !== null ? (
              <DistributeGroup
                key={activeGroupIdx}
                name={displayGroups[activeGroupIdx].name}
                clientesCount={displayGroups[activeGroupIdx].clientesCount}
                clientes={displayGroups[activeGroupIdx].clientes}
                codes={displayGroups[activeGroupIdx].codes}
                totalCajas={displayGroups[activeGroupIdx].totalCajas}
                totalUnid={displayGroups[activeGroupIdx].totalUnid}
                costoPorKg={costoPorKg}
                isActive={true}
                readOnly={assignment?.isRepartir === "true"}
                vehiculo={vehiculo}
                chofer={chofer}
                onStarted={(isStarted) => {
                  setActiveGroupIdx(isStarted ? activeGroupIdx : null);
                }}
                onCajasChange={(codeIdx, val) => {
                  const newGroups = [...editableGroups];
                  newGroups[activeGroupIdx].codes[codeIdx].cajas = val;
                  setEditableGroups(newGroups);
                }}
                onUnidadesChange={(codeIdx, val) => {
                  const newGroups = [...editableGroups];
                  newGroups[activeGroupIdx].codes[codeIdx].unidades = val;
                  setEditableGroups(newGroups);
                }}
                onEmpezar={() =>
                  console.log(`Empezar ${displayGroups[activeGroupIdx].name}`)
                }
              />
            ) : displayGroups.length > 0 ? (
              displayGroups.map((group, groupIdx) => (
                <DistributeGroup
                  key={groupIdx}
                  name={group.name}
                  clientesCount={group.clientesCount}
                  clientes={group.clientes}
                  codes={group.codes}
                  totalCajas={group.totalCajas}
                  totalUnid={group.totalUnid}
                  costoPorKg={costoPorKg}
                  isActive={false}
                  readOnly={assignment?.isRepartir === "true"}
                  vehiculo={vehiculo}
                  chofer={chofer}
                  onStarted={(isStarted) => {
                    setActiveGroupIdx(isStarted ? groupIdx : null);
                  }}
                  onCajasChange={(codeIdx, val) => {
                    const newGroups = [...editableGroups];
                    newGroups[groupIdx].codes[codeIdx].cajas = val;
                    setEditableGroups(newGroups);
                  }}
                  onUnidadesChange={(codeIdx, val) => {
                    const newGroups = [...editableGroups];
                    newGroups[groupIdx].codes[codeIdx].unidades = val;
                    setEditableGroups(newGroups);
                  }}
                  onEmpezar={() => console.log(`Empezar ${group.name}`)}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Sin grupos disponibles para esta distribución</p>
              </div>
            )}
          </div>

          {/* Global Footer Buttons - Solo se muestra cuando no hay un grupo activo */}
          {activeGroupIdx === null && (
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <button
                onClick={onClose}
                className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-bold shadow-sm bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors sm:w-75 shrink-0 text-center"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal Confirmar Finalizar Repartir */}
      <Modal
        isOpen={showConfirmFinalizar}
        onClose={() => setShowConfirmFinalizar(false)}
        title="Finalizar Repartir"
        size="sm"
      >
        <p className="text-sm text-gray-600 mb-4">
          ¿Está seguro de finalizar el repartir? Una vez finalizado no podrá
          realizar cambios.
        </p>
        <div className="flex gap-3 mb-6">
          <div className="flex-1">
            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">
              Cajas a distribuir (Solicit.)
            </label>
            <input
              type="number"
              min={0}
              value={cajasDistribuir}
              onChange={(e) => setCajasDistribuir(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">
              Cajas en canasto
            </label>
            <input
              type="number"
              min={0}
              value={cajasCanasto}
              onChange={(e) => setCajasCanasto(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowConfirmFinalizar(false)}
            className="px-4 py-2 rounded-lg text-sm font-bold border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmFinalizar}
            disabled={isFinalizando}
            className="px-4 py-2 rounded-lg text-sm font-bold shadow-sm text-white bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors"
          >
            {isFinalizando ? "Finalizando..." : "Confirmar"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
