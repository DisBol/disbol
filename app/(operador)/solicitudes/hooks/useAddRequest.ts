import { useState } from "react";
import { AddRequest } from "../service/addrequest";
import { AddRequestResponse } from "../interfaces/addrequest.interface";

export function useAddRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addRequest = async (
    Provider_id: number,
    Client_id: number,
  ): Promise<AddRequestResponse> => {
    setLoading(true);
    setError(null);
    try {
      const response = await AddRequest(Provider_id, Client_id);
      return response;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al registrar la solicitud";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addRequest, loading, error };
}
