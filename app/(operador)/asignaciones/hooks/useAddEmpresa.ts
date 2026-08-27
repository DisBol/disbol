import { useState, useCallback } from "react";
import { AddEmpresa } from "../service/addempresa";
import { AddEmpresaResponse, Datum } from "../interfaces/addempresa.interface";

export const useAddEmpresa = () => {
  const [data, setData] = useState<Datum[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const addEmpresa = useCallback(async (Assignment_id: number) => {
    try {
      setLoading(true);
      setError(null);

      const response: AddEmpresaResponse = await AddEmpresa(Assignment_id);

      setData(response.data);

      return response.data[0]?.empresa_id || null;
    } catch (err) {
      console.error("Error adding empresa:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    addEmpresa,
    reset,
  };
};
