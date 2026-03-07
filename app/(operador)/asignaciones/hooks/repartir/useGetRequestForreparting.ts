import { useState, useEffect, useCallback } from "react";
import { GetRequestForreparting } from "../../service/repartir/getrequestforreparting";
import { GetRequestForrepartingResponse } from "../../interfaces/repartir/getrequestforreparting.interface";

interface UseGetRequestForrepartingReturn {
  data: GetRequestForrepartingResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useGetRequestForreparting =
  (): UseGetRequestForrepartingReturn => {
    const [data, setData] = useState<GetRequestForrepartingResponse | null>(
      null,
    );
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await GetRequestForreparting();
        setData(response);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Error al obtener las solicitudes para repartir",
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
