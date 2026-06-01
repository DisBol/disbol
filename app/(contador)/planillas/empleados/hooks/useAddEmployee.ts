'use client';

import { useState, useCallback } from 'react';
import { AddEmployee } from '../services/addemployee';
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
        ): Promise<AddEmployeeResponse | null> => {
            try {
                setState({ loading: true, error: null, success: false });

                const response = await AddEmployee(name, document, active, Position_id);

                if (response.success) {
                    setState({ loading: false, error: null, success: true });
                    return response;
                } else {
                    setState({
                        loading: false,
                        error: response.message || 'Error al agregar empleado',
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
