import { AddCarResponse } from "../../interfaces/vehiculos/addcar";
import { apiCall } from "../apiClient";

export async function AddCar(
  name: string,
  idCar: string,
  license: string,
  active: string,
): Promise<AddCarResponse> {
  return apiCall("addcar", {
    name: name,
    idCar: idCar,
    license: license,
    active: active,
  });
}
