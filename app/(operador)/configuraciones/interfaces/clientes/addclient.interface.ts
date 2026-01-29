export interface AddClientResponse {
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

export interface ClientFormData {
  name: string;
  document: string;
  phone: string;
  clientGroupId: string;
  lat: number;
  lng: number;
}
