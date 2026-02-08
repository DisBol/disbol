import { useState } from "react";
import { AddRequestPaymentType } from "../service/addrequestpaymenttype";
import { AddRequestPaymentTypeResponse } from "../interfaces/addrequestpaymenttype.interface";

export function useAddRequestPaymentType() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addPaymentType = async (
    Request_id: number,
  ): Promise<AddRequestPaymentTypeResponse> => {
    setLoading(true);
    setError(null);
    try {
      const response = await AddRequestPaymentType(Request_id);
      return response;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error al registrar el tipo de pago";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addPaymentType, loading, error };
}
