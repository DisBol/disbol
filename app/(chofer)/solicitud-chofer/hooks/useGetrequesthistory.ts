import { useState, useEffect, useCallback } from "react";
import { Datum } from "../interfaces/getrequesthistory.interface";
import { GetRequestHistory } from "../service/getrequesthistory";

export interface RequestHistoryFilters {
  start_date: string;
  end_date: string;
  Provider_id: number;
  ClientGroup_id: number;
  RequestState_id: number;
  Client_id?: number;
}

export interface GroupedRequest {
  Request_id: number;
  Request_created_at: Date;
  RequestState_name: string;
  ClientGroup_name: string;
  Client_name: string;
  Provider_name: string;
  Provider_id: number;
  Client_id: number;
  CategoryProvider_id: number;
  items: Datum[];
  pagado: boolean;
  RequestStage_payment?: number;
  PaymentType_name?: string;
}

export function useGetrequesthistory() {
  const formatDate = (date: Date, isEnd = false) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const time = isEnd ? "23:59:59" : "00:00:00";
    return `${year}-${month}-${day} ${time}`;
  };

  const getDateWindow = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    return {
      start_date: formatDate(today, false),
      end_date: formatDate(tomorrow, true),
    };
  };

  const [data, setData] = useState<GroupedRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { start_date, end_date } = getDateWindow();

      const response = await GetRequestHistory(
        start_date,
        end_date,
        0,
        0,
        0,
        0,
      );

      const grouped = response.data.reduce((acc, curr) => {
        // Solo procesamos y agrupamos los items que estén en el RequestStage_position 1
        if (Number(curr.RequestStage_position) !== 1) return acc;

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
            Provider_id: curr.Provider_id,
            Client_id: curr.Client_id,
            CategoryProvider_id: curr.Request_CategoryProvider_id,
            pagado: isPaid,
            RequestStage_payment: curr.RequestStage_payment,
            PaymentType_name: String(curr.PaymentType_name),
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
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    data,
    loading,
    error,
    refetch: fetchHistory,
  };
}
