import { UpdateClientGroupResponse } from "../../interfaces/clientes/updateclientgroup.interface";
import { apiCall } from "../apiClient";

export async function UpdateClientGroup(
  id: number,
  name: string,
  idCerca: string,
  active: string,
): Promise<UpdateClientGroupResponse> {
  return apiCall("updateclientgroup", {
    id,
    name,
    idCerca,
    active,
  });
}
