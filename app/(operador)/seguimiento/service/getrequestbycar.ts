import { apiCall } from "@/app/(operador)/configuraciones/services/apiClient";
import { GetRequestByCarResponse } from "../interface/getrequestbycar.interface";

export async function GetRequestByCar(
  Car_id: number,
): Promise<GetRequestByCarResponse> {
  return apiCall("getrequestbycar", {
    Car_id: Car_id || 0,
  });
}
