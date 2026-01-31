import { UpdateUserResponse } from "../../interfaces/usuarios/updateuser.interface";
import { apiCall } from "../apiClient";

export async function UpdateUser(
  id: number,
  username: string,
  password: string,
  active: string,
  Role_id: number,
): Promise<UpdateUserResponse> {
  return apiCall("updateuser", {
    id,
    username,
    password,
    active,
    Role_id,
    Client_id: 1,
    Employee_id: 1,
  });
}
