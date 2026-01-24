import { ProductByCategoryResponse } from "../interfaces/getproductbycategory.interface";
import { apiCall } from "./apiClient";

export async function GetProductByCategory(): Promise<ProductByCategoryResponse> {
  return apiCall("getproductbycategory", { active: "true" });
}
