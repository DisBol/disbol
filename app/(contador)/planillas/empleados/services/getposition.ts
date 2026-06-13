import { apiCall } from "@/app/(operador)/configuraciones/services/apiClient";

export interface PositionItem {
    id: number;
    name: string;
    active: string;
    created_at: string;
    updated_at: string;
}

export interface GetPositionResponse {
    data: PositionItem[];
    metadata: {
        connectedMs: number;
        executedMs: number;
        elapsedMs: number;
        functionPreparedMs: number;
        functionConnectedMs: number;
        functionExecutedMs: number;
    };
}

export async function GetPosition(
    active: string = "true",
): Promise<GetPositionResponse> {
    return apiCall("getposition", { active });
}