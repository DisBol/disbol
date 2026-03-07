import { useState } from "react";
import { UpdateRequestResponse } from "../../interfaces/repartir/updaterequest.interface";
import { UpdateRequest } from "../../service/repartir/updaterequest";

export function useUpdateRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateRequest = async (
    id: number,
    active: string,
    Provider_id: number,
    Client_id: number,
    Car_id: number,
    Employee_id: number,
  ): Promise<UpdateRequestResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await UpdateRequest(
        id,
        active,
        Provider_id,
        Client_id,
        Car_id,
        Employee_id,
      );
      return response;
    } catch (err: any) {
      setError(err.message || "Failed to update request");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateRequest, loading, error };
}
