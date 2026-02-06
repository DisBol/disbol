import { useState, useEffect, useCallback } from "react";
import { Datum } from "../interfaces/getrequesthistory.interface";
import { GetRequestHistory } from "../service/getrequesthistory";


export interface RequestHistoryFilters {
  start_date: string;
  end_date: string;
  Provider_id: number;
  ClientGroup_id: number;
  RequestState_id: number;
}

export interface GroupedRequest {
  Request_id: number;
  Request_created_at: Date;
  RequestState_name: string;
  ClientGroup_name: string;
  Client_name: string;
  Provider_name: string;
  items: Datum[];
  pagado: boolean; 
}

export function useGetrequesthistory() {
  const [filters, setFilters] = useState<RequestHistoryFilters>({
    start_date: "2026-01-01 00:00:00",
    end_date: "2026-02-01 00:00:00",
    Provider_id: 0,
    ClientGroup_id: 0,
    RequestState_id: 0,
  });

  const [data, setData] = useState<GroupedRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await GetRequestHistory(
        filters.start_date,
        filters.end_date,
        filters.Provider_id,
        filters.ClientGroup_id,
        filters.RequestState_id,
      );

      const grouped = response.data.reduce((acc, curr) => {
        const existing = acc.find((r) => r.Request_id === curr.Request_id);
        if (existing) {
          existing.items.push(curr);
        } else {
  
          const isPaid = curr.PaymentType_name === "Efectivo";

          acc.push({
            Request_id: curr.Request_id,
            Request_created_at: curr.Request_created_at,
            RequestState_name: curr.RequestState_name,
            ClientGroup_name: curr.ClientGroup_name,
            Client_name: curr.Client_name,
            Provider_name: curr.Provider_name,
            pagado: isPaid,
            items: [curr],
          });
        }
        return acc;
      }, [] as GroupedRequest[]);

      setData(grouped);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching history");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {

    if (filters.start_date && filters.end_date) {
      fetchHistory();
    }
  }, [fetchHistory]);

  const updateFilter = (key: keyof RequestHistoryFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return {
    data,
    loading,
    error,
    filters,
    updateFilter,
    refetch: fetchHistory,
  };
}
