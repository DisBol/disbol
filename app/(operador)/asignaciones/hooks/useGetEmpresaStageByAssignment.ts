import { useState, useCallback } from "react";
import { GetEmpresaStageByAssignment } from "../service/getempresastagebyassignment";
import {
  GetEmpresaStageByAssignmentResponse,
  EmpresaStageByAssignmentDatum,
} from "../interfaces/getempresastagebyassignment.interface";

export const useGetEmpresaStageByAssignment = () => {
  const [data, setData] = useState<EmpresaStageByAssignmentDatum[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmpresaStageByAssignment = useCallback(async (Assignment_id: number) => {
    try {
      setLoading(true);
      setError(null);

      const response: GetEmpresaStageByAssignmentResponse = await GetEmpresaStageByAssignment(
        Assignment_id,
      );

      setData(response.data);
      return response.data;
    } catch (err) {
      console.error("Error fetching empresa stage by assignment:", err);
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
    fetchEmpresaStageByAssignment,
    reset,
  };
};
