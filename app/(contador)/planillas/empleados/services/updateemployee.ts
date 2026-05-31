import { apiCall } from "@/app/(operador)/configuraciones/services/apiClient";
import { UpdateEmployeeResponse } from "../interface/updateemployee.interface";


export async function UpdateEmployee(
    id: number,
    name: string,
    document: string,
    active: string = "true",
    Position_id: number = 3,
): Promise<UpdateEmployeeResponse> {
    const payload: Record<string, unknown> = {
        id,
        name,
        document,
        active,
        Position_id,
    };

    return apiCall("updateemployee", payload);
}
