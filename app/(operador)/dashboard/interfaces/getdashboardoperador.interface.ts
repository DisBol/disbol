export interface GetDashboardOperadorResponse {
  data: Datum[];
  metadata: Metadata;
}

// ventas_por_cliente y pedidos_por_categoria llegan como texto JSON
export interface Datum {
  entregas_hoy: number;
  entregas_ayer: number;
  solicitudes_hoy: number;
  solicitudes_ayer: number;
  ventas_por_cliente: string | VentaCliente[];
  pedidos_por_categoria: string | PedidoCategoria[];
}

export interface VentaCliente {
  Client_id: number;
  Client_name: string;
  total: number;
}

export interface PedidoCategoria {
  Category_id: number;
  Category_name: string;
  units: number;
  containers: number;
}

export interface Metadata {
  connectedMs: number;
  executedMs: number;
  elapsedMs: number;
  functionPreparedMs: number;
  functionConnectedMs: number;
  functionExecutedMs: number;
}
