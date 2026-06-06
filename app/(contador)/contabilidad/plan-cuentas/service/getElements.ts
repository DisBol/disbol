import { apiCall } from "../../../../(operador)/configuraciones/services/apiClient";
import { GetElementsResponse } from "../interfaces/getelements.interface";

export async function GetElements(): Promise<GetElementsResponse> {
  return apiCall("getelements", {
    active: "true",
  });
}
