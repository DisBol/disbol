import { GetContainerMovementsProviderHistoryResponse } from "../interfaces/getcontainermovementsproviderhistory.interface";
import { apiCall } from "../../configuraciones/services/apiClient";

export async function GetContainerMovementsProviderHistory(
  startDate: string,
  endDate: string,
  providerId: number,
  containerId: number,
): Promise<GetContainerMovementsProviderHistoryResponse> {
  return apiCall("getcontainermovementsproviderhistory", {
    start_date: startDate,
    end_date: endDate,
    Provider_id: providerId,
    Container_id: containerId,
  });
}
