export interface GetInventoryByContainerResponse {
    data: Datum[];
    metadata: Metadata;
}

export interface Datum {
    "sum(container)": number;
}

export interface Metadata {
    connectedMs: number;
    executedMs: number;
    elapsedMs: number;
    functionPreparedMs: number;
    functionConnectedMs: number;
    functionExecutedMs: number;
}
