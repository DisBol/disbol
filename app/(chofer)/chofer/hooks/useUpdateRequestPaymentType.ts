import { AddRequestPaymentTypeResponse } from "@/app/(operador)/solicitudes/interfaces/addrequestpaymenttype.interface";
import { AddRequestPaymentType } from "@/app/(chofer)/chofer/service/updaterequestpaymenttype";
import { useState } from "react";

export function useUpdateRequestPaymentType() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addPaymentType = async (
    Request_id: number,
    PaymentType_id: number,
  ): Promise<AddRequestPaymentTypeResponse> => {
    setLoading(true);
    setError(null);
    try {
      const response = await AddRequestPaymentType(Request_id, PaymentType_id);
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
