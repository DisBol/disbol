export interface GetAsientoResponse {
  data: Datum[];
  metadata: Metadata;
}

export interface Datum {
  id: number;
  description: string;
  active: string;
  amount_credit: number;
  amount_debit: number;
  created_at: Date;
  updated_at: Date;
  Account_id: number;
  AccountingPeriod_id: number;
  state: string | null;
  employee: number | null;
}

export interface Metadata {
  connectedMs: number;
  executedMs: number;
  elapsedMs: number;
  functionPreparedMs: number;
  functionConnectedMs: number;
  functionExecutedMs: number;
}
