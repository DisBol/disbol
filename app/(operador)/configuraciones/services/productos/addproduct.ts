import {
  AddProductRequest,
  AddProductResponse,
} from "../../interfaces/productos/addproduct.interface";
import { apiCall } from "../apiClient";

export async function AddProduct(
  productData: AddProductRequest,
): Promise<AddProductResponse> {
  return apiCall("addproduct", productData);
}
