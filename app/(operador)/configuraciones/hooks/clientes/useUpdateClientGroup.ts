import { useState } from "react";
import { UpdateClientGroup } from "../../services/clientes/updateclientgroup";
import { UpdateClientGroupResponse } from "../../interfaces/clientes/updateclientgroup.interface";

interface UseUpdateClientGroupReturn {
  updateClientGroup: (
    id: number,
    name: string,
    idCerca: string,
    active: string,
  ) => Promise<UpdateClientGroupResponse>;
  loading: boolean;
  error: Error | null;
  success: boolean;
}

export const useUpdateClientGroup = (): UseUpdateClientGroupReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState(false);

  const updateClientGroup = async (
    id: number,
    name: string,
    idCerca: string,
    active: string,
  ): Promise<UpdateClientGroupResponse> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await UpdateClientGroup(id, name, idCerca, active);
      setSuccess(true);
      return response;
    } catch (err) {
      const error =
        err instanceof Error
          ? err
          : new Error("Error al actualizar grupo de clientes");
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateClientGroup,
    loading,
    error,
    success,
  };
};
