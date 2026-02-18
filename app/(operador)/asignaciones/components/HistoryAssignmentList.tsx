"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { EditIcon } from "@/components/icons/EditIcon";
import { SaveIcon } from "@/components/icons/Save";
import EditableProductCard from "./EditableProductCard";
import {
  Assignment,
  useAssignmentsStore,
  ProductQuantity,
} from "../stores/assignments-store";
import { useProductActions } from "../hooks/useProductActions";

interface HistoryAssignmentListProps {
  assignments: Assignment[];
  loading: boolean;
  error: string | null;
  onRecibirClick: (assignment: Assignment) => void;
  onRefreshData: () => void;
}

const HistoryAssignmentList: React.FC<HistoryAssignmentListProps> = ({
  assignments,
  loading,
  error,
  onRecibirClick,
  onRefreshData,
}) => {
  const {
    editingAssignments,
    updatingProducts,
    startEditingAssignment,
    stopEditingAssignment,
    setPendingChange,
    clearPendingChanges,
    revertPendingChanges,
    getPendingChanges,
    updateProductInAssignment,
  } = useAssignmentsStore();

  const { updateProduct, deleteProduct } = useProductActions();

  const handleEditToggle = async (assignmentId: string) => {
    if (editingAssignments.has(assignmentId)) {
      await handleSaveChanges(assignmentId);
    } else {
      startEditingAssignment(assignmentId);
    }
  };

  const handleSaveChanges = async (assignmentId: string) => {
    const pendingChanges = getPendingChanges(assignmentId);

    if (pendingChanges.size === 0) {
      stopEditingAssignment(assignmentId);
      return;
    }

    const assignment = assignments.find((a) => a.id === assignmentId);
    if (!assignment) return;

    try {
      const updatePromises = Array.from(pendingChanges.entries()).map(
        async ([productCode, changes]) => {
          const product = assignment.productos.find(
            (p) => p.codigo === productCode,
          );
          if (!product) return;

          await updateProduct(
            assignmentId,
            product.productAssignmentId,
            product.productId,
            product.ticketId,
            product.codigo,
            product.menudencia,
            {
              cajas: product.cajas,
              unidades: product.unidades,
              kgBruto: product.kgBruto,
              kgNeto: product.kgNeto,
            },
            changes,
          );
        },
      );

      await Promise.all(updatePromises);

      clearPendingChanges(assignmentId);
      stopEditingAssignment(assignmentId);

      setTimeout(() => onRefreshData(), 500);
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("Error al guardar algunos cambios. Por favor, intente nuevamente.");
    }
  };

  const handleLocalChange = (
    assignmentId: string,
    productCode: string,
    updates: Partial<ProductQuantity>,
  ) => {
    setPendingChange(assignmentId, productCode, updates);
    updateProductInAssignment(assignmentId, productCode, updates);
  };

  const handleDeleteProduct = async (
    assignmentId: string,
    productCode: string,
  ) => {
    const assignment = assignments.find((a) => a.id === assignmentId);
    if (!assignment) return;

    const product = assignment.productos.find((p) => p.codigo === productCode);
    if (!product) return;

    try {
      await deleteProduct(
        assignmentId,
        product.productAssignmentId,
        product.productId,
        product.ticketId,
        product.codigo,
        product.menudencia,
      );

      // Limpiar cambios pendientes y salir del modo edición después de eliminar
      clearPendingChanges(assignmentId);
      stopEditingAssignment(assignmentId);

      // Refrescar datos tras eliminación
      setTimeout(() => onRefreshData(), 500);
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error al eliminar el producto. Por favor, intente nuevamente.");
    }
  };

  const handleCancel = (assignmentId: string) => {
    revertPendingChanges(assignmentId);
    stopEditingAssignment(assignmentId);
    onRefreshData();
  };
  // Estados de carga y error
  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Cargando historial de asignaciones...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          No se encontraron asignaciones para el período seleccionado.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {assignments.map((assignment) => (
        <div
          key={assignment.id}
          className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm"
        >
          {/* Header de la Asignación */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
            <div className="space-y-2 lg:space-y-0 lg:space-x-6 lg:flex lg:items-center">
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase block">
                  FECHA
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {assignment.fecha}
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-gray-500 uppercase block">
                  PROVEEDOR
                </span>
                <Chip variant="flat" color="info" size="sm" radius="md">
                  {assignment.proveedor}
                </Chip>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex gap-2 mt-3 lg:mt-0">
              <Button
                variant="primary"
                color="danger"
                size="sm"
                className="min-w-22.5"
              >
                Repartir
              </Button>
              <Button
                variant="warning"
                color="warning"
                size="sm"
                className="min-w-22.5"
              >
                Planificar
              </Button>
              <Button
                variant="success"
                color="success"
                size="sm"
                className="min-w-22.5"
                onClick={() => onRecibirClick(assignment)}
              >
                Recibir
              </Button>
            </div>
          </div>

          {/* Detalle de Productos */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase">
                DETALLE DE PRODUCTOS
              </h3>

              {/* Botón de Editar/Guardar movido aquí */}
              {editingAssignments.has(assignment.id) ? (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    color="secondary"
                    size="sm"
                    className="min-w-20"
                    onClick={() => handleCancel(assignment.id)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="success"
                    color="success"
                    size="sm"
                    className="min-w-20"
                    onClick={() => handleEditToggle(assignment.id)}
                  >
                    <SaveIcon className="w-4 h-4 mr-1" />
                    Guardar
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  color="secondary"
                  size="sm"
                  className="min-w-20"
                  onClick={() => handleEditToggle(assignment.id)}
                >
                  <EditIcon className="w-4 h-4 mr-1" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {assignment.productos.map((producto) => {
                const isEditing = editingAssignments.has(assignment.id);
                const productKey = `${assignment.id}-${producto.codigo}`;
                const isUpdating = updatingProducts.has(productKey);

                return (
                  <EditableProductCard
                    key={producto.codigo}
                    product={producto}
                    isEditing={isEditing}
                    isUpdating={isUpdating}
                    onLocalChange={(productCode, updates) =>
                      handleLocalChange(assignment.id, productCode, updates)
                    }
                    onDelete={(productCode) =>
                      handleDeleteProduct(assignment.id, productCode)
                    }
                  />
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HistoryAssignmentList;
