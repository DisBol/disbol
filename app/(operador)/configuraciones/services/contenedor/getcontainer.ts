import { GetContainerResponse } from "../../interfaces/contenedores/getcontainer.interface";
import { apiCall } from "../apiClient";

export async function GetContainer(): Promise<GetContainerResponse> {
  return apiCall("getcontainer", { active: "true" });
}
