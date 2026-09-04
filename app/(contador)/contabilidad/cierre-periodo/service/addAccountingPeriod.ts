import { apiCall } from "@/app/(operador)/configuraciones/services/apiClient";
import {
  AddAccountingPeriodPayload,
  AddAccountingPeriodResponse,
} from "../interfaces/addaccountingperiod.interface";

export async function AddAccountingPeriod(
  payload: AddAccountingPeriodPayload,
): Promise<AddAccountingPeriodResponse> {
  return apiCall("addaccountingperiod", {
    name: payload.name,
    active: payload.active ?? "true",
    User_id: payload.User_id,
  });
}
