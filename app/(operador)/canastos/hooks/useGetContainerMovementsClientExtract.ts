import { useState, useEffect, useCallback } from "react";
import { GetContainerMovementsClientExtract } from "../services/getcontainermovementsclientextract";
import {
  GetContainerMovementsClienteExtractResponse,
  Datum,
} from "../interfaces/getcontainermovementsclientextract.interface";

interface UseGetContainerMovementsClientExtractReturn {
  data: Datum[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useGetContainerMovementsClientExtract(
  clientId: number,
  containerId: number,
): UseGetContainerMovementsClientExtractReturn {
  const [data, setData] = useState<Datum[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!clientId) return;
    try {
      setLoading(true);
      const result: GetContainerMovementsClienteExtractResponse =
        await GetContainerMovementsClientExtract(clientId, containerId);
      setData(result.data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Error al cargar el extracto"),
      );
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [clientId, containerId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
