export interface GetContainerByClientGroupResponse {
    data: Datum[];
    metadata: Metadata;
}

export interface Datum {
    Group_id: number;
    Group_name: string;
    Total_Containers: number;
}

export interface Metadata {
    connectedMs: number;
    executedMs: number;
    elapsedMs: number;
    functionPreparedMs: number;
    functionConnectedMs: number;
    functionExecutedMs: number;
}
