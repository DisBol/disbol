import { apiCall } from "../../configuraciones/services/apiClient";
import { GetTicketBayAssignmentHistoryResponse } from "../interfaces/getticketsbyassignmenthistory.interface";

export async function GetTicketbyAssignmentHistory(
    Assignment_id: number,
): Promise<GetTicketBayAssignmentHistoryResponse> {
    return apiCall("getticketsbyassignmenthistory", {
        Assignment_id,
    });
}
