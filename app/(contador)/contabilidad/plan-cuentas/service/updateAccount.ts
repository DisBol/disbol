import { apiCall } from "../../../../(operador)/configuraciones/services/apiClient";
import { UpdateAccountResponse } from "../interfaces/updateaccount.interface";

export interface UpdateAccountPayload extends Record<string, unknown> {
  id: number;
  name: string;
  active: string;
  code: string;
  CenterCost_id: number;
  Elements_id: number;
}

export async function UpdateAccount(
  payload: UpdateAccountPayload,
): Promise<UpdateAccountResponse> {
  return apiCall("updateaccount", payload);
}
