import { apiCall } from "../../configuraciones/services/apiClient";
import { GetRequestHistoryResponse } from "../interfaces/getrequesthistory.interface";


export async function GetRequestHistory(
  start_date: string,
  end_date: string,
  Provider_id: number,
  ClientGroup_id: number,
  RequestState_id: number,
): Promise<GetRequestHistoryResponse> {
  return apiCall("getrequesthistory", {
    start_date,
    end_date,
    Provider_id,
    ClientGroup_id,
    RequestState_id,
    active: "true",
  });
}
