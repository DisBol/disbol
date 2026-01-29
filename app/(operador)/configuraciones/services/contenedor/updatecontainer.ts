import { UpdateContainerResponse } from "../../interfaces/contenedores/updatecontainer.interface";
import { apiCall } from "../apiClient";

export async function UpdateContainer(
  id: number,
  name: string,
  destare: number,
  deff: boolean | string | number,
  active: boolean | string | number,
): Promise<UpdateContainerResponse> {
  return apiCall("updatecontainer", { id, name, destare, deff, active });
}
