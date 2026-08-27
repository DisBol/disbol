import { apiCall } from "../../configuraciones/services/apiClient";
import { AddEmpresaResponse } from "../interfaces/addempresa.interface";

export async function AddEmpresa(
  Assignment_id: number,
): Promise<AddEmpresaResponse> {
  return apiCall("addempresa", {
    active: "true",
    Assignment_id,
  });
}
