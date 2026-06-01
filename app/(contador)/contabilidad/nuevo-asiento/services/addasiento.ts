import { apiCall } from "@/app/(operador)/configuraciones/services/apiClient";

export interface AddAsientoPayload {
    description: string;
    active?: string;
    amount_credit: number;
    amount_debit: number;
    Account_id: number;
    AccountingPeriod_id?: number;
}

export async function AddAsiento(
    payload: AddAsientoPayload,
): Promise<unknown> {
    return apiCall("addasiento", {
        ...payload,
        active: payload.active ?? "true",
        AccountingPeriod_id: payload.AccountingPeriod_id ?? 1,
    });
}