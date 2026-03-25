import { useState, useCallback } from "react";
import { UpdateTicket } from "../service/updateticket";
import {
  UpdateTicketResponse,
  Data,
} from "../interfaces/updateticket.interface";

interface UseUpdateTicketParams {
  id: string;
  code: string;
  deferred_payment: string;
  total_payment: string;
  product_payment: string;
  active: string;
  AssignmentStage_id: number;
  total_container: number;
  total_units: number;
}

interface UseUpdateTicketReturn {
  data: Data | null;
  loading: boolean;
  error: string | null;
  updateTicket: (params: UseUpdateTicketParams) => Promise<boolean>;
  deleteTicket: (
    params: Omit<UseUpdateTicketParams, "active">,
  ) => Promise<boolean>;
  reset: () => void;
}

export const useUpdateTicket = (): UseUpdateTicketReturn => {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateTicket = useCallback(async (params: UseUpdateTicketParams) => {
    try {
      setLoading(true);
      setError(null);

      const response: UpdateTicketResponse = await UpdateTicket(
        params.id,
        params.code,
        params.deferred_payment,
        params.total_payment,
        params.product_payment,
        params.active,
        params.AssignmentStage_id,
        params.total_container,
        params.total_units,
      );

      setData(response.data);
      return true;
    } catch (err) {
      console.error("Error updating ticket:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTicket = useCallback(
    async (params: Omit<UseUpdateTicketParams, "active">) => {
      try {
        setLoading(true);
        setError(null);

        const response: UpdateTicketResponse = await UpdateTicket(
          params.id,
          params.code,
          params.deferred_payment,
          params.total_payment,
          params.product_payment,
          "false", // active: false para eliminar
          params.AssignmentStage_id,
          params.total_container,
          params.total_units,
        );

        setData(response.data);
        return true;
      } catch (err) {
        console.error("Error deleting ticket:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    updateTicket,
    deleteTicket,
    reset,
  };
};
