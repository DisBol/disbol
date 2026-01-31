import { AddRoleResponse } from "../../interfaces/usuarios/addrole";
import { apiCall } from "../apiClient";

export async function AddRole(name: string): Promise<AddRoleResponse> {
  return apiCall("addrole", {
    active: "true",
    name: name,
  });
}
