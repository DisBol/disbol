export interface CuentaBalance {
    nombre: string;
    valor: number;
    esSubtotal?: boolean;
    color?: 'default' | 'danger' | 'success' | 'primary';
}

export interface SeccionBalance {
    titulo: string;
    color: 'success' | 'danger' | 'primary';
    cuentas: CuentaBalance[];
    subtotal: number;
    esNoCorriente?: boolean;
}

export interface BalanceGeneral {
    periodo: string;
    activos: {
        corriente: CuentaBalance[];
        subtotalCorriente: number;
        noCorriente: CuentaBalance[];
        subtotalNoCorriente: number;
        total: number;
    };
    pasivos: {
        corriente: CuentaBalance[];
        subtotalCorriente: number;
        noCorriente: CuentaBalance[];
        subtotalNoCorriente: number;
        total: number;
    };
    patrimonio: CuentaBalance[];
    totalPatrimonio: number;
    verificacion: number;
}

export interface ReporteComparativo {
    periodo1: string;
    periodo2: string;
    comparacion: {
        activos: number[];
        pasivos: number[];
        patrimonio: number[];
    };
}
