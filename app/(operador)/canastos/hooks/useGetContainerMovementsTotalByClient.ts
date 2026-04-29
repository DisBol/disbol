import { useState, useEffect, useCallback } from "react";
import { GetContainerMovementsTotalByClient } from "../services/getcontainermovementstotalbyclient";
import {
  GetContainerMovementsTotalByClientResponse,
  Datum,
} from "../interfaces/getcontainermovementstotalbyclient.interface";

interface UseGetContainerMovementsTotalByClientReturn {
  data: Datum[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useGetContainerMovementsTotalByClient(
  containerId: number,
): UseGetContainerMovementsTotalByClientReturn {
  const [data, setData] = useState<Datum[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result: GetContainerMovementsTotalByClientResponse =
        await GetContainerMovementsTotalByClient(containerId);
      setData(result.data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Error al cargar clientes en mora"),
      );
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [containerId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
