import { apiCall } from "@/app/(operador)/configuraciones/services/apiClient";
import { AddEmployeeResponse } from "../interface/addemployee.interface";


export async function AddEmployee(
    name: string,
    document: string,
    active: string = "true",
    Position_id: number = 3,
    amount: number = 0,
): Promise<AddEmployeeResponse> {
    const payload: Record<string, unknown> = {
        name,
        document,
        active,
        Position_id,
        amount,
    };

    return apiCall("addemployee", payload);
}
