import { apiCall } from "../../../../(operador)/configuraciones/services/apiClient";
import { GetAccountingPeriodResponse } from "../interfaces/getaccountingperiod.interface";

export async function GetAccountingPeriod(): Promise<GetAccountingPeriodResponse> {
  return apiCall("getaccountingperiod", {
    active: "true",
  });
}
