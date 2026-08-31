export interface GetRequestPaymentTypeByRequestIdResponse {
  data: Datum[];
  metadata: Metadata;
}

export interface Datum {
  Request_id: number;
  PaymentType_id: number;
  PaymentType_name: string;
  RequestPaymentType_amount: number;
  RequestPaymentType_active: string;
}

export interface Metadata {
  connectedMs: number;
  executedMs: number;
  elapsedMs: number;
  functionPreparedMs: number;
  functionConnectedMs: number;
  functionExecutedMs: number;
}
