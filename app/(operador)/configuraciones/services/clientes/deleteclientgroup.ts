import { UpdateClientGroupResponse } from "../../interfaces/clientes/updateclientgroup.interface";
import { UpdateClientGroup } from "./updateclientgroup";

export async function DeleteClientGroup(
  id: number,
  name: string,
  idCerca: string,
): Promise<UpdateClientGroupResponse> {
  return UpdateClientGroup(id, name, idCerca, "false");
}
