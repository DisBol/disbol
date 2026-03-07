import { apiCall } from "@/app/(operador)/configuraciones/services/apiClient";
import { GetRequestForrepartingResponse } from "@/app/(operador)/asignaciones/interfaces/repartir/getrequestforreparting.interface";

export async function GetRequestForreparting(): Promise<GetRequestForrepartingResponse> {
  return apiCall("getrequestforreparting", {});
}
