import { apiCall } from "../../configuraciones/services/apiClient";
import { AddRequestPaymentTypeResponse } from "../interfaces/addrequestpaymenttype.interface";

export async function AddRequestPaymentType(
  Request_id: number
): Promise<AddRequestPaymentTypeResponse> {
  return apiCall("addrequestpaymenttype", {
    PaymentType_id: 3,
    Request_id,
    active: "true",
  });
}
