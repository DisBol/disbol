import { useState } from "react";
import { AddClient } from "../../services/clientes/addclient";
import { AddUser } from "../../services/usuarios/adduser";
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

      const responseData = response as unknown as {
        data?: Record<string, unknown> | Array<Record<string, unknown>>;
      };

      const dataArray = Array.isArray(responseData.data)
        ? responseData.data
        : responseData.data
        ? [responseData.data]
        : [];

      const clientIdValue = dataArray[0]?.Client_id ?? dataArray[0]?.rowId ?? null;

      if (clientIdValue === null || clientIdValue === undefined) {
        throw new Error("No se pudo obtener el Client_id tras crear el cliente");
      }

      const clientId = Number(clientIdValue);
      if (Number.isNaN(clientId)) {
        throw new Error("Client_id inválido recibido tras crear el cliente");
      }

      await AddUser(name, document, "1", clientId);

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
