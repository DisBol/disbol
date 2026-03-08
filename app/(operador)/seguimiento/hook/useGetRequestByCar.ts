import { useState, useEffect } from "react";
import { GetRequestByCar } from "../service/getrequestbycar";
import { Datum } from "../interface/getrequestbycar.interface";

export function useGetRequestByCar(Car_id: number) {
  const [requests, setRequests] = useState<Datum[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await GetRequestByCar(Car_id);
        if (isMounted) {
          setRequests(response?.data || []);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Error al obtener requests");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [Car_id]);

  return { requests, loading, error };
}
