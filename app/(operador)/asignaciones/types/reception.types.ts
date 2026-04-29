export interface Boleta {
  id: string;
  ticketId?: string;
  assignmentStageId?: number;
  flujoCompletado?: boolean;
  hasPendingChanges?: boolean;
  codigo: string;
  costoPorKg: string;
  costoTotal: string;
  precioDiferido: boolean;
  ticket_payment: string;
  Tickets_ticket_payment?: string;
  Account_id: number;
  Account_code?: string;
  Account_name?: string;
  codigosSeleccionados: string[];
  menudencias: string[];
  detalles: Record<string, BoletaDetail>;
  tiposContenedor: Record<string, "caja" | "pallet" | "contenedor">;
}

export interface BoletaDetail {
  cajas: number;
  unidades: number;
  precio?: string;
  pesajes?: PesajeData[];
  kgBruto?: number;
  kgNeto?: number;
  productAssignmentId?: string;
  _isEdited?: boolean; // Flag para saber si los valores han sido editados por el usuario
}

export interface PesajeData {
  id: string;
  cajas: number;
  unidades: number;
  kg: number;
  contenedor?: string;
  guardado?: boolean;
}