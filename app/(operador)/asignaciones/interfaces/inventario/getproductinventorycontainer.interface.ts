export interface GetProductInventoryContainerResponse {
  data: Datum[];
  metadata: Metadata;
}

export interface Datum {
  Container_id: number;
  Container_name: string;
  Total_container: number;
}

export interface Metadata {
  connectedMs: number;
  executedMs: number;
  elapsedMs: number;
  functionPreparedMs: number;
  functionConnectedMs: number;
  functionExecutedMs: number;
}
