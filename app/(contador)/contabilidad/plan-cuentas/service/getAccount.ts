import { apiCall } from "../../../../(operador)/configuraciones/services/apiClient";
import { GetAccountResponse } from "../interfaces/getaccount.interface";

export async function GetAccount(): Promise<GetAccountResponse> {
  return apiCall("getaccount", {
    active: "true",
  });
}
