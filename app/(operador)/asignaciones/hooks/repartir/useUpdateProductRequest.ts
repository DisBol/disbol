import { useState } from "react";
import { UpdateProductRequest } from "../../service/repartir/updateproductreques";
import { UpdateProductRequestResponse } from "../../interfaces/repartir/updateproductrequest.interface";

interface UseUpdateProductRequestReturn {
  loading: boolean;
  error: string | null;
  updateProductRequest: (
    id: number,
    containers: number,
    units: number,
    menudencia: string,
    net_weight: number,
    gross_weight: number,
    payment: number,
    active: string,
    RequestStage_id: number,
    Product_id: number,
  ) => Promise<UpdateProductRequestResponse | null>;
}

export const useUpdateProductRequest = (): UseUpdateProductRequestReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateProductRequest = async (
    id: number,
    containers: number,
    units: number,
    menudencia: string,
    net_weight: number,
    gross_weight: number,
    payment: number,
    active: string,
    RequestStage_id: number,
    Product_id: number,
  ): Promise<UpdateProductRequestResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await UpdateProductRequest(
        id,
        containers,
        units,
        menudencia,
        net_weight,
        gross_weight,
        payment,
        active,
        RequestStage_id,
        Product_id,
      );
      return response;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al actualizar el producto de solicitud",
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, updateProductRequest };
};
