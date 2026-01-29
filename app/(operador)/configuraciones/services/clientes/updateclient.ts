import { UpdateClientResponse } from "../../interfaces/clientes/updateclient.interface";
import { apiCall } from "../apiClient";

export async function UpdateClient(
  id: number,
  name: string,
  document: string,
  lat: number,
  long: number,
  phone: string,
  active: string,
  ClientGroup_id: string,
): Promise<UpdateClientResponse> {
  return apiCall("updateclient", {
    id,
    name,
    document,
    lat,
    long,
    phone,
    active,
    ClientGroup_id,
  });
}
