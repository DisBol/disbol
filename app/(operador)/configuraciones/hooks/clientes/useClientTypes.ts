import { useState, useEffect } from "react";
import { SelectOption } from "@/components/ui/SelectInput";
import { GetClientTypes } from "../../services/clientes/getclienttype";
import { GetClientTypeResponse, Datum } from "../../interfaces/clientes/getclienttype.interface";

interface UseClientTypesReturn {
  clientTypes: SelectOption[];
  rawData: Datum[];
  isLoading: boolean;
  error: Error | null;
}

export function useClientTypes(): UseClientTypesReturn {
  const [data, setData] = useState<Datum[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result: GetClientTypeResponse = await GetClientTypes();
        setData(result.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Error al cargar tipos de cliente"));
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const clientTypes: SelectOption[] =
    data?.map((t) => ({ value: t.id.toString(), label: t.name })) || [];

  return { clientTypes, rawData: data || [], isLoading, error };
}
