export interface GetTemployeeDriverResponse {
    data: Datum[];
    metadata: Metadata;
}

export interface Datum {
    id: number;
    name: string;
    document: string;
    active: string;
    created_at: Date;
    updated_at: Date;
    Position_id: number;
}

export interface Metadata {
    connectedMs: number;
    executedMs: number;
    elapsedMs: number;
    functionPreparedMs: number;
    functionConnectedMs: number;
    functionExecutedMs: number;
}
