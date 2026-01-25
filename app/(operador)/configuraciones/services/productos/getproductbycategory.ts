import { ProductByCategoryResponse } from "../../interfaces/productos/getproductbycategory.interface";
import { apiCall } from "../apiClient";

export async function GetProductByCategory(): Promise<ProductByCategoryResponse> {
  return apiCall("getproductbycategory", { active: "true" });
}
