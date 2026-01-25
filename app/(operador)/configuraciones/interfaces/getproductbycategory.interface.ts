export interface ProductByCategoryResponse {
  data: Datum[];
  metadata: Metadata;
}

export interface Datum {
  id_0: number; // Category ID
  name_0: string; // Category Name
  id: number; // Product ID
  name: string; // Product Name
}

export interface Metadata {
  connectedMs: number;
  executedMs: number;
  elapsedMs: number;
  functionPreparedMs: number;
  functionConnectedMs: number;
  functionExecutedMs: number;
}
