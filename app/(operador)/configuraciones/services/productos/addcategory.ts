import { apiCall } from "../apiClient";
import {
  CategoryAddRequest,
  CategoryAddResponse,
} from "../../interfaces/productos/addcategory.interface";

export async function AddCategory(
  categoryData: CategoryAddRequest,
): Promise<CategoryAddResponse> {
  return apiCall("addcategory", categoryData);
}
