import { GetClientResponse } from "../../interfaces/clientes/getclient.interface";
import { apiCall } from "../apiClient";

export async function GetClients(
  groupId?: number,
  clientTypeId?: number,
): Promise<GetClientResponse> {
  const payload: Record<string, unknown> = {
    active: "true",
    ClientGroup_id: groupId ?? 0,
  };

  // Always include ClientType_id in the payload. Use 0 to mean "all types".
  payload.ClientType_id = clientTypeId ?? 0;

  console.log("GetClients API call with payload:", payload);
  return apiCall("getclient", payload);
}
