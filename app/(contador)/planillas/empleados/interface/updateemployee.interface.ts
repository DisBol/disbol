export interface UpdateEmployeeResponse {
    success: boolean;
    message: string;
    data?: {
        id: number;
        name: string;
        document: string;
        active: string;
        Position_id: number;
        created_at: string;
        updated_at: string;
    };
}
