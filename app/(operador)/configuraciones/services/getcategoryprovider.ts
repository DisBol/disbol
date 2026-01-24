import { CategoryProviderResponse } from "../interfaces/getcategoryprovider.interface";
import { apiCall } from "./apiClient";

export async function GetCategoryProviders(): Promise<CategoryProviderResponse> {
  return apiCall("getcategoryprovider", { active: "true" });
}
