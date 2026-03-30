import { apiCall } from "@/app/(operador)/configuraciones/services/apiClient";
import { GetProductInventoryContainerResponse } from "@/app/(operador)/asignaciones/interfaces/inventario/getproductinventorycontainer.interface";

export async function GetProductInventoryContainer(
  Container_id: number,
): Promise<GetProductInventoryContainerResponse> {
  return apiCall("getproductinventorycontainer", { Container_id });
}
