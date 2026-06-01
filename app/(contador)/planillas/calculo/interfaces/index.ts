export interface EmpleadoPlanilla {
    id: string;
    nombre: string;
    bruto: number;
    descuentos: number;
    aFavor: number;
    neto: number;
}

export interface Planilla {
    id: string;
    periodo: string;
    empleados: EmpleadoPlanilla[];
    totalBruto: number;
    totalDescuentos: number;
    totalAFavor: number;
    totalNeto: number;
    estado: 'draft' | 'calculada' | 'procesada';
}

export interface PlanillaResponse {
    planilla: Planilla;
    mensaje: string;
}
