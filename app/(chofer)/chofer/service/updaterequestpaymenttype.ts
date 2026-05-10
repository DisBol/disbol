import { apiCall } from "@/app/(operador)/configuraciones/services/apiClient";
import { AddRequestPaymentTypeResponse } from "@/app/(operador)/solicitudes/interfaces/addrequestpaymenttype.interface";

export async function AddRequestPaymentType(
  Request_id: number,
  PaymentType_id: number,
  amount: number = 0,
): Promise<AddRequestPaymentTypeResponse> {
  return apiCall("addrequestpaymenttype", {
    PaymentType_id,
    Request_id,
    active: "true",
    amount,
  });
}
