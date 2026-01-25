import { useState } from "react";
import { AddProduct } from "../services/addproduct";
import { AddProductRequest } from "../interfaces/addproduct.interface";

interface UseAddProductReturn {
  addProduct: (productData: AddProductRequest) => Promise<boolean>;
  loading: boolean;
  error: Error | null;
}

export function useAddProduct(): UseAddProductReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addProduct = async (
    productData: AddProductRequest,
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      await AddProduct(productData);
      return true; // Éxito
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Error al crear producto"),
      );
      return false; // Error
    } finally {
      setLoading(false);
    }
  };

  return { addProduct, loading, error };
}
