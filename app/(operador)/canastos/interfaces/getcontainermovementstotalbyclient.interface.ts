export interface GetContainerMovementsTotalByClientResponse {
    data: Datum[];
    metadata: Metadata;
}

export interface Datum {
    Client_id: number;
    Client_name: string;
    ClientGroup_id: number;
    Group_name: string;
    Total_Canastos: number;
}

export interface Metadata {
    connectedMs: number;
    executedMs: number;
    elapsedMs: number;
    functionPreparedMs: number;
    functionConnectedMs: number;
    functionExecutedMs: number;
}
