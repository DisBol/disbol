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
  refetch: (groupId?: number) => Promise<void>;
  fetchByGroup: (groupId?: number) => Promise<void>;
}

export function useClients(initialGroupId?: number): UseClientsReturn {
  const [data, setData] = useState<Datum[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentGroupId, setCurrentGroupId] = useState<number | undefined>(
    initialGroupId,
  );

  const fetchData = async (groupId?: number) => {
    try {
      setLoading(true);
      const result: GetClientResponse = await GetClients(groupId);
      setData(result.data);
      setCurrentGroupId(groupId);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async (groupId?: number) => {
    await fetchData(groupId ?? currentGroupId);
  };

  const fetchByGroup = async (groupId?: number) => {
    await fetchData(groupId);
  };

  useEffect(() => {
    fetchData(currentGroupId);
  }, [currentGroupId]);

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

  return { rawData: data, clients, loading, error, refetch, fetchByGroup };
}
