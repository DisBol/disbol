export interface GetContainerMovementsProviderHistoryResponse {
  data: Datum[];
  metadata: Metadata;
}

export interface Datum {
  ContainerMovements_id: number;
  ContainerMovements_quantity: number;
  ContainerMovements_created_at: Date;
  Container_id: number;
  Container_name: string;
  Provider_name: string;
  AssigmentStage_in_container: number;
  AssignmentStage_out_container: number;
}

export interface Metadata {
  connectedMs: number;
  executedMs: number;
  elapsedMs: number;
  functionPreparedMs: number;
  functionConnectedMs: number;
  functionExecutedMs: number;
}
