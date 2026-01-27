export interface GetContainerResponse {
  data: Container[];
  metadata: Metadata;
}

export interface Container {
  id: number;
  name: string;
  destare: number;
  deff: string | number | boolean;
  active: string | number | boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Metadata {
  connectedMs: number;
  executedMs: number;
  elapsedMs: number;
  functionPreparedMs: number;
  functionConnectedMs: number;
  functionExecutedMs: number;
}
