import { apiCall } from "@/app/(operador)/configuraciones/services/apiClient";
import { UpdateRequestStageResponse } from "../../interfaces/repartir/updaterequeststage.interface";

export async function UpdateRequestStage(
  id: number,
  position: number,
  in_container: number,
  out_container: number,
  units: number,
  container: number,
  payment: number,
  active: string,
  Request_id: number,
): Promise<UpdateRequestStageResponse> {
  return apiCall("updaterequeststage", {
    id,
    position,
    in_container,
    out_container,
    units,
    container,
    payment,
    active,
    Request_id,
  });
}
