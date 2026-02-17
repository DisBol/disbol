import { apiCall } from "../../configuraciones/services/apiClient";
import { AddAssignmentStageResponse } from "../interfaces/addassignmentstage.interface";

export async function AddAssignmentStage(
  position: string,
  in_container: number,
  out_container: number,
  units: number,
  container: number,
  payment: string,
  Assignment_id: string,
): Promise<AddAssignmentStageResponse> {
  return apiCall("addassignmentstage", {
    position,
    in_container,
    out_container,
    units,
    container,
    payment,
    active: "true",
    Assignment_id,
  });
}
