import { GetContainerMovementsTotalByClientResponse } from "../interfaces/getcontainermovementstotalbyclient.interface";
import { apiCall } from "../../configuraciones/services/apiClient";

export async function GetContainerMovementsTotalByClient(
  containerId: number,
): Promise<GetContainerMovementsTotalByClientResponse> {
  return apiCall("getcontainermovementstotalbyclient", {
    Container_id: containerId,
  });
}
