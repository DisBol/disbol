"use client";

import { useState } from "react";
import { UpdateEmployee } from "../services/updateemployee";
import { UpdateEmployeeResponse } from "../interface/updateemployee.interface";

interface UseUpdateEmployeeReturn {
    updateEmployee: (
        id: number,
        name: string,
        document: string,
        active: string,
        Position_id: number
    ) => Promise<{ success: boolean; data?: any; message?: string }>;
    loading: boolean;
    error: string | null;
    success: boolean;
}

export const useUpdateEmployee = (): UseUpdateEmployeeReturn => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const updateEmployee = async (
        id: number,
        name: string,
        document: string,
        active: string,
        Position_id: number
    ): Promise<{ success: boolean; data?: any; message?: string }> => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await UpdateEmployee(id, name, document, active, Position_id);

            console.log("Update response:", response);

            // Considerar éxito si:
            // 1. Tiene success: true
            // 2. O si tiene data
            // 3. O si no tiene mensaje de error
            if (response?.success || response?.data) {
                setSuccess(true);
                // Si no tiene data completa, construir desde los parámetros
                const dataToReturn = response?.data || {
                    id,
                    name,
                    document,
                    active,
                    Position_id,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                };
                return { success: true, data: dataToReturn };
            } else {
                const errorMsg = response?.message || "Error al actualizar empleado";
                setError(errorMsg);
                return { success: false, message: errorMsg };
            }
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Error desconocido";
            console.error("Update error:", errorMessage);
            setError(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    return { updateEmployee, loading, error, success };
};
