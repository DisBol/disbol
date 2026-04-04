import { GetContainerMovementsClienteExtractResponse } from "../interfaces/getcontainermovementsclientextract.interface";
import { apiCall } from "../../configuraciones/services/apiClient";

export async function GetContainerMovementsClientExtract(
  clientId: number,
  containerId: number,
): Promise<GetContainerMovementsClienteExtractResponse> {
  return apiCall("getcontainermovementsclientextract", {
    client_id: clientId,
    Container_id: containerId,
  });
}
