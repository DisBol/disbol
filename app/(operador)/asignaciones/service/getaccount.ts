import { apiCall } from "../../configuraciones/services/apiClient";
import { GetAccountResponse } from "../interfaces/getaccount.interface";

export async function GetAccount(active: string): Promise<GetAccountResponse> {
  return apiCall("getaccount", {
    active,
  });
}
