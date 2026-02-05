import { GerProviderResponse } from "../../interfaces/proveedores/getprovider.interface";
import { apiCall } from "../apiClient";

export async function GetProvider(): Promise<GerProviderResponse> {
  return apiCall("getprovider", { active: "true" });
}
