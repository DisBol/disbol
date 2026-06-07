export interface AsientoDetalle {
  id: string;
  fecha: string;
  tipo: string;
  glosa: string;
  total: number;
  currency: string;
}

export interface CierrePeriodo {
  id: string;
  periodo: string;
  fechaCierre: Date;
  cerradoPor: string;
  asientos: number;
  resultado: number;
  estado: "pendiente" | "validando" | "cerrado" | "error";
  totalIngresos: number;
  totalGastos: number;
  currency?: string;
  asientosDetalle: AsientoDetalle[];
}

export interface CierreResponse {
  cierres: CierrePeriodo[];
  total: number;
}

export interface ValidacionRequest {
  periodo: string;
  usuarioId: string;
}

export interface ValidacionResponse {
  exito: boolean;
  mensaje: string;
  errores?: string[];
}
