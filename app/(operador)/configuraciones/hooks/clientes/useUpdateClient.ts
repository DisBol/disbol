import { useState } from "react";
import { UpdateClient } from "../../services/clientes/updateclient";
import { UpdateClientResponse } from "../../interfaces/clientes/updateclient.interface";

interface UseUpdateClientReturn {
  updateClient: (
    id: number,
    name: string,
    document: string,
    lat: number,
    long: number,
    phone: string,
    active: string,
    clientGroupId: string,
    clientTypeId?: string,
  ) => Promise<UpdateClientResponse>;
  loading: boolean;
  error: Error | null;
}

export function useUpdateClient(): UseUpdateClientReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateClient = async (
    id: number,
    name: string,
    document: string,
    lat: number,
    long: number,
    phone: string,
    active: string,
    clientGroupId: string,
    clientTypeId?: string,
  ): Promise<UpdateClientResponse> => {
    try {
      setLoading(true);
      setError(null);

      const response = await UpdateClient(
        id,
        name,
        document,
        lat,
        long,
        phone,
        active,
        clientGroupId,
        clientTypeId,
      );

      return response;
    } catch (err) {
      const errorObj =
        err instanceof Error ? err : new Error("Error al actualizar cliente");
      setError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  };

  return { updateClient, loading, error };
}
