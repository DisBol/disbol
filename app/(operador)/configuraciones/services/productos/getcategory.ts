import { CategoryResponse } from "../../interfaces/productos/getcategory.interface";
import { apiCall } from "../apiClient";

export async function GetCategories(): Promise<CategoryResponse> {
  return apiCall("getcategory", { active: "true" });
}
