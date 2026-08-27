export interface GetEmpresaStageByAssignmentResponse {
  data: EmpresaStageByAssignmentDatum[];
  metadata: Metadata;
}

export interface EmpresaStageByAssignmentDatum {
  Assignment_id: number;
  Empresa_id: number;
  EmpresaStage_id: number;
  EmpresaStage_in_container: number;
  EmpresaStage_out_container: number;
  EmpresaStage_units: number;
  EmpresaStage_container: number;
  EmpresaStage_active: string;
  EmpresaStage_Empresa_id: number;
  EmpresaStage_gross_weight: number;
  EmpresaStage_net_weight: number;
  EmpresaStage_Container_id: number;
  EmpresaStage_Bono?: string | null;
  Empresa_Product_id?: number | null;
  Product_name?: string | null;
}

export interface Metadata {
  connectedMs: number;
  executedMs: number;
  elapsedMs: number;
  functionPreparedMs: number;
  functionConnectedMs: number;
  functionExecutedMs: number;
}
