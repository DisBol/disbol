import { useState, useCallback } from "react";
import { AddProductAssignment } from "../service/addproductassignment";
import {
  AddProductAssignmentResponse,
  Data,
} from "../interfaces/addproductassignment.interface";

interface UseAddProductAssignmentParams {
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

interface UseAddProductAssignmentReturn {
  data: Data | null;
  loading: boolean;
  error: string | null;
  addProductAssignment: (
    params: UseAddProductAssignmentParams,
  ) => Promise<number | null>;
  reset: () => void;
}

export const useAddProductAssignment = (): UseAddProductAssignmentReturn => {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const addProductAssignment = useCallback(
    async (params: UseAddProductAssignmentParams) => {
      try {
        setLoading(true);
        setError(null);

        const response: AddProductAssignmentResponse =
          await AddProductAssignment(
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

        // Retornamos el ID del product assignment creado
        return response.data?.rowId || null;
      } catch (err) {
        console.error("Error adding product assignment:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
        return null;
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
    addProductAssignment,
    reset,
  };
};
