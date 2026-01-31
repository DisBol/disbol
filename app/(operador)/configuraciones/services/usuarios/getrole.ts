import { GetRoleResponse } from "../../interfaces/usuarios/role.interface";
import { apiCall } from "../apiClient";

export async function GetRoles(): Promise<GetRoleResponse> {
  return apiCall("getrole", { active: "true" });
}
