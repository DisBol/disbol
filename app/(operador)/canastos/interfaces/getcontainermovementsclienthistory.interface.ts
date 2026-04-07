export interface GetContainerMovementsClientHistoryResponse {
  data: Datum[];
  metadata: Metadata;
}

export interface Datum {
  ContainerMovements_id: number;
  ContainerMovements_quantity: number;
  ContainerMovements_created_at: Date;
  Container_id: number;
  Container_name: string;
  Client_id: number;
  Client_name: string;
  ClientGroup_id: number;
  ClientGroup_name: string;
  RequestStage_in_container: number;
  RequestStage_out_container: number;
}

export interface Metadata {
  connectedMs: number;
  executedMs: number;
  elapsedMs: number;
  functionPreparedMs: number;
  functionConnectedMs: number;
  functionExecutedMs: number;
}
