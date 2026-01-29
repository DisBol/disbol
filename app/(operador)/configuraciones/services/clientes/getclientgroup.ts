import { GetClientGroupResponse } from "../../interfaces/clientes/getclientgroup.interface";
import { apiCall } from "../apiClient";

export async function GetClientGroups(): Promise<GetClientGroupResponse> {
  return apiCall("getclientgroup", { active: "true" });
}
