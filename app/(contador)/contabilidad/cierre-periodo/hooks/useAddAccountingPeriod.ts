"use client";

import { useCallback, useState } from "react";
import { AddAccountingPeriod } from "../service/addAccountingPeriod";
import {
  AddAccountingPeriodPayload,
  AddAccountingPeriodResponse,
} from "../interfaces/addaccountingperiod.interface";

export function useAddAccountingPeriod() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addAccountingPeriod = useCallback(
    async (payload: AddAccountingPeriodPayload): Promise<AddAccountingPeriodResponse> => {
      setLoading(true);
      setError(null);

      try {
        const response = await AddAccountingPeriod(payload);
        return response;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Error al agregar el período contable";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    addAccountingPeriod,
    loading,
    error,
  };
}
