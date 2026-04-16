import { useState, useEffect, useCallback } from "react";
import { GetContainerMovementsProviderHistory } from "../services/getcontainermovementsproviderhistory";
import {
  GetContainerMovementsProviderHistoryResponse,
  Datum,
} from "../interfaces/getcontainermovementsproviderhistory.interface";

interface UseGetContainerMovementsProviderHistoryReturn {
  data: Datum[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useGetContainerMovementsProviderHistory(
  startDate: string,
  endDate: string,
  providerId: number,
  containerId: number,
): UseGetContainerMovementsProviderHistoryReturn {
  const [data, setData] = useState<Datum[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!startDate || !endDate) return;
    try {
      setLoading(true);
      const result: GetContainerMovementsProviderHistoryResponse =
        await GetContainerMovementsProviderHistory(
          startDate,
          endDate,
          providerId,
          containerId,
        );
      setData(result.data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Error al cargar el historial de movimientos por proveedor"),
      );
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, providerId, containerId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
