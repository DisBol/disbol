import { apiCall } from "../../configuraciones/services/apiClient";
import { UpdateAssignmentResponse } from "../interfaces/updateassignment.interface";

export async function UpdateAssignment(
  id: string,
  active: string,
  CategoryProvider_id: string,
  isRecibir: string,
  isPlanificar: string,
  isRepartir: string,
): Promise<UpdateAssignmentResponse> {
  return apiCall("updateassignment", {
    id,
    active,
    CategoryProvider_id,
    isRecibir,
    isPlanificar,
    isRepartir,
  });
}
