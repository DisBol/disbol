import { GetClientTypeResponse } from "../../interfaces/clientes/getclienttype.interface";
import { apiCall } from "../apiClient";

export async function GetClientTypes(): Promise<GetClientTypeResponse> {
  return apiCall("getclienttype", { active: "true" });
}
