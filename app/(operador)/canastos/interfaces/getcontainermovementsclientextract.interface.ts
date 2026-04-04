export interface GetContainerMovementsClienteExtractResponse {
    data: Datum[];
    metadata: Metadata;
}

export interface Datum {
    Client_id: number;
    Client_name: string;
    ContainerMovements_created_at: Date;
    Contenedor_name: string;
    ContainerMovements_quantity: number;
    Request_id: number;
    Tipo_Operacion: string;
}


export interface Metadata {
    connectedMs: number;
    executedMs: number;
    elapsedMs: number;
    functionPreparedMs: number;
    functionConnectedMs: number;
    functionExecutedMs: number;
}
