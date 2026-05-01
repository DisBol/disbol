import { useState, useEffect, useCallback } from "react";
import { Datum } from "@/app/(operador)/solicitudes/interfaces/getrequesthistory.interface";
import { GetRequestHistory } from "@/app/(operador)/solicitudes/service/getrequesthistory";

export interface SolicitudChoferFilters {
  start_date: string;
  end_date: string;
}

export interface ProductoChofer {
  nombre: string;
  categoria: string;
  cajas: number;
  unidades: number;
  menudencia: string;
}

export interface SolicitudChofer {
  Request_id: number;
  Client_id: number;
  Provider_id: number;
  Client_name: string;
  Provider_name: string;
  ClientGroup_name: string;
  RequestState_name: string;
  PaymentType_name: string;
  RequestStage_payment: number;
  items: ProductoChofer[];
}

function getTodayFormatted(isEnd = false) {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day} ${isEnd ? "23:59:59" : "00:00:00"}`;
}

export function useGetSolicitudesChofer() {
  const [filters, setFilters] = useState<SolicitudChoferFilters>({
    start_date: getTodayFormatted(false),
    end_date: getTodayFormatted(true),
  });

  const [data, setData] = useState<SolicitudChofer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSolicitudes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await GetRequestHistory(
        filters.start_date,
        filters.end_date,
        0,
        0,
        0,
      );

      const grouped = response.data.reduce((acc, curr: Datum) => {
        // Solo position 2
        if (Number(curr.RequestStage_position) !== 2) return acc;
        // Solo estados ENVIADO y ENTREGADO
        if (
          curr.RequestState_name !== "ENVIADO" &&
          (curr.RequestState_name as string) !== "ENTREGADO"
        )
          return acc;

        const existing = acc.find((r) => r.Request_id === curr.Request_id);
        if (existing) {
          existing.items.push({
            nombre: curr.Product_name,
            categoria: curr.Category_name,
            cajas: curr.ProductRequest_containers,
            unidades: curr.ProductRequest_units,
            menudencia: curr.ProductRequest_menudencia,
          });
        } else {
          acc.push({
            Request_id: curr.Request_id,
            Client_id: curr.Client_id,
            Provider_id: curr.Provider_id,
            Client_name: curr.Client_name,
            Provider_name: curr.Provider_name,
            ClientGroup_name: curr.ClientGroup_name,
            RequestState_name: curr.RequestState_name,
            PaymentType_name: curr.PaymentType_name,
            RequestStage_payment: curr.RequestStage_payment ?? 0,
            items: [
              {
                nombre: curr.Product_name,
                categoria: curr.Category_name,
                cajas: curr.ProductRequest_containers,
                unidades: curr.ProductRequest_units,
                menudencia: curr.ProductRequest_menudencia,
              },
            ],
          });
        }
        return acc;
      }, [] as SolicitudChofer[]);

      setData(grouped);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar solicitudes",
      );
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchSolicitudes();
  }, [fetchSolicitudes]);

  const updateFilter = (key: keyof SolicitudChoferFilters, value: string) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  return {
    data,
    loading,
    error,
    filters,
    updateFilter,
    refetch: fetchSolicitudes,
  };
}
