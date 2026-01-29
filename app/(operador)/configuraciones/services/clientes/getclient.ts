import { GetClientResponse } from "../../interfaces/clientes/getclient.interface";
import { apiCall } from "../apiClient";

export async function GetClients(): Promise<GetClientResponse> {
  return apiCall("getclient", { active: "true" });
}
