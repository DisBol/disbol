"use client";

import { useState, useEffect } from "react";

import CardCode from "@/components/ui/CardCode";
import { Chip } from "@/components/ui/Chip";

import { useGetrequesthistory } from "../hooks/useGetrequesthistory";
import { useUpdateRequest } from "../hooks/useUpdateRequest";
import { useUpdateProductrequest } from "../hooks/useUpdateProducterequest";
import FIiltroRequest from "./FIiltroRequest";

export default function TableResquest() {
  const { data, loading, error, filters, updateFilter } =
    useGetrequesthistory();
  const [editingRequestId, setEditingRequestId] = useState<number | null>(null);
  const [editedItems, setEditedItems] = useState<{
    [key: string]: { units: number; containers: number; menudencia: boolean };
  }>({});
  const [deletedItems, setDeletedItems] = useState<number[]>([]);

  const formatDateDisplay = (dateStr: Date | string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleEditClick = (request: any) => {
    setEditingRequestId(request.Request_id);
    const initialItems: any = {};
    request.items.forEach((item: any) => {
      initialItems[`${item.ProductRequest_id}`] = {
        units: item.ProductRequest_units,
        containers: item.ProductRequest_containers,
        menudencia: item.ProductRequest_menudencia === "true",
      };
    });
    setEditedItems(initialItems);
    setDeletedItems([]);
  };

  const handleCancelEdit = () => {
    setEditingRequestId(null);
    setEditedItems({});
    setDeletedItems([]);
  };

  const handleRemoveItem = (productRequestId: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      setDeletedItems((prev) => [...prev, productRequestId]);
    }
  };

  const handleItemChange = (
    productRequestId: number,
    field: "units" | "containers" | "menudencia",
    value: string | boolean,
  ) => {
    let finalValue: string | boolean | number = value;
    if (field === "units" || field === "containers") {
      finalValue = parseInt(value as string) || 0;
    }

    setEditedItems((prev) => {
      const current = prev[productRequestId] || ({} as any);
      const newState = { ...current, [field]: finalValue };

      return {
        ...prev,
        [productRequestId]: newState as never,
      };
    });
  };

  const { updateProductRequest } = useUpdateProductrequest();

  const handleSaveEdit = async () => {
    if (!editingRequestId) return;

    // Find the current request to get default values for fields that are not edited
    const currentRequest = data.find((r) => r.Request_id === editingRequestId);
    if (!currentRequest) return;

    try {
      // 1. Process deletions first (Soft Delete)
      if (deletedItems.length > 0) {
        const deletePromises = deletedItems.map((id) => {
          const itemToDelete = currentRequest.items.find(
            (item) => item.ProductRequest_id === id,
          );
          if (!itemToDelete) return Promise.resolve(false);

          return updateProductRequest(
            id,
            0, // containers
            0, // units
            itemToDelete.ProductRequest_menudencia === "true",
            0, // net_weight (default)
            0, // gross_weight (default)
            0, // payment (default)
            false, // active: false for soft delete
            1, // RequestStage_id (default)
            itemToDelete.Product_id,
          );
        });
        await Promise.all(deletePromises);
      }

      // 2. Process updates for remaining items
      const promises = Object.entries(editedItems)
        .filter(([id]) => !deletedItems.includes(Number(id)))
        .map(([productRequestId, values]) => {
          const itemToUpdate = currentRequest.items.find(
            (item) => item.ProductRequest_id === Number(productRequestId),
          );
          if (!itemToUpdate) return Promise.resolve(false);

          const wasActive =
            String((itemToUpdate as any).ProductRequest_active) === "true";
          const isActive =
            wasActive || values.containers > 0 || values.units > 0;

          return updateProductRequest(
            Number(productRequestId),
            values.containers,
            values.units,
            values.menudencia,
            0, // net_weight (default)
            0, // gross_weight (default)
            0, // payment (default)
            isActive, // active
            1, // RequestStage_id (default)
            itemToUpdate.Product_id,
          );
        });

      await Promise.all(promises);
      // toast.success("Solicitud actualizada correctamente");
      alert("Solicitud actualizada correctamente");
      setEditingRequestId(null);
      setDeletedItems([]);
      // Refresh data logic here if needed, or rely on state update if data syncs
      window.location.reload(); // Temporary refresh to show changes
    } catch (error) {
      console.error("Error updating request:", error);
      // toast.error("Error al actualizar la solicitud");
      alert("Error al actualizar la solicitud");
    }
  };

  const { updateRequest } = useUpdateRequest();

  const handleDeleteClick = async (
    requestId: number,
    providerId: number,
    clientId: number,
  ) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta solicitud?")) {
      try {
        const success = await updateRequest(
          requestId,
          false,
          providerId,
          clientId,
        );
        if (success) {
          // toast.success("Solicitud eliminada correctamente");
          alert("Solicitud eliminada correctamente");
          window.location.reload(); // Temporary refresh to show changes
        } else {
          alert("Error al eliminar la solicitud");
        }
      } catch (error) {
        console.error("Error deleting request:", error);
        // toast.error("Error al eliminar la solicitud");
        alert("Error al eliminar la solicitud");
      }
    }
  };

  return (
    <div className="w-full mt-8">
      <div className="max-w-[1600px] mx-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Solicitudes</h2>

        {/* Filters */}
        <FIiltroRequest filters={filters} updateFilter={updateFilter} />

        {/* List of Cards */}
        {loading && <div className="text-center py-8">Cargando...</div>}
        {error && (
          <div className="text-center py-8 text-red-500">Error: {error}</div>
        )}

        <div className="space-y-4 font-primary">
          {!loading &&
            !error &&
            data.map((request) => (
              <div
                key={request.Request_id}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="w-full lg:w-48 shrink-0 space-y-4 border-b lg:border-b-0 lg:border-r border-gray-100 pb-4 lg:pb-0 lg:pr-4">
                    <div>
                      <span className="block text-[10px] font-bold text-gray-400 uppercase">
                        FECHA
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        {formatDateDisplay(request.Request_created_at)}
                      </span>
                    </div>

                    <div>
                      <span className="block text-[10px] font-bold text-gray-400 uppercase">
                        GRUPO / RUTA
                      </span>
                      <div className="flex items-start gap-1">
                        <svg
                          className="w-3.5 h-3.5 text-gray-400 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="text-sm font-medium text-gray-700 leading-tight">
                          {request.ClientGroup_name}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="block text-[10px] font-bold text-gray-400 uppercase">
                        CLIENTE
                      </span>
                      <span className="text-sm font-bold text-gray-800">
                        {request.Client_name}
                      </span>
                    </div>

                    <div className="flex gap-4">
                      <div>
                        <span className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                          ESTADO
                        </span>
                        <Chip
                          variant="flat"
                          color={
                            request.RequestState_name === "EMITIDO"
                              ? "warning"
                              : request.RequestState_name === "ENVIADO"
                                ? "success"
                                : "default"
                          }
                          size="sm"
                          className="font-bold"
                        >
                          {request.RequestState_name}
                        </Chip>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                          PAGADO
                        </span>
                        <Chip
                          variant="flat"
                          color={request.pagado ? "success" : "danger"}
                          size="sm"
                          className="font-bold"
                        >
                          {request.pagado ? "SI" : "NO"}
                        </Chip>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">
                          PRODUCTOS SOLICITADOS
                        </span>
                        <Chip
                          variant="solid"
                          color={
                            request.Provider_name === "SOFIA"
                              ? "danger"
                              : "default"
                          }
                          size="sm"
                          className={
                            request.Provider_name === "SOFIA"
                              ? "bg-red-300 border-none text-white font-bold"
                              : "bg-blue-300 border-none text-white font-bold"
                          }
                        >
                          {request.Provider_name}
                        </Chip>
                      </div>

                      <div className="flex gap-2">
                        {editingRequestId === request.Request_id ? (
                          <div className="flex gap-2">
                            <span className="text-xs text-blue-600 font-bold animate-pulse content-center">
                              Editando...
                            </span>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditClick(request)}
                              className="p-1 text-blue-500 hover:text-blue-700 transition-colors"
                              title="Editar"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-5 h-5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteClick(
                                  request.Request_id,
                                  request.Provider_id,
                                  request.Client_id,
                                )
                              }
                              className="p-1 text-red-500 hover:text-red-700 transition-colors"
                              title="Eliminar"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-5 h-5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                />
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-2">
                      {request.items
                        .filter(
                          (item: any) =>
                            !deletedItems.includes(item.ProductRequest_id),
                        )
                        .map((item: any, idx: any) => {
                          const isEditing =
                            editingRequestId === request.Request_id;
                          const editedItem =
                            editedItems[item.ProductRequest_id];

                          const isOriginallyInactive =
                            String(item.ProductRequest_active) === "false";
                          const hasValidEditedValues =
                            isEditing &&
                            editedItem &&
                            (editedItem.containers > 0 || editedItem.units > 0);
                          const isInactive =
                            isOriginallyInactive && !hasValidEditedValues;

                          return (
                            <CardCode
                              key={`${request.Request_id}-${item.Product_id}-${idx}`}
                              className={
                                isInactive ? "opacity-60 grayscale" : ""
                              }
                              label={
                                isInactive ? (
                                  <div className="flex flex-col items-center">
                                    <span className="text-[10px] text-red-500 font-bold leading-none mb-0.5">
                                      INACTIVO
                                    </span>
                                    <span className="line-through text-gray-500">
                                      {item.Product_name}
                                    </span>
                                  </div>
                                ) : (
                                  item.Product_name
                                )
                              }
                              cajas={
                                isEditing
                                  ? (editedItem?.containers ??
                                    item.ProductRequest_containers)
                                  : item.ProductRequest_containers
                              }
                              unidades={
                                isEditing
                                  ? (editedItem?.units ??
                                    item.ProductRequest_units)
                                  : item.ProductRequest_units
                              }
                              menudencia={
                                isEditing
                                  ? (editedItem?.menudencia ??
                                    item.ProductRequest_menudencia === "true")
                                  : item.ProductRequest_menudencia === "true"
                              }
                              readOnly={!isEditing}
                              productName={item.Product_name}
                              onCajasChange={(val) =>
                                handleItemChange(
                                  item.ProductRequest_id,
                                  "containers",
                                  val,
                                )
                              }
                              onUnidadesChange={(val) =>
                                handleItemChange(
                                  item.ProductRequest_id,
                                  "units",
                                  val,
                                )
                              }
                              onMenudenciaChange={(val) =>
                                handleItemChange(
                                  item.ProductRequest_id,
                                  "menudencia",
                                  val,
                                )
                              }
                              onRemove={
                                isEditing && !isInactive
                                  ? () =>
                                      handleRemoveItem(item.ProductRequest_id)
                                  : undefined
                              }
                            />
                          );
                        })}
                    </div>
                    {editingRequestId === request.Request_id && (
                      <div className="flex justify-end gap-2 mt-4 border-t pt-4">
                        <button
                          onClick={handleSaveEdit}
                          className="px-4 py-2 bg-green-500 text-white text-sm font-bold rounded shadow-sm hover:bg-green-600 transition-colors"
                        >
                          Guardar Cambios
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-4 py-2 bg-gray-500 text-white text-sm font-bold rounded shadow-sm hover:bg-gray-600 transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          {!loading && data.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No se encontraron solicitudes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
