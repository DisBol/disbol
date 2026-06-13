"use client";

import { useState } from "react";
import { UpdateEmployee } from "../services/updateemployee";
import { AddSalary } from "../services/addsalary";
import { UpdateSalary } from "../services/updatesalary";
import { UpdateEmployeeResponse } from "../interface/updateemployee.interface";

interface UseUpdateEmployeeReturn {
    updateEmployee: (
        id: number,
        name?: string,
        document?: string,
        active?: string,
        Position_id?: number,
        amount?: number,
        Salary_id?: number
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
        name?: string,
        document?: string,
        active?: string,
        Position_id?: number,
        amount?: number,
        Salary_id?: number
    ): Promise<{ success: boolean; data?: any; message?: string }> => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            let employeeUpdated = false;
            let response: any = null;

            if (name !== undefined && document !== undefined && active !== undefined && Position_id !== undefined) {
                response = await UpdateEmployee(id, name, document, active, Position_id);
                console.log("Update response:", response);
                
                if (!response?.success && !response?.data) {
                    const errorMsg = response?.message || "Error al actualizar empleado";
                    setError(errorMsg);
                    return { success: false, message: errorMsg };
                }
                employeeUpdated = true;
            }

            if (amount !== undefined) {
                try {
                    if (Salary_id) {
                        console.log("useUpdateEmployee: calling UpdateSalary with id =", Salary_id, "amount =", amount, "and employeeId =", id);
                        const salaryResponse = await UpdateSalary(Salary_id, amount, id);
                        console.log("useUpdateEmployee: UpdateSalary response =", salaryResponse);
                    } else {
                        console.log("useUpdateEmployee: calling AddSalary with amount =", amount, "and employeeId =", id);
                        const salaryResponse = await AddSalary(amount, id);
                        console.log("useUpdateEmployee: AddSalary response =", salaryResponse);
                    }
                } catch (salaryError) {
                    console.error("Error al actualizar/guardar el salario:", salaryError);
                }
            }

            setSuccess(true);
            const dataToReturn = (employeeUpdated ? response?.data : null) || {
                id,
                name: name || "",
                document: document || "",
                active: active || "true",
                Position_id: Position_id || 3,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
            return { success: true, data: dataToReturn };
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
