export interface UpdateTicketsWeighingResponse {
  data: Data;
  metadata: Metadata;
}

export interface Data {
  type: number;
  index: number;
  lastID: number;
  changes: number;
  totalChanges: number;
  finalized: number;
  rowId: number;
}

export interface Metadata {
  connectedMs: number;
  executedMs: number;
  elapsedMs: number;
  functionPreparedMs: number;
  functionConnectedMs: number;
  functionExecutedMs: number;
}
