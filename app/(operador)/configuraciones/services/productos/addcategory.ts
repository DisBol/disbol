import { AddCategoryResponse } from "../../interfaces/productos/addcategory.interface";
import { apiCall } from "../apiClient";

export async function AddCategory(name: string): Promise<AddCategoryResponse> {
  return apiCall("addcategory", { name, active: "true" });
}
