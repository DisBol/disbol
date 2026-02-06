import { apiCall } from "../../configuraciones/services/apiClient";
import { AddRequestResponse } from "../interfaces/addrequest.interface";

export async function AddRequest(
  Provider_id: number,
  Client_id: number,
  Car_id: number,
  Employee_id: number,
): Promise<AddRequestResponse> {
  return apiCall("addrequest", {
    Provider_id,
    Client_id,
    Car_id,
    Employee_id,
    active: "true",
  });
}
