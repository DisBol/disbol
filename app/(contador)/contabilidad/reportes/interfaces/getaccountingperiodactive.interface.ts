export interface GetAccountingPeriodActiveResponse {
  data: Datum[];
  metadata: Metadata;
}

export interface Datum {
  id: number;
  name: string;
  active: string;
  created_at: Date;
  updated_at: Date;
  User_id: number;
  User_name: string;
}

export interface Metadata {
  connectedMs: number;
  executedMs: number;
  elapsedMs: number;
  functionPreparedMs: number;
  functionConnectedMs: number;
  functionExecutedMs: number;
}
