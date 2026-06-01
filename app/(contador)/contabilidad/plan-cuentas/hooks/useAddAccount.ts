"use client";

import { useCallback, useState } from "react";
import { AddAccount, type AddAccountPayload } from "../service/addAccount";

export function useAddAccount() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addAccount = useCallback(async (payload: AddAccountPayload) => {
    setLoading(true);
    setError(null);

    try {
      return await AddAccount(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear la cuenta");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    addAccount,
    loading,
    error,
  };
}
