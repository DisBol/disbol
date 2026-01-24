export interface CategoryProviderResponse {
    data:     Datum[];
    metadata: Metadata;
}

export interface Datum {
    id_0:   number;
    name_0: string;
    id:     number;
    name:   string;
}

export interface Metadata {
    connectedMs:         number;
    executedMs:          number;
    elapsedMs:           number;
    functionPreparedMs:  number;
    functionConnectedMs: number;
    functionExecutedMs:  number;
}
