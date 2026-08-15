import { apiCall } from "../../configuraciones/services/apiClient";
import { GetEmpresaStageByAssignmentResponse } from "../interfaces/getempresastagebyassignment.interface";

export async function GetEmpresaStageByAssignment(
  Assignment_id: number,
): Promise<GetEmpresaStageByAssignmentResponse> {
  return apiCall("getempresastagebyassignment", {
    Assignment_id,
  });
}
