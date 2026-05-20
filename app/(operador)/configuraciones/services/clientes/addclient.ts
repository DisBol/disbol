import { AddClientResponse } from "../../interfaces/clientes/addclient.interface";
import { apiCall } from "../apiClient";

export async function AddClient(
  name: string,
  document: string,
  lat: number,
  long: number,
  phone: string,
  ClientGroup_id: string,
  ClientType_id?: string,
): Promise<AddClientResponse> {
  const payload: Record<string, unknown> = {
    name,
    document,
    lat,
    long,
    phone,
    active: "true",
    ClientGroup_id,
  };

  if (ClientType_id) payload.ClientType_id = ClientType_id;

  return apiCall("addclient", payload);
}
