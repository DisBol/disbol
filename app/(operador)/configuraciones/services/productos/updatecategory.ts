import { UpdateCategoryResponse } from "../../interfaces/productos/updatecategory.interface";
import { apiCall } from "../apiClient";

export async function UpdateCategory(
  id: number,
  name: string,
  active: string,
): Promise<UpdateCategoryResponse> {
  return apiCall("updatecategory", { id, name, active });
}
