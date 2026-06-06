"use client";

import { useCallback, useState } from "react";
import {
  UpdateAccount,
  type UpdateAccountPayload,
} from "../service/updateAccount";

export function useUpdateAccount() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateAccount = useCallback(async (payload: UpdateAccountPayload) => {
    setLoading(true);
    setError(null);

    try {
      return await UpdateAccount(payload);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al actualizar la cuenta",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    updateAccount,
    loading,
    error,
  };
}
