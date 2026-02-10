import { apiCall } from "../../configuraciones/services/apiClient";
import { GetAssignmentHistoryResponse } from "../interfaces/getassignmenthistory.interface";

export async function GetAssignmentHistory(
  start_date: string,
  end_date: string,
  Provider_id: number,
): Promise<GetAssignmentHistoryResponse> {
  return apiCall("getassignmenthistory", {
    start_date,
    end_date,
    Provider_id,
    active: "true",
  });
}
