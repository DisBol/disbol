export interface GetProductInventoryUnitsResponse {
  data: Datum[];
  metadata: Metadata;
}

export interface Datum {
  Product_id: number;
  Product_name: string;
  Total_units: number;
}

export interface Metadata {
  connectedMs: number;
  executedMs: number;
  elapsedMs: number;
  functionPreparedMs: number;
  functionConnectedMs: number;
  functionExecutedMs: number;
}
