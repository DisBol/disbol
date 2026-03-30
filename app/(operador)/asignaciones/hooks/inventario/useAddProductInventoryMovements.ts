import { useState, useCallback } from "react";
import { AddProductInventoryMovements } from "../../service/inventario/addproductinventorymovements";
import {
  AddProductInventoryMovementsBody,
  AddProductInventoryMovementsResponse,
} from "../../interfaces/inventario/addproductinventorymovements.interface";

interface UseAddProductInventoryMovementsReturn {
  mutate: (body: AddProductInventoryMovementsBody) => Promise<AddProductInventoryMovementsResponse>;
  loading: boolean;
  error: string | null;
}

export const useAddProductInventoryMovements = (): UseAddProductInventoryMovementsReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (body: AddProductInventoryMovementsBody) => {
    try {
      setLoading(true);
      setError(null);
      return await AddProductInventoryMovements(body);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al registrar movimiento";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error };
};
