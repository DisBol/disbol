export interface GetAccountResponse {
  data: Datum[];
  metadata: Metadata;
}

export interface Datum {
  id: number;
  name: string;
  active: string;
  created_at: Date;
  updated_at: Date;
  code: string;
  CenterCost_id: number;
  Elements_id: number;
  money_type: string;
}

export interface Metadata {
  connectedMs: number;
  executedMs: number;
  elapsedMs: number;
  functionPreparedMs: number;
  functionConnectedMs: number;
  functionExecutedMs: number;
}
