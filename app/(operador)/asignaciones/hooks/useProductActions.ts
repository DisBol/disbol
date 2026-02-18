import { useCallback } from "react";
import { useAssignmentsStore } from "../stores/assignments-store";
import { useUpdateProductAssignment } from "./useUpdateProductAssignment";

export const useProductActions = () => {
  const { setProductUpdating } = useAssignmentsStore();
  const { updateProductAssignment } = useUpdateProductAssignment();

  // Helper para manejar operaciones comunes
  const executeProductOperation = useCallback(
    async (
      assignmentId: string,
      productCode: string,
      operation: () => Promise<boolean>,
    ) => {
      const productKey = `${assignmentId}-${productCode}`;

      try {
        setProductUpdating(productKey, true);
        const success = await operation();

        if (!success) {
          throw new Error("Error en la operación del producto");
        }

        return true;
      } catch (error) {
        console.error("Error in product operation:", error);
        throw error;
      } finally {
        setProductUpdating(productKey, false);
      }
    },
    [setProductUpdating],
  );

  const updateProduct = useCallback(
    async (
      assignmentId: string,
      productAssignmentId: string,
      productId: string,
      ticketId: string,
      productCode: string,
      menudencia: string,
      currentProduct: {
        cajas: number;
        unidades: number;
        kgBruto: number;
        kgNeto: number;
      },
      updates: {
        cajas?: number;
        unidades?: number;
        kgBruto?: number;
        kgNeto?: number;
      },
    ) => {
      return executeProductOperation(assignmentId, productCode, async () => {
        const updateData = {
          id: productAssignmentId,
          container: updates.cajas ?? currentProduct.cajas,
          units: updates.unidades ?? currentProduct.unidades,
          menudencia: menudencia,
          net_weight: (updates.kgNeto ?? currentProduct.kgNeto).toString(),
          gross_weight: (updates.kgBruto ?? currentProduct.kgBruto).toString(),
          payment: "0",
          active: "true",
          Tickets_id: ticketId,
          Product_id: productId,
        };

        return updateProductAssignment(updateData);
      });
    },
    [updateProductAssignment, executeProductOperation],
  );

  return {
    updateProduct,
  };
};
