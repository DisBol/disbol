import { GetContainerMovementsClientHistoryResponse } from "../interfaces/getcontainermovementsclienthistory.interface";
import { apiCall } from "../../configuraciones/services/apiClient";

export async function GetContainerMovementsClientHistory(
  startDate: string,
  endDate: string,
  clientId: number,
  clientGroupId: number,
  containerId: number,
): Promise<GetContainerMovementsClientHistoryResponse> {
  return apiCall("getcontainermovementsclienthistory", {
    start_date: startDate,
    end_date: endDate,
    Client_id: clientId,
    Clientgroup_id: clientGroupId,
    Container_id: containerId,
  });
}
