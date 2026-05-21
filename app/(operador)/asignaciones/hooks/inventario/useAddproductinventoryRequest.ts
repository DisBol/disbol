import { useState, useCallback } from "react";
import { AddProductInventory } from "../../service/inventario/addproductinventory";
import {
    AddProductInventoryBody,
    AddProductInventoryResponse,
} from "../../interfaces/inventario/addproductinventory.interface";

interface UseAddProductInventoryRequestReturn {
    mutate: (body: AddProductInventoryBody) => Promise<AddProductInventoryResponse>;
    loading: boolean;
    error: string | null;
}

export const useAddProductInventoryRequest = (): UseAddProductInventoryRequestReturn => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const mutate = useCallback(async (body: AddProductInventoryBody) => {
        try {
            setLoading(true);
            setError(null);
            return await AddProductInventory(body);
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Error al crear inventario de producto";
            setError(msg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { mutate, loading, error };
};
