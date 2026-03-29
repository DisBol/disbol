export interface GetProductInventoryUnitsResponse {
  data: Datum[];
  metadata: Metadata;
}

export interface Datum {
  Productinventory_id: number;
  Productinventory_active: string;
  Productinventory_units: number;
  Product_id: number;
  Product_name: string;
  Category_id: number;
  Category_name: string;
}

export interface Metadata {
  connectedMs: number;
  executedMs: number;
  elapsedMs: number;
  functionPreparedMs: number;
  functionConnectedMs: number;
  functionExecutedMs: number;
}
