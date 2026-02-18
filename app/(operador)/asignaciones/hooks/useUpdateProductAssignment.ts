import { useState, useCallback } from "react";
import { UpdateProductAssignment } from "../service/updateproductassignment";
import {
  UpdateProductAssignmentResponse,
  Data,
} from "../interfaces/updateproductassignment.interface";

interface UseUpdateProductAssignmentParams {
  id: string;
  container: number;
  units: number;
  menudencia: string;
  net_weight: string;
  gross_weight: string;
  payment: string;
  active: string;
  Tickets_id: string;
  Product_id: string;
}

interface UseUpdateProductAssignmentReturn {
  data: Data | null;
  loading: boolean;
  error: string | null;
  updateProductAssignment: (
    params: UseUpdateProductAssignmentParams,
  ) => Promise<boolean>;
  deleteProductAssignment: (
    params: Omit<UseUpdateProductAssignmentParams, "active">,
  ) => Promise<boolean>;
  reset: () => void;
}

export const useUpdateProductAssignment =
  (): UseUpdateProductAssignmentReturn => {
    const [data, setData] = useState<Data | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const updateProductAssignment = useCallback(
      async (params: UseUpdateProductAssignmentParams) => {
        try {
          setLoading(true);
          setError(null);

          const response: UpdateProductAssignmentResponse =
            await UpdateProductAssignment(
              params.id,
              params.container,
              params.units,
              params.menudencia,
              params.net_weight,
              params.gross_weight,
              params.payment,
              params.active,
              params.Tickets_id,
              params.Product_id,
            );

          setData(response.data);
          return true;
        } catch (err) {
          console.error("Error updating product assignment:", err);
          setError(
            err instanceof Error ? err.message : "An unknown error occurred",
          );
          return false;
        } finally {
          setLoading(false);
        }
      },
      [],
    );

    const deleteProductAssignment = useCallback(
      async (params: Omit<UseUpdateProductAssignmentParams, "active">) => {
        try {
          setLoading(true);
          setError(null);

          const response: UpdateProductAssignmentResponse =
            await UpdateProductAssignment(
              params.id,
              params.container,
              params.units,
              params.menudencia,
              params.net_weight,
              params.gross_weight,
              params.payment,
              "false", // active: false para eliminar
              params.Tickets_id,
              params.Product_id,
            );

          setData(response.data);
          return true;
        } catch (err) {
          console.error("Error deleting product assignment:", err);
          setError(
            err instanceof Error ? err.message : "An unknown error occurred",
          );
          return false;
        } finally {
          setLoading(false);
        }
      },
      [],
    );

    const reset = useCallback(() => {
      setData(null);
      setError(null);
      setLoading(false);
    }, []);

    return {
      data,
      loading,
      error,
      updateProductAssignment,
      deleteProductAssignment,
      reset,
    };
  };
