// Interfaz para las métricas principales del dashboard Planillas
export interface MetricasPlanillas {
    totalEmpleados: number;
    costoMensualPlanilla: number;
}

// Interfaz para el costo por centro de costo
export interface CostoPorCC {
    centrocosto_id: string;
    centrocosto_nombre: string;
    costo: number;
}

// Interfaz para alertas
export interface Alerta {
    id: string;
    tipo: string;
    descripcion: string;
    cantidad: number;
    prioridad: "alta" | "media" | "baja";
}

// Interfaz para acciones rápidas
export interface AccionRapida {
    id: string;
    titulo: string;
    color: string;
    ruta: string;
}

// Interfaz para empleados
export interface Empleado {
    id: string;
    nombre: string;
    dni: string;
    cargo: string;
    salario?: number;
    estado: "Activo" | "Inactivo" | "Licencia";
}

// Interfaz para el estado del dashboard Planillas completo
export interface DashboardPlanillasData {
    metricas: MetricasPlanillas;
    costosPorCC: CostoPorCC[];
    alertas: Alerta[];
    acciones: AccionRapida[];
}
