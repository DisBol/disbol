import { apiCall } from "../../../../(operador)/configuraciones/services/apiClient";
import { AddAccountResponse } from "../interfaces/addaccount.interface";

export interface AddAccountPayload extends Record<string, unknown> {
  name: string;
  active: string;
  code: string;
  CenterCost_id: number;
  Elements_id: number;
}

export async function AddAccount(
  payload: AddAccountPayload,
): Promise<AddAccountResponse> {
  return apiCall("addaccount", payload);
}
