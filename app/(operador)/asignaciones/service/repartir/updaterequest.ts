import { apiCall } from "@/app/(operador)/configuraciones/services/apiClient";
import { UpdateRequestResponse } from "../../interfaces/repartir/updaterequest.interface";

export async function UpdateRequest(
  id: number,
  active: string,
  Provider_id: number,
  Client_id: number,
  Car_id: number,
  Employee_id: number,
): Promise<UpdateRequestResponse> {
  return apiCall("updaterequest", {
    id,
    active,
    Provider_id,
    Client_id,
    Car_id,
    Employee_id,
  });
}
