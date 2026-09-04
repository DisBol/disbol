import { apiCall } from "@/app/(operador)/configuraciones/services/apiClient";
import {
  UpdateAccountingPeriodPayload,
  UpdateAccountingPeriodResponse,
} from "../interfaces/updateaccountingperiod.interface";

export async function UpdateAccountingPeriod(
  payload: UpdateAccountingPeriodPayload,
): Promise<UpdateAccountingPeriodResponse> {
  return apiCall("updateaccountingperiod", {
    name: payload.name,
    active: payload.active,
    id: payload.id,
    User_id: payload.User_id,
  });
}
