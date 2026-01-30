import { useState, useEffect } from "react";
import {
  Datum,
  GetClientGroupResponse,
} from "../../interfaces/clientes/getclientgroup.interface";
import { GetClientGroups } from "../../services/clientes/getclientgroup";

export interface ClientGroupOption {
  value: string;
  label: string;
  active: string;
}

interface UseClientGroupsReturn {
  clientGroups: ClientGroupOption[];
  rawData: Datum[];
  isLoading: boolean;
  error: Error | null;
}

export function useClientGroups(): UseClientGroupsReturn {
  const [data, setData] = useState<Datum[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result: GetClientGroupResponse = await GetClientGroups();
        setData(result.data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Error al cargar grupos de clientes"),
        );
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Transformar datos para el SelectField (que espera value/label)
  const clientGroups: ClientGroupOption[] =
    data?.map((group) => ({
      value: group.id.toString(),
      label: group.name,
      active: group.active,
    })) || [];

  return { clientGroups, rawData: data || [], isLoading, error };
}
