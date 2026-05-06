import { apiCall } from "../../configuraciones/services/apiClient";
import { AddRequestPaymentTypeResponse } from "../interfaces/addrequestpaymenttype.interface";

export async function AddRequestPaymentType(
  Request_id: number,
  paymentTypeId: number = 3,
  amount: number = 0,
): Promise<AddRequestPaymentTypeResponse> {
  return apiCall("addrequestpaymenttype", {
    PaymentType_id: paymentTypeId,
    Request_id,
    active: "true",
    amount,
  });
}
