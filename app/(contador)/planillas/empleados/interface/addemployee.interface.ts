export interface AddEmployeeResponse {
    success: boolean;
    message: string;
    data?: {
        id: string;
        name: string;
        document: string;
        active: string;
        Position_id: number;
    };
}
