export interface AddAssignmentStageResponse {
  data: Datum[];
  metadata: Metadata;
}

export interface Datum {
  assignmentstage_id: number;
}

export interface Metadata {
  connectedMs: number;
  executedMs: number;
  elapsedMs: number;
  functionPreparedMs: number;
  functionConnectedMs: number;
  functionExecutedMs: number;
}
