export interface AsientoPlanilla {
    id: number;
    description: string;
    active: string;
    amount_credit: number;
    amount_debit: number;
    created_at: string;
    updated_at: string;
    Account_id: number;
    AccountingPeriod_id: number;
    state: string | null;
    employee: number | null;
    employeeName?: string;
    employeeAmount?: number | null;
}

export interface ResumenAsientoPlanilla {
    id: string;
    employeeId: number;
    employeeName: string;
    employeeAmount: number | null;
    accountingPeriodId: number;
    description: string;
    active: string;
    amount_credit: number;
    amount_debit: number;
    created_at: string;
    updated_at: string;
    Account_id: number;
    state: string | null;
    employee: number | null;
    movimientos: number;
    detalle: Array<{
        id: number;
        created_at: string;
        type: string;
        description: string;
        amount: number;
        state: string | null;
        accountId: number;
    }>;
}

export interface AsientoPlanillaResponse {
    data: AsientoPlanilla[];
}
