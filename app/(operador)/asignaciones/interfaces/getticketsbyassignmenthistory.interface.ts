export interface GetTicketBayAssignmentHistoryResponse {
    data: Datum[];
    metadata: Metadata;
}

export interface Datum {
    Assignment_id: number;
    AssignmentStage_id: number;
    AssignmentStage_position: number;
    Tickets_id: number;
    Tickets_code: string;
    Tickets_total_container: number;
    Tickets_total_units: number;
    Tickets_deferred_payment: number;
    Tickets_product_payment: number;
    ProductAssignment_id: number;
    ProductAssignment_container: number;
    ProductAssignment_units: number;
    ProductAssignment_menudencia: number;
    ProductAssignment_net_weight: number;
    ProductAssignment_gross_weight: number;
    ProductAssignment_payment: number;
    Category_id: number;
    Product_id: number;
    Product_name: string;
    total_container: number;
    total_units: number;
}

export interface Metadata {
    connectedMs: number;
    executedMs: number;
    elapsedMs: number;
    functionPreparedMs: number;
    functionConnectedMs: number;
    functionExecutedMs: number;
}
