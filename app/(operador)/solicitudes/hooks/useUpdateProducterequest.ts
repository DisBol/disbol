import { useState } from "react";
import { UpdateProductRequest } from "../service/updateproductrequest";

export function useUpdateProductrequest() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateProductRequest = async (
    id: number,
    containers: number,
    units: number,
    menudencia: boolean,
    net_weight: number,
    gross_weight: number,
    payment: number,
    active: boolean,
    RequestStage_id: number,
    Product_id: number,
  ) => {
    setLoading(true);
    setError(null);
    try {
      await UpdateProductRequest(
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
      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error updating product request",
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateProductRequest,
    loading,
    error,
  };
}
