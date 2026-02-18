import { apiCall } from "../../configuraciones/services/apiClient";
import { AddAssignmentResponse } from "../interfaces/addassignment.interface";

export async function AddAssignment(
  Provider_id: string,
): Promise<AddAssignmentResponse> {
  return apiCall("addassignment", {
    active: "true",
    Provider_id,
  });
}
