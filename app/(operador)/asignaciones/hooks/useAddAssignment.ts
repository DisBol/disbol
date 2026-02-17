import { useState, useCallback } from "react";
import { AddAssignment } from "../service/addassignment";
import {
  AddAssignmentResponse,
  Datum,
} from "../interfaces/addassignment.interface";

interface UseAddAssignmentParams {
  Provider_id: string;
}

interface UseAddAssignmentReturn {
  data: Datum[] | null;
  loading: boolean;
  error: string | null;
  addAssignment: (params: UseAddAssignmentParams) => Promise<number | null>;
  reset: () => void;
}

export const useAddAssignment = (): UseAddAssignmentReturn => {
  const [data, setData] = useState<Datum[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const addAssignment = useCallback(async (params: UseAddAssignmentParams) => {
    try {
      setLoading(true);
      setError(null);

      const response: AddAssignmentResponse = await AddAssignment(
        params.Provider_id,
      );

      setData(response.data);

      // Retornamos el ID del assignment creado para usarlo en el siguiente paso
      return response.data[0]?.assignment_id || null;
    } catch (err) {
      console.error("Error adding assignment:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    addAssignment,
    reset,
  };
};
