import { AddClientGroupResponse } from "../../interfaces/clientes/addclientgroup.interface";
import { apiCall } from "../apiClient";

export async function AddClient(
  name: string,
  idCerca: string,
): Promise<AddClientGroupResponse> {
  return apiCall("addclientgroup", {
    name,
    idCerca,
    active: "true",
  });
}
