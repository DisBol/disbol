export interface ProductByCategoryResponse {
  data: Datum[];
  metadata: Metadata;
}

export interface Datum {
  id_0: number; // Category ID
  name_0: string; // Category Name
  id: number; // Product ID
  name: string; // Product Name
  CategoryProvider_id: number; // Category Provider ID
}

export interface Metadata {
  connectedMs: number;
  executedMs: number;
  elapsedMs: number;
  functionPreparedMs: number;
  functionConnectedMs: number;
  functionExecutedMs: number;
}
