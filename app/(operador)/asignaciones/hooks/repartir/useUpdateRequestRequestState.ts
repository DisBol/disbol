import { useState } from "react";
import { AddRequestRequestSatateResponse } from "@/app/(operador)/solicitudes/interfaces/addrequestrequeststate.interface";
import { UpdateRequestRequestState } from "../../service/repartir/upadaterequestrequestsatate";

export function useUpdateRequestRequestState() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateRequestRequestState = async (
    Request_id: number,
  ): Promise<AddRequestRequestSatateResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await UpdateRequestRequestState(Request_id);
      return response;
    } catch (err: any) {
      setError(err.message || "Failed to update request request state");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateRequestRequestState, loading, error };
}
