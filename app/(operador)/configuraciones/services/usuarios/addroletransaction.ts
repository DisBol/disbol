import { AddTransactionResponse } from "../../interfaces/usuarios/addtransaction.interface";
import { GetTransactionResponse } from "../../interfaces/usuarios/transaction.interface";
import { apiCall } from "../apiClient";

export async function AddRoleTransaction(
  Transaction_id: number,
  Role_id: number,
): Promise<AddTransactionResponse> {
  return apiCall("addroletransaction", {
    active: "true",
    Transaction_id: Transaction_id,
    Role_id: Role_id,
  });
}
