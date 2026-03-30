export interface AddProductInventoryMovementsBody {
  active: string;
  Assignment_id: number | null;
  ProductInventory_id: number;
  Request_id: number | null;
  Container_id: number | null;
  container: number;
  units: number;
}

export interface AddProductInventoryMovementsResponse {
    data: string;
    metadata: Metadata;
}

export interface Metadata {
    connectedMs: number;
    executedMs: number;
    elapsedMs: number;
    functionPreparedMs: number;
    functionConnectedMs: number;
    functionExecutedMs: number;
}
