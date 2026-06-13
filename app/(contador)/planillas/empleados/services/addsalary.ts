import { apiCall } from "@/app/(operador)/configuraciones/services/apiClient";
import { AddSalaryResponse } from "../interface/addsalary.interface";

export async function AddSalary(
    amount: number,
    Employee_id: number,
    active: string = "true",
): Promise<AddSalaryResponse> {
    const payload: Record<string, unknown> = {
        amount,
        Employee_id,
        active,
    };

    return apiCall("addsalary", payload);
}
