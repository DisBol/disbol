// Interfaz para las métricas principales del dashboard
export interface MetricasContables {
    ingresos: number;
    gastos: number;
    resultado: number;
}

// Interfaz para datos del gráfico comparativo de ingresos vs gastos
export interface DatosComparativo {
    ingresos: number;
    gastos: number;
}

// Interfaz para datos de evolución mensual
export interface DatosEvolucion {
    mes: string;
    ingresos: number;
    gastos: number;
}

// Interfaz para accesos rápidos
export interface AccesoRapido {
    id: string;
    titulo: string;
    color: string;
    ruta: string;
}

// Interfaz para el estado del dashboard contable completo
export interface DashboardContableData {
    metricas: MetricasContables;
    comparativo: DatosComparativo;
    evolucion: DatosEvolucion[];
    accesosRapidos: AccesoRapido[];
}
