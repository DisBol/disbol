import { useState, useEffect, useMemo } from "react";
import { CategoryProviderResponse, Datum } from "../../interfaces/proveedores/getcategoryprovider.interface";
import { GetCategoryProviders } from "../../services/provedores/getcategoryprovider";


export interface ProviderView {
  nombre: string;
  grupos: string[];
  estado: string;
}

interface UseCategoryProviderReturn {
  rawData: Datum[] | null; 
  providers: ProviderView[]; 
  loading: boolean;
  error: Error | null;
}

export function useCategoryProvider(): UseCategoryProviderReturn {
  const [data, setData] = useState<Datum[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result: CategoryProviderResponse = await GetCategoryProviders();
        setData(result.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

 
  const providers = useMemo<ProviderView[]>(() => {
    if (!data) return [];

    const map = new Map<string, ProviderView>();

    data.forEach((item) => {

      if (!map.has(item.name_0)) {
        map.set(item.name_0, {
          nombre: item.name_0,
          grupos: [],
          estado: "Activo",
        });
      }
      // Nota: Asumo que 'item.name' es el nombre del grupo
      const provider = map.get(item.name_0);
      if (provider && item.name) {
         provider.grupos.push(item.name);
      }
    });

    return Array.from(map.values());
  }, [data]); 
  return { rawData: data, providers, loading, error };
} 