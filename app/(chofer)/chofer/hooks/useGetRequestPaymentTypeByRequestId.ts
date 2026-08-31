import { useCallback, useEffect, useState } from "react";
import { Datum } from "../interfaces/getrequestpaymenttypebyrequestid.interface";
import { GetRequestPaymentTypeByRequestId } from "../service/getrequestpaymenttypebyrequestid";

export function useGetRequestPaymentTypeByRequestId(requestId?: number) {
  const [data, setData] = useState<Datum[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (requestId === undefined || requestId === null || requestId <= 0) {
      setData([]);
      return [] as Datum[];
    }

    setLoading(true);
    setError(null);
    try {
      const response = await GetRequestPaymentTypeByRequestId(requestId);
      const payments = response.data ?? [];
      setData(payments);
      return payments;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Error al cargar pagos de la solicitud";
      setError(message);
      setData([]);
      return [] as Datum[];
    } finally {
      setLoading(false);
    }
  }, [requestId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}
