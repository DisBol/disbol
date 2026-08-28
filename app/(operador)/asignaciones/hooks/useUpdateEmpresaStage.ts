import { useState, useCallback } from "react";
import { UpdateEmpresaStage } from "../service/updateempresastage";
import {
  UpdateEmpresaStageResponse,
  UpdateEmpresaStageData,
} from "../interfaces/updateempresastage.interface";

interface UseUpdateEmpresaStageParams {
  EmpresaStage_id: number;
  in_container: number;
  out_container: number;
  units: number;
  container: number;
  Empresa_id: number;
  gross_weight: number;
  net_weight: number;
  Container_id: number;
  active?: string;
  Product_id?: number;
}

export const useUpdateEmpresaStage = () => {
  const [data, setData] = useState<UpdateEmpresaStageData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateEmpresaStage = useCallback(
    async (params: UseUpdateEmpresaStageParams) => {
      try {
        setLoading(true);
        setError(null);

        const response: UpdateEmpresaStageResponse = await UpdateEmpresaStage(
          params.EmpresaStage_id,
          params.in_container,
          params.out_container,
          params.units,
          params.container,
          params.Empresa_id,
          params.gross_weight,
          params.net_weight,
          params.Container_id,
          params.active,
          params.Product_id,
        );

        setData(response.data);
        return response.data;
      } catch (err) {
        console.error("Error updating empresa stage:", err);
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
    updateEmpresaStage,
    reset,
  };
};
