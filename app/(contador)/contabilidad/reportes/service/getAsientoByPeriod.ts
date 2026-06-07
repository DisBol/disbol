import { apiCall } from "../../../../(operador)/configuraciones/services/apiClient";
import { GetAsientoByPeriodResponse } from "../interfaces/getasientobyperiod.interface";

export async function GetAsientoByPeriod(
  AccountingPeriod_id: number,
): Promise<GetAsientoByPeriodResponse> {
  return apiCall("getasientobyperiod", {
    AccountingPeriod_id,
  });
}
