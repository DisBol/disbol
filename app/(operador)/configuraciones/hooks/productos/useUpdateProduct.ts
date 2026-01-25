import { useState } from "react";
import { UpdateProduct } from "../../services/productos/updateproduct";
import { UpdateProductRequest } from "../../interfaces/productos/updateproduct.interface";

interface UseUpdateProductReturn {
  updateProduct: (productData: UpdateProductRequest) => Promise<boolean>;
  loading: boolean;
  error: Error | null;
}

export function useUpdateProduct(): UseUpdateProductReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateProduct = async (
    productData: UpdateProductRequest,
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      await UpdateProduct(productData);
      return true; // Éxito
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Error al actualizar producto"),
      );
      return false; // Error
    } finally {
      setLoading(false);
    }
  };

  return { updateProduct, loading, error };
}
