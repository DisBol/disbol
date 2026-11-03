import { useCallback, useEffect, useState } from "react";
import { GetDashboardOperador } from "../service/getdashboardoperador";
import {
  PedidoCategoria,
  VentaCliente,
} from "../interfaces/getdashboardoperador.interface";
import { useContainer } from "@/app/(operador)/configuraciones/hooks/contenedores/useContainer";
import { useGetContainerMovementsTotalByClient } from "@/app/(operador)/canastos/hooks/useGetContainerMovementsTotalByClient";

export interface DashboardOperadorData {
  entregasHoy: number;
  entregasAyer: number;
  solicitudesHoy: number;
  solicitudesAyer: number;
  ventasPorCliente: VentaCliente[];
  pedidosPorCategoria: PedidoCategoria[];
}

const emptyData: DashboardOperadorData = {
  entregasHoy: 0,
  entregasAyer: 0,
  solicitudesHoy: 0,
  solicitudesAyer: 0,
  ventasPorCliente: [],
  pedidosPorCategoria: [],
};

function getTodayLocal() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseJsonList<T>(value: string | T[] | null | undefined): T[] {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function useGetDashboardOperador() {
  const [data, setData] = useState<DashboardOperadorData>(emptyData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Canastos en clientes: se reutiliza la función de la pantalla Canastos
  const { containersData } = useContainer();
  const containerId = containersData?.[0]?.id ?? 0;
  const { data: canastosPorCliente, loading: loadingCanastos } =
    useGetContainerMovementsTotalByClient(containerId);
  const canastosEnClientes = canastosPorCliente.reduce(
    (sum, cliente) => sum + Number(cliente.Total_Canastos ?? 0),
    0,
  );

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await GetDashboardOperador(getTodayLocal());
      const row = response?.data?.[0];
      setData(
        row
          ? {
              entregasHoy: Number(row.entregas_hoy ?? 0),
              entregasAyer: Number(row.entregas_ayer ?? 0),
              solicitudesHoy: Number(row.solicitudes_hoy ?? 0),
              solicitudesAyer: Number(row.solicitudes_ayer ?? 0),
              ventasPorCliente: parseJsonList<VentaCliente>(
                row.ventas_por_cliente,
              ),
              pedidosPorCategoria: parseJsonList<PedidoCategoria>(
                row.pedidos_por_categoria,
              ),
            }
          : emptyData,
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar el dashboard",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    data,
    canastosEnClientes,
    loading: loading || loadingCanastos,
    error,
    refetch: fetchDashboard,
  };
}
