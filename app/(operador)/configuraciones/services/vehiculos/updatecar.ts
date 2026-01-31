import { UpdateCarResponse } from "../../interfaces/vehiculos/updatecar";
import { apiCall } from "../apiClient";

export async function UpdateCar(
  id: number,
  name: string,
  idCar: string,
  license: string,
  active: string,
): Promise<UpdateCarResponse> {
  return apiCall("updatecar", { id, name, idCar, license, active });
}
