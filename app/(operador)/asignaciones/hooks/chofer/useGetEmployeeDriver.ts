import { useState, useEffect } from "react";
import { GetTicketHistory } from "../../service/chofer/getemployeedriver";
import { Datum } from "../../interfaces/chofer/getemployeedriver.interface";

export function useGetEmployeeDriver() {
    const [drivers, setDrivers] = useState<Datum[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDrivers = async () => {
        try {
            setIsLoading(true);
            const response = await GetTicketHistory();
            setDrivers(response.data);
        } catch (err) {
            setError("Error al cargar choferes");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDrivers();
    }, []);

    return { drivers, isLoading, error, refetch: fetchDrivers };
}
