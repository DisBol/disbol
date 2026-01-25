import { AddCategoryProviderResponse } from "../../interfaces/proveedores/addcategoryprovider";
import { apiCall } from "../apiClient";

export async function AddCategoryProvider(
  providerId: number,
  categoryId: number
): Promise<AddCategoryProviderResponse> {
  return apiCall("addcategoryprovider", {
    Provider_id: providerId,
    Category_id: categoryId,
    active: "true",
  });
}
