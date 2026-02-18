import { apiCall } from "../../configuraciones/services/apiClient";
import { UpdateAssignmentResponse } from "../interfaces/updateassignment.interface";

export async function UpdateAssignment(
  id: string,
  active: string,
  Provider_id: string,
): Promise<UpdateAssignmentResponse> {
  return apiCall("updateassignment", {
    id,
    active,
    Provider_id,
  });
}
