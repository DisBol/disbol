import { AddProviderResponse } from "../../interfaces/proveedores/addprovider.interface";
import { apiCall } from "../apiClient";

export async function AddProvider(name: string): Promise<AddProviderResponse> {
  return apiCall("addprovider", { name, active: "true" });
}
