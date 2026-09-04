export interface CategoryResponse {
    data:     Datum[];
    metadata: Metadata;
}

export interface Datum {
    id:         number;
    name_0:     string;
    active:     string;
    created_at: Date;
    updated_at: Date;
    CategoryUnit_id: string;
    unit:       string;
    name:       string;
}

export interface Metadata {
    connectedMs:         number;
    executedMs:          number;
    elapsedMs:           number;
    functionPreparedMs:  number;
    functionConnectedMs: number;
    functionExecutedMs:  number;
}
