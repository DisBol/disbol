import { apiCall } from "@/app/(operador)/configuraciones/services/apiClient";
import { GetRequestPaymentTypeByRequestIdResponse } from "../interfaces/getrequestpaymenttypebyrequestid.interface";

export async function GetRequestPaymentTypeByRequestId(
  Request_id: number,
): Promise<GetRequestPaymentTypeByRequestIdResponse> {
  return apiCall("getrequestpaymenttypebyrequestid", {
    Request_id,
  });
}
