export interface AddSalaryResponse {
    success: boolean;
    message: string;
    data?: {
        id: number;
        amount: number;
        Employee_id: number;
        active: string;
        created_at?: string;
        updated_at?: string;
    };
}
