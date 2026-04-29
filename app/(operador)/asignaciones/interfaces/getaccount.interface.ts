export interface Account {
  id: number;
  name: string;
  active: string;
  created_at: string;
  updated_at: string;
  code: string;
  CenterCost_id: number;
  Elements_id: number;
}

export interface GetAccountResponse {
  data: Account[];
  metadata: Metadata;
}

export interface Metadata {
  connectedMs: number;
  executedMs: number;
  elapsedMs: number;
  functionPreparedMs: number;
  functionConnectedMs: number;
  functionExecutedMs: number;
}
