import { apiCall } from "../../configuraciones/services/apiClient";
import { UpdateTicketsWeighingResponse } from "../interfaces/updateticketsweighing";

export async function UpdateTicketsWeighing(
  id: string,
  weight: number,
  units: number,
  container: number,
  active: string,
): Promise<UpdateTicketsWeighingResponse> {
  return apiCall("updateticketsweighing", {
    id,
    weight,
    units,
    container,
    active,
  });
}
