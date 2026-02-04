import { GetClientResponse } from "../../interfaces/clientes/getclient.interface";
import { apiCall } from "../apiClient";

export async function GetClients(groupId?: number): Promise<GetClientResponse> {
  const payload = {
    active: "true",
    ClientGroup_id: groupId ?? 0,
  };
  console.log("GetClients API call with payload:", payload);
  return apiCall("getclient", payload);
}
