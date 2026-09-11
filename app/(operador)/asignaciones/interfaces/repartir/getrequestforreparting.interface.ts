export interface GetRequestForrepartingParams {
  CategoryProvider_id: number;
  Employee_id?: number;
}

export interface GetRequestForrepartingResponse {
  data: Datum[];
  metadata: Metadata;
}

export interface Datum {
  Request_id: number;
  Request_created_at: Date;
  Request_Employee_id?: number;
  RequestStage_id: number;
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
  CategoryUnit_unit?: string;
  CategoryUnit_name?: string;
  Employee_id?: number;
  Employee_name?: string;
  RequestStage_payment?: number;
  RequestState_out_container?: number;
  RequestState_in_container?: number;
  ProductRequest_active?: string;
}

export interface Metadata {
  connectedMs: number;
  executedMs: number;
  elapsedMs: number;
  functionPreparedMs: number;
  functionConnectedMs: number;
  functionExecutedMs: number;
}
