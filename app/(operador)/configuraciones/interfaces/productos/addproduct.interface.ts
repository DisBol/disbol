export interface AddProductRequest extends Record<string, unknown> {
  name: string;
  active: string;
  Category_id: string;
}

export interface AddProductResponse {
  data: {
    type: number;
    index: number;
    lastID: number;
    changes: number;
    totalChanges: number;
    finalized: number;
    rowId: number;
  };
  metadata: {
    connectedMs: number;
    executedMs: number;
    elapsedMs: number;
    functionPreparedMs: number;
    functionConnectedMs: number;
    functionExecutedMs: number;
  };
}
