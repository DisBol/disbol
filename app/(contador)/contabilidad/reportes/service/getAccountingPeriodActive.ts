import { apiCall } from "../../../../(operador)/configuraciones/services/apiClient";
import { GetAccountingPeriodActiveResponse } from "../interfaces/getaccountingperiodactive.interface";

export async function GetAccountingPeriodActive(): Promise<GetAccountingPeriodActiveResponse> {
  return apiCall("getaccountingperiodactive");
}
