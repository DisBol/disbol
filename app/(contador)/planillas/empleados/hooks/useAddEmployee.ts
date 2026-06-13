'use client';

import { useState, useCallback } from 'react';
import { AddEmployee } from '../services/addemployee';
import { AddSalary } from '../services/addsalary';
import { AddEmployeeResponse } from '../interface/addemployee.interface';

interface UseAddEmployeeState {
    loading: boolean;
    error: string | null;
    success: boolean;
}

export function useAddEmployee() {
    const [state, setState] = useState<UseAddEmployeeState>({
        loading: false,
        error: null,
        success: false,
    });

    const addEmployee = useCallback(
        async (
            name: string,
            document: string,
            active: string = 'true',
            Position_id: number = 3,
            amount: number = 0,
        ): Promise<AddEmployeeResponse | null> => {
            try {
                setState({ loading: true, error: null, success: false });

                const response = await AddEmployee(
                    name,
                    document,
                    active,
                    Position_id,
                    amount,
                );

                console.log("useAddEmployee: raw response:", response);

                const employeeId = (Array.isArray(response?.data) ? response?.data[0]?.Employee_id : undefined) ||
                                   response?.data?.id ||
                                   (response as any)?.id ||
                                   (response?.data as any)?.Employee_id;

                if (employeeId) {
                    let salaryId: number | undefined = undefined;
                    try {
                        console.log("useAddEmployee: calling AddSalary with amount =", amount, "and employeeId =", employeeId);
                        const salaryResponse = await AddSalary(amount, Number(employeeId));
                        console.log("useAddEmployee: AddSalary response =", salaryResponse);
                        salaryId = salaryResponse?.data?.id || (salaryResponse as any)?.id;
                    } catch (salaryError) {
                        console.error('Error al guardar el salario:', salaryError);
                    }
                    setState({ loading: false, error: null, success: true });
                    
                    // Attach the salary ID to the returned employee data
                    if (salaryId) {
                        if (response.data) {
                            (response.data as any).Salary_id = salaryId;
                        } else {
                            (response as any).Salary_id = salaryId;
                        }
                    }
                    return response;
                } else {
                    setState({
                        loading: false,
                        error: response?.message || 'Error al agregar empleado',
                        success: false,
                    });
                    return null;
                }
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
                setState({ loading: false, error: errorMessage, success: false });
                return null;
            }
        },
        [],
    );

    const resetState = useCallback(() => {
        setState({ loading: false, error: null, success: false });
    }, []);

    return {
        addEmployee,
        resetState,
        ...state,
    };
}
