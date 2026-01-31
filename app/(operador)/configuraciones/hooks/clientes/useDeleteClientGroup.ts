import { useState } from "react";
import { DeleteClientGroup } from "../../services/clientes/deleteclientgroup";
import { UpdateClientGroupResponse } from "../../interfaces/clientes/updateclientgroup.interface";

interface UseDeleteClientGroupReturn {
  deleteClientGroup: (
    id: number,
    name: string,
    idCerca: string,
  ) => Promise<UpdateClientGroupResponse>;
  loading: boolean;
  error: Error | null;
  success: boolean;
}

export const useDeleteClientGroup = (): UseDeleteClientGroupReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState(false);

  const deleteClientGroup = async (
    id: number,
    name: string,
    idCerca: string,
  ): Promise<UpdateClientGroupResponse> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await DeleteClientGroup(id, name, idCerca);
      setSuccess(true);
      return response;
    } catch (err) {
      const error =
        err instanceof Error
          ? err
          : new Error("Error al desactivar grupo de clientes");
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteClientGroup,
    loading,
    error,
    success,
  };
};
