import { apiCall } from "@/app/(operador)/configuraciones/services/apiClient";
import { AddRequestStageResponse } from "../interfaces/addrequeststage.interface";

export async function AddRequestStage(
  position: number,
  in_container: number,
  out_container: number,
  units: number,
  container: number,
  payment: number,
  Request_id: number,
): Promise<AddRequestStageResponse> {
  return apiCall("addrequeststage", {
    position,
    in_container,
    out_container,
    units,
    container,
    payment,
    active: "true",
    Request_id,
  });
}
