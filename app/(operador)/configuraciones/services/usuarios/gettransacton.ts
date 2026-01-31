import { GetTransactionResponse } from "../../interfaces/usuarios/transaction.interface";
import { apiCall } from "../apiClient";

export async function GetTransaction(): Promise<GetTransactionResponse> {
  return apiCall("gettransacton", { active: "true" });
}
