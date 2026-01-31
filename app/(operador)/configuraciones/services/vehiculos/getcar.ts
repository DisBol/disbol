import { GetCarResponse } from "../../interfaces/vehiculos/getcar";
import { apiCall } from "../apiClient";

export async function GetCars(): Promise<GetCarResponse> {
  return apiCall("getcar", { active: "true" });
}
