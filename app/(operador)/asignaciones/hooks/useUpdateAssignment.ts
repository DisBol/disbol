import { useState, useCallback } from "react";
import { UpdateAssignment } from "../service/updateassignment";
import {
  UpdateAssignmentResponse,
  Data,
} from "../interfaces/updateassignment.interface";

interface UseUpdateAssignmentParams {
  id: string;
  active: string;
  CategoryProvider_id: string;
  isRecibir: string;
  isPlanificar: string;
  isRepartir: string;
}

interface UseUpdateAssignmentReturn {
  data: Data | null;
  loading: boolean;
  error: string | null;
  updateAssignment: (params: UseUpdateAssignmentParams) => Promise<boolean>;
  deleteAssignment: (id: string, categoryProviderId: string) => Promise<boolean>;
  reset: () => void;
}

export const useUpdateAssignment = (): UseUpdateAssignmentReturn => {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateAssignment = useCallback(
    async (params: UseUpdateAssignmentParams) => {
      try {
        setLoading(true);
        setError(null);

        const response: UpdateAssignmentResponse = await UpdateAssignment(
          params.id,
          params.active,
          params.CategoryProvider_id,
          params.isRecibir,
          params.isPlanificar,
          params.isRepartir,
        );

        setData(response.data);
        return true;
      } catch (err) {
        console.error("Error updating assignment:", err);
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

  const deleteAssignment = useCallback(
    async (id: string, categoryProviderId: string) => {
      try {
        setLoading(true);
        setError(null);

        const response: UpdateAssignmentResponse = await UpdateAssignment(
          id,
          "false", // active: false para eliminar
          categoryProviderId,
          "false",
          "false",
          "false",
        );

        setData(response.data);
        return true;
      } catch (err) {
        console.error("Error deleting assignment:", err);
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
    updateAssignment,
    deleteAssignment,
    reset,
  };
};
