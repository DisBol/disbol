import { useState, useEffect, useCallback } from "react";
import { GetProductInventory } from "../../service/inventario/getproductinventory";
import { GetProductInventoryResponse } from "../../interfaces/inventario/getproductinventory.interface";

interface UseGetProductInventoryReturn {
  data: GetProductInventoryResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useGetProductInventory = (): UseGetProductInventoryReturn => {
  const [data, setData] = useState<GetProductInventoryResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await GetProductInventory();
      setData(response);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al obtener el inventario de productos",
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
