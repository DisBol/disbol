import { useState } from "react";
import { GetTicketHistory } from "../service/getticketshistory";
import { GetTicketsHistoryResponse } from "../interfaces/getticketshistory.interface";

export const useGetTicketsHistory = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTicketsHistory = async (
    Tickets_id: number,
  ): Promise<GetTicketsHistoryResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await GetTicketHistory(Tickets_id);
      return response;
    } catch (err: any) {
      console.error("Error fetching tickets history:", err);
      setError(err.message || "Error fetching tickets history");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { fetchTicketsHistory, loading, error };
};
