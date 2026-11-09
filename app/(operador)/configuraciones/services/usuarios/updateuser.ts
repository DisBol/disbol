import { UpdateUserResponse } from "../../interfaces/usuarios/updateuser.interface";
import { apiCall } from "../apiClient";

export async function UpdateUser(
  id: number,
  username: string,
  password: string,
  active: string,
  Role_id: number,
  // Se reenvían los vínculos actuales del usuario para no reasignarlo a otro cliente/empleado
  Client_id: number | null,
  Employee_id: number | null,
): Promise<UpdateUserResponse> {
  return apiCall("updateuser", {
    id,
    username,
    password,
    active,
    Role_id,
    Client_id,
    Employee_id,
  });
}
