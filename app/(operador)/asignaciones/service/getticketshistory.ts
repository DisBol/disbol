import { apiCall } from "../../configuraciones/services/apiClient";
import { GetTicketsHistoryResponse } from "../interfaces/getticketshistory.interface";

export async function GetTicketHistory(
  Assignment_id?: number,
): Promise<GetTicketsHistoryResponse> {
  return apiCall("getticketshistory", {
    Assignment_id,
  });
}
