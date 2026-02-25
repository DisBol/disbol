import { apiCall } from "../../configuraciones/services/apiClient";
import { GetTicketsHistoryResponse } from "../interfaces/getticketshistory.interface";

export async function GetTicketHistory(
  Tickets_id: number,
): Promise<GetTicketsHistoryResponse> {
  return apiCall("getticketshistory", {
    Tickets_id,
  });
}
