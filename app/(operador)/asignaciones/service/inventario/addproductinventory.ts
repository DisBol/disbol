import { apiCall } from "@/app/(operador)/configuraciones/services/apiClient";
import {
    AddProductInventoryBody,
    AddProductInventoryResponse,
} from "@/app/(operador)/asignaciones/interfaces/inventario/addproductinventory.interface";

export async function AddProductInventory(
    body: AddProductInventoryBody,
): Promise<AddProductInventoryResponse> {
    return apiCall("addproductinventory", body as unknown as Record<string, unknown>);
}
