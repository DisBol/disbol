import { apiCall } from "@/app/(operador)/configuraciones/services/apiClient";
import { GetPaymentTypeResponse } from "../interfaces/getpaymenttype.interface";

export async function GetPaymentType(): Promise<GetPaymentTypeResponse> {
  return apiCall("getpaymenttype", {
    active: "true",
  });
}
