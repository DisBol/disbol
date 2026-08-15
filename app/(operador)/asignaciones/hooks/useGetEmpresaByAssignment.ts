import { useState, useCallback } from "react";
import { GetEmpresaByAssignment } from "../service/getempresabyassignement";
import {
  GetEmpresaByAssignmentResponse,
  EmpresaByAssignmentDatum,
} from "../interfaces/getempresabyassignement.interface";

export const useGetEmpresaByAssignment = () => {
  const [data, setData] = useState<EmpresaByAssignmentDatum[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmpresaByAssignment = useCallback(async (Assignment_id: number) => {
    try {
      setLoading(true);
      setError(null);

      const response: GetEmpresaByAssignmentResponse = await GetEmpresaByAssignment(
        Assignment_id,
      );

      setData(response.data);
      return response.data;
    } catch (err) {
      console.error("Error fetching empresa by assignment:", err);
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
    fetchEmpresaByAssignment,
    reset,
  };
};
