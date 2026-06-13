import { apiCall } from "@/app/(operador)/configuraciones/services/apiClient";
import { UpdateSalaryResponse } from "../interface/updatesalary.interface";

export async function UpdateSalary(
    id: number,
    amount: number,
    Employee_id: number,
    active: string = "true",
): Promise<UpdateSalaryResponse> {
    const payload: Record<string, unknown> = {
        id,
        amount,
        Employee_id,
        active,
    };

    return apiCall("updatesalary", payload);
}
