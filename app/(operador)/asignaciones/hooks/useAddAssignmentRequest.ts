import { useState } from "react";
import { AddAssignmentRequest } from "../service/planificar/addassignmentrequest";
import { AddAssignmentRequestResponse } from "../interfaces/planificar/addassignmentrequest.interface";

export function useAddAssignmentRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addAssignment = async (
    Assignment_id: number,
    Request_id: number,
    active: string,
  ): Promise<AddAssignmentRequestResponse> => {
    setLoading(true);
    setError(null);
    try {
      const response = await AddAssignmentRequest(
        Assignment_id,
        Request_id,
        active,
      );
      return response;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error adding assignment request";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addAssignment, loading, error };
}
