export interface GetRequestHistoryResponse {
  data: Datum[];
  metadata: Metadata;
}

export interface Datum {
  Request_id: number;
  Request_created_at: Date;
  RequestStage_position: number;
  RequestState_name: RequestStateName;
  PaymentType_name: PaymentTypeName;
  ClientGroup_name: ClientGroupName;
  Client_name: ClientName;
  Provider_id: number;
  Client_id: number;
  Provider_name: ProviderName;
  Category_id: number;
  Category_name: CategoryName;
  ProductRequest_id: number;
  Product_id: number;
  Product_name: string;
  ProductRequest_units: number;
  ProductRequest_containers: number;
  ProductRequest_menudencia: string;
}

export enum CategoryName {
  PolloSofia = "POLLO SOFIA",
}

export enum ClientGroupName {
  RutaCejaEdit = "Ruta Ceja edit",
}

export enum ClientName {
  ClienteCeja2 = "cliente ceja 2",
  ClientePruebaEditado = "cliente prueba editado",
}

export enum PaymentTypeName {
  Efectivo = "Efectivo",
  NoPagado = "No Pagado",
}

export enum ProviderName {
  Sofia = "SOFIA",
}

export enum RequestStateName {
  Emitido = "EMITIDO",
  Enviado = "ENVIADO",
}

export interface Metadata {
  connectedMs: number;
  executedMs: number;
  elapsedMs: number;
  functionPreparedMs: number;
  functionConnectedMs: number;
  functionExecutedMs: number;
}
