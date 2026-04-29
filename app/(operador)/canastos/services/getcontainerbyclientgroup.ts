import { GetContainerByClientGroupResponse } from "../interfaces/getcontainerbyclientgroup.interface";
import { apiCall } from "../../configuraciones/services/apiClient";

export async function GetContainerByClientGroup(
  containerId: number,
): Promise<GetContainerByClientGroupResponse> {
  return apiCall("getcontainerbyclientgroup", { Container_id: containerId });
}
