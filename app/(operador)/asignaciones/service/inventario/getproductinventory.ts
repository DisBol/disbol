import { apiCall } from "@/app/(operador)/configuraciones/services/apiClient";
import { GetProductInventoryResponse } from "@/app/(operador)/asignaciones/interfaces/inventario/getproductinventory.interface";

export async function GetProductInventory(): Promise<GetProductInventoryResponse> {
  return apiCall("getproductinventory", {});
}
