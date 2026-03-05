import { useState, useEffect, useCallback } from "react";
import { GetRequestForPlanning } from "../../service/planificar/getrequestforplanning";
import { GetRequestForPlanningResponse } from "../../interfaces/planificar/getrequestforplanning.interface";

interface UseGetRequestForPlanningReturn {
  data: GetRequestForPlanningResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useGetRequestForPlanning = (): UseGetRequestForPlanningReturn => {
  const [data, setData] = useState<GetRequestForPlanningResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await GetRequestForPlanning();
      setData(response);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al obtener las solicitudes para planificación",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};
