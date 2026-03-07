import { useState } from "react";
import { UpdateRequestStage } from "../../service/repartir/updaterequeststage";
import { UpdateRequestStageResponse } from "../../interfaces/repartir/updaterequeststage.interface";

interface UseUpdateRequestStageReturn {
  loading: boolean;
  error: string | null;
  updateRequestStage: (
    id: number,
    position: number,
    in_container: number,
    out_container: number,
    units: number,
    container: number,
    payment: number,
    active: string,
    Request_id: number,
  ) => Promise<UpdateRequestStageResponse | null>;
}

export const useUpdateRequestStage = (): UseUpdateRequestStageReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateRequestStage = async (
    id: number,
    position: number,
    in_container: number,
    out_container: number,
    units: number,
    container: number,
    payment: number,
    active: string,
    Request_id: number,
  ): Promise<UpdateRequestStageResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await UpdateRequestStage(
        id,
        position,
        in_container,
        out_container,
        units,
        container,
        payment,
        active,
        Request_id,
      );
      return response;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al actualizar el stage de la solicitud",
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, updateRequestStage };
};
