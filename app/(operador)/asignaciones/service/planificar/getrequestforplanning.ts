import { apiCall } from "@/app/(operador)/configuraciones/services/apiClient";
import { GetRequestForPlanningResponse } from "../../interfaces/planificar/getrequestforplanning.interface";

export async function GetRequestForPlanning(): Promise<GetRequestForPlanningResponse> {
  return apiCall("getrequestforplanning", {});
}
