'use client';

import { useState, useCallback, useEffect } from 'react';
import { GetEmployeeDriver } from '../services/getemployeedriver';
import { GetEmployeeDriverResponse, Employee } from '../interface';

interface UseGetEmployeeDriverState {
    loading: boolean;
    error: string | null;
    success: boolean;
    empleados: Employee[];
}

export function useGetEmployeeDriver() {
    const [state, setState] = useState<UseGetEmployeeDriverState>({
        loading: false,
        error: null,
        success: false,
        empleados: [],
    });

    const getEmpleados = useCallback(
        async (active: string = 'true'): Promise<GetEmployeeDriverResponse | null> => {
            try {
                setState((prev) => ({ ...prev, loading: true, error: null, success: false }));

                const response = await GetEmployeeDriver(active);

                if (response.data) {
                    setState({
                        loading: false,
                        error: null,
                        success: true,
                        empleados: response.data,
                    });
                    return response;
                } else {
                    setState({
                        loading: false,
                        error: 'No se encontraron empleados',
                        success: false,
                        empleados: [],
                    });
                    return null;
                }
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
                setState({
                    loading: false,
                    error: errorMessage,
                    success: false,
                    empleados: [],
                });
                return null;
            }
        },
        [],
    );

    // Cargar empleados al montar el componente
    useEffect(() => {
        getEmpleados();
    }, [getEmpleados]);

    const resetState = useCallback(() => {
        setState({
            loading: false,
            error: null,
            success: false,
            empleados: [],
        });
    }, []);

    const updateEmpleadoLocal = useCallback((empleadoActualizado: Employee) => {
        setState((prev) => ({
            ...prev,
            empleados: prev.empleados.map((emp) =>
                Number(emp.id) === Number(empleadoActualizado.id) ? empleadoActualizado : emp
            ),
        }));
    }, []);

    const addEmpleadoLocal = useCallback((nuevoEmpleado: Employee) => {
        setState((prev) => ({
            ...prev,
            empleados: [...prev.empleados, nuevoEmpleado],
        }));
    }, []);

    return {
        getEmpleados,
        resetState,
        updateEmpleadoLocal,
        addEmpleadoLocal,
        ...state,
    };
}
