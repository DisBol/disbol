import { apiCall } from "@/app/(operador)/configuraciones/services/apiClient";
import { AddRequestRequestSatateResponse } from "@/app/(operador)/solicitudes/interfaces/addrequestrequeststate.interface";

export async function UpdateRequestRequestState(
  Request_id: number,
): Promise<AddRequestRequestSatateResponse> {
  return apiCall("addrequestrequeststate", {
    RequestState_id: 2,
    Request_id,
    active: "true",
  });
}
