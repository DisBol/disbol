import { apiCall } from "@/app/(operador)/configuraciones/services/apiClient";
import { AddContainerMovementsResponse } from "../../interfaces/repartir/addcontainermovements";

export async function AddContainerMovements(
  quantity: number,
  active: string,
  Container_id: number,
  Request_id: number | null,
  Client_id: number | null,
  Assignment_id: number | null,
  Provider_id: number | null,
): Promise<AddContainerMovementsResponse> {
  return apiCall("addcontainermovements", {
    quantity,
    active,
    Container_id,
    Request_id,
    Client_id,
    Assignment_id,
    Provider_id,
  });
}
