import { useState } from "react";
import { AddClient } from "../../services/clientes/addclientgroup";
import { AddClientGroupResponse } from "../../interfaces/clientes/addclientgroup.interface";

interface UseAddClientGroupReturn {
  addClientGroup: (
    name: string,
    idCerca: string,
  ) => Promise<AddClientGroupResponse>;
  loading: boolean;
  error: Error | null;
  success: boolean;
}

export const useAddClientGroup = (): UseAddClientGroupReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState(false);

  const addClientGroup = async (
    name: string,
    idCerca: string,
  ): Promise<AddClientGroupResponse> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await AddClient(name, idCerca);
      setSuccess(true);
      return response;
    } catch (err) {
      const error =
        err instanceof Error
          ? err
          : new Error("Error al crear grupo de clientes");
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    addClientGroup,
    loading,
    error,
    success,
  };
};
