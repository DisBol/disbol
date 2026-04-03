import { useState, useEffect, useCallback } from "react";
import { GetInventoryByContainer } from "../services/getinventorybycontainer";
import { GetInventoryByContainerResponse } from "../interfaces/getinventorybycontainer.interface";

interface UseGetInventoryByContainerReturn {
    total: number | null;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

export function useGetInventoryByContainer(
    containerId: number,
): UseGetInventoryByContainerReturn {
    const [total, setTotal] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        if (!containerId) return;
        try {
            setLoading(true);
            const result: GetInventoryByContainerResponse =
                await GetInventoryByContainer(containerId);
            setTotal(result.data[0]?.["sum(container)"] ?? 0);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Error al cargar inventario"));
            setTotal(null);
        } finally {
            setLoading(false);
        }
    }, [containerId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { total, loading, error, refetch: fetchData };
}
