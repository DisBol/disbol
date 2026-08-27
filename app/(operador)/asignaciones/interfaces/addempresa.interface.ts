export interface AddEmpresaResponse {
  message: string;
  data: Datum[];
  isError: boolean;
}

export interface Datum {
  empresa_id: number;
}
