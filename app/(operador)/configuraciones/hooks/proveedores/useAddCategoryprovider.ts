import { useState } from "react";
import { AddCategoryProvider } from "../../services/provedores/addcategoryprovider";
import { AddCategoryProviderResponse } from "../../interfaces/proveedores/addcategoryprovider";

export function useAddCategoryProvider() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AddCategoryProviderResponse | null>(null);

  const addCategoryToProvider = async (
    providerId: number,
    categoryId: number
  ): Promise<AddCategoryProviderResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await AddCategoryProvider(providerId, categoryId);
      setData(response);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    addCategoryToProvider,
    loading,
    error,
    data,
  };
}
