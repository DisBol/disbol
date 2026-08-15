import { apiCall } from "../../configuraciones/services/apiClient";
import { AddEmpresaStageResponse } from "../interfaces/addempresastage.interface";

export async function AddEmpresaStage(
  in_container: number,
  out_container: number,
  units: number,
  container: number,
  Empresa_id: number,
  gross_weight: number,
  net_weight: number,
  Container_id: number,
): Promise<AddEmpresaStageResponse> {
  return apiCall("addempresastage", {
    in_container,
    out_container,
    units,
    container,
    active: "true",
    Empresa_id,
    gross_weight,
    net_weight,
    Container_id,
  });
}
