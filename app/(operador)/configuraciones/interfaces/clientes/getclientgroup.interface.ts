export interface GetClientGroupResponse {
  data: Datum[];
  metadata: Metadata;
}

export interface Datum {
  id: number;
  name: string;
  idCerca: number;
  active: string;
  created_at: Date;
  updated_at: Date;
}

export interface Metadata {
  connectedMs: number;
  executedMs: number;
  elapsedMs: number;
  functionPreparedMs: number;
  functionConnectedMs: number;
  functionExecutedMs: number;
}

export interface GroupFormData {
  nombre: string;
  idCerca: string;
}

export interface GroupFormProps {
  onSave: (data: GroupFormData) => Promise<void>;
  onCancel: () => void;
  group?: Datum;
}
