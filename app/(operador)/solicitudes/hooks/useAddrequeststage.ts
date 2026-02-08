import { useState } from "react";
import { AddRequestStage } from "../service/addrequeststage";
import { AddRequestStageResponse } from "../interfaces/addrequeststage.interface";

export function useAddRequestStage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addStage = async (
    position: number,
    in_container: number,
    out_container: number,
    units: number,
    container: number,
    payment: number,
    Request_id: number,
  ): Promise<AddRequestStageResponse> => {
    setLoading(true);
    setError(null);
    try {
      const response = await AddRequestStage(
        position,
        in_container,
        out_container,
        units,
        container,
        payment,
        Request_id,
      );
      return response;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error al registrar la etapa de la solicitud";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addStage, loading, error };
}
