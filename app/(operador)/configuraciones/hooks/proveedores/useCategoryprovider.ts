import { useEffect, useMemo } from "react";
import { Datum } from "../../interfaces/proveedores/getcategoryprovider.interface";
import { useProviderStore } from "../../store/providers.store";

export interface ProviderView {
  id: number;
  nombre: string;
  grupos: { id: number; name: string; CategoryProvider_id: number }[];
  estado: string;
}

interface UseCategoryProviderReturn {
  rawData: Datum[] | null;
  providers: ProviderView[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export function useCategoryProvider(): UseCategoryProviderReturn {
  const { rawData, loading, error, fetchProviders } = useProviderStore();

  useEffect(() => {
    if (!rawData) {
      fetchProviders();
    }
  }, [rawData, fetchProviders]);

  const providers = useMemo<ProviderView[]>(() => {
    if (!rawData) return [];

    const map = new Map<string, ProviderView>();

    rawData.forEach((item) => {
      if (!map.has(item.name_0)) {
        map.set(item.name_0, {
          id: item.id_0,
          nombre: item.name_0,
          grupos: [],
          estado: "Activo",
        });
      }
      const provider = map.get(item.name_0);
      if (provider && item.name) {
        provider.grupos.push({
          id: item.id,
          name: item.name,
          CategoryProvider_id: item.CategoryProvider_id,
        });
      }
    });

    return Array.from(map.values());
  }, [rawData]);

  return { rawData, providers, loading, error, refresh: fetchProviders };
}
