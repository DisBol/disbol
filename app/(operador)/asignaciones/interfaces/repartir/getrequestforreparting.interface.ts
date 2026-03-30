export interface GetRequestForrepartingResponse {
  data: Datum[];
  metadata: Metadata;
}

export interface Datum {
  Request_id: number;
  Request_created_at: Date;
  RequestStage_position: number;
  Request_CategoryProvider_id: number;
  RequestState_name: string;
  PaymentType_name: string;
  ClientGroup_id: number;
  ClientGroup_name: string;
  Client_id: number;
  Client_name: string;
  Provider_id: number;
  Provider_name: string;
  Category_id: number;
  Category_name: string;
  ProductRequest_id: number;
  Product_id: number;
  Product_name: string;
  ProductRequest_units: number;
  ProductRequest_containers: number;
  ProductRequest_menudencia: string;
}

export interface Metadata {
  connectedMs: number;
  executedMs: number;
  elapsedMs: number;
  functionPreparedMs: number;
  functionConnectedMs: number;
  functionExecutedMs: number;
}
