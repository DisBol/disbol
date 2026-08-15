export interface UpdateEmpresaStageResponse {
  data: UpdateEmpresaStageData;
  metadata: Metadata;
}

export interface UpdateEmpresaStageData {
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
