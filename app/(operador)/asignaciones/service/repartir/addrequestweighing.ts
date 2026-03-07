import { apiCall } from "@/app/(operador)/configuraciones/services/apiClient";
import { AddRequestWeighingResponse } from "../../interfaces/repartir/addrequestweighing.interface";

export async function AddRequestWeighing(
  weight: number,
  units: number,
  container: number,
  active: string,
  ProductRequest_id: number,
): Promise<AddRequestWeighingResponse> {
  return apiCall("addrequestweighing", {
    weight,
    units,
    container,
    active,
    ProductRequest_id,
  });
}
