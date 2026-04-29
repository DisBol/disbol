import { apiCall } from "../../configuraciones/services/apiClient";
import { UpdateTicketsWeighingResponse } from "../interfaces/updateticketsweighing";

export async function UpdateTicketsWeighing(
  id: number,
  net_weight: number,
  gross_weight: number,
  units: number,
  container: number,
  Container_id: number,
  active: string,
): Promise<UpdateTicketsWeighingResponse> {
  return apiCall("updateticketsweighing", {
    id,
    net_weight,
    gross_weight,
    units,
    container,
    Container_id,
    active,
  });
}
