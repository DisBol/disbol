import { useState, useEffect, useCallback } from "react";
import { GetProductInventoryUnits } from "../../service/inventario/getproductinventoryunits";
import { GetProductInventoryUnitsResponse } from "../../interfaces/inventario/getproductinventoryunits.interface";

interface UseGetProductInventoryUnitsReturn {
  data: GetProductInventoryUnitsResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useGetProductInventoryUnits = (
  Category_id: number | null | undefined,
): UseGetProductInventoryUnitsReturn => {
  const [data, setData] = useState<GetProductInventoryUnitsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!Category_id) return;
    try {
      setLoading(true);
      setError(null);
      const response = await GetProductInventoryUnits(Category_id);
      setData(response);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al obtener el inventario de unidades",
      );
    } finally {
      setLoading(false);
    }
  }, [Category_id]);

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
