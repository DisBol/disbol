import { apiCall } from "../../configuraciones/services/apiClient";
import { GetEmpresaByAssignmentResponse } from "../interfaces/getempresabyassignement.interface";

export async function GetEmpresaByAssignment(
  Assignment_id: number,
): Promise<GetEmpresaByAssignmentResponse> {
  return apiCall("getempresabyassignement", {
    Assignment_id,
  });
}
