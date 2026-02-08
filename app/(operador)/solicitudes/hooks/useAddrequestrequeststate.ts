import { useState } from "react";
import { AddRequestRequestState } from "../service/addrequestrequeststate";
import { AddRequestRequestSatateResponse } from "../interfaces/addrequestrequeststate.interface";

export function useAddRequestRequestState() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addRequestState = async (
    Request_id: number,
  ): Promise<AddRequestRequestSatateResponse> => {
    setLoading(true);
    setError(null);
    try {
      const response = await AddRequestRequestState(Request_id);
      return response;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error al registrar el estado de la solicitud";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addRequestState, loading, error };
}
