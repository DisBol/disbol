export interface AddEmpresaStageResponse {
  message: string;
  data: Datum[];
  isError: boolean;
}

export interface Datum {
  empresastage_id: number;
}
