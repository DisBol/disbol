import { apiCall } from "../../configuraciones/services/apiClient";
import { AddTicketsWeighingResponse } from "../interfaces/addticketsweighing.interface";

export async function AddTicketsWeighing(
  weight: number,
  units: number,
  container: number,
  ProductAssignment_id: string,
): Promise<AddTicketsWeighingResponse> {
  return apiCall("addticketsweighing", {
    weight,
    units,
    container,
    active: "true",
    ProductAssignment_id,
  });
}
