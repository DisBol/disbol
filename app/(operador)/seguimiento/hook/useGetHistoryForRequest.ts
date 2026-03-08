import { useState, useEffect } from "react";
import { GetRequestHistory } from "@/app/(operador)/solicitudes/service/getrequesthistory";
import { Datum } from "@/app/(operador)/solicitudes/interfaces/getrequesthistory.interface";
import { GroupedRequest } from "@/app/(operador)/solicitudes/hooks/useGetrequesthistory";

export function useGetHistoryForRequest(
  createdAt?: string,
  providerId?: number,
  clientGroupId?: number,
) {
  const [stops, setStops] = useState<GroupedRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    if (!createdAt) {
      setStops([]);
      return;
    }

    const fetchIt = async () => {
      setLoading(true);
      setError(null);
      try {
        const dateStr = String(createdAt).split("T")[0];
        const day = dateStr.split(" ")[0];

        const res = await GetRequestHistory(
          day + " 00:00:00",
          day + " 23:59:59",
          providerId || 0,
          clientGroupId || 0,
          0,
          0,
        );

        if (isMounted) {
          const grouped = res.data.reduce((acc, curr) => {
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
                pagado: isPaid,
                RequestStage_payment: curr.RequestStage_payment,
                PaymentType_name: String(curr.PaymentType_name),
                items: [curr],
              });
            }
            return acc;
          }, [] as GroupedRequest[]);

          setStops(grouped);
        }
      } catch (err: any) {
        if (isMounted) setError(err.message || "Error al obtener el historial");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchIt();

    return () => {
      isMounted = false;
    };
  }, [createdAt, providerId, clientGroupId]);

  return { stops, loading, error };
}
