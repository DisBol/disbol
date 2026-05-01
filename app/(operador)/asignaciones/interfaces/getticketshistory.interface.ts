export interface GetTicketsHistoryResponse {
    data: Datum[];
    metadata: Metadata;
}

export interface Datum {
    Tickets_id: number;
    Tickets_code: string;
    Tickets_deferred_payment: number | string;
    Tickets_product_payment: number;
    Tickets_ticket_payment?: number;
    Account_id?: number;
    Account_code?: string;
    Account_name?: string;
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
    TicketsWeighing_id: number;
    TicketsWeighing_net_weight: number;
    TicketsWeighing_gross_weight: number;
    TicketsWeighing_container: number;
    TicketsWeighing_units: number;
    TicketsWeighing_Container_id: number;
    Container_name: string;
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
