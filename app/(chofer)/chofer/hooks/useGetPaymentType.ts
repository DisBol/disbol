import { useState, useEffect } from "react";
import { Datum } from "../interfaces/getpaymenttype.interface";
import { GetPaymentType } from "../service/getpaymenttype";

export function useGetPaymentType() {
  const [data, setData] = useState<Datum[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await GetPaymentType();
        setData(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar métodos de pago");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { data, loading, error };
}
