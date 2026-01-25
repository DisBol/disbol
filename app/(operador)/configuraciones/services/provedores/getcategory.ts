import { CategoryResponse } from "../../interfaces/proveedores/getcategory.interface";
import { apiCall } from "../apiClient";

export async function GetCategory(): Promise<CategoryResponse> {
  return apiCall("getcategory", { active: "true" });
}
