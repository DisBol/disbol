import {
  UpdateProductRequest,
  UpdateProductResponse,
} from "../../interfaces/productos/updateproduct.interface";
import { apiCall } from "../apiClient";

export async function UpdateProduct(
  productData: UpdateProductRequest,
): Promise<UpdateProductResponse> {
  return apiCall("updateproduct", productData);
}
