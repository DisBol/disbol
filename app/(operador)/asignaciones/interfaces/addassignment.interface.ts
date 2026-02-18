export interface AddAssignmentResponse {
  data: Datum[];
  metadata: Metadata;
}

export interface Datum {
  assignment_id: number;
}

export interface Metadata {
  connectedMs: number;
  executedMs: number;
  elapsedMs: number;
  functionPreparedMs: number;
  functionConnectedMs: number;
  functionExecutedMs: number;
}
