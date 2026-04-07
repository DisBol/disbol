import { useState, useEffect, useCallback } from "react";
import { GetContainerMovementsClientHistory } from "../services/getcontainermovementsclienthistory";
import {
  GetContainerMovementsClientHistoryResponse,
  Datum,
} from "../interfaces/getcontainermovementsclienthistory.interface";

interface UseGetContainerMovementsClientHistoryReturn {
  data: Datum[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useGetContainerMovementsClientHistory(
  startDate: string,
  endDate: string,
  clientId: number,
  clientGroupId: number,
  containerId: number,
): UseGetContainerMovementsClientHistoryReturn {
  const [data, setData] = useState<Datum[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!startDate || !endDate) return;
    try {
      setLoading(true);
      const result: GetContainerMovementsClientHistoryResponse =
        await GetContainerMovementsClientHistory(
          startDate,
          endDate,
          clientId,
          clientGroupId,
          containerId,
        );
      setData(result.data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Error al cargar el historial de movimientos"),
      );
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, clientId, clientGroupId, containerId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
