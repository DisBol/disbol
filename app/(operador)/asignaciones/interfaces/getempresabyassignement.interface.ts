export interface GetEmpresaByAssignmentResponse {
  data: EmpresaByAssignmentDatum[];
  metadata: Metadata;
}

export interface EmpresaByAssignmentDatum {
  id: number;
  active: string;
  created_at: string;
  updated_at: string;
  Assignment_id: number;
}

export interface Metadata {
  connectedMs: number;
  executedMs: number;
  elapsedMs: number;
  functionPreparedMs: number;
  functionConnectedMs: number;
  functionExecutedMs: number;
}
