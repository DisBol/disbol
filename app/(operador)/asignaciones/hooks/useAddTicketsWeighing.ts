import { useState, useCallback } from "react";
import { AddTicketsWeighing } from "../service/addticketsweighing";
import {
  AddTicketsWeighingResponse,
  Data,
} from "../interfaces/addticketsweighing.interface";

interface UseAddTicketsWeighingParams {
  gross_weight: number;
  net_weight: number;
  units: number;
  container: number;
  Container_id: string;
  ProductAssignment_id: string;
}

interface UseAddTicketsWeighingReturn {
  data: Data | null;
  loading: boolean;
  error: string | null;
  addTicketsWeighing: (
    params: UseAddTicketsWeighingParams,
  ) => Promise<number | null>;
  reset: () => void;
}

export const useAddTicketsWeighing = (): UseAddTicketsWeighingReturn => {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const addTicketsWeighing = useCallback(
    async (params: UseAddTicketsWeighingParams) => {
      try {
        setLoading(true);
        setError(null);

        const response: AddTicketsWeighingResponse = await AddTicketsWeighing(
          params.gross_weight,
          params.net_weight,
          params.units,
          params.container,
          params.Container_id,
          params.ProductAssignment_id,
        );

        setData(response.data);

        // Retornamos el ID del ticket weighing creado
        return response.data?.rowId || null;
      } catch (err) {
        console.error("Error adding ticket weighing:", err);
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
    addTicketsWeighing,
    reset,
  };
};
