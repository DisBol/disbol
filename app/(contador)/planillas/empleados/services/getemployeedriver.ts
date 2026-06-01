import { apiCall } from "@/app/(operador)/configuraciones/services/apiClient";
import { GetEmployeeDriverResponse } from "../interface";


export async function GetEmployeeDriver(
    active: string = "true",
): Promise<GetEmployeeDriverResponse> {
    const payload: Record<string, unknown> = {
        active,
    };

    return apiCall("getemployee", payload);
}
