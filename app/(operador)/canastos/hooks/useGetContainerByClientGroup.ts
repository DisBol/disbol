import { useState, useEffect, useCallback } from "react";
import { GetContainerByClientGroup } from "../services/getcontainerbyclientgroup";
import {
  GetContainerByClientGroupResponse,
  Datum,
} from "../interfaces/getcontainerbyclientgroup.interface";

interface UseGetContainerByClientGroupReturn {
  data: Datum[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useGetContainerByClientGroup(
  containerId: number,
): UseGetContainerByClientGroupReturn {
  const [data, setData] = useState<Datum[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result: GetContainerByClientGroupResponse =
        await GetContainerByClientGroup(containerId);
      setData(result.data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Error al cargar canastos por ruta"),
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
