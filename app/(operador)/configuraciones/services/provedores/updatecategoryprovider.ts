import { apiCall } from "@/app/(operador)/configuraciones/services/apiClient";
import { UpdateCategoryproviderResponse } from "../../interfaces/proveedores/updatecategoryprovider.interface";

export async function updatecategoryprovider(
  id: number,
  active: string,
): Promise<UpdateCategoryproviderResponse | null> {
  return apiCall("updatecategoryprovider", {
    id,
    CategoryProvider_id: id,
    active,
  });
}
