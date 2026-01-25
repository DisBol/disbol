export interface CategoryResponse {
  data: CategoryData[];
  metadata: {
    connectedMs: number;
    executedMs: number;
    elapsedMs: number;
    functionPreparedMs: number;
    functionConnectedMs: number;
    functionExecutedMs: number;
  };
}

export interface CategoryData {
  id: number;
  name: string;
  active: string;
  created_at: string;
  updated_at: string;
}
