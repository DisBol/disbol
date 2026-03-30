import { apiCall } from "../../configuraciones/services/apiClient";
import { AddRequestResponse } from "../interfaces/addrequest.interface";

export async function AddRequest(
  CategoryProvider_id: number,
  Client_id: number,
): Promise<AddRequestResponse> {
  return apiCall("addrequest", {
    CategoryProvider_id,
    Client_id,
    Car_id: 1,
    Employee_id: 1,
    active: "true",
  });
}
