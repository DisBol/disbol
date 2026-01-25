export interface AddProviderResponse {
    data: ProviderData[];
    metadata: Metadata;
}

export interface ProviderData {
    provider_id: number;
}

export interface Metadata {
    connectedMs:         number;
    executedMs:          number;
    elapsedMs:           number;
    functionConnectedMs: number;
    functionExecutedMs:  number;
    functionPreparedMs:  number;
}
