export interface GetProductInventoryResponse {
  data: Datum[];
  metadata: Metadata;
}

export interface Datum {
  id: number;
  active: string;
  created_at: Date;
  updated_at: Date;
  container: number;
  units: number;
  menudencia: string;
  Product_id: number;
  Container_id: number;
}

export interface Metadata {
  connectedMs: number;
  executedMs: number;
  elapsedMs: number;
  functionPreparedMs: number;
  functionConnectedMs: number;
  functionExecutedMs: number;
}
