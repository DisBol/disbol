import { useState, useCallback } from "react";
import { AddEmpresaStage } from "../service/addempresastage";
import {
  AddEmpresaStageResponse,
  Datum,
} from "../interfaces/addempresastage.interface";

interface UseAddEmpresaStageParams {
  in_container: number;
  out_container: number;
  units: number;
  container: number;
  Empresa_id: number;
  gross_weight: number;
  net_weight: number;
  Container_id: number;
  Product_id?: number;
}

export const useAddEmpresaStage = () => {
  const [data, setData] = useState<Datum[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const addEmpresaStage = useCallback(
    async (params: UseAddEmpresaStageParams) => {
      try {
        setLoading(true);
        setError(null);

        const response: AddEmpresaStageResponse = await AddEmpresaStage(
          params.in_container,
          params.out_container,
          params.units,
          params.container,
          params.Empresa_id,
          params.gross_weight,
          params.net_weight,
          params.Container_id,
          params.Product_id,
        );

        setData(response.data);

        return response.data[0]?.empresastage_id || null;
      } catch (err) {
        console.error("Error adding empresa stage:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    addEmpresaStage,
    reset,
  };
};
