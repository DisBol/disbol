import { useState } from "react";
import { AddRequestWeighing } from "../../service/repartir/addrequestweighing";
import { AddRequestWeighingResponse } from "../../interfaces/repartir/addrequestweighing.interface";

interface UseAddRequestWeighingReturn {
  loading: boolean;
  error: string | null;
  addWeighing: (
    weight: number,
    units: number,
    container: number,
    active: string,
    ProductRequest_id: number,
  ) => Promise<AddRequestWeighingResponse | null>;
}

export const useAddRequestWeighing = (): UseAddRequestWeighingReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const addWeighing = async (
    weight: number,
    units: number,
    container: number,
    active: string,
    ProductRequest_id: number,
  ): Promise<AddRequestWeighingResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await AddRequestWeighing(
        weight,
        units,
        container,
        active,
        ProductRequest_id,
      );
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear el pesaje");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, addWeighing };
};
