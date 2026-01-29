import { useState } from "react";
import { AddClient } from "../../services/clientes/addclient";
import { AddClientResponse } from "../../interfaces/clientes/addclient.interface";

interface UseAddClientReturn {
  addClient: (
    name: string,
    document: string,
    lat: number,
    long: number,
    phone: string,
    clientGroupId: string,
  ) => Promise<AddClientResponse>;
  loading: boolean;
  error: Error | null;
}

export function useAddClient(): UseAddClientReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addClient = async (
    name: string,
    document: string,
    lat: number,
    long: number,
    phone: string,
    clientGroupId: string,
  ): Promise<AddClientResponse> => {
    try {
      setLoading(true);
      setError(null);

      const response = await AddClient(
        name,
        document,
        lat,
        long,
        phone,
        clientGroupId,
      );

      return response;
    } catch (err) {
      const errorObj =
        err instanceof Error ? err : new Error("Error al agregar cliente");
      setError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  };

  return { addClient, loading, error };
}
