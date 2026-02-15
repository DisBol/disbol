export interface GetAssignmentHistoryResponse {
  data: Datum[];
  metadata: Metadata;
}

export interface Datum {
  Assignment_id: number;
  Assignment_created_at: Date;
  AssignmentStage_id: number;
  AssignmentStage_position: number;
  Provider_id: number;
  Provider_name: string;
  Category_id: number;
  Category_name: string;
  Ticket_id: number;
  Product_id: number;
  Product_name: string;
  ProductAssignment_units: number;
  ProductAssignment_container: number;
  ProductAssignment_menudencia: string;
  ProductAssignment_gross_weight: string;
  ProductAssignment_net_weight: string;
}

export interface Metadata {
  connectedMs: number;
  executedMs: number;
  elapsedMs: number;
  functionPreparedMs: number;
  functionConnectedMs: number;
  functionExecutedMs: number;
}
