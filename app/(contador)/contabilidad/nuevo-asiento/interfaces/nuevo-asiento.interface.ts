export interface JournalLine {
    id: string;
    date: string;
    accountId: number | null;
    glosa: string;
    debit: number;
    credit: number;
    isNew?: boolean;
}

export interface DraftEntry {
    id: string;
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
}
