import { useState, useCallback } from "react";
import { AddTicket } from "../service/addticket";
import { AddTicketResponse, Data } from "../interfaces/addticket.interface";

interface UseAddTicketParams {
  code: string;
  deferred_payment: string;
  total_payment: string;
  product_payment: string;
  AssignmentStage_id: number;
  total_container: string;
  total_units: string;
  ticket_payment: number;
  Account_id: number;
}

interface UseAddTicketReturn {
  data: Data | null;
  loading: boolean;
  error: string | null;
  addTicket: (params: UseAddTicketParams) => Promise<number | null>;
  reset: () => void;
}

export const useAddTicket = (): UseAddTicketReturn => {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const addTicket = useCallback(async (params: UseAddTicketParams) => {
    try {
      setLoading(true);
      setError(null);

      const response: AddTicketResponse = await AddTicket(
        params.code,
        params.deferred_payment,
        params.total_payment,
        params.product_payment,
        params.AssignmentStage_id,
        params.total_container,
        params.total_units,
        params.ticket_payment,
        params.Account_id
      );

      setData(response.data);

      // Retornamos el ID del ticket creado (usando rowId que representa el ID del ticket)
      return response.data?.rowId || null;
    } catch (err) {
      console.error("Error adding ticket:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    addTicket,
    reset,
  };
};
