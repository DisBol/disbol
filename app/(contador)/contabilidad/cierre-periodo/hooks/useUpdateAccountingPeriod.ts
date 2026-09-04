"use client";

import { useCallback, useState } from "react";
import { UpdateAccountingPeriod } from "../service/updateAccountingPeriod";
import {
  UpdateAccountingPeriodPayload,
  UpdateAccountingPeriodResponse,
} from "../interfaces/updateaccountingperiod.interface";

export function useUpdateAccountingPeriod() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateAccountingPeriod = useCallback(
    async (payload: UpdateAccountingPeriodPayload): Promise<UpdateAccountingPeriodResponse> => {
      setLoading(true);
      setError(null);

      try {
        const response = await UpdateAccountingPeriod(payload);
        return response;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Error al actualizar el período contable";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    updateAccountingPeriod,
    loading,
    error,
  };
}
