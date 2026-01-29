export interface GetClientResponse {
  data: Datum[];
  metadata: Metadata;
}

export interface Datum {
  id: number;
  name: string;
  document: string;
  lat: number;
  long: number;
  phone: string;
  active: string;
  created_at: Date;
  updated_at: Date;
  ClientGroup_id: number;
}

export interface Metadata {
  connectedMs: number;
  executedMs: number;
  elapsedMs: number;
  functionPreparedMs: number;
  functionConnectedMs: number;
  functionExecutedMs: number;
}
