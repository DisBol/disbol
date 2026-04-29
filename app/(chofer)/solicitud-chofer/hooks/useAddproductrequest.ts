import { useState } from "react";
import { AddProductRequest } from "../service/addProductRequest";
import { AddProductrequestResponse } from "../interfaces/addproductrequest.interface";

export function useAddProductRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addProduct = async (
    containers: number,
    units: number,
    menudencia: boolean,
    net_weight: number,
    gross_weight: number,
    payment: number,
    active: boolean,
    RequestStage_id: number,
    Product_id: number,
  ): Promise<AddProductrequestResponse> => {
    setLoading(true);
    setError(null);
    try {
      const response = await AddProductRequest(
        containers,
        units,
        menudencia ? "true" : "false", // Convert boolean to "true"/"false" as per service update
        net_weight,
        gross_weight,
        payment,
        active,
        RequestStage_id,
        Product_id,
      );
      return response;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al registrar el producto";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addProduct, loading, error };
}
