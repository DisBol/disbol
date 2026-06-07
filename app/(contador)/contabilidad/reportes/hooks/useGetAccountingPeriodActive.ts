"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Datum,
  GetAccountingPeriodActiveResponse,
} from "../interfaces/getaccountingperiodactive.interface";
import { GetAccountingPeriodActive } from "../service/getAccountingPeriodActive";

export function useGetAccountingPeriodActive() {
  const [data, setData] = useState<Datum[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAccountingPeriodActive = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response: GetAccountingPeriodActiveResponse =
        await GetAccountingPeriodActive();

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
          : "Error al cargar periodos contables activos",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccountingPeriodActive();
  }, [fetchAccountingPeriodActive]);

  return {
    data,
    loading,
    error,
    refetch: fetchAccountingPeriodActive,
  };
}
