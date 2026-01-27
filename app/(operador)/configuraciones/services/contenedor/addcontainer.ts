import { AddContainerResponse } from "../../interfaces/contenedores/addcontainer.interface";
import { apiCall } from "../apiClient";

export async function AddContainer(
  name: string,
  destare: number,
  deff: boolean | string | number,
  active: boolean | string | number,
): Promise<AddContainerResponse> {
  return apiCall("addcontainer", { name, destare, deff, active });
}
