import { apiCall } from "../../configuraciones/services/apiClient";
import { UpdateEmpresaStageResponse } from "../interfaces/updateempresastage.interface";

export async function UpdateEmpresaStage(
  EmpresaStage_id: number,
  in_container: number,
  out_container: number,
  units: number,
  container: number,
  Empresa_id: number,
  gross_weight: number,
  net_weight: number,
  Container_id: number,
  active: string = "true",
  bono: string,
): Promise<UpdateEmpresaStageResponse> {
  return apiCall("updateempresastage", {
    EmpresaStage_id,
    in_container,
    out_container,
    units,
    container,
    active,
    Empresa_id,
    gross_weight,
    net_weight,
    Container_id,
    bono,
  });
}
