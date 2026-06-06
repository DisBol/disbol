"use client";

import { useCallback, useEffect, useState } from "react";
import { Datum } from "../interfaces/getaccountingperiod.interface";
import { GetAccountingPeriod } from "../service/getAccountingPeriod";

export function useGetAccountingPeriod() {
  const [data, setData] = useState<Datum[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAccountingPeriod = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await GetAccountingPeriod();
      setData(response.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al cargar periodos contables",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccountingPeriod();
  }, [fetchAccountingPeriod]);

  return {
    data,
    loading,
    error,
    refetch: fetchAccountingPeriod,
  };
}
