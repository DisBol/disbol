import { apiCall } from "../../configuraciones/services/apiClient";
import { AddTicketsWeighingResponse } from "../interfaces/addticketsweighing.interface";

export async function AddTicketsWeighing(
  gross_weight: number,
  net_weight: number,
  units: number,
  container: number,
  Container_id: string,
  ProductAssignment_id: string,
): Promise<AddTicketsWeighingResponse> {
  return apiCall("addticketsweighing", {
    gross_weight,
    net_weight,
    units,
    container,
    active: "true",
    ProductAssignment_id,
    Container_id,
  });
}
