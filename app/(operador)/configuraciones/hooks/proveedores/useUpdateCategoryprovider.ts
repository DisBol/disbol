import { useState } from "react";
import { updatecategoryprovider } from "../../services/provedores/updatecategoryprovider";
import { UpdateCategoryproviderResponse } from "../../interfaces/proveedores/updatecategoryprovider.interface";

interface UseUpdateCategoryReturn {
  updateCategory: (
    id: number,
    active: string,
  ) => Promise<UpdateCategoryproviderResponse | null>;
  loading: boolean;
  error: string | null;
}

export function useUpdateCategory(): UseUpdateCategoryReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCategory = async (
    id: number,
    active: string,
  ): Promise<UpdateCategoryproviderResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await updatecategoryprovider(id, active);
      return response;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error desconocido al actualizar la categoria",
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateCategory, loading, error };
}
