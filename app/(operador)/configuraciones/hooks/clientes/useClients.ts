import { useState, useEffect, useMemo, useCallback } from "react";
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
  clientTypeId?: number | null;
  clientTypeName?: string | null;
}

interface UseClientsReturn {
  rawData: Datum[] | null;
  clients: ClientView[];
  loading: boolean;
  error: Error | null;
  refetch: (groupId?: number, typeId?: number) => Promise<void>;
  fetchByGroup: (groupId?: number, typeId?: number) => Promise<void>;
}

export function useClients(initialGroupId?: number): UseClientsReturn {
  const [data, setData] = useState<Datum[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentGroupId, setCurrentGroupId] = useState<number | undefined>(
    initialGroupId,
  );
  const [currentTypeId, setCurrentTypeId] = useState<number | undefined>(
    undefined,
  );

  const fetchData = useCallback(async (groupId?: number, typeId?: number) => {
    try {
      setLoading(true);
      const result: GetClientResponse = await GetClients(groupId, typeId);
      setData(result.data);
      setCurrentGroupId(groupId);
      setCurrentTypeId(typeId);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(
    async (groupId?: number, typeId?: number) => {
      await fetchData(groupId ?? currentGroupId, typeId ?? currentTypeId);
    },
    [fetchData, currentGroupId, currentTypeId],
  );

  const fetchByGroup = useCallback(
    async (groupId?: number, typeId?: number) => {
      await fetchData(groupId, typeId ?? currentTypeId);
    },
    [fetchData, currentTypeId],
  );

  useEffect(() => {
    fetchData(currentGroupId, currentTypeId);
  }, [currentGroupId, currentTypeId, fetchData]);

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
      clientTypeId: client.ClientType_id ?? null,
      clientTypeName: client.ClientType_name ?? null,
    }));
  }, [data]);

  return { rawData: data, clients, loading, error, refetch, fetchByGroup };
}
