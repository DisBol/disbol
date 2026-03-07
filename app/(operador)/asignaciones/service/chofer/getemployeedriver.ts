import { apiCall } from "@/app/(operador)/configuraciones/services/apiClient";
import { GetTemployeeDriverResponse } from "../../interfaces/chofer/getemployeedriver.interface";

export async function GetTicketHistory(



): Promise<GetTemployeeDriverResponse> {
    return apiCall("getemployeedriver", { active: "true" });
}
