import { apiCall } from "../../configuraciones/services/apiClient";
import { UpdateProducteRequestResponse } from "../interfaces/updateproductrequest.interface";

export async function UpdateRequest(
  id: number,
  active: boolean,
  CategoryProvider_id: number,
  Client_id: number,
): Promise<UpdateProducteRequestResponse> {
  return apiCall("updaterequest", {
    id,
    active: String(active),
    CategoryProvider_id,
    Client_id,
    Car_id: 1,
    Employee_id: 1,
  });
}
