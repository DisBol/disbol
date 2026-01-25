import { useState } from "react";
import { UpdateProvider } from "../../services/provedores/updateprovider";
import { useProviderStore } from "../../store/providers.store";
import { UpdateProviderResponse } from "../../interfaces/proveedores/updateprovider.interface";

interface UseUpdateProviderReturn {
  updateProvider: (
    id: number,
    name: string,
    active: string,
  ) => Promise<UpdateProviderResponse | null>;
  loading: boolean;
  error: string | null;
}

export function useUpdateProvider(): UseUpdateProviderReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchProviders } = useProviderStore();

  const updateProvider = async (
    id: number,
    name: string,
    active: string,
  ): Promise<UpdateProviderResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await UpdateProvider(id, name, active);
      await fetchProviders(); 
      return response;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error desconocido al actualizar el proveedor",
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateProvider, loading, error };
}
