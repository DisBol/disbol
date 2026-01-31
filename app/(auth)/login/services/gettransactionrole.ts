import { apiCall } from "@/app/(operador)/configuraciones/services/apiClient";
import { GetTransactionRoleResponse } from "../interfaces/gettransactionrole.interface";

export async function GetTransactionRole(
  roleId: number,
): Promise<GetTransactionRoleResponse> {
  return apiCall("gettransactionbyrole", { Role_id: roleId });
}
