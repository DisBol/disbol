export interface GetRoleResponse {
  data: Datum[];
  metadata: Metadata;
}

export interface Datum {
  id: number;
  name: string;
  active: string;
  created_at: Date;
  updated_at: Date;
}

export interface Metadata {
  connectedMs: number;
  executedMs: number;
  elapsedMs: number;
  functionPreparedMs: number;
  functionConnectedMs: number;
  functionExecutedMs: number;
}
