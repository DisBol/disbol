export interface GetUsersReponse {
  data:     Datum[];
  metadata: Metadata;
}

export interface Datum {
  id:                number;
  username:          string;
  password:          string;
  active:            string;
  created_at:        Date;
  updated_at:        Date;
  Role_id:           number;
  Client_id_0:       number;
  Employee_id_0:     number;
  Role_name:         string;
  Client_id:         number;
  Client_name:       string;
  Client_document:   string;
  Employee_id:       number;
  Employee_name:     string;
  Employee_document: string;
}

export interface Metadata {
  connectedMs:         number;
  executedMs:          number;
  elapsedMs:           number;
  functionPreparedMs:  number;
  functionConnectedMs: number;
  functionExecutedMs:  number;
}
