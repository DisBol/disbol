"use client";

import { useCallback, useEffect, useState } from "react";
import { Datum } from "../interfaces/getasientobyperiod.interface";
import { GetAsientoByPeriod } from "../service/getAsientoByPeriod";

export function useGetAsientobyPeriod(accountingPeriodId?: number | null) {
  const [data, setData] = useState<Datum[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAsientosByPeriod = useCallback(async () => {
    if (!accountingPeriodId) {
      setData([]);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await GetAsientoByPeriod(accountingPeriodId);
      setData(
        response.data.map((item) => ({
          ...item,
          created_at: new Date(item.created_at),
          updated_at: new Date(item.updated_at),
        })),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al cargar asientos por período",
      );
    } finally {
      setLoading(false);
    }
  }, [accountingPeriodId]);

  useEffect(() => {
    fetchAsientosByPeriod();
  }, [fetchAsientosByPeriod]);

  return {
    data,
    loading,
    error,
    refetch: fetchAsientosByPeriod,
  };
}
