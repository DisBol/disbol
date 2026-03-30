import { useState, useEffect, useCallback } from "react";
import { GetProductInventoryContainer } from "../../service/inventario/getproductinventorycontainer";
import { GetProductInventoryContainerResponse } from "../../interfaces/inventario/getproductinventorycontainer.interface";

interface UseGetProductInventoryContainerReturn {
  data: GetProductInventoryContainerResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useGetProductInventoryContainer = (
  Container_id: number | null | undefined,
): UseGetProductInventoryContainerReturn => {
  const [data, setData] = useState<GetProductInventoryContainerResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!Container_id) {
      setData(null);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await GetProductInventoryContainer(Container_id);
      setData(response);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al obtener el inventario del contenedor",
      );
    } finally {
      setLoading(false);
    }
  }, [Container_id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};
