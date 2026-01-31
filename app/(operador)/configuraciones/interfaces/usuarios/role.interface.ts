export interface GetRoleResponse {
  data: Datum[];
  metadata: Metadata;
}

export interface Datum {
  id: number;
  name: string;
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

export interface RoleFormData {
  roleName: string;
  screens: {
    dashboard: boolean;
    consolidacion: boolean;
    asignaciones: boolean;
    seguimiento: boolean;
    canastos: boolean;
    appChofer: boolean;
    appCliente: boolean;
    contabilidad: boolean;
    rrhh: boolean;
    configuracion: boolean;
  };
}
