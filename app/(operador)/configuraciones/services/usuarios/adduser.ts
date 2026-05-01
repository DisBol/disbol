import { AddUserResponse } from "../../interfaces/usuarios/adduser.interface";
import { apiCall } from "../apiClient";

export async function AddUser(
  username: string,
  password: string,
  Role_id: string,
  Client_id: number = 1,
  Employee_id: number = 1,
): Promise<AddUserResponse> {
  return apiCall("adduser", {
    username: username,
    password: password,
    active: "true",
    Role_id: Role_id,
    Client_id,
    Employee_id,
  });
}
