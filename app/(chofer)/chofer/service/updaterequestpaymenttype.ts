import { apiCall } from "@/app/(operador)/configuraciones/services/apiClient";
import { AddRequestPaymentTypeResponse } from "@/app/(operador)/solicitudes/interfaces/addrequestpaymenttype.interface";

export async function AddRequestPaymentType(
  Request_id: number,
  PaymentType_id: number,
): Promise<AddRequestPaymentTypeResponse> {
  return apiCall("addrequestpaymenttype", {
    PaymentType_id,
    Request_id,
    active: "true",
  });
}
