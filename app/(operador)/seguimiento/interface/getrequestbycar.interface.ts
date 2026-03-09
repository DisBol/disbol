export interface GetRequestByCarResponse {
  data: Datum[];
  metadata: Metadata;
}

export interface Datum {
  ClientGroup_id: number;
  ClientGroup_name: string;
  Employee_id: number;
  Employee_name: string;
  Client_name: string;
  Client_lat: number;
  Client_long: number;
  Provider_id: number;
  Provider_name: string;
  Car_id: number;
  Car_name: string;
  Request_id: number;
  RequestState_name: string;
  PaymentType_name: string;
  RequestStage_in_container: number;
  RequestStage_out_container: number;
  RequestStage_payment: number;
  Request_created_at: Date;
}

export interface Metadata {
  connectedMs: number;
  executedMs: number;
  elapsedMs: number;
  functionPreparedMs: number;
  functionConnectedMs: number;
  functionExecutedMs: number;
}
