import { apiCall } from "@/app/(operador)/configuraciones/services/apiClient";
import {
  AddProductInventoryMovementsBody,
  AddProductInventoryMovementsResponse,
} from "@/app/(operador)/asignaciones/interfaces/inventario/addproductinventorymovements.interface";

export async function AddProductInventoryMovements(
  body: AddProductInventoryMovementsBody,
): Promise<AddProductInventoryMovementsResponse> {
  return apiCall("addproductinventorymovements", body as unknown as Record<string, unknown>);
}
