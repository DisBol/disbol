import { useState, useCallback } from "react";
import { AddAssignmentStage } from "../service/addassignmentstage";
import {
  AddAssignmentStageResponse,
  Datum,
} from "../interfaces/addassignmentstage.interface";

interface UseAddAssignmentStageParams {
  position: string;
  in_container: number;
  out_container: number;
  units: number;
  container: number;
  payment: string;
  Assignment_id: string;
}

interface UseAddAssignmentStageReturn {
  data: Datum[] | null;
  loading: boolean;
  error: string | null;
  addAssignmentStage: (
    params: UseAddAssignmentStageParams,
  ) => Promise<number | null>;
  reset: () => void;
}

export const useAddAssignmentStage = (): UseAddAssignmentStageReturn => {
  const [data, setData] = useState<Datum[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const addAssignmentStage = useCallback(
    async (params: UseAddAssignmentStageParams) => {
      try {
        setLoading(true);
        setError(null);

        const response: AddAssignmentStageResponse = await AddAssignmentStage(
          params.position,
          params.in_container,
          params.out_container,
          params.units,
          params.container,
          params.payment,
          params.Assignment_id,
        );

        setData(response.data);

        // Retornamos el ID del assignmentStage creado para usarlo en el siguiente paso
        return response.data[0]?.assignmentstage_id || null;
      } catch (err) {
        console.error("Error adding assignment stage:", err);
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
    addAssignmentStage,
    reset,
  };
};
