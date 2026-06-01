"use client";

import { useCallback, useEffect, useState } from "react";
import { Datum } from "../interfaces/getaccount.interface";
import { GetAccount } from "../service/getAccount";

export function useGetAccount() {
  const [data, setData] = useState<Datum[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await GetAccount();
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar cuentas");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return {
    data,
    loading,
    error,
    refetch: fetchAccounts,
  };
}
