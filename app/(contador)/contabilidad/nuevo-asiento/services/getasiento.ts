import { apiCall } from "@/app/(operador)/configuraciones/services/apiClient";

export interface GetAsientoItem {
    id: number;
    description: string;
    active: string;
    amount_credit: number;
    amount_debit: number;
    created_at: string;
    updated_at: string;
    Account_id: number;
    AccountingPeriod_id: number;
    state: string | null;
    employee: number | null;
}

interface GetAsientoResponse {
    data: GetAsientoItem[];
}

export async function GetAsiento(): Promise<GetAsientoResponse> {
    return apiCall("getasiento", { active: "true" });
}