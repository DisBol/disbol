import { useState, useCallback } from "react";
import { GetAssignmentHistory } from "../service/getassignmenthistory";
import {
  GetAssignmentHistoryResponse,
  Datum,
} from "../interfaces/getassignmenthistory.interface";

interface UseGetAssignmentHistoryParams {
  start_date: string;
  end_date: string;
  Provider_id: number;
}

interface UseGetAssignmentHistoryReturn {
  data: Datum[] | null;
  loading: boolean;
  error: string | null;
  fetchAssignmentHistory: (
    params: UseGetAssignmentHistoryParams,
  ) => Promise<void>;
  refetch: () => Promise<void>;
}

export const useGetAssignmentHistory = (): UseGetAssignmentHistoryReturn => {
  const [data, setData] = useState<Datum[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastParams, setLastParams] =
    useState<UseGetAssignmentHistoryParams | null>(null);

  const fetchAssignmentHistory = useCallback(
    async (params: UseGetAssignmentHistoryParams) => {
      try {
        setLoading(true);
        setError(null);
        setLastParams(params);

        const response: GetAssignmentHistoryResponse =
          await GetAssignmentHistory(
            params.start_date,
            params.end_date,
            params.Provider_id,
          );

        setData(response.data);
      } catch (err) {
        console.error("Error fetching assignment history:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Error desconocido al obtener el historial de asignaciones",
        );
        setData(null);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const refetch = useCallback(async () => {
    if (lastParams) {
      await fetchAssignmentHistory(lastParams);
    }
  }, [lastParams, fetchAssignmentHistory]);

  return {
    data,
    loading,
    error,
    fetchAssignmentHistory,
    refetch,
  };
};
