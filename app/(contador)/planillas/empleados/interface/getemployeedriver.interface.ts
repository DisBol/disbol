export interface Employee {
  id: number;
  name: string;
  document: string;
  active: string;
  created_at: string;
  updated_at: string;
  Position_id: number;
}

export interface GetEmployeeDriverResponse {
  data: Employee[];
  metadata: {
    connectedMs: number;
    executedMs: number;
    elapsedMs: number;
    functionPreparedMs: number;
    functionConnectedMs: number;
    functionExecutedMs: number;
  };
}
