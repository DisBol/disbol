import { apiCall } from "@/app/(operador)/configuraciones/services/apiClient";
import { GetProductInventoryUnitsResponse } from "@/app/(operador)/asignaciones/interfaces/inventario/getproductinventoryunits.interface";

export async function GetProductInventoryUnits(
  Category_id: number,
): Promise<GetProductInventoryUnitsResponse> {
  return apiCall("getproductinventoryunits", { Category_id });
}
