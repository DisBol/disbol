// Interfaz para el formulario de categoría
export interface CategoryFormData {
  categoryName: string;
}

// Interfaz para el request a la API
export interface CategoryAddRequest extends Record<string, unknown> {
  name: string;
  active: string;
}

// Interfaz para la respuesta de la API
export interface CategoryAddResponse {
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
