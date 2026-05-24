export interface AsientoDetalle {
    id: string;
    fecha: string;
    tipo: string;
    glosa: string;
    total: number;
}

export interface CierrePeriodo {
    id: string;
    periodo: string;
    fechaCierre: Date;
    cerradoPor: string;
    asientos: number;
    resultado: number;
    estado: 'pendiente' | 'validando' | 'cerrado' | 'error';
    totalIngresos: number;
    totalGastos: number;
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
