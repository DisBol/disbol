import { UpdateProviderResponse } from "../../interfaces/proveedores/updateprovider.interface";
import { apiCall } from "../apiClient";

export async function UpdateProvider(
  id: number,
  name: string,
  active: string,
): Promise<UpdateProviderResponse> {
  return apiCall("updateprovider", { id, name, active });
}
