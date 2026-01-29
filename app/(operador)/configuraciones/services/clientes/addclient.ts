import { AddClientResponse } from "../../interfaces/clientes/addclient.interface";
import { apiCall } from "../apiClient";

export async function AddClient(
  name: string,
  document: string,
  lat: number,
  long: number,
  phone: string,
  ClientGroup_id: string,
): Promise<AddClientResponse> {
  return apiCall("addclient", {
    name,
    document,
    lat,
    long,
    phone,
    active: "true",
    ClientGroup_id,
  });
}
