import { useState } from "react";
import { UpdateRequest } from "../service/updaterequest";

export function useUpdateRequest() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateRequest = async (
    id: number,
    active: boolean,
    Provider_id: number,
    Client_id: number,
  ) => {
    setLoading(true);
    setError(null);
    try {
      await UpdateRequest(id, active, Provider_id, Client_id);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error updating request");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateRequest,
    loading,
    error,
  };
}
