"use client";

import { useCallback, useEffect, useState } from "react";
import { Datum } from "../interfaces/getasiento.interface";
import { GetAsiento } from "../services/getasiento";

export function useGetAsiento() {
  const [data, setData] = useState<Datum[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAsientos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await GetAsiento();
      setData(
        response.data.map((item) => ({
          ...item,
          created_at: new Date(item.created_at),
          updated_at: new Date(item.updated_at),
        })),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar asientos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAsientos();
  }, [fetchAsientos]);

  return {
    data,
    loading,
    error,
    refetch: fetchAsientos,
  };
}
