export interface AddProductInventoryBody {
    active: string;
    container: number;
    units: number;
    menudencia: string;
    Product_id: number;
    Container_id: number;
}

export interface AddProductInventoryResponse {
    data: Datum[];
    metadata: Metadata;
}

export interface Datum {
    ProductInventory_id: number;
}

export interface Metadata {
    connectedMs: number;
    executedMs: number;
    elapsedMs: number;
    functionPreparedMs: number;
    functionConnectedMs: number;
    functionExecutedMs: number;
}
