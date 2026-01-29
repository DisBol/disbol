import { useState, useEffect, useMemo } from "react";
import { GetClients } from "../../services/clientes/getclient";
import {
  Datum,
  GetClientResponse,
} from "../../interfaces/clientes/getclient.interface";

export interface ClientView {
  id: number;
  name: string;
  document: string;
  phone: string;
  clientGroupId: number;
  active: string;
}

interface UseClientsReturn {
  rawData: Datum[] | null;
  clients: ClientView[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useClients(): UseClientsReturn {
  const [data, setData] = useState<Datum[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result: GetClientResponse = await GetClients();
      setData(result.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Listar clientes con su grupo correspondiente
  const clients: ClientView[] = useMemo(() => {
    if (!data) return [];
    return data.map((client) => ({
      id: client.id,
      name: client.name,
      document: client.document,
      phone: client.phone,
      clientGroupId: client.ClientGroup_id,
      active: client.active,
    }));
  }, [data]);

  return { rawData: data, clients, loading, error, refetch };
}
