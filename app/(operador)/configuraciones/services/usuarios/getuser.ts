import { GetUsersReponse } from "../../interfaces/usuarios/user.interface";
import { apiCall } from "../apiClient";

export async function GetUsers(): Promise<GetUsersReponse> {
  return apiCall("getuser", { active: "true" });
}
